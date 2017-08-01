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

  getTrainerById(id) {
    return this.store.findOneBy(this.collection, { id: id }); //------------------> gets a single trainer by id 
  },

  getTrainerByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email }); //------------> gets a single trainer by email 
  },
  
  addAllMembers(id, members) {
    const trainer = this.getTrainerById(id); //-----------------------------------> gets trainer by id and stores it in trainer
    trainer.members.push(members); //---------------------------------------------> loads members to the end of pile
    this.store.save(); //---------------------------------------------------------> saves new results to store
  },
};

module.exports = trainerStore; //-------------------------------------------------> this is the object that is then exported