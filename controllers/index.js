const bcrypt = require("bcrypt");
const User = require("../models").User;
const Todo = require("../models").Todo;

const homeIndex = async (req, res) => {
  const { nama, userId } = req.session;

  let user;
  if (req.session.authenticate) {
    user = await User.findOne({
      where: { id: userId },
      include: Todo,
    });
  }
  res.render("index.ejs", { nama, loggedIn: req.session.authenticate, user });
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
    req.session.userId = user.id;

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

const profileIndex = async (req, res) => {
  if (req.session.authenticate) {
    const { userId } = req.session;
    const user = await User.findOne({ where: { id: userId } });
    res.render("profile/profile.ejs", { loggedIn: true, user });
  } else {
    res.redirect("/");
  }
};

const editProfileIndex = async (req, res) => {
  if (req.session.authenticate) {
    const { userId } = req.session;
    const user = await User.findOne({ where: { id: userId } });
    res.render("profile/edit-profile.ejs", { loggedIn: true, user });
  } else {
    res.redirect("/");
  }
};

const editProfileAction = async (req, res) => {
  if (req.session.authenticate) {
    const { firstName, lastName, email } = req.body;
    const { userId } = req.session;
    await User.update(
      { firstName, lastName, email },
      { where: { id: userId } }
    );
    res.redirect("/");
  } else {
    res.redirect("/");
  }
};

const deleteProfileAction = async (req, res) => {
  if (req.session.authenticate) {
    const { userId } = req.session;
    await User.destroy({ where: { id: userId } });
    req.session.destroy((err) => {
      console.log("Error");
    });
    res.redirect("/");
  } else {
    res.redirect("/");
  }
};

const createTodoIndex = (req, res) => {
  if (req.session.authenticate) {
    res.render("todo/create.ejs", { loggedIn: true });
  } else {
    res.redirect("/");
  }
};

const createTodoAction = async (req, res) => {
  if (req.session.authenticate) {
    const { title, detail } = req.body;
    const { userId } = req.session;
    await Todo.create({ title, detail, userId });
    res.redirect("/");
  } else {
    res.redirect("/");
  }
};

const deleteTodoAction = async (req, res) => {
  if (req.session.authenticate) {
    const { id } = req.params;
    await Todo.destroy({ where: { id } });
    res.redirect("/");
  } else {
    res.redirect("/");
  }
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
  profileIndex,
  editProfileIndex,
  editProfileAction,
  deleteProfileAction,
  createTodoIndex,
  createTodoAction,
  deleteTodoAction,
};
