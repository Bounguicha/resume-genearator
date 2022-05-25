const { createLogger, format ,transports } = require('winston');
const winston = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(
  // eslint-disable-next-line no-shadow
  ({ level, message, label, timestamp }) => `${timestamp} [${label}] ${level}: ${message}`,
);

module.exports = createLogger({
  level: 'info',
  format: combine(label({ label: 'Logger' }), timestamp(), myFormat),
  transports: [
    new winston.transports.Console()
  ],
  exitOnError: false, // do not exit on handled exceptions
});
