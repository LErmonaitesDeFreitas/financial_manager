'use strict';

const repository = require("../repositories/month-repository");
const authService = require("../services/auth-services");
const helperMonth = require("../helpers/month-helper");

exports.get = async (req, res, next) => {
    try {
        const data = await repository.get(req.query.filter);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({ message: "Erro ao processar a sua requisição" });
    }
};

exports.getById = async (req, res, next) => {
    try {
        const data = await repository.getById(req.params.id);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({ message: "Erro ao processar a sua requisição" });
    }
};

exports.post = async (req, res, next) => {
    try {
        const userSession = await authService.getSession(req);
        const objPost = helperMonth.getObjPost(req.body, ['name'], userSession);
        const data = await repository.create(objPost);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({ message: "Erro ao processar a sua requisição" });
    }
}

exports.put = async (req, res, next) => {
    try {
        const objPut = helperMonth.getObjPut(req.body, ['active', 'name', 'family', 'salary', 'balance', 'accounts']);
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

exports.createMonthsUser = async (user) => {
    const lote = await helperMonth.getObjCreateFromCreateMonthsUser(user);
    var months = [];
    for (var i = 0; i < lote.length; i++) {
        const month = await await repository.create(lote[i]);
        months.push(month);
    }
    return months;
}

exports.getMonthsByUser = async (user) => {
    const filter = { user: user };
    const data = await repository.get(JSON.stringify(filter));
    return data;
}

exports.getCurrentMonth = async (user) => {
    const filter = {
        user: user,
        number: new Date().getMonth() + 1
    }
    const data = await repository.get(JSON.stringify(filter));
    if (data)
        return data[0];
    return;
}

