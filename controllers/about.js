/**
 * Author: Gary Fleming
 * Student No: 20019497
 * Start Date: Aug 1st 2017
 */

'use strict';

const logger = require('../utils/logger.js');

const about = {
  index(request, response) {
    logger.info('about rendering');
    const viewData = {
      title: 'About JS Gym App',
    };
    response.render('about', viewData);
  },
};

module.exports = about;