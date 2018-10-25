'use strict';

const mongoose = require('mongoose');
const Account = mongoose.model('Account');

exports.get = async (filter) => {
    var data;
    if (filter)
        data = await Account.find(JSON.parse(filter));
    else
        data = await Account.find();
    return data;
};

exports.getById = async (id) => {
    const data = await Account.findById(id);
    return data;
};

exports.create = async (data) => {
    var account = new Account(data);
    const res = await account.save()
    return res;
};

exports.update = async (id, data) => {
    const set = { $set: data }
    const res = await Account.findByIdAndUpdate(id, set);
    return res;
};

exports.updateByCondition = async (condition, set) => {
    await Account.updateMany(condition, set);
}

exports.delete = async (id) => {
    const data = await Account.findByIdAndRemove(id);
    return data;
};

exports.deleteAll = async () => {
    const data = await Account.deleteMany({});
    return data;
}

exports.push = async (id, field, value) => {
    var account = await Account.findById(id);
    if (!account)
        return { message: "A conta não existe" };
    var exist = account[field].find(function (item) {
        return item == value;
    });
    if (exist)
        return { message: "A conta já possue o elemento " + value + " em " + field }
    account[field].push(value);
    const res = await account.save();
    return res;
}

exports.pull = async (id, field, value) => {
    var account = await account.findById(id);
    if (!account)
        return { message: "A conta não existe" };
    var exist = account[field].find(function (item) {
        return item == value;
    });
    if (!exist)
        return { message: "A conta já não possue o elemento " + value + " em " + field }
    account[field].pull(value);
    const res = await account.save();
    return res;
}