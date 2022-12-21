var configObj = require('../models/Config');

module.exports.getConfigValue = function (key) {
    return new Promise(async function (resolve, reject) {
        var sval = await configObj.getValBykey(key);
        resolve(sval)
    });
}

module.exports.getConfigData = function (key) {
    return new Promise(async function (resolve, reject) {
        var sval = await configObj.getBykey(key);
        resolve(sval)
    });
}