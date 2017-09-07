/**
 * Author: Gary Fleming
 * Student No: 20019497
 * Start Date: Aug 1st 2017
 */

'use strict';

const _ = require('lodash'); //---------------------------------------------------> imports lodash (library for js)
const JsonStore = require('./json-store'); //-------------------------------------> imports json-store

//---> manage database of trainers <---//

const trainerStore = {
  store: new JsonStore('./models/trainer-store.json', { trainers: [] }),
  collection: 'trainers',

  getAllTrainers() {
    return this.store.findAll(this.collection); //--------------------------------> gets all trainers from the store
  },

  addTrainer(trainer) {
    this.store.add(this.collection, trainer); //----------------------------------> adds a trainer to the store
    this.store.save(); //---------------------------------------------------------> saves new results to store
  },

  getTrainerById(trainerid) {
    return this.store.findOneBy(this.collection, { trainerid: trainerid }); //----> gets a single trainer by id
  },

  getTrainerByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email }); //------------> gets a single trainer by email
  },

  getAllTrainerCLasses(trainerid) {
    const trainer = this.getTrainerById(trainerid); //----------------------------> getTrainerById and store it in trainer
    return trainer.classes; //----------------------------------------------------> returns classes of trainer
  },

  addBooking(trainerid, booking) {
    const trainer = this.getTrainerById(trainerid); //----------------------------> getTrainerById and store it in trainer
    trainer.bookings.push(booking); //--------------------------------------------> loads booking to the end of the pile
    this.store.save(); //---------------------------------------------------------> saves new results to store
  },

  getBookingById(trainerid, bookingid) {
    const trainer = this.getTrainerById(trainerid); //----------------------------> getTrainerById and store it in trainer
    for (let i = 0; i < trainer.bookings.length; i++) { //------------------------> for loop
      if (trainer.bookings[i].bookingid === bookingid) { //-----------------------> if bookingid is equal to one found then
        return trainer.bookings[i]; //--------------------------------------------> return that booking from the bookings in trainer
      }
    }
  },

  getAllTrainerBookings(trainerid) {
    const trainer = this.getTrainerById(trainerid); //----------------------------> getTrainerById and store it in trainer
    return trainer.bookings; //---------------------------------------------------> returns bookings of trainer
  },

  removeBooking(trainerid, bookingid) {
    const trainer = this.getTrainerById(trainerid); //----------------------------> getTrainerById and store it in trainer
    _.remove(trainer.bookings, { bookingid: bookingid }); //----------------------> removes bookingid from the bookings in trainer
    this.store.save(); //---------------------------------------------------------> saves new results to store
  },

  addGoal(trainerid, goal) {
    const trainer = this.getTrainerById(trainerid); //----------------------------> getTrainerById and stores it in trainer
    trainer.goals.push(goal); //--------------------------------------------------> loads goal to the front of the pile
    this.store.save(); //---------------------------------------------------------> saves new results to store
  },

  getGoalById(trainerid, goalid) {
    const trainer = this.getTrainerById(trainerid); //----------------------------> getTrainerById and store it in trainer
    for (let i = 0; i < trainer.goals.length; i++) { //---------------------------> for loop
      if (trainer.goals[i].goalid === goalid) { //--------------------------------> if goalid is equal to one found then
        return trainer.goals[i]; //-----------------------------------------------> return that goal from the goals in trainer
      }
    }
  },

  getAllTrainerGoals(trainerid) {
    const trainer = this.getTrainerById(trainerid); //----------------------------> getTrainerById and stores it in trainer
    return trainer.goals; //------------------------------------------------------> return goals of the trainer
  },

  removeGoal(trainerid, goalid) {
    const trainer = this.getTrainerById(trainerid); //----------------------------> getTrainerById and stores it in trainer
    _.remove(trainer.goals, { goalid: goalid }); //-------------------------------> removes goalid from the goals of trainer
    this.store.save(); //---------------------------------------------------------> saves new results to store
  },
};

module.exports = trainerStore; //-------------------------------------------------> this is the object that is then exported
