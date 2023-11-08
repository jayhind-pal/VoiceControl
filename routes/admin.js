

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
    router.post("/adminSubmit", adminAuth, admins_controller.adminSubmit);    


    // router.get("/admins", adminAuth, admins_controller.findAll);
    // router.post("/admin/create", adminAuth, admins_controller.create);
    // router.post("/admin/update", adminAuth, admins_controller.update);
    // router.get("/dashboard", adminAuth, admins_controller.getDashboard);
    // router.get("/testing", admins_controller.testing);
    
    app.use('/', router);
};