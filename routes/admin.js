

module.exports = app => {
    var router = require("express").Router();
    const auth = require("../middleware/auth");
    var multer  = require('multer');
    var categoryStorage = multer.diskStorage({
        destination: function (req, file, cb) {
           cb(null, 'public/category');
        },
        filename: function (req, file, cb) {
           cb(null, Date.now() + '-' + file.originalname);
        }
    });
    var categoryUpload = multer({ storage: categoryStorage });

    
    //admins
    const admins_controller = require("../controllers/admin/admin.controller.js");
    router.post("/login", admins_controller.login);
    router.get("/admins", auth, admins_controller.findAll);
    router.post("/admin/create", auth, admins_controller.create);
    router.post("/admin/update", auth, admins_controller.update);
    router.get("/dashboard", auth, admins_controller.getDashboard);
    router.get("/testing", admins_controller.testing);

    //categories
    const category_controller = require("../controllers/admin/category.controller.js");
    router.post("/category/create", [auth, categoryUpload.single('category_image')], category_controller.create);
    router.get("/categories", auth, category_controller.findAll);
    router.get("/category/:id",  auth, category_controller.findOne);
    router.post("/category/update", [auth, categoryUpload.single('category_image')], category_controller.update);
    router.delete("/category/delete/:id",  auth, category_controller.delete);

    //users
    const users_controller = require("../controllers/api/user.controller.js");
    router.post("/user/login", users_controller.login);
    router.get("/users", auth, users_controller.findAll);
    router.post("/user/create", auth, users_controller.create);
    router.post("/user/update", auth, users_controller.update);
    
    //country
    const country_controller = require("../controllers/api/country.controller.js");
    router.get("/countries", auth, country_controller.findAll);

    
    app.use('/admin/api/', router);
};