const ConfigHelper = require('./ConfigHelper');
const Country = require('../models/Country');
const State = require('../models/State');
const District = require('../models/District');
const City = require('../models/City');
const MotherTongue = require('../models/MotherTongue');
const Language = require('../models/Language');
const Role = require('../models/Role');
module.exports.getUserData = function (data) {
    const self = this;
    return new Promise(async function (resolve, reject) {
        data = JSON.parse(JSON.stringify(data));
        const RoleData = await Role.getById(data.role);
        resp = {};
        resp.user_id = data._id;
        resp.profile_id = data.profile_id;
        resp.avatar = await self.userAvatar(data.avatar);
        resp.mobile_number = data.mobile_number;
        resp.name = (data.name != undefined) ? data.name : '';
        resp.sur_name = data.sur_name;
        resp.father_name = data.father_name;
        resp.date_of_birth = data.date_of_birth;
        resp.email = data.email;
        resp.gender = data.gender;
        resp.alternate_mobile_number = data.alternate_mobile_number;
        resp.qualification = data.qualification;
        resp.other_achivement = data.other_achivement;
        resp.role = RoleData.slug;
        resolve(resp);
    });
}

module.exports.getTeacherData = function (data) {
    const self = this;
    return new Promise(async function (resolve, reject) {
        data = JSON.parse(JSON.stringify(data));
        const countryData = await Country.getById(data.country);
        const stateData = await State.getById(data.state);
        const districtData = await District.getById(data.district);
        const cityData = await City.getById(data.city);
        const mothertongueData = await MotherTongue.getById(data.mother_tongue);
        resp = {};
        resp.user_id = data._id;
        resp.profile_id = data.profile_id;
        resp.avatar = await self.userAvatar(data.avatar);
        resp.mobile_number = data.mobile_number;
        resp.name = (data.name != undefined) ? data.name : '';
        resp.sur_name = data.sur_name;
        resp.father_name = data.father_name;
        resp.date_of_birth = data.date_of_birth;
        resp.email = data.email;
        resp.gender = data.gender;
        resp.alternate_mobile_number = data.alternate_mobile_number;
        resp.qualification = data.qualification;
        resp.other_achivement = data.other_achivement;
        resp.country_id = (countryData != undefined && countryData != null) ? countryData._id : '';
        resp.country_name = (countryData != undefined && countryData != null) ? countryData.name : '';
        resp.state_id = (stateData != undefined && stateData != null) ? stateData._id : '';
        resp.state_name = (stateData != undefined && stateData != null) ? stateData.name : '';
        resp.district_id = (districtData != undefined && districtData != null) ? districtData._id : '';
        resp.district_name = (districtData != undefined && districtData != null) ? districtData.name : '';
        resp.city_id = (cityData != undefined && cityData != null) ? cityData._id : '';
        resp.city_name = (cityData != undefined && cityData != null) ? cityData.name : '';
        resp.mother_tongue_id = (mothertongueData != undefined && mothertongueData != null) ? mothertongueData._id : '';
        resp.mother_tongue_name = (mothertongueData != undefined && mothertongueData != null) ? mothertongueData.name : '';
        resp.certificates = [];
        if (data.certificates.length > 0) {
            for (let i = 0; i < data.certificates.length; i++) {
                resp.certificates[i] = await self.certificatesImage(data.certificates[i]);
            }
        }
        resp.pan_card = await self.panCardImage(data.pan_card);
        resp.address_proof = await self.addressProofImage(data.address_proof);
        resp.about = data.about;
        resp.hourly_charges = data.hourly_charges;
        resp.selfi = await self.selfiImage(data.selfi);
        resp.teaching_experience = data.teaching_experience;
        resp.languages = [];
        if (data.languages.length > 0) {
            for (let i = 0; i < data.languages.length; i++) {
                resp.languages[i] = await Language.getLanguageById(data.languages[i]);
            }
        }
        resolve(resp);
    });
}

module.exports.getAccountData = function (data) {
    const self = this;
    return new Promise(async function (resolve, reject) {
        data = JSON.parse(JSON.stringify(data));
        resp = {};
        resp.bank_name = data.bank_name;
        resp.branch_name = data.branch_name;
        resp.account_number = data.account_number;
        resp.ifsc_code = data.ifsc_code;
        resp.account_holder_name = data.account_holder_name;
        resolve(resp);
    });
}
module.exports.getStudentData = function (data) {
    const self = this;
    return new Promise(async function (resolve, reject) {
        data = JSON.parse(JSON.stringify(data));
        const mothertongueData = await MotherTongue.getById(data.mother_tongue);
        resp = {};
        resp.user_id = data._id;
        resp.profile_id = data.profile_id;
        resp.avatar = await self.userAvatar(data.avatar);
        resp.mobile_number = data.mobile_number;
        resp.name = (data.name != undefined) ? data.name : '';
        resp.sur_name = data.sur_name;
        resp.date_of_birth = data.date_of_birth;
        resp.email = data.email;
        resp.gender = data.gender;
        resp.alternate_mobile_number = data.alternate_mobile_number;
        resp.qualification = data.qualification;
        resp.other_achivement = data.other_achivement;
        resp.mother_tongue_id = (mothertongueData != undefined && mothertongueData != null) ? mothertongueData._id : '';
        resp.mother_tongue_name = (mothertongueData != undefined && mothertongueData != null) ? mothertongueData.name : '';
        resp.address_proof = await self.addressProofImage(data.address_proof);
        resp.languages = [];
        if (data.languages.length > 0) {
            for (let i = 0; i < data.languages.length; i++) {
                resp.languages[i] = await Language.getLanguageById(data.languages[i]);
            }
        }
        resolve(resp);
    });
}

module.exports.getGroupStudentData = function (data) {
    const self = this;
    return new Promise(async function (resolve, reject) {
        data = JSON.parse(JSON.stringify(data));
        resp = {};
        resp.user_id = data._id;
        resp.profile_id = data.profile_id;
        resp.mobile_number = data.mobile_number;
        resp.name = (data.name != undefined) ? data.name : '';
        resolve(resp);
    });
}
module.exports.userAvatar = function (avatar) {
    return new Promise(function (resolve, reject) {
        if (avatar != "") {
            resolve(locals.user_avatar.path + avatar);
        } else {
            resolve(locals.user_avatar.default_path);
        }
    });
}

module.exports.panCardImage = function (image) {
    return new Promise(function (resolve, reject) {
        if (image != "") {
            resolve(locals.user_pan_card.path + image);
        } else {
            resolve(locals.user_pan_card.default_path);
        }
    });
}

module.exports.addressProofImage = function (image) {
    return new Promise(function (resolve, reject) {
        if (image != "") {
            resolve(locals.user_address_proof.path + image);
        } else {
            resolve(locals.user_address_proof.default_path);
        }
    });
}

module.exports.selfiImage = function (image) {
    return new Promise(function (resolve, reject) {
        if (image != "") {
            resolve(locals.user_selfi.path + image);
        } else {
            resolve(locals.user_selfi.default_path);
        }
    });
}


module.exports.certificatesImage = function (image) {
    return new Promise(function (resolve, reject) {
        if (image != "") {
            resolve(locals.user_certificates.path + image);
        } else {
            resolve(locals.user_certificates.default_path);
        }
    });
}

module.exports.scheduleFile = function (image) {
    return new Promise(function (resolve, reject) {
        if (image != "") {
            resolve(locals.tution_schedule_file.path + image);
        } else {
            resolve("");
        }
    });
}
module.exports.postDoubtImage = function (image) {
    return new Promise(function (resolve, reject) {
        if (image != "") {
            resolve(locals.post_doubt_image.path + image);
        } else {
            resolve("");
        }
    });
}

