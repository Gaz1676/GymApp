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
    const memberList = memberStore.getAllMembers(); //----------------------------------------> get all members from memberStore and store them in memberList
    const viewData = { //---------------------------------------------------------------------> place model in viewData object
      title: 'Trainer Dashboard', //----------------------------------------------------------> name of the title
      trainer: loggedInTrainer, //------------------------------------------------------------> logged in trainer
      memberList: memberList, //--------------------------------------------------------------> memberList
    };
    response.render('trainerDashboard', viewData); //-----------------------------------------> renders 'trainerDashboard' and viewData to view
  },

  viewAssessments(request, response) { //-----------------------------------------------------> viewAssessments method, called when ‘/ trainerDashboard’ request received
    logger.info('rendering viewing assessments'); //------------------------------------------> log message to console
    const memberid = request.params.memberid; //----------------------------------------------> gets memberid (params)stores them in memberid
    const member = memberStore.getMemberById(memberid); //------------------------------------> gets member by id from memberStore and stores it in member
    const bmi = analytics.calculateBMI(member); //--------------------------------------------> gets calculateBMI of member from analytics and stores it in bmi
    const idealBodyWeight = analytics.idealBodyWeight(member); //-----------------------------> gets IBW of member from analytics and stores it in IBW
    const viewData = { //---------------------------------------------------------------------> place model in viewData object
      memberid: memberid, //------------------------------------------------------------------> memberid
      member: member, //----------------------------------------------------------------------> member
      bmi: bmi, //----------------------------------------------------------------------------> bmi
      bmiCategory: analytics.BMICategory(bmi), //---------------------------------------------> bmiCategory of bmi from analytics
      idealBodyWeight: idealBodyWeight, //----------------------------------------------------> IBW
    };
    logger.debug(`View ${member.firstName} assessments`); //----------------------------------> logs message to console
    const list = member.assessments; //-------------------------------------------------------> the assessments of the member stored in list
    for (let i = 0; i < list.length; i++) { //------------------------------------------------> if 'i' is less than list.length then increment by one
      list[i].updateComment = true; //--------------------------------------------------------> update comment equals to true
    }

    response.render('viewAssessments', viewData); //------------------------------------------> renders 'viewAssessments' and viewData to view
  },

  viewTrainerClasses(request, response) { //--------------------------------------------------> viewTrainerClasses method, called when ‘/ trainerDashboard’ request received
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
    const memberid = request.params.memberid; //----------------------------------------------> gets memberid (params) stores it in memberid
    const assessmentid = request.params.assessmentid; //--------------------------------------> gets assessmentid (params) stores it in assessmentid
    logger.debug(`Deleting ${memberStore.firstName} ${assessmentid}`); //---------------------> logs message to console
    memberStore.removeAssessment(memberid, assessmentid); //----------------------------------> removes assessment (memberid, assessmentid) from memberStore
    response.redirect('/trainerDashboard'); //------------------------------------------------> redirects to (/trainerDashboard)
  },

  removeMember(request, response) { //--------------------------------------------------------> removeMember method, called when ‘/ trainerDashboard’ request received
    logger.info('rendering removing member'); //----------------------------------------------> log message to console
    const memberid = request.params.memberid; //----------------------------------------------> gets memberid (params) stores it in memberid
    logger.debug(`Deleting ${memberid.firstName} ${memberid}`); //----------------------------> logs message to console
    memberStore.removeMember(memberid); //----------------------------------------------------> remove member by memberid from memberStore
    response.redirect('/trainerDashboard'); //------------------------------------------------> redirects to (/trainerDashboard)
  },

  removeClass(request, response) { //---------------------------------------------------------> removeClass method, called when ‘/ trainerDashboard’ request received
    logger.info('rendering removing class'); //-----------------------------------------------> log message to console
    const classid = request.params.classid; // -----------------------------------------------> gets classid (params) stores it in classid
    logger.debug(`Deleting ${classid}`); //---------------------------------------------------> logs message to console
    classStore.removeClass(classid); //-------------------------------------------------------> remove class by classid from classStore
    response.redirect('/trainerDashboard/viewTrainerClasses'); //-----------------------------> redirects to (/trainerDashboard/viewTrainerClasses)
  },

  updateComment(request, response) { //-------------------------------------------------------> updateComment method, called when ‘/ trainerDashboard’ request received
    logger.info('rendering updating comment'); //---------------------------------------------> logs message to console
    const memberid = request.params.memberid; //----------------------------------------------> gets memberid (params) stores it in memberid
    const assessmentid = request.params.assessmentid; //--------------------------------------> gets assessmentid (params) store it in assessmentid
    const comment = request.body.comment; //--------------------------------------------------> gets comment data and stores it in comment
    const assessment = memberStore.getAssessmentById(memberid, assessmentid); //--------------> gets assessment by id (memberid, assessmentid) from memberStore and stores it in assessment
    assessment.comment = comment; //----------------------------------------------------------> comment from assessment equals new comment

    memberStore.store.save(); //--------------------------------------------------------------> saves new results to memberStore
    response.redirect('/trainerDashboard'); //------------------------------------------------> redirects to (/trainerDashboard)
  },

  addClass(request, response) { //------------------------------------------------------------> addClass method, called when ‘/ trainerDashboard’ request received
    logger.info('creating a class'); //-------------------------------------------------------> logs message to console
    const newClass = { //---------------------------------------------------------------------> place model in newClass object
      classid: uuid(), //---------------------------------------------------------------------> unique classid
      name: request.body.name, //-------------------------------------------------------------> requests name
      description: request.body.description, //-----------------------------------------------> requests description
      duration: request.body.duration, //-----------------------------------------------------> requests duration
      capacity: Number(request.body.capacity), //---------------------------------------------> requests capacity
      difficulty: request.body.difficulty, //-------------------------------------------------> requests difficulty
      classesWorkouts: Number(request.body.classesWorkouts), //-------------------------------> request classesWorkouts
      time: request.body.time, //-------------------------------------------------------------> requests time
      date: request.body.date, //-------------------------------------------------------------> requests date
      image: request.body.image, //-----------------------------------------------------------> requests image
      workouts: [], //------------------------------------------------------------------------> empty workouts array list
    };
    for (let i = 0; i < request.body.classesWorkouts; i++) { //------------------------------->  for loop
      const date = new Date(request.body.date); //--------------------------------------------> request date as new Date and stores it in date
      const daysToAdd = (i * 7); //-----------------------------------------------------------> increments i by 7 and stores it in daysToAdd
      const workoutDate = new Date(date.setTime(date.getTime() + (daysToAdd * 86400000))); //->
      const workout = { //--------------------------------------------------------------------> place model in workout object
        workoutid: uuid(), //-----------------------------------------------------------------> unique workoutid
        workoutDate: workoutDate.toISOString().replace(/T/, ' ').replace(/\..+/, ''), //------> workoutDate (trying to remove the hhmmss)
        time: request.body.time, //-----------------------------------------------------------> requests time
        duration: request.body.duration, //---------------------------------------------------> requests duration
        currentCapacity: 0, //----------------------------------------------------------------> currentCapacity set to 0
        capacity: request.body.capacity, //---------------------------------------------------> request capacity
        members: [], //-----------------------------------------------------------------------> empty members array list
      };
      newClass.workouts.push(workout); //-----------------------------------------------------> pushes workout to the end of workouts pile
    }

    classStore.addClass(newClass); //---------------------------------------------------------> adds new class to classStore
    response.redirect('/trainerDashboard/viewTrainerClasses'); //-----------------------------> redirects to (/trainerDashboard/viewTrainerClasses)
  },

  editClass(request, response) { //-----------------------------------------------------------> editClass method, called when ‘/ trainerDashboard’ request received
    logger.info('rendering updating class'); //-----------------------------------------------> logs message to console
    const classid = request.params.classid; //------------------------------------------------> gets classid (params) stores it in classid
    const newClass = classStore.getClassById(classid); //-------------------------------------> gets class by id from classStore and stores it in newClass
    newClass.name = request.body.name; //-----------------------------------------------------> request name
    newClass.description = request.body.description; //---------------------------------------> request description
    newClass.duration = request.body.duration; //---------------------------------------------> request duration
    newClass.capacity = request.body.capacity; //---------------------------------------------> request capacity
    newClass.difficulty = request.body.difficulty; //-----------------------------------------> request difficulty
    newClass.image = request.body.image; //---------------------------------------------------> request image
    newClass.time = request.body.time; //-----------------------------------------------------> request time
    newClass.date = request.body.date; //-----------------------------------------------------> request date

    classStore.store.save(); //---------------------------------------------------------------> saves new results to classStore
    response.redirect('/trainerDashboard/viewTrainerClasses'); //-----------------------------> redirects to ('/trainerDashboard/viewTrainerClasses)
  },

  updateClass(request, response) { //---------------------------------------------------------> updateClass method, called when ‘/ trainerDashboard’ request received
    logger.info('rendering edits'); //--------------------------------------------------------> logs message to console
    const classid = request.params.classid; //------------------------------------------------> gets classid (params) stores it in classid
    const updatedClass = classStore.getClassById(classid); //---------------------------------> gets class by id from classStore and stores it in updatedClass
    const viewData = { //---------------------------------------------------------------------> place model in viewData object
      updatedClass: updatedClass, //----------------------------------------------------------> updatedClass
    };
    response.render('updateClass', viewData); //----------------------------------------------> name of view to render 'updateClass' and sends viewData to view
  },

  createClasses(request, response) { //-------------------------------------------------------> createClass method, called when ‘/ trainerDashboard’ request received
    const loggedInTrainer = accounts.getCurrentTrainer(request); //---------------------------> gets currentTrainer from accounts and stores it in loggedInTrainer
    const classes = classStore.getAllClasses(); //--------------------------------------------> gets allClasses from classStore and stores it in classes
    const viewData = { //---------------------------------------------------------------------> place model in viewData object
      trainer: loggedInTrainer, //------------------------------------------------------------> loggedInTrainer
      classes: classes, //--------------------------------------------------------------------> classes
    };
    logger.info(`classes menu rendering for ${loggedInTrainer.firstName}`); //----------------> logs message to console
    response.render('createClasses', viewData); //--------------------------------------------> renders 'createClasses' and viewData to view
  },

};

module.exports = trainerDashboard; //---------------------------------------------------------> this is the object that is then exported:

//-----> request -> link or button pressed on page
//-----> response -> complete page rendered into browser
