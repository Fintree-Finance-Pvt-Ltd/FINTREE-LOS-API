const router = require('express').Router();
const { requestOTP, verifyOTP } = require('../services/otp.service');


// 1) Request OTP
router.post('/request-otp', async (req, res, next) => {
try {
const { email } = req.body;
await requestOTP(email);
res.json({ ok: true, message: 'OTP sent to mail' });
} catch (e) { next(e); }
});


// 2) Verify OTP -> JWT
router.post('/verify-otp', async (req, res, next) => {
try {
const { email, code } = req.body;
const data = await verifyOTP(email, code);
res.json({ ok: true, ...data });
} catch (e) { next(e); }
});


module.exports = router;