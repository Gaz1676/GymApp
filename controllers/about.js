'use strict';

const logger = require('../utils/logger'); //-------------------> import logger

//---> about object definition <---//

const about = {
  index(request, response) { //---------------------------------> index method called when ‘/ accounts’ request received
    logger.info('rendering about'); //--------------------------> logs a message to the console
    const viewData = { //---------------------------------------> creates object called viewData
      title: 'About JS Gym App', //-----------------------------> name of title
    };
    response.render('about', viewData); //----------------------> name of view to render (about) and sends viewData to view
  },                                   
};

module.exports = about; //--------------------------------------> this is the object that is then exported

//-----> request -> link or button pressed on page
//-----> response -> complete page rendered into browser