'use strict';

const logger = require('../utils/logger'); //-------------------------> require identifies and imports object defined in utils logger
const uuid = require('uuid'); //--------------------------------------> loads the model (unique id)
const accounts = require('./accounts.js'); //-------------------------> require identifies and imports object defined in accounts.js

//---> dashboard object definition <---//

const dashboard = {
  index(request, response) { //---------------------------------------> index method, called when ‘/ dashboard’ request received
    logger.info('dashboard rendering'); //----------------------------> log message to console so we can track app behaviour
    const loggedInUser = accounts.getCurrentUser(request); //---------> finds which user is currently logged in
    const viewData = { //---------------------------------------------> place model in viewData object
      title: 'Gym Dashboard', //--------------------------------------> name of the title
    };
    logger.info('about to render'); //--------------------------------> logs message to console so we can track app behaviour
    response.render('dashboard', viewData); //------------------------> name of view to render 'dashboard' and sends viewData to view
  },

};

module.exports = dashboard; //----------------------------------------> this is the object that is then exported:

//-----> request -> link or button pressed on page
//-----> response -> complete page rendered into browser
