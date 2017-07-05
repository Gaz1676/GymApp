const winston = require('winston'); //---------------------------------> require identifies and imports object defined in other modules

const logger = new (winston.Logger)({

  transports: [new (winston.transports.Console)({ json: true })], //---> changed to true to better arrange the data structure
});                                                               //---> this will change how the lists are displayed in the logs:

logger.level = 'debug';

if (process.env.LEVEL) {
  logger.level = process.env.LEVEL;
}

module.exports = logger; //---------------------------------------------> this is the object that is then exported:
