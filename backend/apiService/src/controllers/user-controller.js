'use strict';

const repository = require("../repositories/user-repository");
const emailService = require("../services/email-services");
const authService = require("../services/auth-services");
const helperUser = require("../helpers/user-helper");
const familyController = require("./family-controller");
const accountController = require("./account-controller");
const monthController = require("./month-controller");

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
        const userCreated = await repository.create(objPost);
        if (userCreated) {
            userCreated.months = await monthController.createMonthsUser(userCreated);
            //emailService.send(req.body.email, 'Seja bem vindo ao Sistema', global.EMAIL_TMPL.replace('{0}', req.body.firstName));
            res.status(200).send(userCreated);
        } else {
            res.status(500).send({ message: "Ocorreu um erro interno!" });
        } 


    } catch (e) {
        console.log(e);
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
        const objPut = helperUser.getObjPut(req.body, ['firstName', 'lastName', 'family'], 'password');
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
            await accountController.desactivateAccounts(userDesactivated._id);
            res.status(200).send(userDesactivated);
            return;
        }
        res.status(400).send({ "message": "Usuário não encontrado" });
    } catch (e) {
        res.status(500).send({ error: e });
    }
}

exports.activate = async (req, res, next) => {
    try {
        var userActivate = await repository.update(req.params.id, { active: true });
        if (userActivate) {
            await accountController.activateAccounts(userActivate._id);
            res.status(200).send(userActivate);
            return;
        }
        res.status(400).send({ "message": "Usuário não encontrado" });
    } catch (e) {
        res.status(500).send({ error: e });
    }
}

//INCREMENTANDO O PADRÃOS
exports.setFamilyCreated = (user, family) => {
    const objSetFamily = {
        family: family._id
    };
    repository.update(user._id, objSetFamily);
    repository.push(user._id, "roles", "family-admin");
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



