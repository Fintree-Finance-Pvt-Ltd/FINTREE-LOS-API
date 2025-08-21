const fs = require('fs');
const path = require('path');
const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const LOG_DIR = process.env.LOG_DIR || 'logs';
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

const logFmt = format.printf(({ level, message, timestamp, stack, ...meta }) => {
  const reqId = meta.requestId ? ` reqId=${meta.requestId}` : '';
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `${timestamp} [${level.toUpperCase()}]${reqId} ${message}${stack ? `\n${stack}` : ''}${metaStr}`;
});

const fileRotate = new DailyRotateFile({
  dirname: LOG_DIR,
  filename: 'app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxFiles: process.env.LOG_MAX_FILES || '14d',
  level: process.env.LOG_LEVEL || 'info',
});

const errorRotate = new DailyRotateFile({
  dirname: LOG_DIR,
  filename: 'error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxFiles: process.env.LOG_MAX_FILES || '14d',
  level: 'error',
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    format.errors({ stack: true }),
    format.splat(),
    logFmt
  ),
  transports: [fileRotate, errorRotate],
});

if (String(process.env.LOG_CONSOLE || 'true').toLowerCase() === 'true') {
  logger.add(new transports.Console({
    level: process.env.LOG_LEVEL || 'info',
    format: format.combine(format.colorize(), format.timestamp({ format: 'HH:mm:ss' }), logFmt),
  }));
}

module.exports = logger;
