// const nodemailer = require('nodemailer');

// function createTransport() {
//   const provider = (process.env.SMTP_PROVIDER || '').toLowerCase();
//   const insecure = String(process.env.SMTP_INSECURE || 'false').toLowerCase() === 'true'; // DEV ONLY

//   const commonTls = insecure ? { tls: { rejectUnauthorized: false } } : {};

//   if (provider === 'gmail') {
//     if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
//       throw new Error('SMTP_USER/SMTP_PASS required for Gmail transport');
//     }
//     return nodemailer.createTransport({
//       service: 'gmail',
//       auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
//       ...commonTls,
//     });
//   }

//   if (['outlook','office365','microsoft'].includes(provider)) {
//     if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
//       throw new Error('SMTP_USER/SMTP_PASS required for Outlook transport');
//     }
//     return nodemailer.createTransport({
//       host: 'smtp.office365.com',
//       port: 587,
//       secure: false, // STARTTLS
//       auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
//       ...commonTls,
//     });
//   }

//   // custom
//   if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
//     throw new Error('For custom SMTP, set SMTP_HOST, SMTP_USER, SMTP_PASS (and optionally SMTP_PORT/SMTP_SECURE)');
//   }
//   return nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: Number(process.env.SMTP_PORT || 587),
//     secure: String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
//     auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
//     ...commonTls,
//   });
// }

// const transporter = createTransport();

// async function sendMail({ to, subject, html, text }) {
//   const from = process.env.SMTP_FROM || process.env.SMTP_USER;
//   const info = await transporter.sendMail({ from, to, subject, html, text });
//   if (process.env.NODE_ENV !== 'production') {
//     console.log(`[MAIL] sent to ${to} • id=${info.messageId}`);
//   }
//   return info;
// }

// module.exports = { sendMail };


/////////////////// NEW CODE ///////////////////
const nodemailer = require('nodemailer');

function createTransport() {
  const provider = (process.env.SMTP_PROVIDER || 'gmail').toLowerCase();
  const insecure = String(process.env.SMTP_INSECURE || 'false').toLowerCase() === 'true'; // DEV ONLY
  const tlsOpt = insecure ? { tls: { rejectUnauthorized: false } } : {};

  if (provider === 'gmail') {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('SMTP_USER/SMTP_PASS required for Gmail transport');
    }
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      ...tlsOpt,
    });
  }

  if (['outlook','office365','microsoft'].includes(provider)) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('SMTP_USER/SMTP_PASS required for Outlook transport');
    }
    return nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false, // STARTTLS
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      ...tlsOpt,
    });
  }

  // custom smtp
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    ...tlsOpt,
  });
}

const transporter = createTransport();

async function sendMail({ to, subject, html, text }) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const info = await transporter.sendMail({ from, to, subject, html, text });
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[MAIL] sent to ${to} • id=${info.messageId}`);
  }
  return info;
}

module.exports = { sendMail };

