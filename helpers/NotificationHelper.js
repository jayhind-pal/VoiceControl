const admin = require('firebase-admin');

module.exports.send = function(title, msg, receiver_token,type) {
    return new Promise(async function (resolve, reject) {
        if (locals.isLive != 1) {
            resolve(true);
        }else {
            if (!admin.apps.length) {
                var serviceAccount = require('../firebase/privatekey.json');
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                    databaseURL: "https://medico-203da.firebaseio.com"
                });
            }
            var message = {
                android: {
                    ttl: 10000,
                    priority: 'high',
                    data: {
                        title: title,
                        type: JSON.stringify(type),
                        body: decodeURIComponent(msg)
                    }
                },
                // apns: {
                //     payload: {
                //         ttl: 10000,
                //         priority: 'high',
                //         data: {
                //             title: title,
                //             type: type,
                //             body: decodeURIComponent(msg)
                //         },
                //         aps: {
                //             badge: 0,
                //             sound: "bingbong.aiff",
                //             alert: decodeURIComponent(msg),
                //             "content-available": 1
                //         }
                //     }
                // },
                token: receiver_token
            };
            admin.messaging().send(message).then(res => {
                console.log("Success", res)
                resolve(true);
            }).catch(err => {
                console.log("Error:", err)
                resolve(false);
            })
        }
    })
};