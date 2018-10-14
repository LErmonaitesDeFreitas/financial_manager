'use strict';

const repository = require("../repositories/family-repository");
const authService = require("../services/auth-services");
const helperFamily = require("../helpers/family-helper");
const userController = require("../controllers/user-controller");

exports.get = async (req, res, next) => {
    try {
        const data = await repository.get(req.query.filter);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({ error: e });
    }
};

exports.getById = async (req, res, next) => {
    try {
        const data = await repository.getById(req.params.id);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({ error: e });
    }
};

exports.create = async (req, res, next) => {
    try {
        const userSession = await authService.getSession(req);
        if (userSession.family) {
            res.status(400).json({ error: 'EFAMILY01', message: "O usuário já possui uma familia" });
            return;
        }
        const objCreate = helperFamily.getObjCreate(req.body, ['name'], userSession);
        const data = await repository.create(objCreate);
        if (data)
            userController.setFamilyCreated(data, userSession);
        res.status(200).send(data);
    } catch (e) {
        switch (e.code) {
            case 11000:
                res.status(400).send({ error: "EFAMILY03", message: "Já existe uma família com este nome" });
                break;
            default:
                res.status(500).send({ error: e });
        }
    }
};

exports.put = async (req, res, next) => {
    try {
        const userSession = await authService.getSession(req);
        if (!userSession.roles.includes("admin") && userSession.family != req.params.id) {
            res.status(400).send({ "message": "O usuário logado não tem permissão para atualizar a família solicitada" });
            return;
        }
        const objPut = helperFamily.getObjPut(req.body, ["name"]);
        const data = await repository.update(req.params.id, objPut);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({ error: e });
    }
};

exports.desactivate = async (req, res, next) => {
    try {
        const userSession = await authService.getSession(req);
        if (!userSession.roles.includes("admin") && userSession.family != req.params.id) {
            res.status(400).send({ "message": "O usuário logado não tem permissão para desativar a família solicitada" });
            return;
        }
        const familyDesactivated = await repository.update(req.params.id, { active: false });
        if (familyDesactivated) {
            helperFamily.clearUsersFamily(userSession.family);
            helperFamily.clearAccountsFamily(userSession.family);
            helperFamily.retireRole(userSession._id);
        }
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({ error: e });
    }
};

exports.delete = async (req, res, next) => {
    try {
        const family = await repository.delete(req.params.id);
        helperFamily.clearUsersFamily(family._id);
        helperFamily.clearAccountsFamily(family._id);
        helperFamily.retireRole(family.manager);
        res.status(200).send(family);
    } catch (e) {
        res.status(500).send({ error: e });
    }
};

exports.deleteAll = async (req, res, next) => {
    try {
        const data = await repository.deleteAll();
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({ error: e });
    }
};

//INCREMENTO DO PADRÃO
exports.insertMember = async (userId, familyId) => {
    await repository.push(familyId, "members", userId);
};

exports.deleteMember = async (userId, familyId) => {
    await repository.pull(familyId, "members", userId);
};
