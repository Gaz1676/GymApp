'use strict';

const logger = require('../utils/logger'); //-------------------> import logger

//---> index object definition <---//

const index = {
  index(request, response) { //---------------------------------> index method, called when ‘/ index’ request received
    logger.info('rendering index'); //--------------------------> logs a message to the console
    const viewData = { //---------------------------------------> creates object called viewData
      title: 'Welcome to me gym app', //------------------------> name of title
    };
    response.render('index', viewData); //----------------------> name of view to render (index) and sends viewData to view
  },
};

module.exports = index; //--------------------------------------> this is the object that is then exported

//-----> request -> link or button pressed on page
//-----> response -> complete page rendered into browser
