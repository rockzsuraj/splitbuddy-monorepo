const path = require('path');
const winston = require('winston');

const isServerless =
  process.env.VERCEL === '1' ||
  !!process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.IS_SERVERLESS === 'true';

const transports = [
  new winston.transports.Console({
    handleExceptions: true,
  }),
];

// 👉 File logging ONLY for non-serverless (local / VM / EC2)
if (!isServerless) {
  const fs = require('fs');
  const logDir = path.join(__dirname, '../logs');

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
    })
  );
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'SplitBuddy' },
  transports,
  exitOnError: false,
});

// Pretty logs for local dev
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

module.exports = logger;