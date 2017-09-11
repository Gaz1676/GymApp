/**
 * Author: Gary Fleming
 * Student No: 20019497
 * Start Date: Aug 1st 2017
 */

'use strict';

const logger = require('../utils/logger.js');
const accounts = require('./accounts.js');
const uuid = require('uuid');
const memberStore = require('../models/member-store.js');
const trainerStore = require('../models/trainer-store.js');
const classStore = require('../models/class-store.js');
const analytics = require('../utils/analytics.js');

const dashboard = {
  index(request, response) {
    logger.info('dashboard rendering');
    const loggedInMember = accounts.getCurrentMember(request);
    const bmi = analytics.calculateBMI(loggedInMember);
    const idealBodyWeight = analytics.idealBodyWeight(loggedInMember);
    const goals = loggedInMember.goals;
    let goalAlert = true;
    let assessmentAlert = false;
    logger.info(`checking the status of your goals ${loggedInMember.firstName}`);

    for (let i = 0; i < goals.length; i++) {
      if ((goals[i].status === 'open') || (goals[i].status === 'processing result')) {
        goalAlert = false;
        const timeLeft = (new Date(goals[i].date) - new Date);
        const daysDue =  Math.ceil(timeLeft / (1000 * 3600 * 24));
        if (daysDue <= 0) {
          const area = goals[i].area;
          const goal = goals[i].goal;

          if (loggedInMember.assessments.length > 0) {
            const recentAssessment = loggedInMember.assessments[0];
            const assessmentCheck = (new Date(recentAssessment.date) - new Date);
            const daysSinceLastAssessment = (assessmentCheck / (1000 * 3600 * 24));

            if ((daysSinceLastAssessment <= 0) && (daysSinceLastAssessment >= (-3))) {
              if (area === 'weight') {
                if (goal <= recentAssessment.weight ) {
                  goals[i].status = 'achieved';
                } else {
                  goals[i].status = 'missed';
                }
              } else if (area === 'chest') {
                if (goal <= recentAssessment.chest) {
                  goals[i].status = 'achieved';
                } else {
                  goals[i].status = 'missed';
                }
              } else if (area === 'thigh') {
                if (goal <= recentAssessment.thigh) {
                  goals[i].status = 'achieved';
                } else {
                  goals[i].status = 'missed';
                }
              } else if (area === 'upperArm') {
                if (goal <= recentAssessment.upperArm) {
                  goals[i].status = 'achieved';
                } else {
                  goals[i].status = 'missed';
                }
              } else if (area === 'waist') {
                if (goal <= recentAssessment.waist) {
                  goals[i].status = 'achieved';
                } else {
                  goals[i].status = 'missed';
                }
              } else if (area === 'hips') {
                if (goal <= recentAssessment.hips) {
                  goals[i].status = 'achieved';
                } else {
                  goals[i].status = 'missed';
                }
              }
            } else {
              goals[i].status = 'processing result';
              assessmentAlert = true;
            }
          } else {
            goals[i].status = 'processing result';
            assessmentAlert = true;
          }
        }
      }
    }
    const viewData = {
      title: 'member dashboard',
      member: loggedInMember,
      bmi: bmi,
      bmiCategory: analytics.BMICategory(bmi),
      idealBodyWeight: idealBodyWeight,
      goals: goals,
      goalAlert: goalAlert,
      assessmentAlert: assessmentAlert,
    };
    logger.debug(`${loggedInMember.firstName} ${loggedInMember.lastName}'s main menu page`);
    response.render('dashboard', viewData);
  },

  memberAddAssessment(request, response) {
    logger.info('adding assessment rendering');
    const loggedInMember = accounts.getCurrentMember(request);
    const memberid = loggedInMember.memberid;
    const newAssessment = {
      assessmentid: uuid(),
      date: new Date().toDateString(),
      weight: Number(request.body.weight),
      chest: Number(request.body.chest),
      thigh: Number(request.body.thigh),
      upperArm: Number(request.body.upperArm),
      waist: Number(request.body.waist),
      hips: Number(request.body.hips),
      trend: '',
      comment: '',
    };
    memberStore.addAssessment(memberid, newAssessment);
    analytics.trend(loggedInMember);
    logger.debug(`added assessment for ${loggedInMember.firstName}`, newAssessment);
    response.redirect('/dashboard');
  },

  removeAssessment(request, response) {
    logger.info('removing assessment rendering');
    const assessmentid = request.params.assessmentid;
    const loggedInMember = accounts.getCurrentMember(request);
    logger.debug(`removing assessmentid: ${assessmentid} from ${loggedInMember.firstName}`);
    memberStore.removeAssessment(loggedInMember.memberid, assessmentid);
    response.redirect('/dashboard');
  },

  settings(request, response) {
    logger.info('settings rendering');
    const loggedInMember = accounts.getCurrentMember(request);
    const viewData = {
      member: loggedInMember,
    };
    logger.debug(`update profile settings menu rendered for ${loggedInMember.firstName}`)
    response.render('settings', viewData);
  },

  updateFirstName(request, response) {
    logger.info('updating first name rendering');
    const loggedInMember = accounts.getCurrentMember(request);
    loggedInMember.firstName = request.body.firstName;
    logger.debug(`saving ${loggedInMember.firstName}'s first name`);
    memberStore.store.save();
    response.redirect('/dashboard');
  },

  updateLastName(request, response) {
    logger.info('updating last name rendering');
    const loggedInMember = accounts.getCurrentMember(request);
    loggedInMember.lastName = request.body.lastName;
    logger.debug(`saving ${loggedInMember.firstName}'s last name`);
    memberStore.store.save();
    response.redirect('/dashboard');
  },

  updateEmail(request, response) {
    logger.info('updating email rendering');
    const loggedInMember = accounts.getCurrentMember(request);
    loggedInMember.email = request.body.email;
    logger.debug(`saving ${loggedInMember.firstName}'s email address: ${loggedInMember.email}`);
    memberStore.store.save();
    response.redirect('/dashboard');
  },

  updatePassword(request, response) {
    logger.info('updating password rendering');
    const loggedInMember = accounts.getCurrentMember(request);
    loggedInMember.password = request.body.password;
    logger.debug(`saving ${loggedInMember.firstName}'s password, ssssshhhhh`);
    memberStore.store.save();
    response.redirect('/dashboard');
  },

  updateAddress(request, response) {
    logger.info('updating address rendering');
    const loggedInMember = accounts.getCurrentMember(request);
    loggedInMember.address = request.body.address;
    logger.debug(`saving ${loggedInMember.firstName}'s home address`);
    memberStore.store.save();
    response.redirect('/dashboard');
  },

  updateGender(request, response) {
    logger.info('updating gender rendering');
    const loggedInMember = accounts.getCurrentMember(request);
    loggedInMember.gender = request.body.gender;
    logger.debug(`saving ${loggedInMember.firstName}'s gender??? Really???`);
    memberStore.store.save();
    response.redirect('/dashboard');
  },

  updateHeight(request, response) {
    logger.info('updating height rendering');
    const loggedInMember = accounts.getCurrentMember(request);
    loggedInMember.height = Number(request.body.height);
    logger.debug(`saving ${loggedInMember.firstName}'s height`);
    memberStore.store.save();
    response.redirect('/dashboard');
  },

  updateStartingWeight(request, response) {
    logger.info('updating starting weight rendering');
    const loggedInMember = accounts.getCurrentMember(request);
    loggedInMember.startingWeight = Number(request.body.startingWeight);
    logger.debug(`saving ${loggedInMember.firstName}'s starting weight`);
    memberStore.store.save();
    response.redirect('/dashboard');
  },

  updateProfilePicture(request, response) {
    logger.info('updating profile picture rendering');
    const loggedInMember = accounts.getCurrentMember(request);
    const picture = request.files.picture;

    memberStore.addPicture(loggedInMember, picture, function () {
          logger.debug(`saving ${loggedInMember.firstName}'s picture`);
          memberStore.store.save();
          response.redirect('/dashboard');
        }
    );
  },

  viewMemberClasses(request, response) {
    logger.info('members classes rendering');
    const loggedInMember = accounts.getCurrentMember(request);
    const classes = classStore.getAllClasses();
    const viewData = {
      member: loggedInMember,
      classes: classes,
    };
    logger.debug(`all classes rendered for ${loggedInMember.firstName}`);
    response.render('viewMemberClasses', viewData);
  },

  enrollClass(request, response) {
    logger.info('enroll class rendering ');
    const classid = request.params.classid;
    const chosenClass = classStore.getClassById(classid);
    const loggedInMember = accounts.getCurrentMember(request);

    for (let i = 0; i < chosenClass.workouts.length; i++) {
      let currentClass = chosenClass.workouts[i];
      let enrolled = false;
      for (let j = 0; j < currentClass.members.length; j++) {
        if (currentClass.members[j] === loggedInMember.memberid) {
          enrolled = true;
        }
      }

      if ((!enrolled) && (currentClass.currentCapacity < currentClass.capacity)) {
        currentClass.currentCapacity += 1;
        currentClass.members.push(loggedInMember.memberid);
        classStore.store.save();
        logger.debug(`WooHoo!! enrolled to class ${loggedInMember.firstName}`);
      } else {
        logger.debug(`Doh!! you're already enrolled in this class ${loggedInMember.firstName}`);
      }
    }

    response.redirect('/dashboard/viewMemberClasses');
  },

  unenrollClass(request, response) {
    logger.info('unenroll class rendering ');
    const classid = request.params.classid;
    const chosenClass = classStore.getClassById(classid);
    const loggedInMember = accounts.getCurrentMember(request);

    for (let i = 0; i < chosenClass.workouts.length; i++) {
      let currentClass = chosenClass.workouts[i];
      for (let j = 0; j < currentClass.members.length; j++) {
        if (currentClass.members[j] === loggedInMember.memberid) {
          currentClass.currentCapacity -= 1;
          currentClass.members.splice(loggedInMember.memberid, 1);
          classStore.store.save();
          logger.debug(`you left the class ${loggedInMember.firstName}, why???`);
        } else {
          logger.debug(`Doh!! you're not enrolled in this class ${loggedInMember.firstName}`);
        }
      }
    }

    response.redirect('/dashboard/viewMemberClasses');
  },

  enrollWorkout(request, response) {
    logger.info('enroll workout rendering ');
    const classid = request.params.classid;
    const workoutid = request.params.workoutid;
    const chosenWorkout = classStore.getWorkoutById(classid, workoutid);
    const loggedInMember = accounts.getCurrentMember(request);
    let enrolled = false;

    for (let i = 0; i < chosenWorkout.members.length; i++) {
      if (chosenWorkout.members[i] === loggedInMember.memberid) {
        enrolled = true;
      }
    }

    if ((!enrolled) && (chosenWorkout.currentCapacity < chosenWorkout.capacity)) {
      chosenWorkout.currentCapacity += 1;
      chosenWorkout.members.push(loggedInMember.memberid);
      classStore.store.save();
      logger.debug(`WooHoo!! welcome to the workout ${loggedInMember.firstName}, are you ready??`);
    } else {
      logger.debug(`Doh!! you're not enrolled in this workout ${loggedInMember.first}`);
    }

    response.redirect('/dashboard/viewMemberClasses');
  },

  unenrollWorkout(request, response) {
    logger.info('unenroll workout rendering ');
    const classid = request.params.classid;
    const workoutid = request.params.workoutid;
    const chosenWorkout = classStore.getWorkoutById(classid, workoutid);
    const loggedInMember = accounts.getCurrentMember(request);

    for (let i = 0; i < chosenWorkout.members.length; i++) {
      if (chosenWorkout.members[i] === loggedInMember.memberid) {
        chosenWorkout.currentCapacity -= 1;
        chosenWorkout.members.splice(loggedInMember.memberid, 1);
        classStore.store.save();
        logger.debug(`you left the workout ${loggedInMember.firstName}, why???`);
      } else {
        logger.debug(`Doh!! you're not enrolled in this workout ${loggedInMember.firstName}`);
      }
    }

    response.redirect('/dashboard/viewMemberClasses');
  },

  memberBookings(request, response) {
    logger.info('members bookings rendering');
    const loggedInMember = accounts.getCurrentMember(request);
    const trainers = trainerStore.getAllTrainers();
    const bookings = loggedInMember.bookings;
    const viewData = {
      member: loggedInMember,
      trainers: trainers,
      bookings: bookings,
    };
    logger.debug(`create bookings menu rendered for ${loggedInMember.firstName}`);
    response.render('memberBookings', viewData);
  },

  memberAddBooking(request, response) {
    logger.info('member add booking rendering');
    const loggedInMember = accounts.getCurrentMember(request);
    const memberid = loggedInMember.memberid;
    const trainerid = request.body.trainerid;
    const trainer = trainerStore.getTrainerById(trainerid);
    const date = new Date(request.body.date);
    const newBooking = {
      bookingid: uuid(),
      trainerid: trainerid,
      memberid: memberid,
      date: date.toDateString(),
      time: request.body.time,
      coachlastname: trainer.lastName,
      memberfirstname: loggedInMember.firstName,
      memberlastname: loggedInMember.lastName,

    };

    const bookings = trainerStore.getAllTrainerBookings(trainerid);
    let notBooked = true;
    for (let i = 0; i < bookings.length; i++) {
      if ((newBooking.time === bookings[i].time) && (newBooking.date === bookings[i].date)) {
        notBooked = false;
        break;
      }
    }

    if (notBooked) {
      logger.debug(`adding new booking for Coach ${trainer.lastName} to the store`, newBooking);
      memberStore.addBooking(memberid, newBooking);
      trainerStore.addBooking(trainerid, newBooking);
      response.redirect('/dashboard/memberBookings');
    } else {
      logger.debug(`booking already made for Coach ${trainer.lastName}`);
      response.redirect('/dashboard/memberBookings');
    }
  },

  removeBooking(request, response) {
    logger.info('remove booking rendering');
    const loggedInMember = accounts.getCurrentMember(request);
    const bookingid = request.params.bookingid;
    const trainerid = request.params.trainerid;
    logger.debug(`removing bookingid: ${bookingid} from ${loggedInMember.firstName}`);
    memberStore.removeBooking(loggedInMember.memberid, bookingid);
    trainerStore.removeBooking(trainerid, bookingid);
    response.redirect('/dashboard/memberBookings');
  },

  memberEditBooking(request, response) {
    logger.info('edit booking rendering');
    const loggedInMember = accounts.getCurrentMember(request);
    const date = new Date(request.body.date);
    const bookingid = request.params.bookingid;
    const booking = memberStore.getBookingById(loggedInMember.memberid, bookingid);
    booking.time = request.body.time;
    booking.date = date.toDateString();
    logger.debug(`saving booking for ${loggedInMember.firstName} ${loggedInMember.lastName}`);
    memberStore.store.save();
    response.redirect('/dashboard/memberBookings');
  },

  memberUpdateBooking(request, response) {
    logger.info('update booking rendering ');
    const loggedInMember = accounts.getCurrentMember(request);
    const bookingid = request.params.bookingid;
    const bookingToUpdate = memberStore.getBookingById(loggedInMember.memberid, bookingid);
    const trainers = trainerStore.getAllTrainers();
    const viewData = {
      member: loggedInMember,
      bookingToUpdate: bookingToUpdate,
      trainers: trainers,
    };
    logger.debug(`updating bookingid: ${bookingid}`);
    response.render('memberUpdateBooking', viewData);
  },

  memberGoals(request, response) {
    logger.info('members goals rendering');
    const loggedInMember = accounts.getCurrentMember(request);
    const trainers = trainerStore.getAllTrainers();
    const goals = loggedInMember.goals;
    const viewData = {
      member: loggedInMember,
      trainers: trainers,
      goals: goals,
    };
    logger.debug(`create goals menu rendered for ${loggedInMember.firstName}`);
    response.render('memberGoals', viewData);
  },

  memberAddGoal(request, response) {
    logger.info('adding goal rendering');
    const loggedInMember = accounts.getCurrentMember(request);
    const memberid = loggedInMember.memberid;
    const date = new Date(request.body.date);
    const newGoal = {
      goalid: uuid(),
      date: date.toDateString(),
      area: request.body.area,
      goal: request.body.goal,
      description: request.body.description,
      status: 'open',
    };

    const goals = memberStore.getAllMemberGoals(memberid);
    let notSet = true;
    for (let i = 0; i < goals.length; i++) {
      if (newGoal.area === goals[i].area) {
        notSet = false;
        break;
      }
    }

    if (notSet) {
      logger.debug(`adding new goal for ${loggedInMember.firstName} to the store`, newGoal);
      memberStore.addGoal(memberid, newGoal);
      response.redirect('/dashboard/memberGoals');
    } else {
      logger.debug(`goal already set by ${loggedInMember.firstName}`);
      response.redirect('/dashboard/memberGoals');
    }
  },

  removeGoal(request, response) {
    logger.info('removing goal rendering');
    const goalid = request.params.goalid;
    const loggedInMember = accounts.getCurrentMember(request);
    logger.debug(`removing goalid: ${goalid} from ${loggedInMember.firstName}`);
    memberStore.removeGoal(loggedInMember.memberid, goalid);
    response.redirect('/dashboard/memberGoals');
  },
};

module.exports = dashboard;