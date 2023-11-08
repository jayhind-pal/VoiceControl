const Admin = require("./../../models/admin.model.js");
const User = require("./../../models/user.model.js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ejs = require('ejs');
const Mailer = require('./../../helpers/MailHelper');
const mailer = new Mailer();

//login page
exports.login = (req, res) => {
    res.render('login.ejs', {appName: global.appname, error: req.query.error});
};

// Find a single User with a id
exports.loginSubmit = async (req, res) => {
    Admin.login(req.body.email, async (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.redirect('/login?error='+trans.lang('message.admin.invalid_credentials'));
          } else {
            res.redirect('/login?error='+trans.lang('message.something_went_wrong'));
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
                const permissions = data.permissions.split(',');
                req.session.user = {...data, permissions, token};

                res.redirect('/dashboard');
            }else{
              res.redirect('/login?error='+trans.lang('message.admin.invalid_credentials'));
            }
        }
    });
};

//logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/login');
  });
};

//dashboard
exports.dashboard = (req, res) => {
  Admin.getDashboard((err, data) => {
    if (err)
      res.redirect('/login?error='+trans.lang('message.something_went_wrong'));
    else {
        res.render('dashboard.ejs', {
          appName: global.appname, 
          user: req.session.user,
          error: req.query.error,
          users: data.users,
          admins: data.admins
        });
      }
  });
};

//users
exports.users = (req, res) => {
  User.getAll((err, data) => {
    if (err)
      res.redirect('/login?error='+trans.lang('message.something_went_wrong'));
    else {
        res.render('users.ejs', {
          appName: global.appname, 
          user: req.session.user,
          error: req.query.error,
          page: req.query.page,
          users: data,
          user: data.find(item=> item.id===req.query.id)
        });
      }
  });
};

//admins
exports.admins = (req, res) => {
  Admin.getAll((err, data) => {
    if (err)
      res.redirect('/login?error='+trans.lang('message.something_went_wrong'));
    else {
      let selected = req.query.id;   
      const admin = data.find(item => item.id === parseInt(selected));

      res.render('admins.ejs', {
          appName: global.appname, 
          user: req.session.user,
          error: req.query.error,
          page: req.query.page,
          admins: data,
          admin: {...admin, permissions: admin?.permissions.split(',')}
        });
      }
  });
};

// Create and Save a new Tutorial
exports.adminSubmit = async (req, res) => {   
    Admin.findByEmail(req.body.email, async (err, data) => {
        if (err) {
          if (err.kind !== "not_found") {
            res.redirect('/admins?page=form&id='+req.body.id+'&error='+trans.lang('message.something_went_wrong'));
            return;
          }
        }else{
          if(data.id != req.body.id){
            res.redirect('/admins?page=form&id='+req.body.id+'&error='+trans.lang('message.email_already_exists'));
            return;
          }
        }
    
        // Save Admin in the database
        let record = req.body;
        record.permissions = record.permissions.join();
        if(req.body.password !== ''){
          record.password = await bcrypt.hash(req.body.password, 10);
        }else{
          delete record.password;
        }
        
        if(req.body.id){
          Admin.updateById(req.body.id, new Admin(record), async (err, data) => {
            if (err){
              res.redirect('/admins?page=form&id='+req.body.id+'&error='+trans.lang('message.something_went_wrong'));
            }else{
              res.redirect('/admins');
            } 
          });
        }else{
          Admin.create(new Admin(record), async (err, data) => {
            if (err){
              res.redirect('/admins?page=form&id='+req.body.id+'&error='+trans.lang('message.something_went_wrong'));
            }else{
              res.redirect('/admins');
            } 
          });
        }
    });
};