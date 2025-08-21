// const jwt = require('jsonwebtoken');
// const { OTP, User, Role } = require('../models');
// const { sendMail } = require('../config/mailer');


// function randomCode() { return String(Math.floor(100000 + Math.random()*900000)); }


// async function requestOTP(email) {

// const code = randomCode();
// const expires = new Date(Date.now() + 5*60*1000);
// await OTP.create({ email, code, expires_at: expires });
// await sendMail({
// to: email,
// subject: 'Your LOS login code',
// html: `<p>Your OTP is <b>${code}</b>. It expires in 5 minutes.</p>`
// });
// }


// async function verifyOTP(email, code) {
// const rec = await OTP.findOne({ where: { email, code, consumed: false } });
// if (!rec) throw new Error('Invalid code');
// if (new Date(rec.expires_at) < new Date()) throw new Error('Code expired');
// rec.consumed = true; await rec.save();


// // Ensure user exists
// let user = await User.findOne({ where: { email } });
// if (!user) user = await User.create({ email, full_name: email.split('@')[0] });


// const roles = await user.getRoles();
// const roleNames = roles.map(r => r.name);


// const token = jwt.sign({ sub: user.id, email, roles: roleNames }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '2d' });
// return { token, user: { id: user.id, email, roles: roleNames } };
// }


// module.exports = { requestOTP, verifyOTP };
// /**
//  * Verifies an OTP (One-Time Password) and generates a JWT token for the user.
//  *
//  * @param {string} email - The email of the user.
//  * @param {string} code - The OTP code provided by the user.
//  *
//  * @returns {Object} An object containing the JWT token and user information.
//  * @returns {string} token - The JWT token for the user.
//  * @returns {Object} user - The user information.
//  * @returns {number} user.id - The ID of the user.
//  * @returns {string} user.email - The email of the user.
//  * @returns {Array<string>} user.roles - The roles assigned to the user.
//  *
//  * @throws {Error} If the provided code is invalid or expired.
//  */
// async function verifyOTP(email, code) {
//     const rec = await OTP.findOne({ where: { email, code, consumed: false } });
//     if (!rec) throw new Error('Invalid code');
//     if (new Date(rec.expires_at) < new Date()) throw new Error('Code expired');
//     rec.consumed = true; await rec.save();

//     // Ensure user exists
//     let user = await User.findOne({ where: { email } });
//     if (!user) user = await User.create({ email, full_name: email.split('@')[0] });

//     const roles = await user.getRoles();
//     const roleNames = roles.map(r => r.name);

//     const token = jwt.sign({ sub: user.id, email, roles: roleNames }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '2d' });
//     return { token, user: { id: user.id, email, roles: roleNames } };
// }


//////////// NEW FOR BOTH EMAIL AND OUTLOCK //////////////
// backend/src/services/otp.service.js
const jwt = require('jsonwebtoken');
const { OTP, User } = require('../models');
const { sendMail } = require('../config/mailer');
const logger = require('../config/logger');

function code6() { return String(Math.floor(100000 + Math.random() * 900000)); }

async function requestOTP(email, reqId) {
  logger.info('OTP.request start', { requestId: reqId, email });

  const code = code6();
  const expires = new Date(Date.now() + 5 * 60 * 1000);
  await OTP.create({ email, code, expires_at: expires });
  logger.info('OTP DB record created', { requestId: reqId, email });

  const html = `<p>Your LOS login code is <b>${code}</b>. Expires in 5 minutes.</p>`;
  await sendMail({ to: email, subject: 'Your LOS login code', html });
  logger.info('OTP email sent', { requestId: reqId, to: email });

  return true;
}

async function verifyOTP(email, code, reqId) {
  logger.info('OTP.verify start', { requestId: reqId, email });

  const rec = await OTP.findOne({ where: { email, code, consumed: false } });
  if (!rec) { logger.warn('OTP not found/consumed', { requestId: reqId, email }); throw new Error('Invalid code'); }
  if (new Date(rec.expires_at) < new Date()) { logger.warn('OTP expired', { requestId: reqId, email }); throw new Error('Code expired'); }

  rec.consumed = true; await rec.save();
  logger.info('OTP marked consumed', { requestId: reqId, email });

  let user = await User.findOne({ where: { email } });
  if (!user) {
    const name = email.split('@')[0];
    user = await User.create({ email, name });
    logger.info('User created', { requestId: reqId, userId: user.id });
  } else {
    logger.info('User found', { requestId: reqId, userId: user.id });
  }

  const roles = (await user.getRoles())?.map(r => r.name) || [];
  const token = jwt.sign({ sub: user.id, email, roles }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || '2d'
  });
  logger.info('JWT issued', { requestId: reqId, userId: user.id });

  return { token, user: { id: user.id, email, roles } };
}

module.exports = { requestOTP, verifyOTP };
