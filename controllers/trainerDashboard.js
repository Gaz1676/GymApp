/**
 * Author: Gary Fleming
 * Student No: 20019497
 * Start Date: Aug 1st 2017
 */

'use strict';

const logger = require('../utils/logger');
const accounts = require('./accounts.js');
const uuid = require('uuid');
const memberStore = require('../models/member-store.js');
const trainerStore = require('../models/trainer-store.js');
const classStore = require('../models/class-store.js');
const analytics = require('../utils/analytics.js');

const trainerDashboard = {
  index(request, response) {
    logger.info('trainer dashboard rendering');
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const members = memberStore.getAllMembers();
    const viewData = {
      title: 'Trainer Dashboard',
      trainer: loggedInTrainer,
      members: members,
    };
    logger.debug(`Coach ${loggedInTrainer.lastName} main menu page`);
    response.render('trainerDashboard', viewData);
  },

  trainerViewAssessments(request, response) {
    logger.info('view members assessments rendering');
    const memberid = request.params.memberid;
    const member = memberStore.getMemberById(memberid);
    const bmi = analytics.calculateBMI(member);
    const idealBodyWeight = analytics.idealBodyWeight(member);
    const viewData = {
      memberid: memberid,
      member: member,
      bmi: bmi,
      bmiCategory: analytics.BMICategory(bmi),
      idealBodyWeight: idealBodyWeight,
    };
    logger.debug(`view ${member.firstName} ${member.lastName}'s assessments`);
    response.render('trainerViewAssessments', viewData);
  },

  viewTrainerClasses(request, response) {
    logger.info('view trainer classes rendering');
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const classes = classStore.getAllClasses();
    const viewData = {
      title: 'Trainer Classes',
      trainer: loggedInTrainer,
      classes: classes,
    };
    logger.debug(`all classes rendered for Coach ${loggedInTrainer.lastName}`);
    response.render('viewTrainerClasses', viewData);
  },

  removeAssessment(request, response) {
    logger.info('remove assessment rendering');
    const memberid = request.params.memberid;
    const assessmentid = request.params.assessmentid;
    logger.debug(`removing ${memberStore.firstName}'s assessment by id: ${assessmentid}`);
    memberStore.removeAssessment(memberid, assessmentid);
    response.redirect('/trainerDashboard');
  },

  removeMember(request, response) {
    logger.info('removing member rendering');
    const memberid = request.params.memberid;
    logger.debug(`removing ${memberStore.firstName} by member id: ${memberid}`);
    memberStore.removeMember(memberid);
    response.redirect('/trainerDashboard');
  },

  updateComment(request, response) {
    logger.info('update comment rendering');
    const memberid = request.params.memberid;
    const assessmentid = request.params.assessmentid;
    const comment = request.body.comment;
    const assessment = memberStore.getAssessmentById(memberid, assessmentid);
    assessment.comment = comment;
    logger.debug(`saving updated comment for memberid: ${memberid}`);
    memberStore.store.save();
    response.redirect('/trainerDashboard');
  },

  trainerClasses(request, response) {
    logger.info('create class rendering ');
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const classes = classStore.getAllClasses();
    const viewData = {
      trainer: loggedInTrainer,
      classes: classes,
    };
    logger.debug(`create classes menu rendered for Coach ${loggedInTrainer.lastName}`);
    response.render('trainerClasses', viewData);
  },

  addClass(request, response) {
    logger.info('add a new class rendering');
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const date = new Date(request.body.date);
    const newClass = {
      trainerid: loggedInTrainer.trainerid,
      classid: uuid(),
      name: request.body.name,
      capacity: Number(request.body.capacity),
      difficulty: request.body.difficulty,
      noOfWorkouts: Number(request.body.noOfWorkouts),
      duration: Number(request.body.duration),
      date: date.toDateString(),
      time: request.body.time,
      workouts: [],
    };
    for (let i = 0; i < request.body.noOfWorkouts; i++) {
      const date = new Date(request.body.date);
      const nextDate = (i * 7);
      const workoutDate = new Date(date.setTime(date.getTime() + (nextDate * 86400000)));
      const workout = {
        workoutid: uuid(),
        workoutDate: workoutDate.toDateString(),
        currentCapacity: 0,
        capacity: Number(request.body.capacity),
        members: [],
      };
      newClass.workouts.push(workout);
    }

    const classes = classStore.getAllClasses();
    let notCreated = true;
    for (let i = 0; i < classes.length; i++) {
      if ((newClass.date === classes[i].date) && (newClass.time === classes[i].time)) {
        notCreated = false;
        break;
      }
    }

    if (notCreated) {
      logger.debug(`adding new class for Coach ${loggedInTrainer.lastName} to the store`);
      classStore.addClass(newClass);
      response.redirect('/trainerDashboard/viewTrainerClasses');
    } else {
      logger.debug(`class already made for Coach ${loggedInTrainer.lastName}`);
      response.redirect('/trainerDashboard/trainerClasses');
    }
  },

  trainerEditTime(request, response) {
    logger.info('editing time rendering ');
    const classid = request.params.classid;
    const newClass = classStore.getClassById(classid);
    newClass.time = request.body.time;
    logger.debug(`saving edited time for classid: ${classid}`);
    classStore.store.save();
    response.redirect('/trainerDashboard/viewTrainerClasses');
  },

  trainerEditDuration(request, response) {
    logger.info('editing duration rendering ');
    const classid = request.params.classid;
    const newClass = classStore.getClassById(classid);
    newClass.duration = Number(request.body.duration);
    logger.debug(`saving edited duration for classid: ${classid}`);
    classStore.store.save();
    response.redirect('/trainerDashboard/viewTrainerClasses');
  },

  trainerEditDifficulty(request, response) {
    logger.info('editing difficulty rendering ');
    const classid = request.params.classid;
    const newClass = classStore.getClassById(classid);
    newClass.difficulty = request.body.difficulty;
    logger.debug(`saving edited difficulty for classid: ${classid}`);
    classStore.store.save();
    response.redirect('/trainerDashboard/viewTrainerClasses');
  },

  trainerEditCapacity(request, response) {
    logger.info('editing difficulty rendering ');
    const classid = request.params.classid;
    const newClass = classStore.getClassById(classid);
    newClass.capacity = Number(request.body.capacity);
    logger.debug(`saving edited capacity for classid: ${classid}`);
    classStore.store.save();
    response.redirect('/trainerDashboard/viewTrainerClasses');
  },

  trainerUpdateClass(request, response) {
    logger.info('updating class rendering ');
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const classid = request.params.classid;
    const classToUpdate = classStore.getClassById(classid);
    const viewData = {
      classToUpdate: classToUpdate,
    };
    logger.debug(`details/update class menu rendered for Coach ${loggedInTrainer.lastName}`);
    response.render('trainerUpdateClass', viewData);
  },

  removeClass(request, response) {
    logger.info('remove class rendering');
    const classid = request.params.classid;
    logger.debug(`removing classid: ${classid}`);
    classStore.removeClass(classid);
    response.redirect('/trainerDashboard/viewTrainerClasses');
  },

  trainerBookings(request, response) {
    logger.info('trainer bookings rendering');
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const members = memberStore.getAllMembers();
    const bookings = loggedInTrainer.bookings;
    const viewData = {
      trainer: loggedInTrainer,
      members: members,
      bookings: bookings,
    };
    logger.debug(`create bookings menu rendered for Coach ${loggedInTrainer.lastName}`);
    response.render('trainerBookings', viewData);
  },

  trainerAddBooking(request, response) {
    logger.info('trainer add booking rendering');
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const trainerid = loggedInTrainer.trainerid;
    const memberid = request.body.memberid;
    const member = memberStore.getMemberById(memberid);
    const date = new Date(request.body.date);
    const newBooking = {
      bookingid: uuid(),
      memberid: memberid,
      trainerid: trainerid,
      date: date.toDateString(),
      time: request.body.time,
      memberfirstname: member.firstName,
      memberlastname: member.lastName,
      coachlastname: loggedInTrainer.lastName,
    };

    const bookings = memberStore.getAllMemberBookings(memberid);
    let notBooked = true;
    for (let i = 0; i < bookings.length; i++) {
      if ((newBooking.time === bookings[i].time) && (newBooking.date === bookings[i].date)) {
        notBooked = false;
        break;
      }
    }

    if (notBooked) {
      logger.debug(`adding new booking for Coach ${loggedInTrainer.lastName} to the store`);
      memberStore.addBooking(memberid, newBooking);
      trainerStore.addBooking(trainerid, newBooking);
      response.redirect('/trainerDashboard/trainerBookings');
    } else {
      logger.debug(`booking already made for ${member.firstName} ${member.lastName}`);
      response.redirect('/trainerDashboard/trainerBookings');
    }
  },

  removeBooking(request, response) {
    logger.info('remove booking rendering');
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const bookingid = request.params.bookingid;
    const memberid = request.params.memberid;
    logger.debug(`removing bookingid: ${bookingid} from Coach ${loggedInTrainer.lastName}`);
    trainerStore.removeBooking(loggedInTrainer.trainerid, bookingid);
    memberStore.removeBooking(memberid, bookingid);
    response.redirect('/trainerDashboard/trainerBookings');
  },

  trainerEditBooking(request, response) {
    logger.info('updating booking rendering');
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const bookingid = request.params.bookingid;
    const bookingToUpdate = trainerStore.getBookingById(loggedInTrainer.trainerid, bookingid);
    const date = new Date(request.body.date);
    bookingToUpdate.time = request.body.time;
    bookingToUpdate.date = date.toDateString();
    logger.debug(`updating booking for Coach ${loggedInTrainer.lastName}`);
    trainerStore.store.save();
    response.redirect('/trainerDashboard/trainerBookings');
  },

  trainerUpdateBooking(request, response) {
    logger.info('update booking rendering ');
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const bookingid = request.params.bookingid;
    const bookingToUpdate = trainerStore.getBookingById(loggedInTrainer.trainerid, bookingid);
    const members = memberStore.getAllMembers();
    const viewData = {
      bookingToUpdate: bookingToUpdate,
      members: members,
    };
    logger.debug(`updating bookingid: ${bookingid} page rendered`);
    response.render('trainerUpdateBooking', viewData);
  },

  trainerGoals(request, response) {
    logger.info('members goals rendering');
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const members = memberStore.getAllMembers();
    const goals = loggedInTrainer.goals;
    const viewData = {
      trainer: loggedInTrainer,
      members: members,
      goals: goals,
    };
    logger.debug(`create goals menu rendered for ${loggedInTrainer.lastName}`);
    response.render('trainerGoals', viewData);
  },

  trainerAddGoal(request, response) {
    logger.info('trainer add goals rendering');
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const trainerid = loggedInTrainer.trainerid;
    const memberid = request.body.memberid;
    const member = memberStore.getMemberById(memberid);
    const date = new Date(request.body.date);
    const newGoal = {
      goalid: uuid(),
      memberid: memberid,
      trainerid: trainerid,
      memberfirstname: member.firstName,
      memberlastname: member.lastName,
      coachlastname: loggedInTrainer.lastName,
      date: date.toDateString(),
      area: request.body.area,
      goal: Number(request.body.goal),
      description: request.body.description,
      status: 'open',
    };

    const goals = memberStore.getAllMemberGoals(memberid);
    let noGoals = true;
    for (let i = 0; i < goals.length; i++) {
      if ((newGoal.time === goals[i].time) && (newGoal.date === goals[i].date)) {
        noGoals = false;
        break;
      }
    }

    if (noGoals) {
      logger.debug(`adding new goals for Coach ${loggedInTrainer.lastName} to the store`);
      memberStore.addGoal(memberid, newGoal);
      trainerStore.addGoal(trainerid, newGoal);
      response.redirect('/trainerDashboard/trainerGoals');
    } else {
      logger.debug(`goal already made for ${member.firstName} ${member.lastName}`);
      response.redirect('/trainerDashboard/trainerGoals');
    }
  },

  removeGoal(request, response) {
    logger.info('removing goal rendering');
    const goalid = request.params.goalid;
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    logger.debug(`removing goalid: ${goalid} from ${loggedInTrainer.lastName}`);
    trainerStore.removeGoal(loggedInTrainer.trainerid, goalid);
    response.redirect('/trainerDashboard/trainerGoals');
  },

  editTargetDate(request, response) {
    logger.info('updating class rendering ');
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const goalid = request.params.goalid;
    const goalToUpdate = trainerStore.getGoalById(loggedInTrainer.trainerid, goalid);
    const date = new Date(request.body.date);
    goalToUpdate.date = date.toDateString();
    logger.debug(`updating goal for Coach ${loggedInTrainer.lastName}`);
    trainerStore.store.save();
    response.redirect('/trainerDashboard/trainerGoals');
  },

  editTargetArea(request, response) {
    logger.info('updating class rendering ');
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const goalid = request.params.goalid;
    const goalToUpdate = trainerStore.getGoalById(loggedInTrainer.trainerid, goalid);
    goalToUpdate.area = request.body.area;
    logger.debug(`updating goal for Coach ${loggedInTrainer.lastName}`);
    trainerStore.store.save();
    response.redirect('/trainerDashboard/trainerGoals');
  },

  editTargetGoal(request, response) {
    logger.info('updating class rendering ');
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const goalid = request.params.goalid;
    const goalToUpdate = trainerStore.getGoalById(loggedInTrainer.trainerid, goalid);
    goalToUpdate.goal = request.body.goal;
    logger.debug(`updating goal for Coach ${loggedInTrainer.lastName}`);
    trainerStore.store.save();
    response.redirect('/trainerDashboard/trainerGoals');
  },

  editDescription(request, response) {
    logger.info('updating class rendering ');
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const goalid = request.params.goalid;
    const goalToUpdate = trainerStore.getGoalById(loggedInTrainer.trainerid, goalid);
    goalToUpdate.description = request.body.description;
    logger.debug(`updating description for Coach ${loggedInTrainer.lastName}`);
    trainerStore.store.save();
    response.redirect('/trainerDashboard/trainerGoals');
  },

  trainerUpdateGoal(request, response) {
    logger.info('update booking rendering ');
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const goalid = request.params.goalid;
    const goalToUpdate = trainerStore.getGoalById(loggedInTrainer.trainerid, goalid);
    const members = memberStore.getAllMembers();
    const viewData = {
      goalToUpdate: goalToUpdate,
      members: members,
    };
    logger.debug(`updating goalid: ${goalid} page rendered`);
    response.render('trainerUpdateGoal', viewData);
  },
};

module.exports = trainerDashboard;