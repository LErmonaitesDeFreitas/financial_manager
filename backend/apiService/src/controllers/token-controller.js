'use strict';

const emailService = require("../services/email-services");
const authService = require("../services/auth-services");
const repository = require("../repositories/user-repository");
const helperUser = require("../helpers/user-helper");

exports.authenticate = async (req, res, next) => {
    try {
        const password = helperUser.getPassword(req.body.password);
        const user = await repository.authenticate(req.body.email, password);
        if (!user) {
            res.status(200).send({ error: "EUSER01", message: "Usuário ou senha inválido(s)" });
            return;
        }
        const token = await authService.generateToken(user);
        res.status(200).send({ token: token, user: user });
    } catch (e) {
        res.status(500).send({ error: e });
    }
};

exports.verify = async (req, res, next) => {
    try {
        const token = req.params.token;
        const isValid = await authService.verify(token);
        res.status(200).send({ isValid: isValid })
    } catch (e) {
        res.status(500).send({ error: e });
    }
}



