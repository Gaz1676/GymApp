'use strict';

const _ = require('lodash'); //----------------------------------------------> imports lodash (library for js)
const JsonStore = require('./json-store'); //--------------------------------> imports json-store

//---> manage database of classes <---//

const classStore = {
  store: new JsonStore('./models/class-store.json', { classes: [] }),
  collection: 'classes',

  getAllClasses() {
    return this.store.findAll(this.collection); //---------------------------> gets all classes from the store
  },

  addClass(newClass) {
    this.store.add(this.collection, newClass); //----------------------------> adds a newClass to the store
    this.store.save(); //----------------------------------------------------> saves new results to store
  },

  getClassById(classid) {
    return this.store.findOneBy(this.collection, { classid: classid }); //---> gets a single class by id
  },

  getWorkoutById(classid, workoutid) {
    const thisClass = this.getClassById(classid); //-------------------------> gets classById from this location, stores it in thisClass
    for (let i = 0; i < thisClass.workouts.length; i++) { //-----------------> for loop
      if (thisClass.workouts[i].workoutid === workoutid) { //----------------> if workoutid is equal to the one found
        return thisClass.workouts[i]; //-------------------------------------> then return that workout from the workouts in thisClass
      }
    }
  },

  removeClass(classid) {
    const classes = this.getClassById(classid); //---------------------------> gets class by id and stores it in classes
    this.store.remove(this.collection, classes); //--------------------------> the classes from the collection is removed from the store
    this.store.save(); //----------------------------------------------------> saves new results to store
  },
};

module.exports = classStore; //----------------------------------------------> this is the object that is then exported
