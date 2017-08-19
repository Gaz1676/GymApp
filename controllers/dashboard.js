'use strict';

const logger = require('../utils/logger.js'); //---------------------------------------------------> imports logger
const accounts = require('./accounts.js'); //------------------------------------------------------> imports accounts
const memberStore = require('../models/member-store.js'); //---------------------------------------> imports member-store
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
    const list = loggedInMember.assessments; //----------------------------------------------------> assessments of the loggedInMember stored in list
    for (let i = 0; i < list.length; i++) { //-----------------------------------------------------> if 'i' is less than list.length then increment by one
      list[i].updateComment = false; //------------------------------------------------------------> update comment equals to false
    }

    logger.debug(`rendering assessments for ${loggedInMember.firstName}`); //----------------------> logs message to console
    response.render('dashboard', viewData); //-----------------------------------------------------> name of view to render 'dashboard' and sends viewData to view
  },

  addAssessment(request, response) { //------------------------------------------------------------> addAssessment method, called when ‘/ dashboard’ request received
    logger.info('adding assessment rendering'); //-------------------------------------------------> logs message to console
    const loggedInMember = accounts.getCurrentMember(request); //----------------------------------> gets currentMember from accounts and stores it in loggedInMember
    const memberid = loggedInMember.memberid; //---------------------------------------------------> gets id of loggedInMember and stores it in memberId
    const newAssessment = { //---------------------------------------------------------------------> place model in newAssessment object
      assessmentid: uuid(), //---------------------------------------------------------------------> unique id for assessment
      date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''), //---------------------> new date
      weight: request.body.weight, //--------------------------------------------------------------> weight
      chest: request.body.chest, //----------------------------------------------------------------> chest
      thigh: request.body.thigh, //----------------------------------------------------------------> thigh
      upperArm: request.body.upperArm, //----------------------------------------------------------> upperArm
      waist: request.body.waist, //----------------------------------------------------------------> waist
      hips: request.body.hips, //------------------------------------------------------------------> hips
      trend: '', //--------------------------------------------------------------------------------> trend
      comment: '', //------------------------------------------------------------------------------> comment
      updateComment: false, //---------------------------------------------------------------------> saved as false if trainer has not commented on assessment
    };
    logger.debug(`adding new assessment for ${loggedInMember.firstName}`); //----------------------> logs message to console
    memberStore.addAssessment(memberid, newAssessment); //-----------------------------------------> adds assessment to member-store
    analytics.trend(loggedInMember); //------------------------------------------------------------> gets trend from analytics of loggedInMember
    response.redirect('/dashboard'); //------------------------------------------------------------> redirects to (/dashboard)
  },

  removeAssessment(request, response) { //---------------------------------------------------------> removeAssessment method, called when ‘/ dashboard’ request received
    logger.info('removing assessment rendering'); //-----------------------------------------------> logs message to console
    const assessmentid = request.params.assessmentid; //-------------------------------------------> gets assessmentId and stores in assessmentId
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
    logger.debug(`settings for ${loggedInMember.firstName}`); //-----------------------------------> logs message to console
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

  memberClasses(request, response) { //------------------------------------------------------------> memberClasses method, called when ‘/ dashboard’ request received
    logger.info('members classes rendering'); //---------------------------------------------------> logs message to console
    const member = accounts.getCurrentMember(request); //------------------------------------------> gets currentMember from accounts and stores it in member
    const classList = classStore.getAllClasses(); //-----------------------------------------------> gets all classes from classStore and stores it in classList
    const viewData = { //--------------------------------------------------------------------------> place model in viewData object
      member: member, //---------------------------------------------------------------------------> member
      classList: classList, //---------------------------------------------------------------------> classList
    };
    logger.debug(`getting all classes for ${member.firstName}`); //--------------------------------> logs message to console
    response.render('memberClasses', viewData); //-------------------------------------------------> renders 'memberClasses' and viewData to view
  },

  //-------- TODO --------//

  showWorkouts(request, response) { //-------------------------------------------------------------> showWorkouts method, called when ‘/ dashboard’ request received
    logger.info('available workouts rendering'); //------------------------------------------------> logs message to console
    const member = accounts.getCurrentMember(request); //------------------------------------------> gets currentMember from accounts and stores it in member
    const classid = request.params.classid; //-----------------------------------------------------> gets classid (params) stores it in classid
    const workoutid = request.params.workoutid; //-------------------------------------------------> gets classid (params) stores it in workoutid
    const workout = classStore.getWorkoutById(classid, workoutid); //------------------------------> gets workoutid (params) stores it in workoutid
    const viewData = { //--------------------------------------------------------------------------> place model in viewData object
      member: member, //---------------------------------------------------------------------------> member
      workout: workout, //-------------------------------------------------------------------------> workout
    };
    logger.debug(`getting all workouts available for ${member.firstName}`); //---------------------> logs message to console
    response.render('showWorkouts', viewData); //--------------------------------------------------> renders 'showWorkouts' and viewData to view
  },
};

module.exports = dashboard; //---------------------------------------------------------------------> this is the object that is then exported:

//-----> request -> link or button pressed on page
//-----> response -> complete page rendered into browser
