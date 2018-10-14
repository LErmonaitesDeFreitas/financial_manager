'use strict';

const md5 = require("md5");

exports.getObjPost = (body, fields, fieldPassword) => {
    var ret = {};

    fields.forEach(function (field) {
        if (body[field])
            ret[field] = body[field];
    });

    ret.roles = ['user'];

    if (body[fieldPassword])
        ret[fieldPassword] = this.getPassword(body[fieldPassword]);
    else
        ret[fieldPassword] = undefined

    return ret;
}

exports.getObjPut = (body, fields, fieldPassword) => {
    var ret = {};

    fields.forEach(function (field) {
        if (body[field])
            ret[field] = body[field];
    });

    if (body[fieldPassword])
        ret[fieldPassword] = this.getPassword(body[fieldPassword]);

    return ret;
}

exports.getPassword = (password) => {
    return md5(password + global.SALT_KEY)
}

exports.insertMember = async  (userId, familyId) => {
    const familyController = require("../controllers/family-controller");
    await familyController.insertMember(userId, familyId);
}

exports.deleteUserFamily = (user) => {
    const familyController = require("../controllers/family-controller");
    familyController.deleteMember(user._id, user.family);
}

exports.desactivateAccountsUser = async (user) => {
    const accountController = require("../controllers/account-controller");
    await accountController.desactivateAccounts(user._id);
}