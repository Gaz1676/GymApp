/**
 * Author: Gary Fleming
 * Student No: 20019497
 * Start Date: Aug 1st 2017
 */

'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

const trainerStore = {
  store: new JsonStore('./models/trainer-store.json', { trainers: [] }),
  collection: 'trainers',

  getAllTrainers() {
    return this.store.findAll(this.collection);
  },

  addTrainer(trainer) {
    this.store.add(this.collection, trainer);
    this.store.save();
  },

  getTrainerById(trainerid) {
    return this.store.findOneBy(this.collection, { trainerid: trainerid });
  },

  getTrainerByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },

  getAllTrainerCLasses(trainerid) {
    const trainer = this.getTrainerById(trainerid);
    return trainer.classes;
  },

  addBooking(trainerid, booking) {
    const trainer = this.getTrainerById(trainerid);
    trainer.bookings.push(booking);
    this.store.save();
  },

  getBookingById(trainerid, bookingid) {
    const trainer = this.getTrainerById(trainerid);
    for (let i = 0; i < trainer.bookings.length; i++) {
      if (trainer.bookings[i].bookingid === bookingid) {
        return trainer.bookings[i];
      }
    }
  },

  getAllTrainerBookings(trainerid) {
    const trainer = this.getTrainerById(trainerid);
    return trainer.bookings;
  },

  removeBooking(trainerid, bookingid) {
    const trainer = this.getTrainerById(trainerid);
    _.remove(trainer.bookings, { bookingid: bookingid });
    this.store.save();
  },

  addGoal(trainerid, goal) {
    const trainer = this.getTrainerById(trainerid);
    trainer.goals.push(goal);
    this.store.save();
  },

  getGoalById(trainerid, goalid) {
    const trainer = this.getTrainerById(trainerid);
    for (let i = 0; i < trainer.goals.length; i++) {
      if (trainer.goals[i].goalid === goalid) {
        return trainer.goals[i];
      }
    }
  },

  getAllTrainerGoals(trainerid) {
    const trainer = this.getTrainerById(trainerid);
    return trainer.goals;
  },

  removeGoal(trainerid, goalid) {
    const trainer = this.getTrainerById(trainerid);
    _.remove(trainer.goals, { goalid: goalid });
    this.store.save();
  },
};

module.exports = trainerStore;
