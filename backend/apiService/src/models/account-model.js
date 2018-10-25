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
    },

    value: {
        type: Number,
        required: true
    },
    
    due_date: {
        type: Date,
        required: true
    },

    month: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Month'
    },
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    family: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Family'
    }
});

module.exports = mongoose.model ('Account', schema);