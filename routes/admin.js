

module.exports = app => {
    var router = require("express").Router();
    const adminAuth = require("../middleware/adminAuth");
    
    //admins
    const admins_controller = require("../controllers/admin/admin.controller.js");
    router.get("/", admins_controller.login);
    router.get("/login", admins_controller.login);
    router.post("/login-submit", admins_controller.loginSubmit);
    router.get("/logout", admins_controller.logout);

    //after login::protected
    router.get("/dashboard", adminAuth, admins_controller.dashboard);
    router.get("/users", adminAuth, admins_controller.users);    
    router.get("/admins", adminAuth, admins_controller.admins);    
    router.get("/activity",adminAuth, admins_controller.activity)
    router.post("/adminSubmit", admins_controller.adminSubmit);    
    router.post("/updateUser",admins_controller.updateUser);
    router.get("/deleteUser/:id",admins_controller.deleteUser)
    
    app.use('/', router);
};