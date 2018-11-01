'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.authenticate = async (email, password) => {
    const data = await User.findOne({
        "email": email,
        "password": password
    }, "active firstName lastName email roles family");
    return data;
}

exports.get = async (filter) => {
    var data;
    if (filter)
        data = await User.find(JSON.parse(filter), "active firstName lastName email roles");
    else
        data = await User.find({}, "active firstName lastName email roles");
    return data;
};

exports.getById = async (id) => {
    const data = await User.findById(id, "active firstName lastName email roles").populate('family');
    return data;
};

exports.create = async (data) => {
    var user = new User(data);
    const res = await user.save();
    return res;
};

exports.update = async (id, data) => {
    const set = { $set: data };
    const res = await User.findByIdAndUpdate(id, set);
    return res;
};

exports.updateByCondition = async (condition, set) => {
    await User.updateMany(condition, set);
}

exports.delete = async (id) => {
    const data = await User.findByIdAndRemove(id);
    if (data)
        return data;
    return { message: "O usuário não existe" };
};

exports.deleteAll = async () => {
    const data = await User.deleteMany({});
    return data;
}

exports.push = async (id, field, value) => {
    var user = await User.findById(id);
    if (!user)
        return { message: "O usuário não existe" };
    var exist = user[field].find(function (item) {
        return item == value;
    });
    if (exist)
        return { message: "O usuário já possue o elemento " + value + " em " + field }
    user[field].push(value);
    const res = await user.save();
    return res;
}

exports.pull = async (id, field, value) => {
    var user = await User.findById(id);
    if (!user)
        return { message: "O usuário não existe" };
    var exist = user[field].find(function (item) {
        return item == value;
    });
    if (!exist)
        return { message: "O usuário já não possue o elemento " + value + " em " + field }
    user[field].pull(value);
    const res = await user.save();
    return res;
}