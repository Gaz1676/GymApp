'use strict';

const logger = require('../utils/logger'); //------------------------------------------------------> imports logger
const memberStore = require('../models/member-store.js'); //---------------------------------------> imports member-store
const trainerStore = require('../models/trainer-store.js'); //-------------------------------------> imports trainer-store
const accounts = require('./accounts.js'); //------------------------------------------------------> imports accounts
const classStore = require('../models/class-store.js'); //-----------------------------------------> imports class-store
const analytics = require('../utils/analytics.js'); //---------------------------------------------> imports analytics
const uuid = require('uuid'); //-------------------------------------------------------------------> import uuid

//---> trainerdashboard object definition <---//

const trainerDashboard = {
  index(request, response) { //--------------------------------------------------------------------> index method, called when ‘/ trainerDashboard’ request received
    logger.info('trainer dashboard rendering'); //-------------------------------------------------> log message to console
    const loggedInTrainer = accounts.getCurrentTrainer(request); //--------------------------------> finds which trainer is currently logged in
    const memberList = memberStore.getAllMembers(); //---------------------------------------------> get all members from memberStore and store them in memberList
    const viewData = { //--------------------------------------------------------------------------> place model in viewData object
      title: 'Trainer Dashboard', //---------------------------------------------------------------> name of the title
      trainer: loggedInTrainer, //-----------------------------------------------------------------> logged in trainer
      memberList: memberList, //-------------------------------------------------------------------> memberList

    };
    logger.debug(`Coach ${loggedInTrainer.lastName} main menu page`); //---------------------------> logs message to console
    response.render('trainerDashboard', viewData); //----------------------------------------------> renders 'trainerDashboard' and viewData to view
  },

  viewAssessments(request, response) { //----------------------------------------------------------> viewAssessments method, called when ‘/ trainerDashboard’ request received
    logger.info('view members assessments rendering'); //------------------------------------------> log message to console
    const memberid = request.params.memberid; //---------------------------------------------------> gets memberid (params)stores them in memberid
    const member = memberStore.getMemberById(memberid); //-----------------------------------------> gets member by id from memberStore and stores it in member
    const bmi = analytics.calculateBMI(member); //-------------------------------------------------> gets calculateBMI of member from analytics and stores it in bmi
    const idealBodyWeight = analytics.idealBodyWeight(member); //----------------------------------> gets IBW of member from analytics and stores it in IBW
    const viewData = { //--------------------------------------------------------------------------> place model in viewData object
      memberid: memberid, //-----------------------------------------------------------------------> memberid
      member: member, //---------------------------------------------------------------------------> member
      bmi: bmi, //---------------------------------------------------------------------------------> bmi
      bmiCategory: analytics.BMICategory(bmi), //--------------------------------------------------> bmiCategory of bmi from analytics
      idealBodyWeight: idealBodyWeight, //---------------------------------------------------------> IBW
    };
    logger.debug(`view ${member.firstName} ${member.lastName}\'s assessments`); //-----------------> logs message to console
    response.render('viewAssessments', viewData); //-----------------------------------------------> renders 'viewAssessments' and viewData to view
  },

  viewTrainerClasses(request, response) { //-------------------------------------------------------> viewTrainerClasses method, called when ‘/ trainerDashboard’ request received
    logger.info('view trainer classes rendering'); //----------------------------------------------> log message to console
    const loggedInTrainer = accounts.getCurrentTrainer(request); //--------------------------------> gets current trainer from accounts and stores it in loggedInTrainer
    const classList = classStore.getAllClasses(); //-----------------------------------------------> gets all classes from classStore and stores it in classList
    const viewData = { //--------------------------------------------------------------------------> place model in viewData object
      title: 'Trainer Classes', //-----------------------------------------------------------------> name of title
      trainer: loggedInTrainer, //-----------------------------------------------------------------> loggedInTrainer
      classList: classList, //---------------------------------------------------------------------> classList
    };
    logger.debug(`all classes rendered for Coach ${loggedInTrainer.lastName}`); //-----------------> logs message to console
    response.render('viewTrainerClasses', viewData); //--------------------------------------------> name of view to render 'allClasses' and sends viewData to view
  },

  removeAssessment(request, response) { //---------------------------------------------------------> removeAssessment method, called when ‘/ trainerDashboard’ request received
    logger.info('removing assessment rendering'); //-----------------------------------------------> logs message to console
    const memberid = request.params.memberid; //---------------------------------------------------> gets memberid (params) stores it in memberid
    const assessmentid = request.params.assessmentid; //-------------------------------------------> gets assessmentid (params) stores it in assessmentid
    logger.debug(`removing ${memberStore.firstName}'s assessment by id: ${assessmentid}`); //------> logs message to console
    memberStore.removeAssessment(memberid, assessmentid); //---------------------------------------> removes assessment (memberid, assessmentid) from memberStore
    response.redirect('/trainerDashboard'); //-----------------------------------------------------> redirects to (/trainerDashboard)
  },

  removeMember(request, response) { //-------------------------------------------------------------> removeMember method, called when ‘/ trainerDashboard’ request received
    logger.info('removing member rendering'); //---------------------------------------------------> log message to console
    const memberid = request.params.memberid; //---------------------------------------------------> gets memberid (params) stores it in memberid
    logger.debug(`removing ${memberStore.firstName} by id: ${memberid}`); //-----------------------> logs message to console
    memberStore.removeMember(memberid); //---------------------------------------------------------> remove member by memberid from memberStore
    response.redirect('/trainerDashboard'); //-----------------------------------------------------> redirects to (/trainerDashboard)
  },

  updateComment(request, response) { //------------------------------------------------------------> updateComment method, called when ‘/ trainerDashboard’ request received
    logger.info('updating comment rendering'); //--------------------------------------------------> logs message to console
    const memberid = request.params.memberid; //---------------------------------------------------> gets memberid (params) stores it in memberid
    const assessmentid = request.params.assessmentid; //-------------------------------------------> gets assessmentid (params) store it in assessmentid
    const comment = request.body.comment; //-------------------------------------------------------> gets comment data and stores it in comment
    const assessment = memberStore.getAssessmentById(memberid, assessmentid); //-------------------> gets assessment by id (memberid, assessmentid) from memberStore and stores it in assessment
    assessment.comment = comment; //---------------------------------------------------------------> comment from assessment equals new comment
    logger.debug(`saving updated comment for memberid: ${memberid}`); //---------------------------> logs message to console
    memberStore.store.save(); //-------------------------------------------------------------------> saves new results to memberStore
    response.redirect('/trainerDashboard'); //-----------------------------------------------------> redirects to (/trainerDashboard)
  },

  trainerClasses(request, response) { //-----------------------------------------------------------> trainerClasses method, called when ‘/ trainerDashboard’ request received
    logger.info('create class rendering '); //-----------------------------------------------------> logs message to console
    const loggedInTrainer = accounts.getCurrentTrainer(request); //--------------------------------> gets currentTrainer from accounts and stores it in loggedInTrainer
    const classes = classStore.getAllClasses(); //-------------------------------------------------> gets allClasses from classStore and stores it in classes
    const viewData = { //--------------------------------------------------------------------------> place model in viewData object
      trainer: loggedInTrainer, //-----------------------------------------------------------------> loggedInTrainer
      classes: classes, //-------------------------------------------------------------------------> classes
    };
    logger.debug(`create classes menu rendered for Coach ${loggedInTrainer.lastName}`); //---------> logs message to console
    response.render('trainerClasses', viewData); //------------------------------------------------> renders 'trainerClasses' and viewData to view
  },

  addClass(request, response) { //-----------------------------------------------------------------> addClass method, called when ‘/ trainerDashboard’ request received
    logger.info('add a new class rendering'); //---------------------------------------------------> logs message to console
    const loggedInTrainer = accounts.getCurrentTrainer(request); //--------------------------------> gets currentTrainer from accounts and stores it in loggedInTrainer
    const trainerid = loggedInTrainer.trainerid; //------------------------------------------------> gets id of loggedInTrainer and stores it in trainerid
    const newClass = { //--------------------------------------------------------------------------> place model in newClass object
      trainerid: trainerid, //---------------------------------------------------------------------> trainerid
      classid: uuid(), //--------------------------------------------------------------------------> unique classid
      name: request.body.name, //------------------------------------------------------------------> requests name
      description: request.body.description, //----------------------------------------------------> requests description
      duration: request.body.duration, //----------------------------------------------------------> requests duration
      capacity: Number(request.body.capacity), //--------------------------------------------------> requests capacity
      difficulty: request.body.difficulty, //------------------------------------------------------> requests difficulty
      classesWorkouts: Number(request.body.classesWorkouts), //------------------------------------> request classesWorkouts
      time: request.body.time, //------------------------------------------------------------------> requests time
      date: request.body.date, //------------------------------------------------------------------> requests date
      image: request.body.image, //----------------------------------------------------------------> requests image
      workouts: [], //-----------------------------------------------------------------------------> empty workouts array list
    };
    for (let i = 0; i < request.body.classesWorkouts; i++) { //------------------------------------> for loop
      const date = new Date(request.body.date); //-------------------------------------------------> request date as new Date and stores it in date
      const daysToAdd = (i * 7); //----------------------------------------------------------------> increments i by 7 and stores it in daysToAdd
      const workoutDate = new Date(date.setTime(date.getTime() + (daysToAdd * 86400000))); //------> sets date to new Date and stores it in workoutDate (calculates on a weekly basis for workout)
      const workout = { //-------------------------------------------------------------------------> place model in workout object
        workoutid: uuid(), //----------------------------------------------------------------------> unique workoutid
        workoutDate: workoutDate.toDateString(),//-------------------------------------------------> workoutDate (converts results to String format)
        time: request.body.time, //----------------------------------------------------------------> requests time
        duration: request.body.duration, //--------------------------------------------------------> requests duration
        currentCapacity: 0, //---------------------------------------------------------------------> currentCapacity set to 0
        capacity: Number(request.body.capacity), //------------------------------------------------> request capacity
        members: [], //----------------------------------------------------------------------------> empty members array list
      };
      newClass.workouts.push(workout); //----------------------------------------------------------> pushes workout to the end of workouts pile
    }

    logger.debug(`adding new class and workouts by ${loggedInTrainer.firstName}`); //--------------> logs message to console
    classStore.addClass(newClass); //--------------------------------------------------------------> adds new class to classStore
    response.redirect('/trainerDashboard/viewTrainerClasses'); //----------------------------------> redirects to (/trainerDashboard/viewTrainerClasses)
  },

  editClass(request, response) { //----------------------------------------------------------------> editClass method, called when ‘/ trainerDashboard’ request received
    logger.info('editing class rendering '); //----------------------------------------------------> logs message to console
    const classid = request.params.classid; //-----------------------------------------------------> gets classid (params) stores it in classid
    const newClass = classStore.getClassById(classid); //------------------------------------------> gets class by id from classStore and stores it in newClass
    newClass.name = request.body.name; //----------------------------------------------------------> request name
    newClass.description = request.body.description; //--------------------------------------------> request description
    newClass.duration = request.body.duration; //--------------------------------------------------> request duration
    newClass.capacity = request.body.capacity; //--------------------------------------------------> request capacity
    newClass.difficulty = request.body.difficulty; //----------------------------------------------> request difficulty
    newClass.classesWorkouts = Number(request.body.classesWorkouts); //----------------------------> request classesWorkouts
    newClass.image = request.body.image; //--------------------------------------------------------> request image
    newClass.time = request.body.time; //----------------------------------------------------------> request time
    newClass.date = request.body.date; //----------------------------------------------------------> request date
    logger.debug(`saving edited classid: ${classid}`); //------------------------------------------> logs message to console
    classStore.store.save(); //--------------------------------------------------------------------> saves new results to classStore
    response.redirect('/trainerDashboard/viewTrainerClasses'); //----------------------------------> redirects to ('/trainerDashboard/viewTrainerClasses)
  },

  updateClass(request, response) { //--------------------------------------------------------------> updateClass method, called when ‘/ trainerDashboard’ request received
    logger.info('updating class rendering '); //---------------------------------------------------> logs message to console
    const loggedInTrainer = accounts.getCurrentTrainer(request); //--------------------------------> gets currentTrainer from accounts and stores it in loggedInTrainer
    const classid = request.params.classid; //-----------------------------------------------------> gets classid (params) stores it in classid
    const updatedClass = classStore.getClassById(classid); //--------------------------------------> gets class by id from classStore and stores it in updatedClass
    const viewData = { //--------------------------------------------------------------------------> place model in viewData object
      updatedClass: updatedClass, //---------------------------------------------------------------> updatedClass
    };
    logger.debug(`details/update class menu rendered for Coach ${loggedInTrainer.lastName}`); //---> logs message to console
    response.render('updateClass', viewData); //---------------------------------------------------> renders 'updateClass' and viewData to view
  },

  removeClass(request, response) { //--------------------------------------------------------------> removeClass method, called when ‘/ trainerDashboard’ request received
    logger.info('removing class rendering'); //----------------------------------------------------> log message to console
    const classid = request.params.classid; // ----------------------------------------------------> gets classid (params) stores it in classid
    logger.debug(`removing classid: ${classid}`); //-----------------------------------------------> logs message to console
    classStore.removeClass(classid); //------------------------------------------------------------> remove class by classid from classStore
    response.redirect('/trainerDashboard/viewTrainerClasses'); //----------------------------------> redirects to (/trainerDashboard/viewTrainerClasses)
  },

  trainerBookings(request, response) { //----------------------------------------------------------> trainerBookings method, called when ‘/ trainerDashboard’ request received
    logger.info('trainer bookings rendering'); //--------------------------------------------------> logs message to console
    const loggedInTrainer = accounts.getCurrentTrainer(request); //--------------------------------> gets currentTrainer from accounts and stores it in loggedInTrainer
    const memberList = memberStore.getAllMembers(); //---------------------------------------------> getAllMembers from memberStore and stores it in memberList
    const bookingList = trainerStore.bookings; //--------------------------------------------------> gets bookings from trainerStore and stores it in bookingList
    const viewData = { //--------------------------------------------------------------------------> place model in viewData object
      trainer: loggedInTrainer, //-----------------------------------------------------------------> loggedInTrainer
      memberList: memberList, //-------------------------------------------------------------------> memberList
      bookingList: bookingList, //-----------------------------------------------------------------> bookingList
    };
    logger.debug(`create bookings menu rendered for Coach ${loggedInTrainer.lastName}`); //--------> logs message to console
    response.render('trainerBookings', viewData); //-----------------------------------------------> renders 'trainerBookings' and viewData to view
  },

  trainerAddBooking(request, response) { //--------------------------------------------------------> trainerAddBooking method, called when ‘/ trainerDashboard’ request received
    const loggedInTrainer = accounts.getCurrentTrainer(request); //--------------------------------> getCurrentTrainer from accounts and stores it in loggedInTrainer
    const trainerid = loggedInTrainer.trainerid; //------------------------------------------------> gets trainerid of loggedInTrainer and stores it in trainerid
    const memberid = request.body.memberid; //-----------------------------------------------------> requests memberid data and stores it in memberid
    const chosenMember = memberStore.getMemberById(memberid); //-----------------------------------> getMemberById from trainerStore stores it in chosenMember
    const newBooking = { //------------------------------------------------------------------------> place model in newBooking object
      bookingid: uuid(), //------------------------------------------------------------------------> unique id for assessment
      memberid: memberid, //-----------------------------------------------------------------------> memberid
      date: request.body.date, //------------------------------------------------------------------> requests date
      time: request.body.time, //------------------------------------------------------------------> requests time
      memberfirstname: chosenMember.firstName, //--------------------------------------------------> gets firstName from chosenMember
      memberlastname: chosenMember.lastName, //----------------------------------------------------> gets lastName from chosenMember
    };
    trainerStore.addBooking(trainerid, newBooking); //---------------------------------------------> adds booking to trainerStore
    response.redirect('/trainerDashboard'); //-----------------------------------------------------> redirects to (/trainerDashboard)
  },

  removeBooking(request, response) { //------------------------------------------------------------> removeBooking method, called when ‘/ trainerDashboard’ request received
    logger.info('removing booking rendering'); //--------------------------------------------------> logs message to console
    const bookingid = request.params.bookingid; //-------------------------------------------------> gets bookingid (params) and stores it in bookingid
    const loggedInTrainer = accounts.getCurrentTrainer(request); //--------------------------------> getCurrentTrainer from accounts and stores it in loggedInTrainer
    logger.debug(`removing bookingid: ${bookingid} from Coach ${loggedInTrainer.lastName}`); //----> logs message to console
    trainerStore.removeBooking(loggedInTrainer.trainerid, bookingid); //---------------------------> removes booking from trainerStore
    response.redirect('/trainerDashboard'); //-----------------------------------------------------> redirects to (/trainerDashboard)
  },

  //----- TODO -----//

  editBooking(request, response) { //--------------------------------------------------------------> editBooking method, called when ‘/ trainerDashboard’ request received
    logger.info('updating booking rendering'); //--------------------------------------------------> logs message to console
    const loggedInTrainer = accounts.getCurrentTrainer(request); //--------------------------------> gets currentTrainer from accounts and stores it in loggedInTrainer
    loggedInTrainer.date = request.body.date; //---------------------------------------------------> request date = date of booking of loggedInTrainer
    loggedInTrainer.time = request.body.time; //---------------------------------------------------> request time = time of booking of loggedInTrainer
    loggedInTrainer.memberfirstname = request.body.firstName; //-----------------------------------> request firstName = memberfirstname of booking of loggedInTrainer
    loggedInTrainer.memberlastname = request.body.lastName; //-------------------------------------> request lastName = memberlastname of booking of loggedInTrainer
    logger.debug(`updating booking for Coach ${loggedInTrainer.lastName}`); //---------------------> logs message to console
    trainerStore.store.save(); //------------------------------------------------------------------> saves new results to trainerStore
    response.redirect('/trainerDashboard'); //-----------------------------------------------------> redirects to (/trainerDashboard)
  },

  updateBooking(request, response) { //------------------------------------------------------------> updateBooking method, called when ‘/ trainerDashboard’ request received
    logger.info('updating booking rendering '); //-------------------------------------------------> logs message to console
    const bookingid = request.params.booking; //---------------------------------------------------> gets bookingid (params) stores it in bookingid
    const updatedBooking = trainerStore.getBookingById(bookingid); //------------------------------> gets booking by id from trainerStore and stores it in updatedBooking
    const viewData = { //--------------------------------------------------------------------------> place model in viewData object
      updatedBooking: updatedBooking, //-----------------------------------------------------------> updatedBooking
    };
    logger.debug(`updated bookingid: ${bookingid}`); //--------------------------------------------> logs message to console
    response.render('updateBooking', viewData); //-------------------------------------------------> renders 'updatedBooking' and viewData to view
  },
};

module.exports = trainerDashboard; //--------------------------------------------------------------> this is the object that is then exported:

//-----> request -> link or button pressed on page
//-----> response -> complete page rendered into browser
