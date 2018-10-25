'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    
    active: {
        type: Boolean,
        required: true,
        default: true
    },

    name: {
        type: String,
        required: true,
        unique: true
    },

    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    }],
    
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

});

module.exports = mongoose.model ('Family', schema);