/**
 * Author: Gary Fleming
 * Student No: 20019497
 * Start Date: Aug 1st 2017
 */

'use strict';

const logger = require('../utils/logger.js');

const index = {
  index(request, response) {
    logger.info('index rendering');
    const viewData = {
      title: 'Welcome to me gym app',
    };
    response.render('index', viewData);
  },
};

module.exports = index;
