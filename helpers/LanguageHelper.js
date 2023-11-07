module.exports.lang = function (_str,params={}) {
    let self = this;
    var str = _str.split('.');
    const file = str[0];
    const filepath = __lang_path+currentLang+'/'+file+'.js';
    let messages = require(filepath);
    if(str.length == 2){
        return self.setAttributes(messages[str[1]],params);
    }
    if(str.length == 3){
        return self.setAttributes(messages[str[1]][str[2]],params);
    }
    if(str.length == 4){
        return self.setAttributes(messages[str[1]][str[2]][str[3]],params);
    }
    return _str;
}

module.exports.setAttributes = function (str,params) {
    if(Object.size(params) > 0){
        let i = 1;
        for (key in params) {
            let _key = new RegExp(':'+key, 'g');
            str = str.replace(_key,params[key]);
            if(i == Object.size(params)){
                return str;
            }
            i++;
        }
    }
    return str;
}

module.exports.validationLang = function () {
    var filepath =  __lang_path+currentLang+'/validation.js';
    return require(filepath);
}

module.exports.validationFieldLang = function () {
    var filepath =  __lang_path+currentLang+'/validation_fields.js';
    return require(filepath);
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};