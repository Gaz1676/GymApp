/**
 * Author: Gary Fleming
 * Student No: 20019497
 * Start Date: Aug 1st 2017
 */

const winston = require('winston');

const logger = new (winston.Logger)({

  transports: [new (winston.transports.Console)({ json: true })],
});

logger.level = 'debug';

if (process.env.LEVEL) {
  logger.level = process.env.LEVEL;
}

module.exports = logger;
