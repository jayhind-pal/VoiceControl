const Admin = require("./../../models/admin.model.js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ejs = require('ejs');
const Mailer = require('./../../helpers/MailHelper');
const mailer = new Mailer();

//test html page rendering
exports.testing = (req, res) => {
    const admin = new Admin({
        name: "test",
        email: "publicserver95@gmail.com",
        password: "12345"
    });
    // res.render('mails/send_admin_user.ejs', { admin});
    res.render('mails/email_verification.ejs', { user: admin, verifyUrl: 'https://abc.com'});
};

// Find a single User with a id
exports.login = async (req, res) => {
    Admin.login(req.body.email, async (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: trans.lang('message.admin.invalid_credentials')
            });
          } else {
            res.status(500).send({
              error: err,
              message: trans.lang('message.something_went_wrong')
            });
          }
        } else {
            let passwordMatched = await bcrypt.compare(req.body.password, data.password);
            if (data && passwordMatched) {
                // Create token
                const token = jwt.sign(
                  { id: data.id, email: data.email },
                  process.env.TOKEN_KEY,
                  {
                    expiresIn: "2h",
                  }
                );
          
                // save user token
                data.token = token;
          
                // user
                res.status(200).json(data);
            }else{
                res.status(404).send({
                    message: trans.lang('message.admin.invalid_credentials')
                });
            }
        }
    });
};

exports.findAll = (req, res) => {
    const name = req.query.name;
    Admin.getAll(name, (err, data) => {
      if (err)
        res.status(500).send({
          error: err,
          message:
            err.message || trans.lang('message.something_went_wrong')
        });
      else res.send(data);
    });
};

// Create and Save a new Tutorial
exports.create = async (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: trans.lang('message.required')
        });
    }
    
    Admin.findByEmail(req.body.email, async (err, data) => {
        if (err) 
        {
            if (err.kind === "not_found") 
            {
                let encPassword = await bcrypt.hash(req.body.password, 10);

                // Create a Admin
                const newRecord = new Admin({
                    name: req.body.name,
                    email: req.body.email,
                    password: encPassword
                });
            
                // Save Admin in the database
                Admin.create(newRecord, async (err, data) => {
                    if (err){
                      res.status(500).send({
                        error: err,
                        message:
                          err.message || trans.lang('message.something_went_wrong')
                      });
                    }else{
                        const html = await ejs.renderFile('./views/mails/send_admin_user.ejs',{admin: req.body});
                        mailer.send(req.body.email, "Welcome to 123Freela",html);  
                        res.send(data);
                    } 
                });
          } else {
            res.status(500).send({
              error: err,
              message: trans.lang('message.something_went_wrong')
            });
          }
        } else {
            res.status(500).send({
              message: trans.lang('message.email_already_exists')
            });
        }
    });
};

// Update a Admin identified by the id in the request
exports.update = async (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: trans.lang('message.required')
    });
  }
  let encPassword = await bcrypt.hash(req.body.password, 10);
  let updatedAdmin = req.body;
  updatedAdmin.password = encPassword;
      
  Admin.updateById(
    req.body.id,
    new Admin(updatedAdmin),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            error: err,
            message: trans.lang('message.not_found')
          });
        } else {
          res.status(500).send({
            error: err,
            message: trans.lang('message.something_went_wrong')
          });
        }
      } else res.send(data);
    }
  );
};


exports.getDashboard = (req, res) => {
    Admin.getDashboard((err, data) => {
        if (err)
            res.status(500).send({
              message:
                err.message || trans.lang('message.something_went_wrong')
            });
        else {
            res.send(data);
        }
    });
};