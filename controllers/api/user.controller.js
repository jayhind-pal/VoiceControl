const User = require("./../../models/user.model.js");
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
                res.status(200).json(data);
            }else{
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
        if (err) 
        {
            if (err.kind === "not_found") 
            {
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
                    if (err){
                      res.status(500).send({
                        error: err,
                        message:
                          err.message || trans.lang('message.something_went_wrong')
                      });
                    }else{                        
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
            res.send({message: "We have sent a Reset password link to your email - "+req.body.email});
        }
    });
};