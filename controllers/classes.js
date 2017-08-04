'use strict';

const logger = require('../utils/logger'); //-----------------------------> import logger
const accounts = require('./accounts.js'); //-----------------------------> import accounts

//---> classes object definition <---//

const classes = {
  index(request, response) { //-------------------------------------------> index method, called when ‘/ classes’ request received
    logger.info('rendering classes'); //----------------------------------> logs message to console
    const loggedInTrainer = accounts.getCurrentTrainer(request); //-------> gets currentTrainer from accounts and stores it in loggedInTrainer
    const viewData = { //-------------------------------------------------> place model in viewData object
      trainer: loggedInTrainer, //----------------------------------------> loggedInTrainer
    };
    response.render('classes', viewData); //------------------------------> name of view to render 'classes' and sends viewData to view
  },
};

module.exports = classes; //----------------------------------------------> this is the object that is then exported

//-----> request -> link or button pressed on page
//-----> response -> complete page rendered into browser
