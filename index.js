const express = require("express");
const routes = require("./routes");
const { Sequelize } = require("sequelize");
const session = require("express-session");
const app = express();

const PORT = 8000;

// HTTP METHOD
// GET
// POST
// PUT
// PATCH
// DELETE

// middleware
// body-parser (libray)

// Connect to SQLite
// const sequelize = new Sequelize({
//     dialect: "sqlite",
//     storage: "pertemuan_12.db",
// });

// Connect to MySQL
const sequelize = new Sequelize("pertemuan_12", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

// Authenticate / Connect to DB
sequelize
  .authenticate()
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(`DB Connection Error - ${err}`));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view-engine", "ejs");
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "SECRET",
  })
);

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
