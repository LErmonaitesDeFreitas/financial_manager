'use strict';

const config = require("../config");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(config.sendgridKey);

exports.send = async (to, subject, body) => {
    sgMail.send({
        to: to,
        from: "lincolnermonaites@gmail.com",
        subject: subject,
        html: body,
    });
}
