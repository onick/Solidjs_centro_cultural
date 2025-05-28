import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Configuración de formatos
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    return log;
  })
);

// Configuración de transports
const transports = [
  new winston.transports.Console({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: consoleFormat
  }),

  new DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format: logFormat,
    level: 'info'
  }),

  new DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '30d',
    format: logFormat,
    level: 'error'
  }),

  new DailyRotateFile({
    filename: 'logs/access-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '50m',
    maxFiles: '7d',
    format: logFormat,
    level: 'http'
  })
];

// Crear logger principal
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports,
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' })
  ]
});

// Logging contextual para diferentes módulos
logger.api = (message, meta = {}) => {
  logger.info(message, { context: 'API', ...meta });
};

logger.db = (message, meta = {}) => {
  logger.info(message, { context: 'DATABASE', ...meta });
};

logger.redis = (message, meta = {}) => {
  logger.info(message, { context: 'REDIS', ...meta });
};

logger.auth = (message, meta = {}) => {
  logger.info(message, { context: 'AUTH', ...meta });
};

logger.sync = (message, meta = {}) => {
  logger.info(message, { context: 'SYNC', ...meta });
};

// Middleware para logging de requests HTTP
logger.httpMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id || 'anonymous'
    };
    
    if (res.statusCode >= 400) {
      logger.error('HTTP Error Request', logData);
    } else {
      logger.http('HTTP Request', logData);
    }
  });
  
  next();
};

export default logger;
