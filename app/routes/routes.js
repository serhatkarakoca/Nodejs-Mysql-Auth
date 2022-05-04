module.exports = app => {
    const user = require("../handlers/user.handler.js");

    var router = require("express").Router();

    // Create a user
    router.post("/register", user.register);

    router.get("/login", user.login);

    app.use('/api/', router);
}