const ConfigHelper = require('./ConfigHelper');

module.exports.sendOTP = async function (code, mobile_no, msg, next) {
    if (locals.isLive == 1) {
        var msg91_api_key = await ConfigHelper.getConfigValue('msg91_api_key');
        var msg91_sender_id = await ConfigHelper.getConfigValue('msg91_sender_id');
        var msg91_route_no = await ConfigHelper.getConfigValue('msg91_route_no');
        var msg91 = require("msg91")(msg91_api_key, msg91_sender_id, msg91_route_no);
        msg91.send(code + mobile_no, msg, function (err, response) {
            next(true)
        });
    } else {
        next(true)
    }
}