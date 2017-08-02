'use strict';

const logger = require('../utils/logger.js'); //------------------------------------------------> imports logger
const accounts = require('./accounts.js'); //---------------------------------------------------> imports accounts
const memberStore = require('../models/member-store.js'); //------------------------------------> imports member-store
const uuid = require('uuid'); //----------------------------------------------------------------> imports uuid
const analytics = require('../utils/analytics.js'); //------------------------------------------> imports analytics

//---> dashboard object definition <---//

const dashboard = {
  index(request, response) { //-----------------------------------------------------------------> index method, called when ‘/ dashboard’ request received
    logger.info('rendering dashboard'); //------------------------------------------------------> logs message to console
    const loggedInMember = accounts.getCurrentMember(request); //-------------------------------> gets currentMember from accounts and stores it in loggedInMember
    const bmi = analytics.calculateBMI(loggedInMember); //--------------------------------------> gets calculateBMI from analytics for loggedInMember and stores it in bmi
    const idealBodyWeight = analytics.idealBodyWeight(loggedInMember); //-----------------------> gets IBW from analytics for loggedInMember and stores it in IBW
    const viewData = { //-----------------------------------------------------------------------> place model in viewData object
      title: 'Member Dashboard', //-------------------------------------------------------------> name of the title
      member: loggedInMember, //----------------------------------------------------------------> loggedInMember
      bmi: bmi, //------------------------------------------------------------------------------> bmi
      bmiCategory: analytics.BMICategory(bmi), //-----------------------------------------------> bmiCategory of bmi results
      idealBodyWeight: idealBodyWeight, //------------------------------------------------------> IBW
    };
    logger.info(`rendering assessments for ${loggedInMember.firstName}`); //--------------------> logs message to console
    const list = loggedInMember.assessments; //-------------------------------------------------> assessments of the loggedInMember stored in list
    for (let i = 0; i < list.length; i++) { //--------------------------------------------------> if 'i' is less than list.length then increment by one
      list[i].updateComment = false; //---------------------------------------------------------> update comment equals to false
    }

    response.render('dashboard', viewData); //--------------------------------------------------> name of view to render 'dashboard' and sends viewData to view
  },

  addAssessment(request, response) { //---------------------------------------------------------> addAssessment method, called when ‘/ dashboard’ request received
    logger.info('rendering adding assessment'); //----------------------------------------------> logs message to console
    const loggedInMember = accounts.getCurrentMember(request); //-------------------------------> gets currentMember from accounts and stores it in loggedInMember
    const memberId = loggedInMember.id; //------------------------------------------------------> gets id of loggedInMember and stores it in memberId
    const newAssessment = { //------------------------------------------------------------------> place model in newAssessment object
      assessmentId: uuid(), //------------------------------------------------------------------> unique id for assessment
      date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''), //------------------> new date
      weight: request.body.weight, //-----------------------------------------------------------> weight
      chest: request.body.chest, //-------------------------------------------------------------> chest
      thigh: request.body.thigh, //-------------------------------------------------------------> thigh
      upperArm: request.body.upperArm, //-------------------------------------------------------> upperArm
      waist: request.body.waist, //-------------------------------------------------------------> waist
      hips: request.body.hips, //---------------------------------------------------------------> hips
      trend: '', //-----------------------------------------------------------------------------> trend
      comment: '', //---------------------------------------------------------------------------> comment
      updateComment: false, //------------------------------------------------------------------> saved as false if no comment Update
    };
    memberStore.addAssessment(memberId, newAssessment); //--------------------------------------> adds assessment to member-store
    analytics.trend(loggedInMember); //---------------------------------------------------------> gets trend from analytics of loggedInMember
    response.redirect('/dashboard'); //---------------------------------------------------------> redirects to (/dashboard)
  },

  removeAssessment(request, response) { //------------------------------------------------------> removeAssessment method, called when ‘/ dashboard’ request received
    logger.info('rendering removing assessment'); //--------------------------------------------> logs message to console
    const assessmentId = request.params.assessmentId; //----------------------------------------> gets assessmentId
    const loggedInMember = accounts.getCurrentMember(request); //-------------------------------> getsCurrentMember from accounts and stores it in loggedInMember
    memberStore.removeAssessment(loggedInMember.id, assessmentId); //---------------------------> removes assessment from member-store
    response.redirect('/dashboard'); //---------------------------------------------------------> redirects to (/dashboard)
  },

  settings(request, response) { //--------------------------------------------------------------> settings method, called when ‘/ dashboard’ request received
    logger.info('rendering settings'); //-------------------------------------------------------> logs message to console
    const loggedInMember = accounts.getCurrentMember(request); //-------------------------------> gets currentMember from accounts and stores it in loggedInMember
    const viewData = { //-----------------------------------------------------------------------> place model in viewData object
      member: loggedInMember, //----------------------------------------------------------------> loggedInMember
    };
    response.render('settings', viewData); //---------------------------------------------------> name of view to render 'settings' and sends viewData to view
  },

  updateProfile(request, response) { //---------------------------------------------------------> updateProfile method, called when ‘/ dashboard’ request received
    logger.info('rendering updating profile'); //-----------------------------------------------> logs message to console
    const loggedInMember = accounts.getCurrentMember(request); //-------------------------------> gets currentMember from accounts and stores it in loggedInMember
    loggedInMember.firstName = request.body.firstName; //---------------------------------------> request fn = fn of loggedInMember
    loggedInMember.lastName = request.body.lastName; //-----------------------------------------> request ln = ln of loggedInMember
    loggedInMember.email = request.body.email; //-----------------------------------------------> request email = email of loggedInMember
    loggedInMember.password = request.body.password; //-----------------------------------------> request password = password of loggedInMember
    loggedInMember.address = request.body.address; //-------------------------------------------> request address = address of loggedInMember
    loggedInMember.gender = request.body.gender; //---------------------------------------------> request gender = gender of loggedInMember
    loggedInMember.height = request.body.height; //---------------------------------------------> request height = height of loggedInMember
    loggedInMember.startingWeight = request.body.startingWeight; //-----------------------------> request startingWeight = startingWeight of loggedInMember

    memberStore.save(); //----------------------------------------------------------------------> saves new results to store
    response.redirect('/dashboard'); //---------------------------------------------------------> redirects to (/dashboard)
  },
};

module.exports = dashboard; //------------------------------------------------------------------> this is the object that is then exported:

//-----> request -> link or button pressed on page
//-----> response -> complete page rendered into browser
