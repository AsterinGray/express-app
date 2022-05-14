const express = require("express");
const {
    homeIndex,
    loginIndex,
    loginAction,
    idIndex,
    logoutAction,
    registerIndex,
    registerAction,
} = require("./controllers");
const router = express.Router();

router.get("/", homeIndex); // ctrl + space

// Authentication
router.get("/login", loginIndex);
router.post("/login", loginAction);

router.post("/logout", logoutAction);

router.get("/register", registerIndex);
router.post("/register", registerAction);

router.get("/:id", idIndex);

module.exports = router;
