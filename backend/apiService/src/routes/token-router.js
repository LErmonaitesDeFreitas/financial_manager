'use strict';

const express = require('express');
const router = express.Router();
const authService = require("../services/auth-services");
const controller = require("../controllers/token-controller");

router.post('/verify/:token', controller.verify);
router.post("/authenticate", controller.authenticate);

module.exports = router;