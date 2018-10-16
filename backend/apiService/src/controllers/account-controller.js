'use strict';

const Validator = require("../validators/fluent-validator");
const repository = require("../repositories/account-repository");
const emailService = require("../services/email-services");
const authService = require("../services/auth-services");
const helper = require("../helpers/all");
const helperAccount = require("../helpers/account-helper");

exports.get = async (req, res, next) => {
    try {
        const data = await repository.get(req.query.filter);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({ message: "Erro ao processar a sua requisição" });
    }
}

exports.getById = async (req, res, next) => {
    try {
        const data = await repository.getById(req.params.id);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({ message: "Erro ao processar a sua requisição" });
    }
}

exports.post = async (req, res, next) => {
    try {
        const userSession = await authService.getSession(req);
        const objPost = helperAccount.getObjPost(req.body, ['name', 'value', 'due_date', 'month'], userSession);
        const data = await repository.create(objPost);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({ message: "Erro ao processar a sua requisição" });
    }
}

exports.put = async (req, res, next) => {
    try {
        const objPut = helperAccount.getObjPut(req.body, ['active', 'name', 'value', 'due_date', 'month']);
        const data = await repository.update(req.params.id, objPut);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({ message: "Erro ao processar a sua requisição" });
    }
}

exports.delete = async (req, res, next) => {
    try {
        const data = await repository.delete(req.params.id);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({ message: "Erro ao processar a sua requisição" });
    }
}

exports.deleteAll = async (req, res, next) => {
    try {
        const data = await repository.deleteAll();
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({ message: "Erro ao processar a sua requisição" });
    }
}

//INCRIMENTO DO PADRÃO
exports.desactivateAccounts = async (userId) => {
    await repository.updateByCondition({ user: userId }, { active: false });
}

exports.activateAccounts = async (userId) => {
    await repository.updateByCondition({ user: userId }, { active: true });
}

exports.clearAccountsFamily = (familyId) => {
    repository.updateByCondition({ family: familyId }, { family: null });
}
