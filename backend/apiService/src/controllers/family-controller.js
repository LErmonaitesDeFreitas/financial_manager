'use strict';

const repository = require("../repositories/family-repository");
const authService = require("../services/auth-services");
const helperFamily = require("../helpers/family-helper");
const userController = require("../controllers/user-controller");
const accountController = require("../controllers/account-controller");

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
            res.status(400).json({ error: 'EFAMILY01', message: "O usuário já possui uma família" });
            return;
        }
        const objCreate = helperFamily.getObjCreate(req.body, ['name'], userSession);
        const familyCreated = await repository.create(objCreate);
        if (familyCreated) {
            userController.setFamilyCreated(userSession, familyCreated);
            res.status(200).send(familyCreated);
        } else {
            res.status(500).send({ message: "Ocorreu um erro interno!" });
        }
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
        const familyUpdated = await repository.update(req.params.id, objPut);
        if (familyUpdated)
            res.status(200).send(familyUpdated);
        else
            res.status(500).send({ message: "Ocorreu um erro interno!" });
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
            userController.retireRole(userSession._id, 'family-admin');
            accountController.clearAccountsFamily(userSession.family);
            res.status(200).send(familyDesactivated);
        } else {
            res.status(500).send({ message: "Ocorreu um erro interno!" });
        }
    } catch (e) {
        res.status(500).send({ error: e });
    }
};

exports.delete = async (req, res, next) => {
    try {
        const familyDeleted = await repository.delete(req.params.id);
        if (familyDeleted) {
            userController.retireRole(userSession._id, 'family-admin');
            accountController.clearAccountsFamily(userSession.family);
            res.status(200).send(family);
        } else {
            res.status(500).send({ message: "Ocorreu um erro interno!" });
        }
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
