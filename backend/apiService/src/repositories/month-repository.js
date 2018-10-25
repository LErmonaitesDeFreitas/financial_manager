'use strict';

const mongoose = require('mongoose');
const Month = mongoose.model('Month');

exports.get = async (filter) => {
    var data;
    if (filter)
        data = await Month.find(JSON.parse(filter));
    else
        data = await Month.find();
    return data;
};

exports.getById = async (id) => {
    const data = await Month.findById(id);
    return data;
};

exports.create = async (data) => {
    var month = new Month(data);
    const res = await month.save()
    return res;
};

exports.update = async (id, data) => {
    const set = { $set: data }
    const res = await Month.findByIdAndUpdate(id, set);
    return res;
};

exports.updateByCondition = async (condition, set) => {
    await Month.updateMany(condition, set);
}

exports.delete = async (id) => {
    const data = await Month.findByIdAndRemove(id);
    return data;
};

exports.deleteAll = async () => {
    const data = await Month.deleteMany({});
    return data;
}

exports.push = async (id, field, value) => {
    var month = await Month.findById(id);
    if (!month)
        return { message: "A conta não existe" };
    var exist = month[field].find(function (item) {
        return item == value;
    });
    if (exist)
        return { message: "A conta já possue o elemento " + value + " em " + field }
    month[field].push(value);
    const res = await month.save();
    return res;
}

exports.pull = async (id, field, value) => {
    var month = await Month.findById(id);
    if (!month)
        return { message: "A conta não existe" };
    var exist = month[field].find(function (item) {
        return item == value;
    });
    if (!exist)
        return { message: "A conta já não possue o elemento " + value + " em " + field }
    month[field].pull(value);
    const res = await month.save();
    return res;
}