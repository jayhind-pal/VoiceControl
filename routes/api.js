

module.exports = app => {
    var router = require("express").Router();
    const auth = require("../middleware/auth");
    var multer  = require('multer');
    var userUpload = multer({ storage: multer.diskStorage({
            destination: function (req, file, cb) {
               cb(null, 'public/users');
            },
            filename: function (req, file, cb) {
               cb(null, Date.now() + '-' + file.originalname);
            }
        })
    });
    var postUpload = multer({ storage: multer.diskStorage({
            destination: function (req, file, cb) {
               cb(null, 'public/posts');
            },
            filename: function (req, file, cb) {
               cb(null, Date.now() + '-' + file.originalname);
            }
        })
    });
    

    //users
    const users_controller = require("../controllers/api/user.controller.js");
    router.post("/login", users_controller.login);
    router.post("/user/create", users_controller.create);
    router.post("/user/resend-verification-email", users_controller.resendVerificationMail);
    router.get("/verify-email", users_controller.verifyEmail);
    router.get("/get-profile", auth, users_controller.getProfile);
    router.get("/users", auth, users_controller.findAll);
    router.post("/user/update", [auth, userUpload.single('user_image')], users_controller.update);
    router.post("/user/change-password", auth, users_controller.changePassword);

    //country
    const country_controller = require("../controllers/api/country.controller.js");
    router.get("/countries", country_controller.findAll);
    
    //category
    const category_controller = require("../controllers/admin/category.controller.js");
    router.get("/categories", auth, category_controller.findAll);
    
    
    //projects: portfolio
    const project_controller = require("../controllers/api/project.controller.js");
    router.get("/user/projects", auth, project_controller.findAll);
    router.post("/user/project/create", auth, project_controller.create);
    router.post("/user/project/update", auth, project_controller.update);
    router.post("/user/project/delete", auth, project_controller.delete);
    
    app.use('/api/', router);
};