'use strict';

//---> require identifies and imports object defined in other modules <--- //

const logger = require('../utils/logger'); //--------------------> import the logger so we can use it

const about = {
  index(request, response) { //---------------------------------> calls render method on response with 2 param
    logger.info('about rendering'); //--------------------------> logs a message to the console
    const viewData = { //---------------------------------------> creates object called viewData
      title: 'About JS Gym App', //-----------------------------> containing single property: title
    };
    response.render('about', viewData); //----------------------> name of view to render(about)
  },                                    //----------------------> anything in viewData will be rendered with (about)
};


module.exports = about; //--------------------------------------> this is the object that is then exported
