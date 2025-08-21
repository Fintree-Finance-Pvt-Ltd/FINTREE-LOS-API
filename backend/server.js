// server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

// --- logging (add these files from my earlier message) ---
const logger = require('./src/config/logger'); // winston + daily rotate
const { attachRequestId, httpLogger } = require('./src/middleware/requestLogger');

const { sequelize } = require('./src/models');

// --- routes ---
const authRoutes = require('./src/routes/auth.routes');
const dealerRoutes = require('./src/routes/dealer.routes');
const loanRoutes = require('./src/routes/loan.routes');
// const partnerRoutes = require('./src/routes/partner.routes');
const documentRoutes = require('./src/routes/document.routes');
const adminRoutes = require('./src/routes/admin.routes');

// --- error handler (kept last) ---
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// behind proxies (if any) to preserve real IP in logs
app.set('trust proxy', true);

// attach per-request id and logger + HTTP access log to file
app.use(attachRequestId);
app.use(httpLogger);

// strict CORS allowlist
app.use(
  cors({
    origin: (origin, cb) => {
      const allow = [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        process.env.CORS_ORIGIN,
      ].filter(Boolean);
      // allow tools (curl/postman) without Origin header
      if (!origin) return cb(null, true);
      if (allow.includes(origin)) return cb(null, true);
      return cb(new Error('CORS: origin not allowed'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
// handle preflight globally
app.options('*', cors());

// parsers & static files
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

// simple healthz
app.get('/healthz', (_req, res) => res.json({ ok: true }));

// --- API routes ---
app.use('/api/auth', authRoutes);
app.use('/api/dealers', dealerRoutes);
app.use('/api/loans', loanRoutes);
// app.use('/api/partners', partnerRoutes);
app.use('/api/docs', documentRoutes);
app.use('/api/admin', adminRoutes);

// --- central error handler (logs with reqId) ---
app.use((err, req, res, next) => {
  const status = err.status || 500;
  logger.error(err.message, {
    requestId: req?.id,
    status,
    stack: err.stack,
    route: req?.originalUrl,
  });
  // delegate to your existing errorHandler (if it formats responses)
  try {
    return errorHandler(err, req, res, next);
  } catch {
    return res.status(status).json({ ok: false, message: err.message || 'Server error' });
  }
});

const PORT = process.env.PORT || 8080;

// start DB then server
sequelize
  .authenticate()
  .then(() => {
    logger.info('DB connection ok');
    return sequelize.sync(); // { alter:true } if you explicitly want auto-sync
  })
  .then(() => {
    app.listen(PORT, () => logger.info(`API running on :${PORT}`));
  })
  .catch((err) => {
    logger.error('DB init failed', { message: err.message, stack: err.stack });
    process.exit(1);
  });

// graceful shutdown
const shutdown = (signal) => {
  logger.warn(`Received ${signal}, shutting down...`);
  Promise.resolve()
    .then(() => sequelize.close().catch(() => {}))
    .finally(() => process.exit(0));
};
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// catch unhandleds (write to logs/error-*.log)
process.on('unhandledRejection', (reason) => {
  logger.error('unhandledRejection', { reason: reason?.message || String(reason), stack: reason?.stack });
});
process.on('uncaughtException', (err) => {
  logger.error('uncaughtException', { message: err.message, stack: err.stack });
  process.exit(1);
});
