'use strict';

const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const router = express.Router();

//CONECTANDO AO BANCO DE DADOS
mongoose.connect(config.connectionString, { useNewUrlParser: true });

//CARREGANDO MODELS
const accountModel = require("./models/account-model");
const familyModel = require("./models/family-model");
const userModel = require("./models/user-model");
const monthModel = require("./models/month-model");

//CARREGANDO ROUTES;
const indexRoutes = require("./routes/index-router");
const accountRoutes = require('./routes/account-router');
const familyRoutes = require("./routes/family-router");
const userRoutes = require("./routes/user-router");
const monthRoutes = require("./routes/month-router");



//APP USE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// Habilita o CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

//APP USER
app.use('/', indexRoutes);
app.use('/accounts', accountRoutes);
app.use('/families', familyRoutes);
app.use('/users', userRoutes);
app.use('/months', monthRoutes);

//EXPORTANDO
module.exports = app;