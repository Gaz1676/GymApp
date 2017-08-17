'use strict';

const logger = require('../utils/logger'); //-------------------------------------------------> imports logger
const memberStore = require('../models/member-store.js'); //----------------------------------> imports member-store
const accounts = require('./accounts.js'); //-------------------------------------------------> imports accounts
const classStore = require('../models/class-store.js'); //------------------------------------> imports class-store
const analytics = require('../utils/analytics.js'); //----------------------------------------> imports analytics
const uuid = require('uuid'); //--------------------------------------------------------------> imports uuid

//---> trainerdashboard object definition <---//

const trainerDashboard = {
  index(request, response) { //---------------------------------------------------------------> index method, called when ‘/ trainerDashboard’ request received
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

  viewAssessments(request, response) { //-----------------------------------------------------> viewAssessments method, called when ‘/ trainerDashboard’ request received
    logger.info('rendering viewing assessments'); //------------------------------------------> log message to console
    const memberid = request.params.memberid; //----------------------------------------------> gets id from member list
    const member = memberStore.getMemberById(memberid); //------------------------------------> gets member by id from store and stores it in viewMember
    const bmi = analytics.calculateBMI(member); //--------------------------------------------> gets calculateBMI of member from analytics and stores it in bmi
    const idealBodyWeight = analytics.idealBodyWeight(member); //-----------------------------> gets IBW of member from analytics and stores it in IBW
    const viewData = { //---------------------------------------------------------------------> place model in viewData object
      memberid: memberid, //------------------------------------------------------------------> member id
      member: member, //----------------------------------------------------------------------> the member
      bmi: bmi, //----------------------------------------------------------------------------> the bmi
      bmiCategory: analytics.BMICategory(bmi), //---------------------------------------------> bmiCategory of bmi from analytics
      idealBodyWeight: idealBodyWeight, //----------------------------------------------------> IBW
    };
    logger.debug(`View ${member.firstName} assessments`); //----------------------------------> logs message to console
    const list = member.assessments; //-------------------------------------------------------> the assessments of the viewed member stored in list
    for (let i = 0; i < list.length; i++) { //------------------------------------------------> if 'i' is less than list.length then increment by one
      list[i].updateComment = true; //--------------------------------------------------------> update comment equals to true
    }

    response.render('viewAssessments', viewData); //------------------------------------------> name of view to render 'viewAssessments' and sends viewData to view
  },

  viewTrainerClasses(request, response) { //--------------------------------------------------> allClasses method, called when ‘/ trainerDashboard’ request received
    const trainer = accounts.getCurrentTrainer(request); //-----------------------------------> gets current trainer from accounts and stores it in trainer
    const classList = classStore.getAllClasses(); //------------------------------------------> gets all classes from classStore and stores it in classList
    const viewData = { //---------------------------------------------------------------------> place model in viewData object
      title: 'Trainer Classes', //------------------------------------------------------------> name of title
      trainer: trainer, //--------------------------------------------------------------------> trainer
      classList: classList, //----------------------------------------------------------------> classList
    };
    logger.debug(`rendering all classes by ${trainer.firstName}`); //-------------------------> logs message to console
    response.render('viewTrainerClasses', viewData); //---------------------------------------> name of view to render 'allClasses' and sends viewData to view
  },

  removeAssessment(request, response) { //----------------------------------------------------> removeAssessment method, called when ‘/ trainerDashboard’ request received
    logger.info('rendering removing assessment'); //------------------------------------------> logs message to console
    const memberid = request.params.memberid; //----------------------------------------------> gets member id
    const assessmentid = request.params.assessmentid; //--------------------------------------> gets assessment id
    logger.debug(`Deleting ${memberStore.firstName} ${assessmentid}`); //---------------------> logs message to console
    memberStore.removeAssessment(memberid, assessmentid); //----------------------------------> removes assessment from store
    response.redirect('/trainerDashboard'); //------------------------------------------------> redirects to (/trainerDashboard)
  },

  removeMember(request, response) { //--------------------------------------------------------> removeMember method, called when ‘/ trainerDashboard’ request received
    logger.info('rendering removing member'); //----------------------------------------------> log message to console
    const memberid = request.params.memberid; //----------------------------------------------> gets member id
    logger.debug(`Deleting ${memberid.firstName} ${memberid}`); //----------------------------> logs message to console
    memberStore.removeMember(memberid); //----------------------------------------------------> remove member by id
    response.redirect('/trainerDashboard'); //------------------------------------------------> redirects to (/trainerDashboard)
  },

  removeClass(request, response) { //---------------------------------------------------------> removeClass method, called when ‘/ trainerDashboard’ request received
    logger.info('rendering removing class'); //-----------------------------------------------> log message to console
    const classid = request.params.classid; // -----------------------------------------------> gets class id
    logger.debug(`Deleting ${classid}`); //---------------------------------------------------> logs message to console
    classStore.removeClass(classid); //-------------------------------------------------------> remove class from class-store
    response.redirect('/trainerDashboard/viewTrainerClasses'); //-----------------------------> redirects to (/trainerDashboard/allClasses)
  },

  updateComment(request, response) { //-------------------------------------------------------> updateComment method, called when ‘/ trainerDashboard’ request received
    logger.info('rendering updating comment'); //---------------------------------------------> logs message to console
    const memberid = request.params.memberid; //----------------------------------------------> gets member id
    const assessmentid = request.params.assessmentid; //--------------------------------------> gets assessment id
    const comment = request.body.comment; //--------------------------------------------------> gets comment data
    const assessment = memberStore.getAssessmentById(memberid, assessmentid); //--------------> gets assessment by id with member id and assessment id from store and stores it in assessment
    assessment.comment = comment; //----------------------------------------------------------> comment equals new comment from assessment

    memberStore.store.save(); //--------------------------------------------------------------> saves new results to store
    response.redirect('/trainerDashboard'); //------------------------------------------------> redirects to (/trainerDashboard)
  },

  addClass(request, response) { //------------------------------------------------------------> addClass method, called when ‘/ trainerDashboard’ request received
    logger.info('creating a class'); //-------------------------------------------------------> logs message to console
    const newClass = { //---------------------------------------------------------------------> place model in newClass object
      classid: uuid(), //---------------------------------------------------------------------> unique class id
      name: request.body.name, //-------------------------------------------------------------> requests name
      description: request.body.description, //-----------------------------------------------> requests description
      duration: request.body.duration, //-----------------------------------------------------> requests duration
      capacity: Number(request.body.capacity), //---------------------------------------------> requests capacity
      difficulty: request.body.difficulty, //-------------------------------------------------> requests difficulty
      time: request.body.time, //-------------------------------------------------------------> requests time
      date: request.body.date, //-------------------------------------------------------------> requests date
      image: request.body.image, //-----------------------------------------------------------> requests image
    };
    classStore.addClass(newClass); //---------------------------------------------------------> adds new class to class Store
    response.redirect('/trainerDashboard/viewTrainerClasses'); //-----------------------------> redirects to (/trainerDashboard/allClasses)
  },

  // --------- TODO ---------- //

  classSettings(request, response) { //-------------------------------------------------------> classSettings method, called when ‘/ trainerDashboard’ request received
    logger.info('rendering edits'); //--------------------------------------------------------> logs message to console
    const classid = request.params.classid; //------------------------------------------------> gets classid (params)
    const updatedClass = classStore.getClassById(classid); //---------------------------------> gets class by id from classStore and stores it in updatedClass
    const viewData = { //---------------------------------------------------------------------> place model in viewData object
      updatedClass: updatedClass, //----------------------------------------------------------> updated class
    };
    response.render('classSettings', viewData); //--------------------------------------------> name of view to render 'classSettings' and sends viewData to view
  },

  updateClass(request, response) { //---------------------------------------------------------> updateClass method, called when ‘/ trainerDashboard’ request received
    logger.info('rendering updating class'); //-----------------------------------------------> logs message to console
    const updatedClass = classStore.getClassById(request); //---------------------------------> gets class by id from classStore and stores it in updatedClass
    updatedClass.name = request.body.name; //-------------------------------------------------> request class name
    updatedClass.description = request.body.description; //-----------------------------------> request description
    updatedClass.duration = request.body.duration; //-----------------------------------------> request duration
    updatedClass.capacity = request.body.capacity; //-----------------------------------------> request capacity
    updatedClass.difficulty = request.body.difficulty; //-------------------------------------> request difficulty
    updatedClass.time = request.body.time; //-------------------------------------------------> request time
    updatedClass.date = request.body.date; //-------------------------------------------------> request date

    classStore.store.save(); //---------------------------------------------------------------> saves new results to store
    response.redirect('/trainerDashboard/viewTrainerClasses'); //-----------------------------> redirects to (//trainerDashboard/trainerClasses)
  },

  createClasses(request, response) {
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const classes = classStore.getAllClasses();
    const viewData = {
      title: 'Classes',
      member: loggedInTrainer,
      classes: classes,
    };
    logger.info(`classes menu rendering for ${loggedInTrainer.firstName}`);
    response.render('createClasses', viewData);
  },

};

module.exports = trainerDashboard; //---------------------------------------------------------> this is the object that is then exported:

//-----> request -> link or button pressed on page
//-----> response -> complete page rendered into browser
