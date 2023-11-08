const nodemailer = require('nodemailer');
class Mailer {
    constructor(){
        this.transporter = nodemailer.createTransport({
            host: process.env.MAILER_HOST,
            port: 25,
            auth: {
                user: process.env.MAILER_USER,
                pass: process.env.MAILER_PASS
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false,
            },
        });
        
        this.mailOptions = {
            from: process.env.FROM_EMAIL                   // sender's gmail
        };
    }

    send(to_email,subject,html) {
        this.mailOptions.to = to_email;
        this.mailOptions.subject = subject;
        this.mailOptions.html = html;
        this.transporter.sendMail(this.mailOptions, function (error, info) {
            if (error) {
                console.log("error is mail sending",error);
            } else {
                console.log('Email sent: ' + info.response);
            }
            // next(error,info);
        });
    }

}

module.exports = Mailer;






/*


var Notification = require('../models/schemas/Notification');
var firebase = require('../firebase/firebase');
var User = require('../models/schemas/User');
var Api_Key = require('../models/schemas/Api_Key');
var userObj = require('../models/User');

module.exports.sendmail = async function (user_email, subject, msg, next = false) {

    var api_key = 'ef5924af46ea9c61c8e31f5c006ada8b-65b08458-d9013671';
    var domain = 'mg.live2talks.com';
    var auth = await Api_Key.findOne({ api_name: 'Mailgun' });
    if (auth == null || auth == undefined || auth == '' || auth == {}) {
        api_key = 'ef5924af46ea9c61c8e31f5c006ada8b-65b08458-d9013671';
        domain = 'mg.live2talks.com';
    }
    else {
        api_key = auth.api_key_1;
        domain = auth.api_key_2;
    }
    var mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });
    var data = {
        // from: constant_english.admin_mail_sender,
        to: user_email,
        subject: subject,
        html: msg,
    };
    // console.log(data)
    mailgun.messages().send(data, function (error, body) {
        if (!error && next) {
            console.log('2')
            next(body);
            return { status: '1', msg: body }
        } else {
            // console.log('1')
            console.log(error);
            return { status: '2', msg: error }
        }
    });
}


*/