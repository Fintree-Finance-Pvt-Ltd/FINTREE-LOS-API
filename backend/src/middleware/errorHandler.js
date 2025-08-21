// MUST have 4 params to be recognized as an error handler
module.exports = function errorHandler(err, req, res, next) {
  console.error('[ERR]', err);
  const status = err.status || 500;
  res.status(status).json({ ok: false, message: err.message || 'Server error' });
};
