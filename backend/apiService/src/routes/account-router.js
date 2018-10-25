'use strict';

const express = require('express');
const router = express.Router();
const controller = require("../controllers/account-controller");
const authService = require("../services/auth-services");

router.get('/', authService.authorize, controller.get);
router.get('/:id', authService.authorize, controller.getById);
router.post('/', authService.authorize, controller.post);
router.put('/:id', authService.authorize, controller.put);
router.delete('/:id', authService.authorize, controller.delete);
router.delete('/admin/all', authService.isAdmin, controller.deleteAll);

module.exports = router;