const User = require("./../../models/user.model.js");
const emailVerification = require("./../../models/email_verification.model.js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ejs = require('ejs');
const Mailer = require('./../../helpers/MailHelper');
const mailer = new Mailer();
const Activity = require("./../../models/activity.model.js")

exports.login = async (req, res) => {
  User.login(req.body.email, async (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: trans.lang('message.user.invalid_credentials')
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
        res.status(200).json(data);
      } else {
        res.status(404).send({
          message: trans.lang('message.user.invalid_credentials')
        });
      }
    }
  });
};

exports.signup = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: trans.lang('message.required')
    });
    return;
  }

  User.findByEmail(req.body.email, async (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        let encPassword = await bcrypt.hash(req.body.password, 10);

        // Create a User
        const newRecord = new User({
          name: req.body.name,
          dob: req.body.dob,
          zipcode: req.body.zipcode,
          email: req.body.email,
          password: encPassword,
        });

        // Save User in the database
        User.create(newRecord, async (err, newUser) => {
          if (err) {
            res.status(500).send({
              error: err,
              message:
                err.message || trans.lang('message.something_went_wrong')
            });
          } else {
            try {
              //add activity
              let activity = `${req.body.name} user created`
              let newActivity = {
                activity: activity,
              }
              Activity.create(new Activity(newActivity), async (err, data) => {
                if (err) {
                  // res.send("error while generating logs");
                  // return;
                }
              });
            } catch (err) { }
            res.send(newUser);
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

exports.forgotPassword = async (req, res) => {
  // Validate Request
  if (!req.body.email) {
    res.status(400).send({
      message: trans.lang('message.required')
    });
  }
  User.findByEmail(req.body.email, async (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: trans.lang('message.data_not_found')
        });
      } else {
        res.status(500).send({
          error: err,
          message: trans.lang('message.something_went_wrong')
        });
      }
    } else {
      emailVerification.create({ user_id: data.id, email: data.email }, async (err, evdata) => {
        if (!err) {
          const resetLink = base_url + 'api/reset-password?evid=' + evdata.id + '&uid=' + data.id + "&email=" + data.email;
          const html = await ejs.renderFile('./views/mails/email_verification.ejs', {
            user: req.body,
            resetLink
          });
          mailer.send(req.body.email, `Welcome to ${global.appname}`, html);

          res.send({ message: "We have sent a Reset password link to your email - " + req.body.email, resetLink });
          return;
        }

        res.status(500).send({
          error: err,
          message: trans.lang('message.something_went_wrong')
        });
      });
    }
  });
};
exports.resetPassword = (req, res) => {
  // Validate Request
  if (!req.query) {
    res.redirect(base_url + 'page-not-found');
    return;
  }

  emailVerification.findRecord(req.query.evid, req.query.uid, req.query.email, (err, data) => {
    if (err) {
      res.redirect(base_url + 'page-not-found');
      return;
    }

    res.render('resetPassword.ejs', {
      appName: global.appname,
      query: req.query
    });
  });
};
exports.resetPasswordSubmit = async (req, res) => {
  User.findByEmail(req.body.email, async (err, data) => {
    if (err) {
      if (err.kind !== "not_found") {
        res.redirect('/api/reset-password?evid=' + req.body.evid + '&uid=' + req.body.uid + "&email=" + req.body.email + '&error=' + trans.lang('message.something_went_wrong'));
        return;
      }
    }

    // confirm password
    if (req.body.password !== req.body.confirm_password) {
      res.redirect('/api/reset-password?evid=' + req.body.evid + '&uid=' + req.body.uid + "&email=" + req.body.email + '&error=' + trans.lang('message.password_not_matched'));
      return;
    }

    // Save user in the database
    let record = { password: await bcrypt.hash(req.body.password, 10) };
    User.updateById(data.id, new User(record), async (err, data) => {
      if (err) {
        res.redirect('/api/reset-password?evid=' + req.body.evid + '&uid=' + req.body.uid + "&email=" + req.body.email + '&error=' + trans.lang('message.something_went_wrong'));
      } else {
        emailVerification.delete(req.body.evid, (err, data) => { });
        res.redirect('/api/success');
      }
    });
  });
};
exports.success = (req, res) => {
  res.render('success.ejs', {
    appname: global.appname,
  });
};