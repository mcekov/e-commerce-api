const nodemailer = require('nodemailer');

const sendEmail = async () => {
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'bridgette3@ethereal.email',
      pass: 'sbXdex7b4r6XBgZpDy',
    },
  });

  await transporter.sendEmail({
    from: '"Fred foo" <foo@example.com>',
    to: 'bar@example, <baz@example.com>',
    subject: 'Hello',
    text: 'Hello world!',
    html: '<b> Hello world?</b>',
  });
};

module.exports = sendEmail;
