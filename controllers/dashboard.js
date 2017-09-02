'use strict';

const logger = require('../utils/logger.js'); //--------------------------------------------------------> imports logger
const accounts = require('./accounts.js'); //-----------------------------------------------------------> imports accounts
const memberStore = require('../models/member-store.js'); //--------------------------------------------> imports member-store
const trainerStore = require('../models/trainer-store.js'); //------------------------------------------> imports trainer-store
const classStore = require('../models/class-store.js'); //----------------------------------------------> imports class-store
const uuid = require('uuid'); //------------------------------------------------------------------------> imports uuid
const analytics = require('../utils/analytics.js'); //--------------------------------------------------> imports analytics

//---> dashboard object definition <---//

const dashboard = {
  index(request, response) { //-------------------------------------------------------------------------> index method, called when ‘/ dashboard’ request received
    logger.info('dashboard rendering'); //--------------------------------------------------------------> logs message to console
    const loggedInMember = accounts.getCurrentMember(request); //---------------------------------------> gets currentMember from accounts and stores it in loggedInMember
    const bmi = analytics.calculateBMI(loggedInMember); //----------------------------------------------> gets calculateBMI from analytics for loggedInMember and stores it in bmi
    const idealBodyWeight = analytics.idealBodyWeight(loggedInMember); //-------------------------------> gets IBW from analytics for loggedInMember and stores it in IBW
    const viewData = { //-------------------------------------------------------------------------------> place model in viewData object
      title: 'Member Dashboard', //---------------------------------------------------------------------> name of the title
      member: loggedInMember, //------------------------------------------------------------------------> loggedInMember
      bmi: bmi, //--------------------------------------------------------------------------------------> bmi
      bmiCategory: analytics.BMICategory(bmi), //-------------------------------------------------------> bmiCategory of bmi results
      idealBodyWeight: idealBodyWeight, //--------------------------------------------------------------> IBW
    };
    logger.debug(`${loggedInMember.firstName} ${loggedInMember.lastName}'s main menu page`); //---------> logs message to console
    response.render('dashboard', viewData); //----------------------------------------------------------> name of view to render 'dashboard' and sends viewData to view
  },

  memberAddAssessment(request, response) { //-----------------------------------------------------------> memberAddAssessment method, called when ‘/ dashboard’ request received
    logger.info('adding assessment rendering'); //------------------------------------------------------> logs message to console
    const loggedInMember = accounts.getCurrentMember(request); //---------------------------------------> gets currentMember from accounts and stores it in loggedInMember
    const memberid = loggedInMember.memberid; //--------------------------------------------------------> gets id of loggedInMember and stores it in memberId
    const newAssessment = { //--------------------------------------------------------------------------> place model in newAssessment object
      assessmentid: uuid(), //--------------------------------------------------------------------------> unique id for assessment
      date: new Date().toDateString(), //---------------------------------------------------------------> new date
      weight: Number(request.body.weight), //-----------------------------------------------------------> weight
      chest: Number(request.body.chest), //-------------------------------------------------------------> chest
      thigh: Number(request.body.thigh), //-------------------------------------------------------------> thigh
      upperArm: Number(request.body.upperArm), //-------------------------------------------------------> upperArm
      waist: Number(request.body.waist), //-------------------------------------------------------------> waist
      hips: Number(request.body.hips), //---------------------------------------------------------------> hips
      trend: '', //-------------------------------------------------------------------------------------> trend
      comment: '', //-----------------------------------------------------------------------------------> comment
    };
    memberStore.addAssessment(memberid, newAssessment); //----------------------------------------------> adds assessment to member-store
    analytics.trend(loggedInMember); //-----------------------------------------------------------------> gets trend from analytics of loggedInMember
    logger.debug(`added assessment for ${loggedInMember.firstName}`); //--------------------------------> logs message to console
    response.redirect('/dashboard'); //-----------------------------------------------------------------> redirects to (/dashboard)
  },

  removeAssessment(request, response) { //--------------------------------------------------------------> removeAssessment method, called when ‘/ dashboard’ request received
    logger.info('removing assessment rendering'); //----------------------------------------------------> logs message to console
    const assessmentid = request.params.assessmentid; //------------------------------------------------> gets assessmentid (params) and stores in assessmentid
    const loggedInMember = accounts.getCurrentMember(request); //---------------------------------------> getsCurrentMember from accounts and stores it in loggedInMember
    logger.debug(`removing assessmentid: ${assessmentid} from ${loggedInMember.firstName}`); //---------> logs message to console
    memberStore.removeAssessment(loggedInMember.memberid, assessmentid); //-----------------------------> removes assessment from member-store
    response.redirect('/dashboard'); //-----------------------------------------------------------------> redirects to (/dashboard)
  },

  settings(request, response) { //----------------------------------------------------------------------> settings method, called when ‘/ dashboard’ request received
    logger.info('settings rendering'); //---------------------------------------------------------------> logs message to console
    const loggedInMember = accounts.getCurrentMember(request); //---------------------------------------> gets currentMember from accounts and stores it in loggedInMember
    const viewData = { //-------------------------------------------------------------------------------> place model in viewData object
      member: loggedInMember, //------------------------------------------------------------------------> loggedInMember
    };
    logger.debug(`update profile settings menu rendered for ${loggedInMember.firstName}`); //-----------> logs message to console
    response.render('settings', viewData); //-----------------------------------------------------------> renders 'settings' and viewData to view
  },

  updateFirstName(request, response) { //---------------------------------------------------------------> updateFirstName method, called when '/ dashboard request received
    logger.info('updating first name rendering'); //----------------------------------------------------> logs message to console
    const loggedInMember = accounts.getCurrentMember(request); //---------------------------------------> gets currentMember from accounts and stores it in loggedInMember
    loggedInMember.firstName = request.body.firstName; //-----------------------------------------------> request firstName = firstName of loggedInMember
    logger.debug(`updating ${loggedInMember.firstName}'s first name`); //-------------------------------> logs message to console
    memberStore.store.save(); //------------------------------------------------------------------------> saves new results to memberStore
    response.redirect('/dashboard'); //-----------------------------------------------------------------> redirects to (/dashboard)
  },

  updateLastName(request, response) { //----------------------------------------------------------------> updateLastName method, called when '/ dashboard request received
    logger.info('updating last name rendering'); //-----------------------------------------------------> logs message to console
    const loggedInMember = accounts.getCurrentMember(request); //---------------------------------------> gets currentMember from accounts and stores it in loggedInMember
    loggedInMember.lastName = request.body.lastName; //-------------------------------------------------> request lastName = lastName of loggedInMember
    logger.debug(`updating ${loggedInMember.firstName}'s last name`); //--------------------------------> logs message to console
    memberStore.store.save(); //------------------------------------------------------------------------> saves new results to memberStore
    response.redirect('/dashboard'); //-----------------------------------------------------------------> redirects to (/dashboard)
  },

  updateEmail(request, response) { //-------------------------------------------------------------------> updateEmail method, called when '/ dashboard request received
    logger.info('updating email rendering'); //---------------------------------------------------------> logs message to console
    const loggedInMember = accounts.getCurrentMember(request); //---------------------------------------> gets currentMember from accounts and stores it in loggedInMember
    loggedInMember.email = request.body.email; //-------------------------------------------------------> request email = email of loggedInMember
    logger.debug(`updating ${loggedInMember.firstName}'s email address: ${loggedInMember.email}`); //---> logs message to console
    memberStore.store.save(); //------------------------------------------------------------------------> saves new results to memberStore
    response.redirect('/dashboard'); //-----------------------------------------------------------------> redirects to (/dashboard)
  },

  updatePassword(request, response) { //----------------------------------------------------------------> updatePassword method, called when '/ dashboard request received
    logger.info('updating password rendering'); //------------------------------------------------------> logs message to console
    const loggedInMember = accounts.getCurrentMember(request); //---------------------------------------> gets currentMember from accounts and stores it in loggedInMember
    loggedInMember.password = request.body.password; //-------------------------------------------------> request password = password of loggedInMember
    logger.debug(`updating ${loggedInMember.firstName}'s password, ssssshhhhh`); //---------------------> logs message to console
    memberStore.store.save(); //------------------------------------------------------------------------> saves new results to memberStore
    response.redirect('/dashboard'); //-----------------------------------------------------------------> redirects to (/dashboard)
  },

  updateAddress(request, response) { //-----------------------------------------------------------------> updateAddress method, called when '/ dashboard request received
    logger.info('updating address rendering'); //-------------------------------------------------------> logs message to console
    const loggedInMember = accounts.getCurrentMember(request); //---------------------------------------> gets currentMember from accounts and stores it in loggedInMember
    loggedInMember.address = request.body.address; //---------------------------------------------------> request address = address of loggedInMember
    logger.debug(`updating ${loggedInMember.firstName}'s home address`); //-----------------------------> logs message to console
    memberStore.store.save(); //------------------------------------------------------------------------> saves new results to memberStore
    response.redirect('/dashboard'); //-----------------------------------------------------------------> redirects to (/dashboard)
  },

  updateGender(request, response) { //------------------------------------------------------------------> updateGender method, called when '/ dashboard request received
    logger.info('updating gender rendering'); //--------------------------------------------------------> logs message to console
    const loggedInMember = accounts.getCurrentMember(request); //---------------------------------------> gets currentMember from accounts and stores it in loggedInMember
    loggedInMember.gender = request.body.gender; //-----------------------------------------------------> request gender = gender of loggedInMember
    logger.debug(`updating ${loggedInMember.firstName}'s gender??? Really???`); //----------------------> logs message to console
    memberStore.store.save(); //------------------------------------------------------------------------> saves new results to memberStore
    response.redirect('/dashboard'); //-----------------------------------------------------------------> redirects to (/dashboard)
  },

  updateHeight(request, response) { //------------------------------------------------------------------> updateHeight method, called when '/ dashboard request received
    logger.info('updating height rendering'); //--------------------------------------------------------> logs message to console
    const loggedInMember = accounts.getCurrentMember(request); //---------------------------------------> gets currentMember from accounts and stores it in loggedInMember
    loggedInMember.height = Number(request.body.height); //---------------------------------------------> request height = height of loggedInMember
    logger.debug(`updating ${loggedInMember.firstName}'s height`); //-----------------------------------> logs message to console
    memberStore.store.save(); //------------------------------------------------------------------------> saves new results to memberStore
    response.redirect('/dashboard'); //-----------------------------------------------------------------> redirects to (/dashboard)
  },

  updateStartingWeight(request, response) { //----------------------------------------------------------> updateStartingWeight method, called when '/ dashboard request received
    logger.info('updating starting weight rendering'); //-----------------------------------------------> logs message to console
    const loggedInMember = accounts.getCurrentMember(request); //---------------------------------------> gets currentMember from accounts and stores it in loggedInMember
    loggedInMember.startingWeight = Number(request.body.startingWeight); //-----------------------------> request startingWeight = startingWeight of loggedInMember
    logger.debug(`updating ${loggedInMember.firstName}'s starting weight`); //--------------------------> logs message to console
    memberStore.store.save(); //------------------------------------------------------------------------> saves new results to memberStore
    response.redirect('/dashboard'); //-----------------------------------------------------------------> redirects to (/dashboard)
  },

  updateProfilePicture(request, response) { //----------------------------------------------------------> updateProfilePicture method, called when '/ dashboard request received
    logger.info('updating profile picture rendering'); //-----------------------------------------------> logs message to console
    const loggedInMember = accounts.getCurrentMember(request); //---------------------------------------> gets currentMember from accounts and stores it in loggedInMember
    const picture = request.files.picture; //-----------------------------------------------------------> gets picture (files) stores it in picture

    memberStore.addPicture(loggedInMember, picture, function () { //------------------------------------> addPicture to the memberStore
          logger.debug(`updating ${loggedInMember.firstName}'s picture`); //----------------------------> logs message to console
          memberStore.store.save(); //------------------------------------------------------------------> saves new results to memberStore
          response.redirect('/dashboard'); //-----------------------------------------------------------> redirects to (/dashboard)
        }
    );
  },

  viewMemberClasses(request, response) { //-------------------------------------------------------------> viewMemberClasses method, called when ‘/ dashboard’ request received
    logger.info('members classes rendering'); //--------------------------------------------------------> logs message to console
    const loggedInMember = accounts.getCurrentMember(request); //---------------------------------------> gets currentMember from accounts and stores it in loggedInMember
    const classes = classStore.getAllClasses(); //------------------------------------------------------> gets all classes from classStore and stores it in classes
    const viewData = { //-------------------------------------------------------------------------------> place model in viewData object
      member: loggedInMember, //------------------------------------------------------------------------> loggedInMember
      classes: classes, //------------------------------------------------------------------------------> classes
    };
    logger.debug(`all classes rendered for ${loggedInMember.firstName}`); //----------------------------> logs message to console
    response.render('viewMemberClasses', viewData); //--------------------------------------------------> renders 'viewMemberClasses' and viewData to view
  },

  enrollClass(request, response) { //-------------------------------------------------------------------> enrollClass method, called when '/ dashboard request received
    logger.info('enroll class rendering '); //----------------------------------------------------------> logs message to console
    const classid = request.params.classid; //----------------------------------------------------------> gets classid (params) stores it in classid
    const chosenClass = classStore.getClassById(classid); //--------------------------------------------> getClassById from classStore and stores it in chosenClass
    const loggedInMember = accounts.getCurrentMember(request); //---------------------------------------> getCurrentMember from accounts and stores it in loggedInMember

    for (let i = 0; i < chosenClass.workouts.length; i++) { //------------------------------------------> for loop
      let currentClass = chosenClass.workouts[i]; //----------------------------------------------------> workouts from chosenClass stored in currentClass
      let enrolled = false; //--------------------------------------------------------------------------> boolean default to false for enrolled
      for (let j = 0; j < currentClass.members.length; j++) { //----------------------------------------> for loop
        if (currentClass.members[j] === loggedInMember.memberid) { //-----------------------------------> if memberid of loggedInMember id equal to the member in currentClass
          enrolled = true; //---------------------------------------------------------------------------> then this is equal to true
        }
      }

      if ((!enrolled) && (currentClass.currentCapacity < currentClass.capacity)) { //-------------------> if not enrolled & currentCapacity of currentClass is less than capacity of currentClass
        currentClass.currentCapacity += 1; //-----------------------------------------------------------> currentCapacity of currentClass + 1 is now currentCapacity of currentClass
        currentClass.members.push(loggedInMember.memberid); //------------------------------------------> pushes memberid of loggedInMember to members array in currentClass
        logger.debug(`WooHoo!! enrolling to class rendered ${loggedInMember.firstName}`); //------------> logs message to console
        classStore.store.save(); //---------------------------------------------------------------------> saves new results to classStore
      } else { //---------------------------------------------------------------------------------------> else
        logger.debug(`Doh!! you're already enrolled in this class ${loggedInMember.firstName}`); //-----> logs message to console
      }
    }

    response.redirect('/dashboard/viewMemberClasses'); //-----------------------------------------------> redirects to (/dashboard/viewMemberClasses)
  },

  unenrollClass(request, response) { //-----------------------------------------------------------------> unenrollClass method, called when '/ dashboard request received
    logger.info('unenroll class rendering '); //--------------------------------------------------------> logs message to console
    const classid = request.params.classid; //----------------------------------------------------------> gets classid (params) stores it in classid
    const chosenClass = classStore.getClassById(classid); //--------------------------------------------> getsClassById from classStore and stores it in chosenClass
    const loggedInMember = accounts.getCurrentMember(request); //---------------------------------------> getCurrentMember from accounts and stores in in loggedInMember

    for (let i = 0; i < chosenClass.workouts.length; i++) { //------------------------------------------> for loop
      let currentClass = chosenClass.workouts[i]; //----------------------------------------------------> workouts from chosenClass stored in currentClass
      for (let j = 0; j < currentClass.members.length; j++) { //----------------------------------------> for loop
        if (currentClass.members[j] === loggedInMember.memberid) { //-----------------------------------> if memberid of loggedInMember id equal to the member in currentClass
          currentClass.currentCapacity -= 1; //---------------------------------------------------------> currentCapacity of currentClass - 1 is now currentCapacity of currentClass
          currentClass.members.splice(loggedInMember.memberid, 1); //-----------------------------------> removes memberid of loggedInMember from members array in currentClass
          logger.debug(`you left the class ${loggedInMember.firstName}, why???`); //--------------------> logs message to console
          classStore.store.save(); //-------------------------------------------------------------------> saves new results to classStore
        } else { //-------------------------------------------------------------------------------------> else
          logger.debug(`Doh!! you're not enrolled in this class ${loggedInMember.firstName}`); //-------> logs message to console
        }
      }
    }

    response.redirect('/dashboard/viewMemberClasses'); //-----------------------------------------------> redirects to (/dashboard/viewMemberClasses)
  },

  enrollWorkout(request, response) { //-----------------------------------------------------------------> enrollWorkout method, called when '/ dashboard request received
    logger.info('enroll workout rendering '); //--------------------------------------------------------> logs message to console
    const classid = request.params.classid; //----------------------------------------------------------> gets classid (params) stores it in classid
    const workoutid = request.params.workoutid; //------------------------------------------------------> gets workoutid (params) stores it in workoutid
    const chosenWorkout = classStore.getWorkoutById(classid, workoutid); //-----------------------------> getsWorkoutById from classStore and stores it in chosenWorkout
    const loggedInMember = accounts.getCurrentMember(request); //---------------------------------------> getCurrentMember from accounts and stores in in loggedInMember
    let enrolled = false; //----------------------------------------------------------------------------> boolean default to false for enrolled

    for (let i = 0; i < chosenWorkout.members.length; i++) { //-----------------------------------------> for loop
      if (chosenWorkout.members[i] === loggedInMember.memberid) { //------------------------------------> if memberid of loggedInMember id equal to the member in chosenWorkout
        enrolled = true; //-----------------------------------------------------------------------------> boolean true is stored in enrolled
      }
    }

    if ((!enrolled) && (chosenWorkout.currentCapacity < chosenWorkout.capacity)) { //-------------------> if not enrolled & currentCapacity of chosenWorkout is less than capacity of chosenWorkout
      chosenWorkout.currentCapacity += 1; //------------------------------------------------------------> currentCapacity of chosenWorkout + 1 is now currentCapacity of chosenWorkout
      chosenWorkout.members.push(loggedInMember.memberid); //-------------------------------------------> pushes memberid of loggedInMember to members array in chosenWorkout
      logger.debug(`WooHoo!! welcome to the workout ${loggedInMember.firstName}, are you ready??`); //--> logs message to console
      classStore.store.save(); //-----------------------------------------------------------------------> saves new results to classStore
    } else { //-----------------------------------------------------------------------------------------> else
      logger.debug(`Doh!! you're not enrolled in this workout ${loggedInMember.first}`); //-------------> logs message to console
    }

    response.redirect('/dashboard/viewMemberClasses'); //-----------------------------------------------> redirects to (/dashboard/viewMemberClasses)
  },

  unenrollWorkout(request, response) { //---------------------------------------------------------------> unenrollWorkout method, called when '/ dashboard request received
    logger.info('unenroll workout rendering '); //------------------------------------------------------> logs message to console
    const classid = request.params.classid; //----------------------------------------------------------> gets classid (params) stores it in classid
    const workoutid = request.params.workoutid; //------------------------------------------------------> gets workoutid (params) stores it in workoutid
    const chosenWorkout = classStore.getWorkoutById(classid, workoutid); //-----------------------------> getsWorkoutById from classStore and stores it in chosenWorkout
    const loggedInMember = accounts.getCurrentMember(request); //---------------------------------------> getCurrentMember from accounts and stores in in loggedInMember

    for (let i = 0; i < chosenWorkout.members.length; i++) { //-----------------------------------------> for loop
      if (chosenWorkout.members[i] === loggedInMember.memberid) { //------------------------------------> if memberid of loggedInMember id equal to the member in chosenWorkout
        chosenWorkout.currentCapacity -= 1; //----------------------------------------------------------> currentCapacity of chosenWorkout - 1 is now currentCapacity of chosenWorkout
        chosenWorkout.members.splice(loggedInMember.memberid, 1); //------------------------------------> removes memberid of loggedInMember from members array in chosenWorkout
        logger.debug(`you left the workout ${loggedInMember.firstName}, why???`); //--------------------> logs message to console
        classStore.store.save(); //---------------------------------------------------------------------> saves new results to classStore
      } else { //---------------------------------------------------------------------------------------> else
        logger.debug(`Doh!! you're not enrolled in this workout ${loggedInMember.firstName}`); //-------> logs message to console
      }
    }

    response.redirect('/dashboard/viewMemberClasses'); //-----------------------------------------------> redirects to (/dashboard/viewMemberClasses)
  },

  memberBookings(request, response) { //----------------------------------------------------------------> memberBookings method, called when ‘/ dashboard’ request received
    logger.info('members bookings rendering'); //-------------------------------------------------------> logs message to console
    const loggedInMember = accounts.getCurrentMember(request); //---------------------------------------> gets currentMember from accounts and stores it in loggedInMember
    const trainers = trainerStore.getAllTrainers(); //--------------------------------------------------> getsAllTrainers from trainerStore and stores it in trainerList
    const bookings = loggedInMember.bookings; //--------------------------------------------------------> gets bookings from loggedInMember and stores it in bookingList
    const viewData = { //-------------------------------------------------------------------------------> place model in viewData object
      member: loggedInMember, //------------------------------------------------------------------------> loggedInMember
      trainers: trainers, //----------------------------------------------------------------------------> trainers
      bookings: bookings, //----------------------------------------------------------------------------> bookings
    };
    logger.debug(`create bookings menu rendered for ${loggedInMember.firstName}`); //-------------------> logs message to console
    response.render('memberBookings', viewData); //-----------------------------------------------------> renders 'memberBookings' and viewData to view
  },

  memberAddBooking(request, response) { //--------------------------------------------------------------> memberAddBooking method, called when ‘/ dashboard’ request received
    logger.info('member add booking rendering'); //-----------------------------------------------------> logs message to console
    const loggedInMember = accounts.getCurrentMember(request); //---------------------------------------> getCurrentMember from accounts and stores it in loggedInMember
    const memberid = loggedInMember.memberid; //--------------------------------------------------------> gets memberid of loggedInMember and stores it in memberid
    const trainerid = request.body.trainerid; //--------------------------------------------------------> requests trainerid data and stores it in trainerid
    const trainer = trainerStore.getTrainerById(trainerid); //------------------------------------------> getTrainerById from trainerStore stores it in trainer
    const date = new Date(request.body.date); //--------------------------------------------------------> request new Date store it in date
    const newBooking = { //-----------------------------------------------------------------------------> place model in newBooking object
      bookingid: uuid(), //-----------------------------------------------------------------------------> unique id for assessment
      trainerid: trainerid, //--------------------------------------------------------------------------> trainerid
      memberid: memberid, //----------------------------------------------------------------------------> memberid
      date: date.toDateString(), //---------------------------------------------------------------------> requests date
      time: request.body.time, //-----------------------------------------------------------------------> requests time
      coachlastname: trainer.lastName, //---------------------------------------------------------------> lastName of trainer stored in coachlastname
      memberfirstname: loggedInMember.firstName, //-----------------------------------------------------> gets firstName from loggedInMember and stores it in memberfirstname
      memberlastname: loggedInMember.lastName, //-------------------------------------------------------> gets lastName from loggedInMember and stores it in memberlastname

    };
    logger.debug(`adding new booking for ${loggedInMember.firstName} to the store`); //-----------------> logs message to console
    memberStore.addBooking(memberid, newBooking); //----------------------------------------------------> adds booking to memberStore
    response.redirect('/dashboard/memberBookings'); //--------------------------------------------------> redirects to (/dashboard/memberBookings)
  },

  removeBooking(request, response) { //-----------------------------------------------------------------> removeBooking method, called when ‘/ dashboard’ request received
    logger.info('remove booking rendering'); //---------------------------------------------------------> logs message to console
    const bookingid = request.params.bookingid; //------------------------------------------------------> gets bookingid (params) and stores it in bookingid
    const loggedInMember = accounts.getCurrentMember(request); //---------------------------------------> getsCurrentMember from accounts and stores it in loggedInMember
    logger.debug(`removing bookingid: ${bookingid} from ${loggedInMember.firstName}`); //---------------> logs message to console
    memberStore.removeBooking(loggedInMember.memberid, bookingid); //-----------------------------------> removes booking from memberStore
    response.redirect('/dashboard/memberBookings'); //--------------------------------------------------> redirects to (/dashboard/memberBookings)
  },

  //-------- TODO editBooking --------//

  memberEditBooking(request, response) { //-------------------------------------------------------------> memberEditBooking method, called when ‘/ dashboard’ request received
    logger.info('edit booking rendering'); //-----------------------------------------------------------> logs message to console
    const loggedInMember = accounts.getCurrentMember(request); //---------------------------------------> gets currentMember from accounts and stores it in loggedInMember
    const date = new Date(request.body.date); //--------------------------------------------------------> request new Date store it in date
    const bookingid = request.params.bookingid; //------------------------------------------------------> gets bookingid (params) and stores it in bookingid
    const booking = memberStore.getBookingById(loggedInMember.memberid, bookingid); //------------------> gets booking by id from memberStore and stores it in booking
    booking.time = request.body.time; //----------------------------------------------------------------> time
    booking.date = date.toDateString(); //----------------------------------------------------------------> date
    logger.debug(`edit booking for ${loggedInMember.firstName} ${loggedInMember.lastName}`); //---------> logs message to console
    memberStore.store.save(); //------------------------------------------------------------------------> saves new results to memberStore
    response.redirect('/dashboard/memberBookings'); //--------------------------------------------------> redirects to (/dashboard/memberBookings)
  },

  //-------- TODO updateBooking --------//

  memberUpdateBooking(request, response) { //-----------------------------------------------------------> memberUpdateBooking method, called when ‘/ dashboard’ request received
    logger.info('update booking rendering '); //--------------------------------------------------------> logs message to console
    const loggedInMember = accounts.getCurrentMember(request); //---------------------------------------> gets currentTrainer from accounts and stores it in loggedInTrainer
    const bookingid = request.params.bookingid; //------------------------------------------------------> gets bookingid (params) stores it in bookingid
    const bookingToUpdate = memberStore.getBookingById(loggedInMember.memberid, bookingid); //----------> gets booking by id from memberStore and stores it in bookingToUpdate
    const trainers = trainerStore.getAllTrainers(); //--------------------------------------------------> getAllMembers from memberStore and stores it in memberList
    const viewData = { //-------------------------------------------------------------------------------> place model in viewData object
      member: loggedInMember, //------------------------------------------------------------------------> loggedInMember
      bookingToUpdate: bookingToUpdate, //--------------------------------------------------------------> bookingToUpdate
      trainers: trainers, //----------------------------------------------------------------------------> trainers
    };
    logger.debug(`updating bookingid: ${bookingid}`); //------------------------------------------------> logs message to console
    response.render('memberUpdateBooking', viewData); //------------------------------------------------> renders 'updatedBooking' and viewData to view
  },

  memberGoals(request, response) { //----------------------------------------------------------------> memberBookings method, called when ‘/ dashboard’ request received
    logger.info('members goals rendering'); //-------------------------------------------------------> logs message to console
    const loggedInMember = accounts.getCurrentMember(request); //---------------------------------------> gets currentMember from accounts and stores it in loggedInMember
    const trainers = trainerStore.getAllTrainers(); //--------------------------------------------------> getsAllTrainers from trainerStore and stores it in trainerList
    const goals = loggedInMember.goals; //--------------------------------------------------------> gets bookings from loggedInMember and stores it in bookingList
    const viewData = { //-------------------------------------------------------------------------------> place model in viewData object
      member: loggedInMember, //------------------------------------------------------------------------> loggedInMember
      trainers: trainers, //----------------------------------------------------------------------------> trainers
      goals: goals, //----------------------------------------------------------------------------> bookings
    };
    logger.debug(`create goals menu rendered for ${loggedInMember.firstName}`); //-------------------> logs message to console
    response.render('memberGoals', viewData); //-----------------------------------------------------> renders 'memberBookings' and viewData to view
  },

  memberAddGoal(request, response) { //-----------------------------------------------------------> memberAddAssessment method, called when ‘/ dashboard’ request received
    logger.info('adding goal rendering'); //------------------------------------------------------> logs message to console
    const loggedInMember = accounts.getCurrentMember(request); //---------------------------------------> gets currentMember from accounts and stores it in loggedInMember
    const memberid = loggedInMember.memberid; //--------------------------------------------------------> gets id of loggedInMember and stores it in memberId
    const date = new Date(request.body.date); //--------------------------------------------------------> request new Date store it in date
    const newGoal = { //--------------------------------------------------------------------------> place model in newAssessment object
      goalid: uuid(), //--------------------------------------------------------------------------> unique id for assessment
      date: date.toDateString(), //---------------------------------------------------------------> new date
      area: request.body.area,
      goal: request.body.goal,
      description: request.body.description, //-------------------------------------------------------------------------------------> trend
      status: 'open', //-----------------------------------------------------------------------------------> comment
    };
    memberStore.addGoal(memberid, newGoal); //----------------------------------------------> adds assessment to member-store
    logger.debug(`added goal for ${loggedInMember.firstName}`); //--------------------------------> logs message to console
    response.redirect('/dashboard/memberGoals'); //-----------------------------------------------------------------> redirects to (/dashboard)
  },

  removeGoal(request, response) { //--------------------------------------------------------------> removeAssessment method, called when ‘/ dashboard’ request received
    logger.info('removing goal rendering'); //----------------------------------------------------> logs message to console
    const goalid = request.params.goalid; //------------------------------------------------> gets assessmentid (params) and stores in assessmentid
    const loggedInMember = accounts.getCurrentMember(request); //---------------------------------------> getsCurrentMember from accounts and stores it in loggedInMember
    logger.debug(`removing goalid: ${goalid} from ${loggedInMember.firstName}`); //---------> logs message to console
    memberStore.removeGoal(loggedInMember.memberid, goalid); //-----------------------------> removes assessment from member-store
    response.redirect('/dashboard/memberGoals'); //-----------------------------------------------------------------> redirects to (/dashboard)
  },
};

module.exports = dashboard; //--------------------------------------------------------------------------> this is the object that is then exported:

//-----> request -> link or button pressed on page
//-----> response -> complete page rendered into browser
