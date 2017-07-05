'use strict';

const userstore = require('../models/user-store'); //----------------> loads the model (the user)
const logger = require('../utils/logger'); //------------------------> require identifies and imports object defined in other modules
const uuid = require('uuid'); //-------------------------------------> loads the model (unique id)

const accounts = {
  index(request, response) { //--------------------------------------> index method called when ‘/ accounts’ request received
    const viewData = { //--------------------------------------------> place model in viewData object
      title: 'Login or Signup', //-----------------------------------> name of title
    };
    response.render('index', viewData); //---------------------------> name of view to render (index) and sends viewData to view
  },

  login(request, response) { //--------------------------------------> login method called when ‘/ accounts’ request received
    const viewData = { //--------------------------------------------> place model in viewData object
      title: 'Login to the Service', //------------------------------> name of title
    };
    response.render('login', viewData); //---------------------------> name of view to render (login) and sends viewData to view
  },

  logout(request, response) { //-------------------------------------> logout method called when ‘/ accounts’ request received
    response.cookie('gym', ''); //------------------------------> creates a cookie called playlist
    response.redirect('/'); //---------------------------------------> redirect to (/)
  },

  signup(request, response) { //-------------------------------------> signup method called when ‘/ accounts’ request received
    const viewData = { //--------------------------------------------> place model in viewData object
      title: 'Login to the Service', //------------------------------> name of title
    };
    response.render('signup', viewData); //--------------------------> name of view to render (signup) and sends viewData to view
  },

  //---> Creates a new user object based on the form data + adds to user-store <---//

  register(request, response) { //-----------------------------------> register method, called when ‘/ accounts’ request received
    const user = request.body;
    user.id = uuid(); //---------------------------------------------> creates a unique user id
    userstore.addUser(user); //--------------------------------------> adds the user to the store
    logger.info(`registering ${user.email}`); //---------------------> logs info to console of user registering
    response.redirect('/login'); //----------------------------------> redirect to (/login)
  },

  authenticate(request, response) {
    const user = userstore.getUserByEmail(request.body.email); //----> checks if user exists by searching valid email
    if (user && user.password === request.body.password) { //--------> checks if the user and password match from db
      response.cookie('gym', user.email); //--------------------> if so then a cookie called ‘playlist’ containing users email is created
      logger.info(`logging in ${user.email}`); //--------------------> logs info to console of user logging in
      response.redirect('/dashboard'); //----------------------------> switches to dashboard otherwise
    } else {
      response.redirect('/login'); //--------------------------------> ask user to try to log in again
    }
  },

  //---> utility method to see if session exists and which user ‘owns’ the session <---//

  getCurrentUser(request) {
    const userEmail = request.cookies.gym;
    return userstore.getUserByEmail(userEmail); //-------------------> returns a valid user by email search if session exists
  },
};

module.exports = accounts; //-----------------------------------------> this is the object that is then exported
