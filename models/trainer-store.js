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
};

module.exports = trainerStore; //-------------------------------------------------> this is the object that is then exported
