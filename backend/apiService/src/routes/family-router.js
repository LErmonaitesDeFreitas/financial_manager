'use strict';

const express = require('express');
const router = express.Router();
const controller = require("../controllers/family-controller");
const authService = require("../services/auth-services");

router.get('/', authService.isAdmin, controller.get);
router.get('/:id', authService.authorize, controller.getById);
router.post('/', authService.authorize, controller.create);
router.put('/:id', authService.isFamilyAdmin, controller.put);
router.put('/desactivate/:id', authService.isFamilyAdmin, controller.desactivate);
router.delete('/:id', authService.isFamilyAdmin, controller.delete);
router.delete('/admin/all', authService.isAdmin, controller.deleteAll);

module.exports = router;