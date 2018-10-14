'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    
    active: {
        type: Boolean,
        required: true,
        default: true
    },

    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: false,
    },

    email: {
        type: String,
        required: true,
        unique: true
    },
    
    password: {
        type: String,
        required: true
    },

    family: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Family'
    },
    
    roles: [{
        type: String,
        required: true,
        enum: ['user', 'admin', 'family-admin'],
        default: 'user'
    }]

});

module.exports = mongoose.model ('User', schema);