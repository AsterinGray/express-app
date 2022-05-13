const bcrypt = require("bcrypt");
const User = require("../models").User;

const homeIndex = (req, res) => {
  const { nama } = req.session;
  res.render("index.ejs", { nama });
};

const loginIndex = (req, res) => {
  // if (req.query.name) {
  //   res.render('index.ejs', { nama: req.query.name })
  // }
  res.render("login.ejs");
};

const loginAction = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.render("login.ejs", { error: "Email dan password diperlukan" });
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    res.render("login.ejs", { error: "User not found" });
  } else {
    const isPassValid = await bcrypt.compare(password, user.password);
    if (!isPassValid) res.render("login.ejs", { error: "Invalid credential" });

    req.session.authenticate = true;
    req.session.nama = user.firstName;

    res.redirect("/");
  }
};

const idIndex = (req, res) => {
  const { id } = req.params;
  res.send(`Access Route with parms (${id})`);
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
};
