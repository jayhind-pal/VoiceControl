

module.exports = app => {
    var router = require("express").Router();
    const auth = require("../middleware/auth");
    var multer  = require('multer');

    var userUpload = multer({ 
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
               cb(null, 'public/users');
            },
            filename: function (req, file, cb) {
               cb(null, Date.now() + '-' + file.originalname);
            }
        })
    });

    var taskUpload = multer({ 
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public/tasks');
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + '-' + file.originalname);
            }
        })
    });

    

    //users
    const users_controller = require("../controllers/api/user.controller.js");
    router.post("/login", users_controller.login);
    router.post("/social/login", users_controller.socialLogin);
    router.post("/user/create", users_controller.create);
    router.post("/user/resend-verification-email", users_controller.resendVerificationMail);
    router.get("/verify-email", users_controller.verifyEmail);
    router.get("/user/profile", auth, users_controller.getProfile);
    router.get("/users", auth, users_controller.findAll);
    router.post("/user/update", [auth, userUpload.single('user_image')], users_controller.update);
    router.post("/user/change-password", auth, users_controller.changePassword);

    //country
    const country_controller = require("../controllers/api/country.controller.js");
    router.get("/countries", country_controller.findAll);
    
    //category
    const category_controller = require("../controllers/admin/category.controller.js");
    router.get("/categories", auth, category_controller.findAll);

    //plan
    const plan_controller = require("../controllers/admin/plan.controller.js");
    router.get("/plans", auth, plan_controller.findAll);

    //task
    const task_controller = require("../controllers/api/task.controller.js");
    router.post("/task/create", [auth, taskUpload.single('task_attachment')], task_controller.create);
    router.post("/task/update", [auth, taskUpload.single('task_attachment')], task_controller.update);
    router.get("/tasks", auth, task_controller.findAll);

    //task_attenders
    const task_attenders = require("../controllers/api/task_attenders.controller.js");
    router.post("/task/attenders/create", auth, task_attenders.create);
    router.get("/task/attenders", auth, task_attenders.findAll);
    router.get("/task/attended", auth, task_attenders.getAttendedTasks);
    
    app.use('/api/', router);
};