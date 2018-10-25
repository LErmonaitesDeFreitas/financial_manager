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



