/**
 * Author: Gary Fleming
 * Student No: 20019497
 * Start Date: Aug 1st 2017
 */

'use strict';

const logger = require('../utils/logger.js'); //-------------------------------------------------------> imports logger
const uuid = require('uuid'); //-----------------------------------------------------------------------> imports uuid
const memberStore = require('../models/member-store.js'); //-------------------------------------------> imports memberStore
const trainerStore = require('../models/trainer-store.js'); //-----------------------------------------> imports trainerStore

//---> accounts object definition <---//

const accounts = {
  index(request, response) { //------------------------------------------------------------------------> index method called when ‘/ accounts’ request received
    const viewData = { //------------------------------------------------------------------------------> place model in viewData object
      title: 'Home', //--------------------------------------------------------------------------------> name of title
    };
    response.render('index', viewData); //-------------------------------------------------------------> renders 'index' and viewData to view
  },

  login(request, response) { //------------------------------------------------------------------------> login method called when ‘/ accounts’ request received
    const viewData = { //------------------------------------------------------------------------------> place model in viewData object
      title: 'Login to the gym', //--------------------------------------------------------------------> name of title
    };
    response.render('login', viewData); //-------------------------------------------------------------> renders 'login' and viewData to view
  },

  logout(request, response) { //-----------------------------------------------------------------------> logout method called when ‘/ accounts’ request received
    response.cookie('member', ''); //------------------------------------------------------------------> creates a cookie called member
    response.redirect('/'); //-------------------------------------------------------------------------> redirect to '/'
  },

  signup(request, response) { //-----------------------------------------------------------------------> sign up method called when ‘/ accounts’ request received
    const viewData = { //------------------------------------------------------------------------------> place model in viewData object
      title: 'Sign up to the gym', //------------------------------------------------------------------> name of title
    };
    response.render('signup', viewData); //------------------------------------------------------------> renders 'sign up' and viewData to view
  },

  tAndC(request, response) { //------------------------------------------------------------------------> t&c method called when ‘/ accounts’ request received
    const viewData = { //------------------------------------------------------------------------------> place model in viewData object
      title: 'T&c\'s to the gym', //-------------------------------------------------------------------> name of title
    };
    response.render('tAndC', viewData); //-------------------------------------------------------------> renders 'tAndC' and viewData to view
  },

  register(request, response) { //---------------------------------------------------------------------> register method, called when ‘/ accounts’ request received
    const member = request.body; //--------------------------------------------------------------------> requests body data and stores it in member
    member.memberid = uuid(); //-----------------------------------------------------------------------> creates a unique memberid for member
    if (member.gender === 'male') { //-----------------------------------------------------------------> if gender of member registering is male
      member.img = 'http://res.cloudinary.com/cloud101/image/upload/v1504124210/man_emkpmv.png'; //----> a default image is set
    } else { //----------------------------------------------------------------------------------------> else
      member.img = 'http://res.cloudinary.com/cloud101/image/upload/v1504124216/woman_kfhqfq.png'; //--> if gender is female then this default image is used
    }

    member.assessments = []; //------------------------------------------------------------------------> creates an empty assessment array list for member
    member.bookings = []; //---------------------------------------------------------------------------> creates an empty bookings array list for member
    member.goals = []; //------------------------------------------------------------------------------> creates an empty goals array list for member

    if (memberStore.getMemberByEmail(member.email)) {
      logger.debug(`email: ${member.email} already registered to database`); //------------------------> logs message to console
      response.render('signup'); //--------------------------------------------------------------------> renders 'sign up' to view
    } else { //----------------------------------------------------------------------------------------> else
      memberStore.addMember(member); //----------------------------------------------------------------> adds the member to memberStore
      logger.debug(`registering ${member.email}`); //--------------------------------------------------> logs message to console
      response.redirect('/login'); //------------------------------------------------------------------> redirect to (/login)
    }
  },

  authenticate(request, response) { //-----------------------------------------------------------------> authenticate method, called when ‘/ accounts’ request received
    const member = memberStore.getMemberByEmail(request.body.email); //--------------------------------> getMemberByEmail from data in memberStore and stores it in member
    const trainer = trainerStore.getTrainerByEmail(request.body.email);//------------------------------> getTrainerByEmail from data in trainerStore and stores it in trainer
    if (member && member.password === request.body.password) { //--------------------------------------> checks if the member and password match from db
      response.cookie('member', member.memberid); //---------------------------------------------------> if so then a cookie called ‘member’ containing members id is created
      logger.debug(`logging in ${member.email}`); //---------------------------------------------------> logs message to console
      response.redirect('/dashboard'); //--------------------------------------------------------------> redirected to dashboard
    } else if (trainer && trainer.password === request.body.password) { //-----------------------------> checks if the trainer and password match from db
      response.cookie('trainer', trainer.trainerid); //------------------------------------------------> if so then a cookie called ‘trainer’ containing trainers id is created
      logger.debug(`logging in ${trainer.email}`); //--------------------------------------------------> logs message to console
      response.redirect('/trainerDashboard'); //-------------------------------------------------------> redirected to (/trainerdashboard)
    } else { //----------------------------------------------------------------------------------------> else
      logger.debug(`authentication failed`); //--------------------------------------------------------> logs message to console
      response.redirect('/login'); //------------------------------------------------------------------> redirect to (/login)
    }
  },

  getCurrentMember(request) { //-----------------------------------------------------------------------> getCurrentMember method, called when ‘/ accounts’ request received
    const memberid = request.cookies.member; //--------------------------------------------------------> requests cookies of member and stores them in memberid
    return memberStore.getMemberById(memberid); //-----------------------------------------------------> returns a valid member by id search if session exists
  },

  getCurrentTrainer(request) { //----------------------------------------------------------------------> getCurrentTrainer method, called when ‘/ accounts’ request received
    const trainerid = request.cookies.trainer; //------------------------------------------------------> requests cookies of trainer and stores them in trainerid
    return trainerStore.getTrainerById(trainerid); //--------------------------------------------------> returns a valid trainer by id search if session exists
  },
};

module.exports = accounts; //--------------------------------------------------------------------------> this is the object that is then exported

//-----> request -> link or button pressed on page
//-----> response -> complete page rendered into browser
