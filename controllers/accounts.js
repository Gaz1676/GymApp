'use strict';

const memberStore = require('../models/member-store'); //--------------------> imports memberStore
const trainerStore = require('../models/trainer-store.js'); //---------------> imports trainerStore
const logger = require('../utils/logger'); //--------------------------------> imports logger
const uuid = require('uuid'); //---------------------------------------------> imports uuid

//---> accounts object definition <---//

const accounts = {
  index(request, response) { //----------------------------------------------> index method called when ‘/ accounts’ request received
    const viewData = { //----------------------------------------------------> place model in viewData object
      title: 'Login or Signup', //-------------------------------------------> name of title
    };
    response.render('index', viewData); //-----------------------------------> name of view to render (index) and sends viewData to view
  },

  login(request, response) { //----------------------------------------------> login method called when ‘/ accounts’ request received
    const viewData = { //----------------------------------------------------> place model in viewData object
      title: 'Login to the gym', //------------------------------------------> name of title
    };
    response.render('login', viewData); //-----------------------------------> name of view to render (login) and sends viewData to view
  },

  logout(request, response) { //---------------------------------------------> logout method called when ‘/ accounts’ request received
    response.cookie('member', ''); //----------------------------------------> creates a cookie called gym
    response.redirect('/'); //-----------------------------------------------> redirect to (/)
  },

  signup(request, response) { //---------------------------------------------> sign up method called when ‘/ accounts’ request received
    const viewData = { //----------------------------------------------------> place model in viewData object
      title: 'Sign up to the gym', //----------------------------------------> name of title
    };
    response.render('signup', viewData); //----------------------------------> name of view to render (sign up) and sends viewData to view
  },

  register(request, response) { //-------------------------------------------> register method, called when ‘/ accounts’ request received
    const member = request.body; //------------------------------------------> requests body data and stores it in member
    member.id = uuid(); //---------------------------------------------------> creates a unique member id
    member.assessments = []; //----------------------------------------------> creates assessment array
    memberStore.addMember(member); //----------------------------------------> adds the member to the store
    logger.info(`registering ${member.email}`); //---------------------------> logs info to console of member registering
    response.redirect('/login'); //------------------------------------------> redirect to (/login)
  },

  authenticate(request, response) { //---------------------------------------> authenticate method, called when ‘/ accounts’ request received
    const member = memberStore.getMemberByEmail(request.body.email); //------> checks if member exists by searching valid email
    const trainer = trainerStore.getTrainerByEmail(request.body.email);//----> checks if trainer exists by searching valid email
    if (member && member.password === request.body.password) { //------------> checks if the member and password match from db
      response.cookie('member', member.email); //----------------------------> if so then a cookie called ‘member’ containing members email is created
      logger.info(`logging in ${member.email}`); //--------------------------> logs info to console of member logging in
      response.redirect('/dashboard'); //------------------------------------> redirected to dashboard 
    } else if (trainer && trainer.password === request.body.password) { //---> checks if the trainer and password match from db
      response.cookie('trainer', trainer.email); //--------------------------> if so then a cookie called ‘trainer’ containing trainers email is created
      logger.info(`logging in ${trainer.email}`); //-------------------------> logs info to console of trainer logging in
      response.redirect('/trainerDashboard'); //-----------------------------> redirected to trainerdashboard 
    } else {
      logger.info(`authentication failed`); //-------------------------------> else if no matches found console displays err
      response.redirect('/login'); //----------------------------------------> redirect to (/login)
    }
  },

  getCurrentMember(request) { //---------------------------------------------> getCurrentMember method, called when ‘/ accounts’ request received
    const memberEmail = request.cookies.member; //---------------------------> requests cookies of member and stores them in memberEmail
    return memberStore.getMemberByEmail(memberEmail); //---------------------> returns a valid member by email search if session exists
  },

  getCurrentTrainer(request) { //--------------------------------------------> getCurrentTrainer method, called when ‘/ accounts’ request received
    const trainerEmail = request.cookies.trainer; //-------------------------> requests cookies of trainer and stores them in trainerEmail
    return trainerStore.getTrainerByEmail(trainerEmail); //------------------> returns a valid trainer by email search if session exists
  },

};

module.exports = accounts; //------------------------------------------------> this is the object that is then exported

//-----> request -> link or button pressed on page
//-----> response -> complete page rendered into browser
