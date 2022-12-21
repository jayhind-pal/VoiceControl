const crypto = require('crypto');
const moment = require('moment-timezone');
const User = require('../models/User');

module.exports.generatePassword = function (length = 8) {
    var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

module.exports.generateCode = function (length = 6) {
    var self = this;
    var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

module.exports.generatePinCode = function (length = 4) {
    var self = this;
    var charset = "0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

module.exports.generatePasscode = function (length = 6) {
    var self = this;
    return new Promise(async function (resolve, reject) {
        var charset = "0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        /* check is exists */
        let isPasscodeExists = await User.isPasscodeExists(retVal);
        if (isPasscodeExists) {
            retVal = await self.generatePasscode();
        }
        return resolve(retVal);
    });
}

var genRandomString = function (length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
var sha512 = function (password, salt) {
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
};

module.exports.generateSalt = function (length = 255) {
    return genRandomString(length); /** Gives us salt of length 16 */
}

module.exports.hashPassword = function (userpassword) {
    var salt = genRandomString(255); /** Gives us salt of length 16 */
    var passwordData = sha512(userpassword, salt);
    return {
        salt: passwordData.salt,
        hash: passwordData.passwordHash
    };
}

module.exports.isPasswordCorrect = function (savedPass, salt, userpassword) {
    var passwordData = sha512(userpassword, salt);
    return savedPass == passwordData.passwordHash;
}


module.exports.sessionrefresh = function (req) {
    var hh = 3600 * 10000000;
    req.session.cookie.expires = new Date(Date.now() + hh);
}

module.exports.errorsValidator = function (object) {
    if (typeof object != "undefined" && Object.keys(object).length > 0) {
        for (var err in object) {
            return object[err][0];
        }
    }
    return '';
}

module.exports.errorsValidate = function (error) {
    // var error = object.validateSync();
    if (typeof error != "undefined" && Object.keys(error).length > 0) {
        var ret_errors = {};
        for (var err in error) {
            ret_errors[err] = error[err][0];
        }
        return (ret_errors);
    }
    return ({});
}

module.exports.errorsAPIValidate = function (error) {
    // var error = object.validateSync();
    if (typeof error != "undefined" && Object.keys(error).length > 0) {
        var ret_errors = "";
        for (var err in error) {
            ret_errors = error[err][0];
            break;
        }
        return (ret_errors);
    }
    return ('');
}

module.exports.modalSort = function (req) {
    var sort = {};
    var col = req.query.order[0]['column'];
    var o = (req.query.order[0]['dir'] == "desc") ? -1 : 1;
    sort[req.query.columns[col]['name']] = o;
    return sort;
}

module.exports.paginateData = function (req, data, fdata, tdata) {
    return {
        "draw": req.query.draw,
        "recordsFiltered": fdata,
        "recordsTotal": tdata,
        "data": data,
    }
}

module.exports.randomString = function (length, chars) {
    var result = '';
    for (var i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

module.exports.numberPadding = function (number, targetLength) {
    var output = number + '';
    while (output.length < targetLength) {
        output = '0' + output;
    }
    return output;
}

module.exports.generateOTP = function () {
    if (locals.isLive == 1) {
        var dd = Math.floor(100000 + Math.random() * 900000);
        return dd;
    } else {
        return 123456;
    }
}

module.exports.findWithAttr = function (array, attr, value) {
    return new Promise(async function (resolve, reject) {
        for (var i = 0; i < array.length; i += 1) {
            if (array[i][attr] === value) {
                resolve(i); return;
            }
        }
        resolve(-1); return;
    });
}

module.exports.numberWithCommas = function (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports.inArrayCounter = function (array, value) {
    return new Promise(async function (resolve, reject) {
        let j = 0;
        for (var i = 0; i < array.length; i += 1) {
            if (array[i] == value) { j++; }
            if (array.length - 1 === i) {
                resolve(j); return;
            }
        }
        resolve(j); return;
    });
}