const User = require("./../../models/user.model.js");
const emailVerification = require("./../../models/email_verification.model.js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ejs = require('ejs');
const Mailer = require('./../../helpers/MailHelper');
const mailer = new Mailer();


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
                    message: trans.lang('message.user.invalid_credentials')
                });
            }
        }
    });
};

exports.findAll = (req, res) => {
    const type = req.query.type;
    User.getAll(type, (err, data) => {
      if (err)
        res.status(500).send({
          error: err,
          message:
            err.message || trans.lang('message.something_went_wrong')
        });
      else res.send(data);
    });
};

exports.create = async (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: trans.lang('message.required')
        });
        return;
    }
    
    User.findByEmail(req.body.email, async (err, data) => {
        if (err) 
        {
            if (err.kind === "not_found") 
            {
                let encPassword = await bcrypt.hash(req.body.password, 10);

                // Create a User
                const newRecord = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: encPassword,
                });
            
                // Save User in the database
                User.create(newRecord, async (err, newUser) => {
                    if (err){
                      res.status(500).send({
                        error: err,
                        message:
                          err.message || trans.lang('message.something_went_wrong')
                      });
                    }else{
                        emailVerification.create({user_id:newUser.id, email: newUser.email}, async (err, evdata) => {
                            if (!err){
                                const html = await ejs.renderFile('./views/mails/email_verification.ejs',{
                                    user: req.body,
                                    verifyUrl: base_url + 'api/verify-email?evid='+evdata.id+'&uid='+newUser.id+"&email="+newUser.email
                                });
                                mailer.send(req.body.email, `Welcome to ${global.appname}`, html);  
                            }
                        });
                        
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

exports.update = async (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: trans.lang('message.required')
    });
  }
  
  let updatedUser = req.body;
  if(req.file){
    updatedUser.user_image = req.file.path;
  }
  if(req.body.password){
      let encPassword = await bcrypt.hash(req.body.password, 10);
      updatedUser.password = encPassword;
  }
      
  User.updateById(
    req.user.id,
    new User(updatedUser),
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
exports.changePassword = async (req, res) => {
    // Validate Request
    if (!req.user.id || !req.body.old_password || !req.body.new_password || !req.body.confirm_password) {
        res.status(400).send({
          message: trans.lang('message.required')
        });
    }
  
    let updatedUser = req.body;
    if(updatedUser.new_password !== updatedUser.confirm_password)
    {
        res.status(404).send({
          message: trans.lang('message.user.confirm_password_not_matched')
        });
    }else{
        User.findById(req.user.id, async (err, data) => {
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
                let oldPasswordMatched = await bcrypt.compare(req.body.old_password, data.password);
                if(!oldPasswordMatched){
                    res.status(404).send({
                      message: trans.lang('message.user.old_password_not_matched')
                    });
                }else{
                    let encPassword = await bcrypt.hash(req.body.new_password, 10);
                    User.updateById(
                        req.user.id,
                        new User({password: encPassword}),
                        (err, data) => {
                          if (err) {
                              res.status(500).send({
                                error: err,
                                message: trans.lang('message.something_went_wrong')
                              });
                          } else res.send(data);
                    });
                }
            }
        });
    }
};
exports.resendVerificationMail = async (req, res) => {
    // Validate request
    if (!req.body.email) {
        res.status(400).send({
            message: trans.lang('message.required')
        });
    }
    
    User.findByEmail(req.body.email, async (err, data) => {
        if (err) 
        {
            res.status(500).send({
              error: err,
              message: trans.lang('message.something_went_wrong')
            });
        } else {
            emailVerification.create({user_id:data.id, email: data.email}, async (err, evdata) => {
                if (!err){
                    const html = await ejs.renderFile('./views/mails/email_verification.ejs',{
                        user: req.body,
                        verifyUrl: base_url + 'api/verify-email?evid='+evdata.id+'&uid='+data.id+"&email="+data.email
                    });
                    mailer.send(req.body.email, "Welcome to 123Freela",html);  
                }
            });
            
            res.send(data);
        }
    });
};
exports.verifyEmail = (req, res) => {
  // Validate Request
    if (!req.query) {
        res.status(400).send({
          message: trans.lang('message.required')
        });
    }
      
    emailVerification.findRecord(
        req.query.evid,
        req.query.uid,
        req.query.email,
    (err, data) => {
        if (err) {
            res.redirect(web_url+'page-not-found');
        } else {
            User.updateById(
                req.query.uid,
                {email_verified: 1},
            (err, updateData) => {
                if (err) {
                    res.redirect(web_url+'page-not-found');
                } else {
                    emailVerification.delete(req.query.evid, (err, data) => {});
                    
                    const token = jwt.sign(
                      { id: req.query.uid, email: req.query.email },
                      process.env.TOKEN_KEY,
                      {
                        expiresIn: "2h",
                      }
                    );
                    res.redirect(web_url+'complete-profile?token='+token);
                }
            });
        }
    });
};
exports.getProfile = async (req, res) => {
  User.findById(req.user.id, async (err, data) => {
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
            data.token = req.user.token;
            res.status(200).json(data);
        }
    });
};