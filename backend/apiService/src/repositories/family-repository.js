'use strict';

const mongoose = require('mongoose');
const Family = mongoose.model('Family');

exports.get = async (filter) => {
    var data;
    if (filter)
        data = await Family.find(JSON.parse(filter));
    else
        data = await Family.find();
    return data;
};

exports.getById = async (id) => {
    const data = await Family.findById(id);
    return data;
};

exports.create = async (data) => {
    var family = new Family(data);
    const res = await family.save()
    return res;
};

exports.update = async (id, data) => {
    const set = { $set: data }
    const res = await Family.findByIdAndUpdate(id, set);
    return res;
};

exports.delete = async (id) => {
    const data = await Family.findByIdAndRemove(id);
    return data;
};

exports.deleteAll = async () => {
    const data = await Family.deleteMany({});
    return data;
}

exports.push = async (id, field, value) => {
    var family = await Family.findById(id);
    if (!family)
        return { message: "A família não existe" };
    var exist = family[field].find(function (item) {
        return item == value;
    });
    if (exist)
        return { message: "A família já possue o elemento " + value + " em " + field }

    family[field].push(value);
    const res = await family.save();
    return res;
}

exports.pull = async (id, field, value) => {
    var family = await Family.findById(id);
    if (!family)
        return { message: "A família não existe" };
    var exist = family[field].find(function (item) {
        return item == value;
    });
    if (!exist)
        return { message: "A família já não possue o elemento " + value + " em " + field }
    family[field].pull(value);
    const res = await family.save();
    return res;
}