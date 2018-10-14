'use strict';

const express = require('express');
const router = express.Router();
const controller = require("../controllers/user-controller");
const authService = require("../services/auth-services");

router.get('/', authService.authorize, controller.get);
router.get('/:id', authService.authorize, controller.getById);
router.post('/', controller.post);
router.post("/authenticate", controller.authenticate);
router.put('/:id', authService.authorize, controller.put);
router.put("/desactivate/:id", authService.authorize, controller.desactivate)
router.put("family/insertFamily/:id", authService.isFamilyAdmin, controller.insertFamily);
router.put('/admin/elevateRoles', authService.isAdmin, controller.elevateRoles)
router.delete('/:id', authService.isAdmin, controller.delete);
router.delete('/admin/all', authService.isAdmin, controller.deleteAll);

module.exports = router;