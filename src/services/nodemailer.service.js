const nodemailer = require('nodemailer');
const config = require('../config');

const transport = nodemailer.createTransport({
  service: 'gmail',
  host: config.MAIL_HOST,
  auth: {
    user: config.MAIL_USER,
    pass: config.MAIL_PASSWORD,
  },
  pool: true,
});

exports.sendMail = ({ to, cc = [], bcc = [], htmlContent, subject, attachments = [] }) => {
  const mailOptions = {
    from: config.MAIL_USER,
    to,
    cc,
    bcc,
    subject: subject,
    html: htmlContent,
    attachments,
  };
  return new Promise((resolve, reject) => {
    transport.sendMail(mailOptions, (error) => {
      if (error) reject(error);
      resolve(true);
    });
  });
};
