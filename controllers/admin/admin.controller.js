const Admin = require("./../../models/admin.model.js");
const User = require("./../../models/user.model.js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ejs = require('ejs');
const moment = require("moment");
const Mailer = require('./../../helpers/MailHelper');
const Activity = require("../../models/activity.model.js");
const mailer = new Mailer();

//login page
exports.login = (req, res) => {
  res.render('login.ejs', { appName: global.appname, error: req.query.error });
  return;
};

// Find a single User with a id
exports.loginSubmit = async (req, res) => {
  Admin.login(req.body.email, async (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.redirect('/login?error=' + trans.lang('message.admin.invalid_credentials'));
      } else {
        res.redirect('/login?error=' + trans.lang('message.something_went_wrong'));
      }
    } else {
      let passwordMatched = await bcrypt.compare(req.body.password, data.password);
      if (data && passwordMatched) {
        // Create token
        const token = jwt.sign(
          { id: data.id, email: data.email, name: data.name },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );

        // save user token
        const permissions = data.permissions.split(',');
        req.session.user = { ...data, permissions, token };

        res.redirect('/dashboard');
        return;
      } else {
        res.redirect('/login?error=' + trans.lang('message.admin.invalid_credentials'));
        return;
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
      res.redirect('/login?error=' + trans.lang('message.something_went_wrong'));
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
      let selected = req.query.id;
      let updateUser = data.find(item => item.id === parseInt(selected));
      if (updateUser?.id) updateUser = { ...updateUser, dob: moment(updateUser.dob).format("YYYY-MM-DD") }
      res.render('users.ejs', {
        appName: global.appname,
        user: req.session.user,
        error: req.query.error,
        page: req.query.page,
        users: data,
        updateUser
      });
      return;
  });
};

//admins
exports.admins = (req, res) => {
  Admin.getAll((err, data) => {
    if (err) {
      res.redirect('/login?error=' + trans.lang('message.something_went_wrong'));
      return;
    }
    else {
      let selected = req.query.id;
      const admin = data.find(item => item.id === parseInt(selected));

      res.render('admins.ejs', {
        appName: global.appname,
        user: req.session.user,
        error: req.query.error,
        page: req.query.page,
        admins: data,
        admin: { ...admin, permissions: admin?.permissions.split(',') }
      });
      return;
    }
  });
};

exports.activity = (req, res) => {
  Activity.getAll((err, data) => {
    if (err) {
      res.redirect('/login?error=' + trans.lang('message.something_went_wrong'));
      return;
    }
    else {
      res.render('activity.ejs', {
        appName: global.appname,
        user: req.session.user,
        error: req.query.error,
        page: req.query.page,
        activities: data,
      });
      return;
    }
  });
}
// Create and Save a new Tutorial
exports.adminSubmit = async (req, res) => {
  Admin.findByEmail(req.body.email, async (err, data1) => {
    console.log("data1", data1, err)
    if (err) {
      if (err.kind !== "not_found") {
        res.redirect('/admins?page=form&id=' + req.body.id + '&error=' + trans.lang('message.something_went_wrong'));
        return;
      }
    } else {
      console.log(data1.id, req.body.id)
      if (data1.id != req.body.id) {
        res.redirect('/admins?page=form&id=' + req.body.id + '&error=' + trans.lang('message.email_already_exists'));
        return;
      }
    }

    // Save Admin in the database
    let record = req.body;
    record.permissions = record.permissions.join();
    if (req.body.password !== '') {
      record.password = await bcrypt.hash(req.body.password, 10);
    } else {
      delete record.password;
    }

    if (req.body.id) {
      Admin.updateById(req.body.id, new Admin(record), async (err, data) => {
        if (err) {
          res.redirect('/admins?page=form&id=' + req.body.id + '&error=' + trans.lang('message.something_went_wrong'));
          return;
        } else {
          //add activity
          let activity = `${req.session.user?.name} modified ${record.name} admin`
          let newActivity = {
            adminId: req.session.user?.id,
            activity: activity,
          }
          Activity.create(new Activity(newActivity), async (err, data) => {
            if (err) {
              res.redirect('/admins?page=form&id=' + req.body.id + '&error=' + trans.lang('message.something_went_wrong'));
              return;
            }
          });
          res.redirect('/admins');
          return;
        }
      });
    } else {
      Admin.create(new Admin(record), async (err, data) => {
        if (err) {
          res.redirect('/admins?page=form&id=' + req.body.id + '&error=' + trans.lang('message.something_went_wrong'));
          return;
        } else {
          //add activity
          let activity = `${req.session.user?.name} created ${record.name} admin`
          let newActivity = {
            adminId: req.session.user?.id,
            activity: activity,
          }
          Activity.create(new Activity(newActivity), async (err, data) => {
            if (err) {
              res.redirect('/admins?page=form&id=' + req.body.id + '&error=' + trans.lang('message.something_went_wrong'));
              return;
            }
          });
          res.redirect('/admins');
          return;
        }
      });
    }
  });
};

exports.updateUser = async (req, res) => {
  User.findByEmail(req.body.email, async (err, data) => {
    if (err) {
      if (err.kind !== "not_found") {
        res.redirect('/users?page=form&id=' + req.body.id + '&error=' + trans.lang('message.something_went_wrong'));
        return;
      }
    } else {
      if (data.id != req.body.id) {
        res.redirect('/users?page=form&id=' + req.body.id + '&error=' + trans.lang('message.email_already_exists'));
        return;
      }
    }

    // Update user in the database
    let record = req.body;
    if (req.body.id) {
      User.updateById(req.body.id, new User(record), async (err, data) => {
        if (err) {
          res.redirect('/users?page=form&id=' + req.body.id + '&error=' + trans.lang('message.something_went_wrong'));
          return;
        } else {
          console.log(data)
          //add activity
          let activity = `${req.session.user?.name} modified ${record.name} user`
          let newActivity = {
            adminId: req.session.user?.id,
            activity: activity,
          }
          Activity.create(new Activity(newActivity), async (err, data) => {
            if (err) {
              res.redirect('/users?page=form&id=' + req.body.id + '&error=' + trans.lang('message.something_went_wrong'));
              return;
            }
          });

          res.redirect('/users');
          return;
        }
      });
    }
  });
}

exports.deleteUser = async (req, res) => {
  User.findById(req.params.id, async (err, data1) => {
    if (err) {
      if (err.kind !== "not_found") {
        res.redirect('/users?id=' + req.params.id + '&error=' + trans.lang('message.something_went_wrong'));
        return;
      }
    } 
    // update delete status in the database
    let obj = { status: 0, deletedAt: new Date() }
    if (req.params.id) {
      User.updateById(req.params.id, new User(obj), async (err, data) => {
        if (err) {
          res.redirect('/users?id=' + req.params.id + '&error=' + trans.lang('message.something_went_wrong'));
          return;
        } else {
          console.log(data)
           //add activity
           let activity = `${req.session.user?.name} deleted ${data1.name} user`
           let newActivity = {
             adminId: req.session.user?.id,
             activity: activity,
           }
           Activity.create(new Activity(newActivity), async (err, data) => {
             if (err) {
               res.redirect('/users?page=form&id=' + req.params.id + '&error=' + trans.lang('message.something_went_wrong'));
               return;
             }
           });
          res.redirect('/users');
          return;
        }
      });
    }
  });
}