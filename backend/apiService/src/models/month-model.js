'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({

    active: {
        type: Boolean,
        required: true,
        default: true
    },

    number: {
        type: Number,
        required: true,
    },

    name: {
        type: String,
        required: true,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    family: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Family'
    },

    salary: {
        type: Number,
        required: true
    },

    balance: {
        type: Number
    },

    accounts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Accounts'
        }
    ]
});

module.exports = mongoose.model('Month', schema);clearImmediate