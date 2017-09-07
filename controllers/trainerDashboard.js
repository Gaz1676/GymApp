/**
 * Author: Gary Fleming
 * Student No: 20019497
 * Start Date: Aug 1st 2017
 */

'use strict';

const logger = require('../utils/logger'); //------------------------------------------------------> imports logger
const accounts = require('./accounts.js'); //------------------------------------------------------> imports accounts
const uuid = require('uuid'); //-------------------------------------------------------------------> import uuid
const memberStore = require('../models/member-store.js'); //---------------------------------------> imports member-store
const trainerStore = require('../models/trainer-store.js'); //-------------------------------------> imports trainer-store
const classStore = require('../models/class-store.js'); //-----------------------------------------> imports class-store
const analytics = require('../utils/analytics.js'); //---------------------------------------------> imports analytics

//---> trainerdashboard object definition <---//

const trainerDashboard = {
  index(request, response) { //--------------------------------------------------------------------> index method, called when ‘/ trainerDashboard’ request received
    logger.info('trainer dashboard rendering'); //-------------------------------------------------> log message to console
    const loggedInTrainer = accounts.getCurrentTrainer(request); //--------------------------------> finds which trainer is currently logged in
    const members = memberStore.getAllMembers(); //------------------------------------------------> get all members from memberStore and store them in memberList
    const viewData = { //--------------------------------------------------------------------------> place model in viewData object
      title: 'Trainer Dashboard', //---------------------------------------------------------------> name of the title
      trainer: loggedInTrainer, //-----------------------------------------------------------------> logged in trainer
      members: members, //-------------------------------------------------------------------------> members
    };
    logger.debug(`Coach ${loggedInTrainer.lastName} main menu page`); //---------------------------> logs message to console
    response.render('trainerDashboard', viewData); //----------------------------------------------> renders 'trainerDashboard' and viewData to view
  },

  trainerViewAssessments(request, response) { //---------------------------------------------------> trainerViewAssessments method, called when ‘/ trainerDashboard’ request received
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
    logger.debug(`view ${member.firstName} ${member.lastName}'s assessments`); //------------------> logs message to console
    response.render('trainerViewAssessments', viewData); //----------------------------------------> renders 'trainerViewAssessments' and viewData to view
  },

  viewTrainerClasses(request, response) { //-------------------------------------------------------> viewTrainerClasses method, called when ‘/ trainerDashboard’ request received
    logger.info('view trainer classes rendering'); //----------------------------------------------> log message to console
    const loggedInTrainer = accounts.getCurrentTrainer(request); //--------------------------------> gets current trainer from accounts and stores it in loggedInTrainer
    const classes = classStore.getAllClasses(); //-------------------------------------------------> gets all classes from classStore and stores it in classList
    const viewData = { //--------------------------------------------------------------------------> place model in viewData object
      title: 'Trainer Classes', //-----------------------------------------------------------------> name of title
      trainer: loggedInTrainer, //-----------------------------------------------------------------> loggedInTrainer
      classes: classes, //-------------------------------------------------------------------------> classes
    };
    logger.debug(`all classes rendered for Coach ${loggedInTrainer.lastName}`); //-----------------> logs message to console
    response.render('viewTrainerClasses', viewData); //--------------------------------------------> name of view to render 'allClasses' and sends viewData to view
  },

  removeAssessment(request, response) { //---------------------------------------------------------> removeAssessment method, called when ‘/ trainerDashboard’ request received
    logger.info('remove assessment rendering'); //-------------------------------------------------> logs message to console
    const memberid = request.params.memberid; //---------------------------------------------------> gets memberid (params) stores it in memberid
    const assessmentid = request.params.assessmentid; //-------------------------------------------> gets assessmentid (params) stores it in assessmentid
    logger.debug(`removing ${memberStore.firstName}'s assessment by id: ${assessmentid}`); //------> logs message to console
    memberStore.removeAssessment(memberid, assessmentid); //---------------------------------------> removes assessment (memberid, assessmentid) from memberStore
    response.redirect('/trainerDashboard'); //-----------------------------------------------------> redirects to (/trainerDashboard)
  },

  removeMember(request, response) { //-------------------------------------------------------------> removeMember method, called when ‘/ trainerDashboard’ request received
    logger.info('removing member rendering'); //---------------------------------------------------> log message to console
    const memberid = request.params.memberid; //---------------------------------------------------> gets memberid (params) stores it in memberid
    logger.debug(`removing ${memberStore.firstName} by member id: ${memberid}`); //----------------> logs message to console
    memberStore.removeMember(memberid); //---------------------------------------------------------> remove member by memberid from memberStore
    response.redirect('/trainerDashboard'); //-----------------------------------------------------> redirects to (/trainerDashboard)
  },

  updateComment(request, response) { //------------------------------------------------------------> updateComment method, called when ‘/ trainerDashboard’ request received
    logger.info('update comment rendering'); //----------------------------------------------------> logs message to console
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
    const date = new Date(request.body.date);
    const newClass = { //--------------------------------------------------------------------------> place model in newClass object
      trainerid: loggedInTrainer.trainerid, //-----------------------------------------------------> trainerid
      classid: uuid(), //--------------------------------------------------------------------------> unique classid
      name: request.body.name, //------------------------------------------------------------------> requests name
      capacity: Number(request.body.capacity), //--------------------------------------------------> requests capacity
      difficulty: request.body.difficulty, //------------------------------------------------------> requests difficulty
      noOfWorkouts: Number(request.body.noOfWorkouts), //------------------------------------------> request noOfWorkouts
      duration: Number(request.body.duration), //--------------------------------------------------> requests duration
      date: date.toDateString(), //----------------------------------------------------------------> requests date
      time: request.body.time, //------------------------------------------------------------------> request time
      workouts: [], //-----------------------------------------------------------------------------> empty workouts array list
    };
    for (let i = 0; i < request.body.noOfWorkouts; i++) { //---------------------------------------> for loop
      const date = new Date(request.body.date); //-------------------------------------------------> request date as new Date and stores it in date
      const nextDate = (i * 7); //-----------------------------------------------------------------> increments i by 7 and stores it in sequence
      const workoutDate = new Date(date.setTime(date.getTime() + (nextDate * 86400000))); //-------> sets date to new Date and stores it in workoutDate (calculates on a weekly basis for workout)
      const workout = { //-------------------------------------------------------------------------> place model in workout object
        workoutid: uuid(), //----------------------------------------------------------------------> unique workoutid
        workoutDate: workoutDate.toDateString(),//-------------------------------------------------> workoutDate (converts results to String format)
        currentCapacity: 0, //---------------------------------------------------------------------> currentCapacity set to 0
        capacity: Number(request.body.capacity), //------------------------------------------------> request capacity
        members: [], //----------------------------------------------------------------------------> empty members array list
      };
      newClass.workouts.push(workout); //----------------------------------------------------------> pushes workout to the end of workouts pile
    }

    const classes = classStore.getAllClasses(); //-------------------------------------------------> getAllClasses from classStore stores it in classes
    let notCreated = true; //----------------------------------------------------------------------> set boolean true as notCreated
    for (let i = 0; i < classes.length; i++) { //--------------------------------------------------> for loop
      if ((newClass.date === classes[i].date) && (newClass.time === classes[i].time)) { //---------> if time/date are equal to newClass
        notCreated = false; //---------------------------------------------------------------------> boolean changes to false
        break; //----------------------------------------------------------------------------------> breaks the loop
      }
    }

    if (notCreated) { //---------------------------------------------------------------------------> if true
      logger.debug(`adding new class for Coach ${loggedInTrainer.lastName} to the store`); //------> logs message to console
      classStore.addClass(newClass); //------------------------------------------------------------> adds Class to classStore
      response.redirect('/trainerDashboard/viewTrainerClasses'); //--------------------------------> redirects to (/trainerDashboard/viewTrainerClasses)
    } else { //------------------------------------------------------------------------------------> else
      logger.debug(`class already made for Coach ${loggedInTrainer.lastName}`); //-----------------> logs message to console
      response.redirect('/trainerDashboard/trainerClasses'); //------------------------------------> redirects to (/trainerDashboard/trainerClasses)
    }
  },

  trainerEditTime(request, response) { //----------------------------------------------------------> trainerEditTime method, called when '/ trainerDashboard request received
    logger.info('editing time rendering '); //-----------------------------------------------------> logs message to console
    const classid = request.params.classid; //-----------------------------------------------------> gets classid (params) stores it in classid
    const newClass = classStore.getClassById(classid); //------------------------------------------> gets class by id from classStore and stores it in newClass
    newClass.time = request.body.time; //----------------------------------------------------------> request time
    logger.debug(`saving edited time for classid: ${classid}`); //---------------------------------> logs message to console
    classStore.store.save(); //--------------------------------------------------------------------> saves new results to classStore
    response.redirect('/trainerDashboard/viewTrainerClasses'); //----------------------------------> redirects to ('/trainerDashboard/viewTrainerClasses)
  },

  trainerEditDuration(request, response) { //------------------------------------------------------> trainerEditDuration method, called when '/ trainerDashboard request received
    logger.info('editing duration rendering '); //-------------------------------------------------> logs message to console
    const classid = request.params.classid; //-----------------------------------------------------> gets classid (params) stores it in classid
    const newClass = classStore.getClassById(classid); //------------------------------------------> gets class by id from classStore and stores it in newClass
    newClass.duration = Number(request.body.duration); //------------------------------------------> request duration
    logger.debug(`saving edited duration for classid: ${classid}`); //-----------------------------> logs message to console
    classStore.store.save(); //--------------------------------------------------------------------> saves new results to classStore
    response.redirect('/trainerDashboard/viewTrainerClasses'); //----------------------------------> redirects to ('/trainerDashboard/viewTrainerClasses)
  },

  trainerEditDifficulty(request, response) { //----------------------------------------------------> trainerEditDifficulty method, called when '/ trainerDashboard request received
    logger.info('editing difficulty rendering '); //-----------------------------------------------> logs message to console
    const classid = request.params.classid; //-----------------------------------------------------> gets classid (params) stores it in classid
    const newClass = classStore.getClassById(classid); //------------------------------------------> gets class by id from classStore and stores it in newClass
    newClass.difficulty = request.body.difficulty; //----------------------------------------------> request difficulty
    logger.debug(`saving edited difficulty for classid: ${classid}`); //---------------------------> logs message to console
    classStore.store.save(); //--------------------------------------------------------------------> saves new results to classStore
    response.redirect('/trainerDashboard/viewTrainerClasses'); //----------------------------------> redirects to ('/trainerDashboard/viewTrainerClasses)
  },

  trainerEditCapacity(request, response) { //------------------------------------------------------> trainerEditCapacity method, called when '/ trainerDashboard request received
    logger.info('editing difficulty rendering '); //-----------------------------------------------> logs message to console
    const classid = request.params.classid; //-----------------------------------------------------> gets classid (params) stores it in classid
    const newClass = classStore.getClassById(classid); //------------------------------------------> gets class by id from classStore and stores it in newClass
    newClass.capacity = Number(request.body.capacity); //------------------------------------------> request capacity
    logger.debug(`saving edited capacity for classid: ${classid}`); //-----------------------------> logs message to console
    classStore.store.save(); //--------------------------------------------------------------------> saves new results to classStore
    response.redirect('/trainerDashboard/viewTrainerClasses'); //----------------------------------> redirects to ('/trainerDashboard/viewTrainerClasses)
  },

  trainerUpdateClass(request, response) { //-------------------------------------------------------> trainerUpdateClass method, called when ‘/ trainerDashboard’ request received
    logger.info('updating class rendering '); //---------------------------------------------------> logs message to console
    const loggedInTrainer = accounts.getCurrentTrainer(request); //--------------------------------> gets currentTrainer from accounts and stores it in loggedInTrainer
    const classid = request.params.classid; //-----------------------------------------------------> gets classid (params) stores it in classid
    const classToUpdate = classStore.getClassById(classid); //-------------------------------------> gets class by id from classStore and stores it in classToUpdate
    const viewData = { //--------------------------------------------------------------------------> place model in viewData object
      classToUpdate: classToUpdate, //-------------------------------------------------------------> classToUpdate
    };
    logger.debug(`details/update class menu rendered for Coach ${loggedInTrainer.lastName}`); //---> logs message to console
    response.render('trainerUpdateClass', viewData); //--------------------------------------------> renders 'trainerUpdateClass' and viewData to view
  },

  removeClass(request, response) { //--------------------------------------------------------------> removeClass method, called when ‘/ trainerDashboard’ request received
    logger.info('remove class rendering'); //------------------------------------------------------> log message to console
    const classid = request.params.classid; // ----------------------------------------------------> gets classid (params) stores it in classid
    logger.debug(`removing classid: ${classid}`); //-----------------------------------------------> logs message to console
    classStore.removeClass(classid); //------------------------------------------------------------> remove class by classid from classStore
    response.redirect('/trainerDashboard/viewTrainerClasses'); //----------------------------------> redirects to (/trainerDashboard/viewTrainerClasses)
  },

  trainerBookings(request, response) { //----------------------------------------------------------> trainerBookings method, called when ‘/ trainerDashboard’ request received
    logger.info('trainer bookings rendering'); //--------------------------------------------------> logs message to console
    const loggedInTrainer = accounts.getCurrentTrainer(request); //--------------------------------> gets currentTrainer from accounts and stores it in loggedInTrainer
    const members = memberStore.getAllMembers(); //------------------------------------------------> getAllMembers from memberStore and stores it in memberList
    const bookings = loggedInTrainer.bookings; //--------------------------------------------------> gets bookings from trainerStore and stores it in bookingList
    const viewData = { //--------------------------------------------------------------------------> place model in viewData object
      trainer: loggedInTrainer, //-----------------------------------------------------------------> loggedInTrainer
      members: members, //-------------------------------------------------------------------------> members
      bookings: bookings, //-----------------------------------------------------------------------> bookings
    };
    logger.debug(`create bookings menu rendered for Coach ${loggedInTrainer.lastName}`); //--------> logs message to console
    response.render('trainerBookings', viewData); //-----------------------------------------------> renders 'trainerBookings' and viewData to view
  },

  trainerAddBooking(request, response) { //--------------------------------------------------------> trainerAddBooking method, called when ‘/ trainerDashboard’ request received
    logger.info('trainer add booking rendering'); //-----------------------------------------------> logs message to console
    const loggedInTrainer = accounts.getCurrentTrainer(request); //--------------------------------> getCurrentTrainer from accounts and stores it in loggedInTrainer
    const trainerid = loggedInTrainer.trainerid; //------------------------------------------------> gets trainerid of loggedInTrainer and stores it in trainerid
    const memberid = request.body.memberid; //-----------------------------------------------------> requests memberid data and stores it in memberid
    const member = memberStore.getMemberById(memberid); //-----------------------------------------> getMemberById from memberStore stores it in member
    const date = new Date(request.body.date); //---------------------------------------------------> request date as new Date and stores it in date
    const newBooking = { //------------------------------------------------------------------------> place model in newBooking object
      bookingid: uuid(), //------------------------------------------------------------------------> unique id for assessment
      memberid: memberid, //-----------------------------------------------------------------------> memberid
      trainerid: trainerid, //---------------------------------------------------------------------> trainerid
      date: date.toDateString(), //----------------------------------------------------------------> requests date
      time: request.body.time, //------------------------------------------------------------------> requests time
      memberfirstname: member.firstName, //--------------------------------------------------------> gets firstName from member and stores it in memberfirstname
      memberlastname: member.lastName, //----------------------------------------------------------> gets lastName from member and stores it in memberlastname
      coachlastname: loggedInTrainer.lastName, //--------------------------------------------------> lastName of loggedInTrainer stored in coachlastname
    };

    const bookings = memberStore.getAllMemberBookings(memberid); //--------------------------------> getAllMemberBookings from memberStore stores it in bookings
    let notBooked = true; //-----------------------------------------------------------------------> sets boolean true to notBooked
    for (let i = 0; i < bookings.length; i++) { //-------------------------------------------------> for loop
      if ((newBooking.time === bookings[i].time) && (newBooking.date === bookings[i].date)) { //---> if time/date is equal to newBooking time/date
        notBooked = false; //----------------------------------------------------------------------> boolean changes to false
        break; //----------------------------------------------------------------------------------> breaks the loop
      }
    }

    if (notBooked) { //----------------------------------------------------------------------------> if true
      logger.debug(`adding new booking for Coach ${loggedInTrainer.lastName} to the store`); //----> logs message to console
      memberStore.addBooking(memberid, newBooking); //---------------------------------------------> adds booking to memberStore
      trainerStore.addBooking(trainerid, newBooking); //-------------------------------------------> adds booking to trainerStore
      response.redirect('/trainerDashboard/trainerBookings'); //-----------------------------------> redirects to (/trainerDashboard/trainerBookings)
    } else { //------------------------------------------------------------------------------------> else
      logger.debug(`booking already made for ${member.firstName} ${member.lastName}`); //----------> logs message to console
      response.redirect('/trainerDashboard/trainerBookings'); //-----------------------------------> redirects to (/trainerDashboard/trainerBookings)
    }
  },

  removeBooking(request, response) { //------------------------------------------------------------> removeBooking method, called when ‘/ trainerDashboard’ request received
    logger.info('remove booking rendering'); //----------------------------------------------------> logs message to console
    const loggedInTrainer = accounts.getCurrentTrainer(request); //--------------------------------> getCurrentTrainer from accounts and stores it in loggedInTrainer
    const bookingid = request.params.bookingid; //-------------------------------------------------> gets bookingid (params) and stores it in bookingid
    const memberid = request.params.memberid; //---------------------------------------------------> gets memberid (params) and stores it in memberid
    logger.debug(`removing bookingid: ${bookingid} from Coach ${loggedInTrainer.lastName}`); //----> logs message to console
    trainerStore.removeBooking(loggedInTrainer.trainerid, bookingid); //---------------------------> removes booking from trainerStore
    memberStore.removeBooking(memberid, bookingid); //---------------------------------------------> removes booking from memberStore
    response.redirect('/trainerDashboard/trainerBookings'); //-------------------------------------> redirects to (/trainerDashboard/trainerBookings)
  },

  trainerEditBooking(request, response) { //-------------------------------------------------------> trainerEditBooking method, called when ‘/ trainerDashboard’ request received
    logger.info('updating booking rendering'); //--------------------------------------------------> logs message to console
    const loggedInTrainer = accounts.getCurrentTrainer(request); //--------------------------------> gets currentTrainer from accounts and stores it in loggedInTrainer
    const bookingid = request.params.bookingid; //-------------------------------------------------> gets bookingid (params) and stores it in bookingid
    const bookingToUpdate = trainerStore.getBookingById(loggedInTrainer.trainerid, bookingid); //--> gets booking by id from trainerStore and stores it in bookingToUpdate
    const date = new Date(request.body.date); //---------------------------------------------------> request date as new Date and stores it in date
    bookingToUpdate.time = request.body.time; //---------------------------------------------------> time
    bookingToUpdate.date = date.toDateString(); //-------------------------------------------------> date
    logger.debug(`updating booking for Coach ${loggedInTrainer.lastName}`); //---------------------> logs message to console
    trainerStore.store.save(); //------------------------------------------------------------------> saves new results to trainerStore
    response.redirect('/trainerDashboard/trainerBookings'); //-------------------------------------> redirects to (/trainerDashboard/trainerBookings)
  },

  trainerUpdateBooking(request, response) { //-----------------------------------------------------> trainerUpdateBooking method, called when ‘/ trainerDashboard’ request received
    logger.info('update booking rendering '); //---------------------------------------------------> logs message to console
    const loggedInTrainer = accounts.getCurrentTrainer(request); //--------------------------------> gets currentTrainer from accounts and stores it in loggedInTrainer
    const bookingid = request.params.bookingid; //-------------------------------------------------> gets bookingid (params) stores it in bookingid
    const bookingToUpdate = trainerStore.getBookingById(loggedInTrainer.trainerid, bookingid); //--> gets booking by id from trainerStore and stores it in bookingToUpdate
    const members = memberStore.getAllMembers(); //------------------------------------------------> getAllMembers from memberStore and stores it in memberList
    const viewData = { //--------------------------------------------------------------------------> place model in viewData object
      bookingToUpdate: bookingToUpdate, //---------------------------------------------------------> bookingToUpdate
      members: members, //-------------------------------------------------------------------------> members
    };
    logger.debug(`updating bookingid: ${bookingid} page rendered`); //-----------------------------> logs message to console
    response.render('trainerUpdateBooking', viewData); //------------------------------------------> renders 'trainerUpdateBooking' and viewData to view
  },

  trainerGoals(request, response) { //-------------------------------------------------------------> memberGoals method, called when ‘/ dashboard’ request received
    logger.info('members goals rendering'); //-----------------------------------------------------> logs message to console
    const loggedInTrainer = accounts.getCurrentTrainer(request); //--------------------------------> gets currentMember from accounts and stores it in loggedInMember
    const members = memberStore.getAllMembers(); //------------------------------------------------> getsAllTrainers from trainerStore and stores it in trainerList
    const goals = loggedInTrainer.goals; //--------------------------------------------------------> gets goals from loggedInMember and stores it in goals
    const viewData = { //--------------------------------------------------------------------------> place model in viewData object
      trainer: loggedInTrainer, //-----------------------------------------------------------------> loggedInMember
      members: members, //-------------------------------------------------------------------------> trainers
      goals: goals, //-----------------------------------------------------------------------------> goals
    };
    logger.debug(`create goals menu rendered for ${loggedInTrainer.lastName}`); //-----------------> logs message to console
    response.render('trainerGoals', viewData); //--------------------------------------------------> renders 'memberBookings' and viewData to view
  },

  trainerAddGoal(request, response) { //-----------------------------------------------------------> trainerAddBooking method, called when ‘/ trainerDashboard’ request received
    logger.info('trainer add goals rendering'); //-------------------------------------------------> logs message to console
    const loggedInTrainer = accounts.getCurrentTrainer(request); //--------------------------------> getCurrentTrainer from accounts and stores it in loggedInTrainer
    const trainerid = loggedInTrainer.trainerid; //------------------------------------------------> gets trainerid of loggedInTrainer and stores it in trainerid
    const memberid = request.body.memberid; //-----------------------------------------------------> requests memberid data and stores it in memberid
    const member = memberStore.getMemberById(memberid); //-----------------------------------------> getMemberById from memberStore stores it in member
    const date = new Date(request.body.date); //---------------------------------------------------> request date as new Date and stores it in date
    const newGoal = { //---------------------------------------------------------------------------> place model in newBooking object
      goalid: uuid(), //---------------------------------------------------------------------------> unique id for assessment
      memberid: memberid, //-----------------------------------------------------------------------> memberid
      trainerid: trainerid, //---------------------------------------------------------------------> trainerid
      memberfirstname: member.firstName, //--------------------------------------------------------> gets firstName from member and stores it in memberfirstname
      memberlastname: member.lastName, //----------------------------------------------------------> gets lastName from member and stores it in memberlastname
      coachlastname: loggedInTrainer.lastName, //--------------------------------------------------> lastName of loggedInTrainer stored in coachlastname
      date: date.toDateString(), //----------------------------------------------------------------> requests date
      area: request.body.area, //------------------------------------------------------------------> request area
      goal: Number(request.body.goal), //----------------------------------------------------------> request goal
      description: request.body.description, //----------------------------------------------------> request description
      status: 'open', //---------------------------------------------------------------------------> status set to open
    };

    const goals = memberStore.getAllMemberGoals(memberid); //--------------------------------------> getAllMemberBookings from memberStore stores it in bookings
    let noGoals = true; //-------------------------------------------------------------------------> sets boolean true to notBooked
    for (let i = 0; i < goals.length; i++) { //----------------------------------------------------> for loop
      if ((newGoal.time === goals[i].time) && (newGoal.date === goals[i].date)) { //---------------> if time/date is equal to newBooking time/date
        noGoals = false; //------------------------------------------------------------------------> boolean changes to false
        break; //----------------------------------------------------------------------------------> breaks the loop
      }
    }

    if (noGoals) { //------------------------------------------------------------------------------> if true
      logger.debug(`adding new goals for Coach ${loggedInTrainer.lastName} to the store`); //------> logs message to console
      memberStore.addGoal(memberid, newGoal); //---------------------------------------------------> adds booking to memberStore
      trainerStore.addGoal(trainerid, newGoal); //-------------------------------------------------> adds booking to trainerStore
      response.redirect('/trainerDashboard/trainerGoals'); //--------------------------------------> redirects to (/trainerDashboard/trainerBookings)
    } else { //------------------------------------------------------------------------------------> else
      logger.debug(`goal already made for ${member.firstName} ${member.lastName}`); //-------------> logs message to console
      response.redirect('/trainerDashboard/trainerGoals'); //--------------------------------------> redirects to (/trainerDashboard/trainerBookings)
    }
  },

  removeGoal(request, response) { //---------------------------------------------------------------> removeGoal method, called when ‘/ dashboard’ request received
    logger.info('removing goal rendering'); //-----------------------------------------------------> logs message to console
    const goalid = request.params.goalid; //-------------------------------------------------------> gets goalid (params) and stores in goalid
    const loggedInTrainer = accounts.getCurrentTrainer(request); //--------------------------------> getsCurrentMember from accounts and stores it in loggedInMember
    logger.debug(`removing goalid: ${goalid} from ${loggedInTrainer.lastName}`); //----------------> logs message to console
    trainerStore.removeGoal(loggedInTrainer.trainerid, goalid); //---------------------------------> removes goal from member-store
    response.redirect('/trainerDashboard/trainerGoals'); //----------------------------------------> redirects to (/dashboard/memberGoals)
  },

  editTargetDate(request, response) { //-----------------------------------------------------------> editTargetDate method, called when ‘/ trainerDashboard’ request received
    logger.info('updating class rendering '); //---------------------------------------------------> logs message to console
    const loggedInTrainer = accounts.getCurrentTrainer(request); //--------------------------------> gets currentTrainer from accounts and stores it in loggedInTrainer
    const goalid = request.params.goalid; //-------------------------------------------------------> gets goalid (params) stores it in goalid
    const goalToUpdate = trainerStore.getGoalById(loggedInTrainer.trainerid, goalid); //-----------> gets goal by id from trainerStore and stores it in goalToUpdate
    const date = new Date(request.body.date); //---------------------------------------------------> request date as new Date and stores it in date
    goalToUpdate.date = date.toDateString(); //----------------------------------------------------> date
    logger.debug(`updating goal for Coach ${loggedInTrainer.lastName}`); //------------------------> logs message to console
    trainerStore.store.save(); //------------------------------------------------------------------> saves new results to trainerStore
    response.redirect('/trainerDashboard/trainerGoals'); //----------------------------------------> redirects to (/trainerDashboard/trainerGoals)
  },

  editTargetArea(request, response) { //-----------------------------------------------------------> editTargetArea method, called when ‘/ trainerDashboard’ request received
    logger.info('updating class rendering '); //---------------------------------------------------> logs message to console
    const loggedInTrainer = accounts.getCurrentTrainer(request); //--------------------------------> gets currentTrainer from accounts and stores it in loggedInTrainer
    const goalid = request.params.goalid; //-------------------------------------------------------> gets goalid (params) stores it in goalid
    const goalToUpdate = trainerStore.getGoalById(loggedInTrainer.trainerid, goalid); //-----------> gets goal by id from trainerStore and stores it in goalToUpdate
    goalToUpdate.area = request.body.area; //------------------------------------------------------> request area
    logger.debug(`updating goal for Coach ${loggedInTrainer.lastName}`); //------------------------> logs message to console
    trainerStore.store.save(); //------------------------------------------------------------------> saves new results to trainerStore
    response.redirect('/trainerDashboard/trainerGoals'); //----------------------------------------> redirects to (/trainerDashboard/trainerGoals)
  },

  editTargetGoal(request, response) { //-----------------------------------------------------------> editTargetGoal method, called when ‘/ trainerDashboard’ request received
    logger.info('updating class rendering '); //---------------------------------------------------> logs message to console
    const loggedInTrainer = accounts.getCurrentTrainer(request); //--------------------------------> gets currentTrainer from accounts and stores it in loggedInTrainer
    const goalid = request.params.goalid; //-------------------------------------------------------> gets goalid (params) stores it in goalid
    const goalToUpdate = trainerStore.getGoalById(loggedInTrainer.trainerid, goalid); //-----------> gets goal by id from trainerStore and stores it in goalToUpdate
    goalToUpdate.goal = request.body.goal; //------------------------------------------------------> request goal
    logger.debug(`updating goal for Coach ${loggedInTrainer.lastName}`); //------------------------> logs message to console
    trainerStore.store.save(); //------------------------------------------------------------------> saves new results to trainerStore
    response.redirect('/trainerDashboard/trainerGoals'); //----------------------------------------> redirects to (/trainerDashboard/trainerGoals)
  },

  editDescription(request, response) { //----------------------------------------------------------> editDescription method, called when ‘/ trainerDashboard’ request received
    logger.info('updating class rendering '); //---------------------------------------------------> logs message to console
    const loggedInTrainer = accounts.getCurrentTrainer(request); //--------------------------------> gets currentTrainer from accounts and stores it in loggedInTrainer
    const goalid = request.params.goalid; //-------------------------------------------------------> gets goalid (params) stores it in goalid
    const goalToUpdate = trainerStore.getGoalById(loggedInTrainer.trainerid, goalid); //-----------> gets goal by id from trainerStore and stores it in goalToUpdate
    goalToUpdate.description = request.body.description; //----------------------------------------> request description
    logger.debug(`updating description for Coach ${loggedInTrainer.lastName}`); //-----------------> logs message to console
    trainerStore.store.save(); //------------------------------------------------------------------> saves new results to trainerStore
    response.redirect('/trainerDashboard/trainerGoals'); //----------------------------------------> redirects to (/trainerDashboard/trainerGoals)
  },

  trainerUpdateGoal(request, response) { //--------------------------------------------------------> trainerUpdateGoal method, called when ‘/ trainerDashboard’ request received
    logger.info('update booking rendering '); //---------------------------------------------------> logs message to console
    const loggedInTrainer = accounts.getCurrentTrainer(request); //--------------------------------> gets currentTrainer from accounts and stores it in loggedInTrainer
    const goalid = request.params.goalid; //-------------------------------------------------------> gets goalid (params) stores it in goalid
    const goalToUpdate = trainerStore.getGoalById(loggedInTrainer.trainerid, goalid); //-----------> gets goal by id from trainerStore and stores it in goalToUpdate
    const members = memberStore.getAllMembers(); //------------------------------------------------> getAllMembers from memberStore and stores it in memberList
    const viewData = { //--------------------------------------------------------------------------> place model in viewData object
      goalToUpdate: goalToUpdate, //---------------------------------------------------------------> goalToUpdate
      members: members, //-------------------------------------------------------------------------> members
    };
    logger.debug(`updating goalid: ${goalid} page rendered`); //-----------------------------------> logs message to console
    response.render('trainerUpdateGoal', viewData); //---------------------------------------------> renders 'trainerUpdateBooking' and viewData to view
  },
};

module.exports = trainerDashboard; //--------------------------------------------------------------> this is the object that is then exported:

//-----> request -> link or button pressed on page
//-----> response -> complete page rendered into browser