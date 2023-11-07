

module.exports = app => {
    var router = require("express").Router();
    const auth = require("../middleware/auth");

    //users
    const users_controller = require("../controllers/api/user.controller.js");
    router.post("/user/login", users_controller.login);
    router.post("/user/signup", users_controller.signup);
    router.post("/user/forgot-password", users_controller.forgotPassword);

    app.use('/api/', router);
};