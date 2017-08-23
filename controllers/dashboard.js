'use strict';

const logger = require('../utils/logger.js'); //---------------------------------------------------> imports logger
const accounts = require('./accounts.js'); //------------------------------------------------------> imports accounts
const memberStore = require('../models/member-store.js'); //---------------------------------------> imports member-store
const trainerStore = require('../models/trainer-store.js'); //-------------------------------------> imports trainer-store
const classStore = require('../models/class-store.js'); //-----------------------------------------> imports class-store
const uuid = require('uuid'); //-------------------------------------------------------------------> imports uuid
const analytics = require('../utils/analytics.js'); //---------------------------------------------> imports analytics

//---> dashboard object definition <---//

const dashboard = {
  index(request, response) { //--------------------------------------------------------------------> index method, called when ‘/ dashboard’ request received
    logger.info('dashboard rendering'); //---------------------------------------------------------> logs message to console
    const loggedInMember = accounts.getCurrentMember(request); //----------------------------------> gets currentMember from accounts and stores it in loggedInMember
    const bmi = analytics.calculateBMI(loggedInMember); //-----------------------------------------> gets calculateBMI from analytics for loggedInMember and stores it in bmi
    const idealBodyWeight = analytics.idealBodyWeight(loggedInMember); //--------------------------> gets IBW from analytics for loggedInMember and stores it in IBW
    const viewData = { //--------------------------------------------------------------------------> place model in viewData object
      title: 'Member Dashboard', //----------------------------------------------------------------> name of the title
      member: loggedInMember, //-------------------------------------------------------------------> loggedInMember
      bmi: bmi, //---------------------------------------------------------------------------------> bmi
      bmiCategory: analytics.BMICategory(bmi), //--------------------------------------------------> bmiCategory of bmi results
      idealBodyWeight: idealBodyWeight, //---------------------------------------------------------> IBW
    };
    logger.debug(`${loggedInMember.firstName} ${loggedInMember.lastName}\'s main menu page`); //---> logs message to console
    response.render('dashboard', viewData); //-----------------------------------------------------> name of view to render 'dashboard' and sends viewData to view
  },

  addAssessment(request, response) { //------------------------------------------------------------> addAssessment method, called when ‘/ dashboard’ request received
    logger.info('adding assessment rendering'); //-------------------------------------------------> logs message to console
    const loggedInMember = accounts.getCurrentMember(request); //----------------------------------> gets currentMember from accounts and stores it in loggedInMember
    const memberid = loggedInMember.memberid; //---------------------------------------------------> gets id of loggedInMember and stores it in memberId
    const newAssessment = { //---------------------------------------------------------------------> place model in newAssessment object
      assessmentid: uuid(), //---------------------------------------------------------------------> unique id for assessment
      date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''), //---------------------> new date
      weight: Number(request.body.weight), //------------------------------------------------------> weight
      chest: Number(request.body.chest), //--------------------------------------------------------> chest
      thigh: Number(request.body.thigh), //--------------------------------------------------------> thigh
      upperArm: Number(request.body.upperArm), //--------------------------------------------------> upperArm
      waist: Number(request.body.waist), //--------------------------------------------------------> waist
      hips: Number(request.body.hips), //----------------------------------------------------------> hips
      trend: '', //--------------------------------------------------------------------------------> trend
      comment: '', //------------------------------------------------------------------------------> comment
    };
    memberStore.addAssessment(memberid, newAssessment); //-----------------------------------------> adds assessment to member-store
    analytics.trend(loggedInMember); //------------------------------------------------------------> gets trend from analytics of loggedInMember
    logger.debug(`added assessment for ${loggedInMember.firstName}`); //---------------------------> logs message to console
    response.redirect('/dashboard'); //------------------------------------------------------------> redirects to (/dashboard)
  },

  removeAssessment(request, response) { //---------------------------------------------------------> removeAssessment method, called when ‘/ dashboard’ request received
    logger.info('removing assessment rendering'); //-----------------------------------------------> logs message to console
    const assessmentid = request.params.assessmentid; //-------------------------------------------> gets assessmentid (params) and stores in assessmentid
    const loggedInMember = accounts.getCurrentMember(request); //----------------------------------> getsCurrentMember from accounts and stores it in loggedInMember
    logger.debug(`removing assessmentid: ${assessmentid} from ${loggedInMember.firstName}`); //----> logs message to console
    memberStore.removeAssessment(loggedInMember.memberid, assessmentid); //------------------------> removes assessment from member-store
    response.redirect('/dashboard'); //------------------------------------------------------------> redirects to (/dashboard)
  },

  settings(request, response) { //-----------------------------------------------------------------> settings method, called when ‘/ dashboard’ request received
    logger.info('settings rendering'); //----------------------------------------------------------> logs message to console
    const loggedInMember = accounts.getCurrentMember(request); //----------------------------------> gets currentMember from accounts and stores it in loggedInMember
    const viewData = { //--------------------------------------------------------------------------> place model in viewData object
      member: loggedInMember, //-------------------------------------------------------------------> loggedInMember
    };
    logger.debug(`update profile settings menu rendered for ${loggedInMember.firstName}`); //------> logs message to console
    response.render('settings', viewData); //------------------------------------------------------> renders 'settings' and viewData to view
  },

  updateProfile(request, response) { //------------------------------------------------------------> updateProfile method, called when ‘/ dashboard’ request received
    logger.info('updating profile rendering'); //--------------------------------------------------> logs message to console
    const loggedInMember = accounts.getCurrentMember(request); //----------------------------------> gets currentMember from accounts and stores it in loggedInMember
    loggedInMember.firstName = request.body.firstName; //------------------------------------------> request firstName = firstName of loggedInMember
    loggedInMember.lastName = request.body.lastName; //--------------------------------------------> request lastName = lastName of loggedInMember
    loggedInMember.email = request.body.email; //--------------------------------------------------> request email = email of loggedInMember
    loggedInMember.password = request.body.password; //--------------------------------------------> request password = password of loggedInMember
    loggedInMember.address = request.body.address; //----------------------------------------------> request address = address of loggedInMember
    loggedInMember.gender = request.body.gender; //------------------------------------------------> request gender = gender of loggedInMember
    loggedInMember.height = Number(request.body.height); //----------------------------------------> request height = height of loggedInMember
    loggedInMember.startingWeight = Number(request.body.startingWeight); //------------------------> request startingWeight = startingWeight of loggedInMember
    loggedInMember.image = request.body.image; //--------------------------------------------------> request image = image of loggedInMember
    logger.debug(`updating profile for ${loggedInMember.firstName}`); //---------------------------> logs message to console
    memberStore.store.save(); //-------------------------------------------------------------------> saves new results to memberStore
    response.redirect('/dashboard'); //------------------------------------------------------------> redirects to (/dashboard)
  },

  viewMemberClasses(request, response) { //--------------------------------------------------------> viewMemberClasses method, called when ‘/ dashboard’ request received
    logger.info('members classes rendering'); //---------------------------------------------------> logs message to console
    const loggedInMember = accounts.getCurrentMember(request); //----------------------------------> gets currentMember from accounts and stores it in loggedInMember
    const classList = classStore.getAllClasses(); //-----------------------------------------------> gets all classes from classStore and stores it in classList
    const viewData = { //--------------------------------------------------------------------------> place model in viewData object
      member: loggedInMember, //-------------------------------------------------------------------> loggedInMember
      classList: classList, //---------------------------------------------------------------------> classList
    };
    logger.debug(`all classes rendered for ${loggedInMember.firstName}`); //-----------------------> logs message to console
    response.render('viewMemberClasses', viewData); //---------------------------------------------> renders 'viewMemberClasses' and viewData to view
  },

  //-------- TODO searchForClass --------//

  searchForClass(request, response) { //-----------------------------------------------------------> searchForClass method, called when ‘/ dashboard’ request received
    logger.info('search for class rendering'); //--------------------------------------------------> logs message to console
    const findClass = classStore.getClassByName(request.body.search); //---------------------------> getClassByName from classStore and stores it in findClass
    if (findClass) { //----------------------------------------------------------------------------> if findClass
      logger.debug(`rendered class: ${findClass.name}`); //----------------------------------------> logs message to console
      response.redirect('/viewClass'); //----------------------------------------------------------> redirects to (/viewClass)
    } else { //------------------------------------------------------------------------------------> if not findClass
      logger.debug(`rendered no class found`); //--------------------------------------------------> logs message to console
      response.redirect('/viewMemberClasses'); //--------------------------------------------------> redirects to (/viewMemberClasses)
    }
  },

  //-------- TODO viewClass --------//

  viewClass(request, response) { //----------------------------------------------------------------> viewClass method, called when ‘/ dashboard’ request received
    logger.info('class details rendering'); //-----------------------------------------------------> logs message to console
    const loggedInMember = accounts.getCurrentMember(request); //----------------------------------> gets currentMember from accounts and stores it in loggedInMember
    const currentClass = accounts.getCurrentClass(request); //-------------------------------------> getCurrentsClass from accounts and stores it in currentClass
    const viewData = { //--------------------------------------------------------------------------> place model in viewData object
      member: loggedInMember, //-------------------------------------------------------------------> loggedInMember
      currentclass: currentClass, //---------------------------------------------------------------> currentClass
    };
    logger.debug(`rendered class for ${loggedInMember.firstName}`); //-----------------------------> logs message to console
    response.render('viewClass', viewData); //-----------------------------------------------------> renders 'viewClass' and viewData to view
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

  memberBookings(request, response) { //-----------------------------------------------------------> memberBookings method, called when ‘/ dashboard’ request received
    logger.info('members bookings rendering'); //--------------------------------------------------> logs message to console
    const loggedInMember = accounts.getCurrentMember(request); //----------------------------------> gets currentMember from accounts and stores it in member
    const trainerList = trainerStore.getAllTrainers(); //------------------------------------------> getsAllTrainers from trainerStore and stores it in trainerList
    const bookingList = memberStore.bookings; //---------------------------------------------------> gets bookings from memberStore and stores it in bookingList
    const viewData = { //--------------------------------------------------------------------------> place model in viewData object
      member: loggedInMember, //-------------------------------------------------------------------> loggedInMember
      trainerList: trainerList, //-----------------------------------------------------------------> trainerList
      bookingList: bookingList, //-----------------------------------------------------------------> bookingList
    };
    logger.debug(`create bookings menu rendered for ${loggedInMember.firstName}`); //--------------> logs message to console
    response.render('memberBookings', viewData); //------------------------------------------------> renders 'memberBookings' and viewData to view
  },

  memberAddBooking(request, response) { //---------------------------------------------------------> memberAddBooking method, called when ‘/ dashboard’ request received
    const loggedInMember = accounts.getCurrentMember(request); //----------------------------------> getCurrentMember from accounts and stores it in loggedInMember
    const memberid = loggedInMember.memberid; //---------------------------------------------------> gets id of loggedInMember and stores it in memberId
    const trainerid = request.body.trainerid; //---------------------------------------------------> requests trainerid data and stores it in trainerid
    const chosenTrainer = trainerStore.getTrainerById(trainerid); //-------------------------------> getTrainerById from trainerStore stores it in chosenTrainer
    const newBooking = { //------------------------------------------------------------------------> place model in newBooking object
      bookingid: uuid(), //------------------------------------------------------------------------> unique id for assessment
      trainerid: trainerid, //---------------------------------------------------------------------> trainerid
      date: request.body.date, //------------------------------------------------------------------> requests date
      time: request.body.time, //------------------------------------------------------------------> requests time
      trainerlastname: chosenTrainer.lastName, //--------------------------------------------------> gets lastName from chosenTrainer
    };
    logger.debug(`added new booking for ${loggedInMember.firstName}`); //--------------------------> logs message to console
    memberStore.addBooking(memberid, newBooking); //-----------------------------------------------> adds booking to memberStore
    response.redirect('/dashboard'); //------------------------------------------------------------> redirects to (/dashboard)
  },

  removeBooking(request, response) { //------------------------------------------------------------> removeBooking method, called when ‘/ dashboard’ request received
    logger.info('removing booking rendering'); //--------------------------------------------------> logs message to console
    const bookingid = request.params.bookingid; //-------------------------------------------------> gets bookingid (params) and stores it in bookingid
    const loggedInMember = accounts.getCurrentMember(request); //----------------------------------> getsCurrentMember from accounts and stores it in loggedInMember
    logger.debug(`removing bookingid: ${bookingid} from ${loggedInMember.firstName}`); //----------> logs message to console
    memberStore.removeBooking(loggedInMember.memberid, bookingid); //------------------------------> removes booking from memberStore
    response.redirect('/dashboard'); //------------------------------------------------------------> redirects to (/dashboard)
  },

  //-------- TODO editBooking --------//

  editBooking(request, response) { //--------------------------------------------------------------> editBooking method, called when ‘/ dashboard’ request received
    logger.info('updating booking rendering'); //--------------------------------------------------> logs message to console
    const loggedInMember = accounts.getCurrentMember(request); //----------------------------------> gets currentMember from accounts and stores it in loggedInMember
    loggedInMember.date = request.body.date; //----------------------------------------------------> request date = date of booking of loggedInMember
    loggedInMember.time = request.body.time; //----------------------------------------------------> request time = time of booking of loggedInMember
    loggedInMember.trainerlastname = request.body.lastName; //-------------------------------------> request lastName = trainerlastname of booking of loggedInMember
    logger.debug(`updating booking for ${loggedInMember.firstName}`); //---------------------------> logs message to console
    memberStore.store.save(); //-------------------------------------------------------------------> saves new results to memberStore
    response.redirect('/dashboard'); //------------------------------------------------------------> redirects to (/dashboard)
  },

  //-------- TODO updateBooking --------//

  updateBooking(request, response) { //------------------------------------------------------------> updateBooking method, called when ‘/ dashboard’ request received
    logger.info('updating booking rendering '); //-------------------------------------------------> logs message to console
    const bookingid = request.params.bookingid; //-------------------------------------------------> gets bookingid (params) stores it in bookingid
    const updatedBooking = memberStore.getBookingById(bookingid); //-------------------------------> gets booking by id from memberStore and stores it in updatedBooking
    const viewData = { //--------------------------------------------------------------------------> place model in viewData object
      updatedBooking: updatedBooking, //-----------------------------------------------------------> updatedBooking
    };
    logger.debug(`updated bookingid: ${bookingid}`); //--------------------------------------------> logs message to console
    response.render('updateBooking', viewData); //-------------------------------------------------> renders 'updatedBooking' and viewData to view
  },
};

module.exports = dashboard; //---------------------------------------------------------------------> this is the object that is then exported:

//-----> request -> link or button pressed on page
//-----> response -> complete page rendered into browser
