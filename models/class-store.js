/**
 * Author: Gary Fleming
 * Student No: 20019497
 * Start Date: Aug 1st 2017
 */

'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

const classStore = {
  store: new JsonStore('./models/class-store.json', { classes: [] }),
  collection: 'classes',

  getAllClasses() {
    return this.store.findAll(this.collection);
  },

  addClass(newClass) {
    this.store.add(this.collection, newClass);
    this.store.save();
  },

  getClassById(classid) {
    return this.store.findOneBy(this.collection, { classid: classid });
  },

  getWorkoutById(classid, workoutid) {
    const currentClass = this.getClassById(classid);
    for (let i = 0; i < currentClass.workouts.length; i++) {
      if (currentClass.workouts[i].workoutid === workoutid) {
        return currentClass.workouts[i];
      }
    }
  },

  removeClass(classid) {
    const classes = this.getClassById(classid);
    this.store.remove(this.collection, classes);
    this.store.save();
  },
};

module.exports = classStore;
