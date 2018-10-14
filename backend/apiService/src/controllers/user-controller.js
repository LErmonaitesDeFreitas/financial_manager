'use strict';

const repository = require("../repositories/user-repository");
const emailService = require("../services/email-services");
const authService = require("../services/auth-services");
const helper = require("../helpers/all");
const helperUser = require("../helpers/user-helper");

exports.authenticate = async (req, res, next) => {
    try {
        const password = helperUser.getPassword(req.body.password);
        const user = await repository.authenticate(req.body.email, password);
        if (!user) {
            res.status(404).send({ message: "Usuário ou senha inválido(s)" });
            return;
        }
        const token = await authService.generateToken(user);
        res.status(200).send({ token: token, user: user });
    } catch (e) {
        res.status(500).send({ error: e });
    }
};

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

exports.post = async (req, res, next) => {
    try {
        const objPost = helperUser.getObjPost(req.body, ['firstName', 'lastName', 'email'], 'password');
        const data = await repository.create(objPost);
        emailService.send(req.body.email, 'Seja bem vindo ao Sistema', global.EMAIL_TMPL.replace('{0}', req.body.firstName));
        res.status(200).send(data);
    } catch (e) {
        switch (e.code) {
            case 11000:
                res.status(400).send({ message: "E-mail já cadastrado" });
                break;
            default:
                res.status(500).send({ error: e });
        }
    }
}; 

exports.put = async (req, res, next) => {
    try {
        const userSession = await authService.getSession(req);
        if (!userSession.roles.includes("admin") && userSession._id != req.params.id) {
            res.status(400).send({ "message": "O usuário logado não tem permissão para atualizar o usuário solicitado" });
            return;
        }
        const objPut = helperUser.getObjPut(req.body, ['name', 'family'], 'password');
        const data = await repository.update(req.params.id, objPut);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({ error: e });
    }
};

exports.delete = async (req, res, next) => {
    try {
        const data = await repository.delete(req.params.id);
        res.status(200).send(data);
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

exports.desactivate = async (req, res, next) => {
    try {
        const userSession = await authService.getSession(req);
        if (!userSession.roles.includes("admin") && userSession != req.params.id) {
            res.status(400).send({ "message": "O usuário logado não tem permissão para deletar o usuário solicitado" });
            return;
        }
        var userDesactivated = await repository.update(req.params.id, { active: false });
        if (userDesactivated) {
            await helperUser.deleteUserFamily(userDesactivated);
            await helperUser.desactivateAccountsUser(userDesactivated);
            res.status(200).send(userDesactivated);
        }
        res.status(400).send({ "message": "Usuário não encontrado" });
    } catch (e) {
        res.status(500).send({ error: e });
    }
}


//INCREMENTO DO PADRÃO

exports.insertFamily = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const familyId = req.body.id;
        const objPut = { family: familyId };
        const data = await repository.update(userId, objPut);
        helperUser.insertMember(userId, familyId);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({ error: e });
    }
}

exports.setFamilyCreated = (user, family) => {
    const objSetFamily = {
        family: family._id
    };
    repository.update(user._id, objSetFamily);
    repository.push(user._id, "roles", "family-admin");
};

exports.clearUsersFamily = (familyId) => {
    const condition = { family: familyId };
    const set = { family: null };
    repository.updateByCondition(condition, set);
};

exports.retireRole = (userId, role) => {
    repository.pull(userId, "roles", role);
};

exports.elevateRoles = async (req, res, next) => {
    try {
        const data = await repository.push(req.body.userId, "roles", req.body.role);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({ error: e });
    }
};



