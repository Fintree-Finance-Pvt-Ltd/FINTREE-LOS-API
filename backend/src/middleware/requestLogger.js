const morgan = require('morgan');
const { v4: uuid } = require('uuid');
const logger = require('../config/logger');

// Create a morgan stream that writes to winston
const stream = {
  write: (message) => {
    // message already has method url status time - we trim
    logger.http ? logger.http(message.trim()) : logger.info(message.trim());
  },
};

// Request ID + attach logger with requestId
function attachRequestId(req, res, next) {
  req.id = req.headers['x-request-id'] || uuid();
  res.setHeader('X-Request-Id', req.id);
  // helper: child-like logger with requestId in meta
  req.log = {
    info: (msg, meta = {}) => logger.info(msg, { requestId: req.id, ...meta }),
    warn: (msg, meta = {}) => logger.warn(msg, { requestId: req.id, ...meta }),
    error: (msg, meta = {}) => logger.error(msg, { requestId: req.id, ...meta }),
    debug: (msg, meta = {}) => logger.debug(msg, { requestId: req.id, ...meta }),
  };
  next();
}

// Morgan format including request id
const morganFmt = (tokens, req, res) => {
  return [
    `reqId=${req.id}`,
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    `${tokens['response-time'](req, res)}ms`,
    tokens.res(req, res, 'content-length') || '-',
    `ref=${req.headers.referer || '-'}`,
  ].join(' ');
};

module.exports = {
  attachRequestId,
  httpLogger: morgan(morganFmt, { stream }),
};
