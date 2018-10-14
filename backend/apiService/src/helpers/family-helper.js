'use strict';

exports.getObjCreate = (body, fields, userSession) => {
    var ret = {};
    fields.forEach(function (field) {
        if (body[field])
            ret[field] = body[field];
    });
    ret.manager = userSession._id;
    ret.members = [userSession._id];
    return ret;
};

exports.getObjPut = (body, fields) => {
    var ret = {};
    fields.forEach(function (field) {
        if (body[field])
            ret[field] = body[field];
    });
    return ret;
}

exports.clearUsersFamily = (familyId) => {
    const userController = require("../controllers/user-controller");
    userController.clearUsersFamily(familyId);
}

exports.retireRole = (userId) => {
    const userController = require("../controllers/user-controller");
    userController.retireRole(userId, 'family-admin');
}

exports.clearAccountsFamily = (familyId) => {
    const accountController = require("../controllers/account-controller");
    accountController.clearAccountsFamily(familyId);
}

exports.setFamilyCreated = (family, user) => {
    const userController = require("../controllers/user-controller");
    userController.setFamilyCreated(user, family);
}

