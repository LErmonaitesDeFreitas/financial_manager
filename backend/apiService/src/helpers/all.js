'use strict';

exports.getObj = (body, fields) => {
    var ret = {};
    fields.forEach(function(field){
        ret[field] = body[field];
    });
    return ret;
}