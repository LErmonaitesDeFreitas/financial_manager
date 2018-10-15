'use strict';

exports.getObjPost = (body, fields, userSession) => {
    var ret = {};
    fields.forEach(function (field) {
        if (body[field])
            ret[field] = body[field];
    });

    ret.user = userSession._id;

    ret.family = userSession.family;

    return ret;
};

exports.getObjPut = (body, fields) => {
    var ret = {};
    fields.forEach(function (field) {
        if (body[field])
            ret[field] = body[field];
    });
    return ret;
};

exports.getObjCreateFromCreateMonthsUser = (user) => {
    
    const objCreate = {
        user: user._id,
        family: user.family,
        salary: 0,
        balance: 0,
        accounts: []
    };
}

exports.getMonths = () => {
    return  ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
}