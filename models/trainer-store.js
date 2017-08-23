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

  addBooking(trainerid, booking) {
    const trainer = this.getTrainerById(trainerid); //-----------------------------> get member by id and store it in member
    trainer.bookings.push(booking); //-------------------------------------------> loads booking to the end of the pile
    this.store.save(); //-------------------------------------------------------> saves new results to store
  },

  getBookingById(trainerid, bookingid) {
    const trainer = this.getTrainerById(trainerid); //-----------------------------> get member by id and stores it in member
    for (let i = 0; i < trainer.bookings.length; i++) { //-----------------------> for loop
      if (trainer.bookings[i].bookingid === bookingid) { //----------------------> if bookingid is equal to one found then
        return trainer.bookings[i]; //-------------------------------------------> return that boking from the bookings in member
      }
    }
  },

  removeBooking(trainerid, bookingid) {
    const trainer = this.getTrainerById(trainerid); //-----------------------------> getsMemberId and stores it in member
    _.remove(trainer.bookings, { bookingid: bookingid }); //---------------------> removes bookingid from the bookings in member
    this.store.save(); //-------------------------------------------------------> saves new results to store
  },
};

module.exports = trainerStore; //-------------------------------------------------> this is the object that is then exported
