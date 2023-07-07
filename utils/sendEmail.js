const nodemailer = require('nodemailer');
const nodeMailerConfig = require('../utils/nodeMailerConfig');

const sendEmail = async ({ to, subject, html }) => {
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport(nodeMailerConfig);

  const info = await transporter.sendMail({
    from: '"Store name" <store@stuff.com>',
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
