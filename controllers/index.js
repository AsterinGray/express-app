const bcrypt = require("bcrypt");
const User = require("../models").User;

const homeIndex = (req, res) => {
    const { nama } = req.session;
    res.render("index.ejs", { nama, loggedIn: req.session.authenticate });
};

const loginIndex = (req, res) => {
    res.render("login.ejs", { loggedIn: req.session.authenticate });
    // if (req.session.authenticate) {
    //     res.redirect("/");
    // } else {
    //     res.render("login.ejs");
    // }
};

const loginAction = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.render("login.ejs", {
            error: "Email dan password diperlukan",
            loggedIn: req.session.authenticate,
        });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
        res.render("login.ejs", {
            error: "User not found",
            loggedIn: req.session.authenticate,
        });
    } else {
        const isPassValid = await bcrypt.compare(password, user.password);
        if (!isPassValid) {
            res.render("login.ejs", {
                error: "Invalid credential",
                loggedIn: req.session.authenticate,
            });
            return;
        }

        req.session.authenticate = true;
        req.session.nama = user.firstName;

        res.redirect("/");
    }
};

const logoutAction = (req, res) => {
    if (req.session.authenticate) {
        // cek apakah user sudah terlogin
        // Kalau user sudah terlogin, logout si user
        req.session.destroy((err) => {
            console.log("Error");
        });
    }
    res.redirect("/");
};

const registerIndex = (req, res) => {
    if (!req.session.authenticate) {
        res.render("register.ejs", { loggedIn: req.session.authenticate });
    }
    res.redirect("/");
};

const registerAction = async (req, res) => {
    const { firstName, lastName, email, password, repeatPassword } = req.body;
    if (!firstName || !lastName || !email || !password || !repeatPassword) {
        res.render("register.ejs", {
            error: "Lengkapi semua data yang diperlukan",
            loggedIn: req.session.authenticate,
        });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
        res.render("register.ejs", {
            error: "Email sudah terdaftar",
            loggedIn: req.session.authenticate,
        });
    } else if (password !== repeatPassword) {
        res.render("register.ejs", {
            error: "Password tidak sama!",
            loggedIn: req.session.authenticate,
        });
    } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        if (newUser) {
            res.redirect("/login");
        }
    }
};

const idIndex = (req, res) => {
    const { id } = req.params;
    res.send(`Access Route with params (${id})`);
};

// Request
// Req query (?nama=Raymond)
// books/filter?genre=fiction

// Req body
// POST PATCH PUT

// Req params (tampilan single item)
// Book Store
// Tampilin buku dengan id 1
// /books/1

module.exports = {
    homeIndex,
    loginIndex,
    loginAction,
    idIndex,
    logoutAction,
    registerIndex,
    registerAction,
};
