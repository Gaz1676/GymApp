'use strict';

const logger = require('../utils/logger'); //-------------------------------------------------> imports logger
const memberStore = require('../models/member-store.js'); //----------------------------------> imports member-store
const accounts = require('./accounts.js'); //-------------------------------------------------> imports accounts
const trainerStore = require('../models/trainer-store.js'); //--------------------------------> imports trainer-store
const analytics = require('../utils/analytics.js'); //----------------------------------------> imports analytics
const uuid = require('uuid'); //--------------------------------------------------------------> imports uuid

//---> trainerdashboard object definition <---//

const trainerDashboard = {
  index(request, response) { //---------------------------------------------------------------> index method, called when ‘/ dashboard’ request received
    logger.info('trainer dashboard rendering'); //--------------------------------------------> log message to console 
    const loggedInTrainer = accounts.getCurrentTrainer(request); //---------------------------> finds which trainer is currently logged in
    const memberList = memberStore.getAllMembers(); //----------------------------------------> get all members from member and store them in memberList
    const viewData = { //---------------------------------------------------------------------> place model in viewData object
      title: 'Trainer Dashboard', //----------------------------------------------------------> name of the title
      trainer: loggedInTrainer, //------------------------------------------------------------> logged in trainer
      memberList: memberList, //--------------------------------------------------------------> member list
    };
    response.render('trainerDashboard', viewData); //-----------------------------------------> name of view to render 'dashboard' and sends viewData to view
  },

  viewAssessments(request, response) { //-----------------------------------------------------> viewAssessments method, called when ‘/ dashboard’ request received
    logger.info('rendering viewing assessments'); //------------------------------------------> log message to console
    const memberId = request.params.id; //----------------------------------------------------> gets id from member list
    const viewMember = memberStore.getMemberById(memberId); //--------------------------------> gets member by id from store and stores it in viewMember
    const bmi = analytics.calculateBMI(viewMember); //----------------------------------------> gets calculateBMI of member from analytics and stores it in bmi
    const idealBodyWeight = analytics.idealBodyWeight(viewMember); //-------------------------> gets IBW of member from analytics and stores it in IBW
    const viewData = { //---------------------------------------------------------------------> place model in viewData object
      id: memberId, //------------------------------------------------------------------------> member id
      member: viewMember, //------------------------------------------------------------------> the member
      bmi: bmi, //----------------------------------------------------------------------------> the bmi
      bmiCategory: analytics.BMICategory(bmi), //---------------------------------------------> bmiCategory of bmi from analytics
      idealBodyWeight: idealBodyWeight, //----------------------------------------------------> IBW
    };
    logger.debug(`View ${viewMember.firstName} assessments`); //------------------------------> logs message to console
    const list = viewMember.assessments; //---------------------------------------------------> the assessments of the viewed member stored in list
    for (let i = 0; i < list.length; i++) { //------------------------------------------------> if 'i' is less than list.length then increment by one
      list[i].updateComment = true; //--------------------------------------------------------> update comment equals to true
    }

    response.render('assessments', viewData); //----------------------------------------------> name of view to render 'assessments' and sends viewData to view
  },

  removeAssessment(request, response) { //----------------------------------------------------> removeAssessment method, called when ‘/ dashboard’ request received
    logger.info('rendering removing assessment'); //------------------------------------------> logs message to console
    const memberId = request.params.id; //----------------------------------------------------> gets member id
    const assessmentId = request.params.assessmentId; //--------------------------------------> gets assessment id
    memberStore.removeAssessment(memberId, assessmentId); //----------------------------------> removes assessment from store
    response.redirect('/trainerDashboard'); //------------------------------------------------> redirects to trainerdashboard
  },

  removeMember(request, response) { //--------------------------------------------------------> removeMember method, called when ‘/ dashboard’ request received
    logger.info('rendering removing member'); //----------------------------------------------> log message to console
    const memberId = request.params.id; //----------------------------------------------------> gets member id
    logger.debug(`Deleting ${memberStore.firstName} ${memberId}`); //-------------------------> logs message to console
    memberStore.removeMember(memberId); //----------------------------------------------------> remove member by id
    response.redirect('/trainerDashboard'); //------------------------------------------------> redirects to trainerdashboard
  },

  updateComment(request, response) { //-------------------------------------------------------> updateComment method, called when ‘/ dashboard’ request received
    logger.info('rendering updating comment'); //---------------------------------------------> logs message to console
    const memberId = request.params.id; //----------------------------------------------------> gets member id
    const assessmentId = request.params.assessmentId; //--------------------------------------> gets assessment id
    const comment = request.body.comment; //--------------------------------------------------> gets comment data
    const assessment = memberStore.getAssessmentById(memberId, assessmentId); //--------------> gets assessment by id with member id and assessment id from store and stores it in assessment
    assessment.comment = comment; //----------------------------------------------------------> comment equals new comment from assessment
    memberStore.store.save(); //--------------------------------------------------------------> saves new results to store
    response.redirect('/trainerDashboard'); //------------------------------------------------> redirects to (/trainerDashboard)
  },

  addClass(request, response) { //------------------------------------------------------------> addClass.hbs method, called when ‘/ dashboard’ request received
    logger.info('creating a class'); //-------------------------------------------------------> logs message to console
    const loggedInTrainer = accounts.getCurrentTrainer(request); //---------------------------> gets current logged in trainer from accounts and stores it in loggedInTrainer
    const trainerId = loggedInTrainer.id; //--------------------------------------------------> gets id of loggedInTrainer and stores it in trainer id
    const newClass = { //---------------------------------------------------------------------> place model in newClass object
      classId: uuid(), //---------------------------------------------------------------------> unique class id
      name: request.body.name, //-------------------------------------------------------------> requests name
      description: request.body.description, //-----------------------------------------------> requests description
      duration: request.body.duration, //-----------------------------------------------------> requests duration
      capacity: request.body.capacity, //-----------------------------------------------------> requests capacity
      difficulty: request.body.difficulty, //-------------------------------------------------> requests difficulty
      time: request.body.time, //-------------------------------------------------------------> requests time
      date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''), //----------------> new date
      suite: request.body.suite, //-----------------------------------------------------------> requests suite
    };
    trainerStore.addClass(trainerId, newClass); //--------------------------------------------> adds class to trainerStore
    response.redirect('/trainerDashboard'); //------------------------------------------------> redirects to (/trainerDashboard)
  },

  createClass(request, response) { //---------------------------------------------------------> classes method, called when ‘/ dashboard’ request received
    logger.info('rendering classes'); //------------------------------------------------------> logs message to console
    const loggedInTrainer = accounts.getCurrentTrainer(request); //---------------------------> gets currentTrainer from trainerDashboard and stores it in loggedInTrainer
    const viewData = { //---------------------------------------------------------------------> place model in viewData object
      trainer: loggedInTrainer, //------------------------------------------------------------> loggedInTrainer
    };
    response.render('createClass', viewData); //----------------------------------------------> name of view to render 'settings' and sends viewData to view
  },

  allClasses(request, response) { //----------------------------------------------------------> allClasses.hbs method, called when ‘/ dashboard’ request received
    logger.info('rendering all classes'); //--------------------------------------------------> logs message to console
    const loggedInTrainer = accounts.getCurrentTrainer(request); //---------------------------> gets current trainer from accounts and store it in loggedInTrainer
    const list = loggedInTrainer.createClass(); //--------------------------------------------> TODO
    response.render('/allclasses'); //--------------------------------------------------------> TODO
  },
};

module.exports = trainerDashboard; //---------------------------------------------------------> this is the object that is then exported:

//-----> request -> link or button pressed on page
//-----> response -> complete page rendered into browser
