'use strict';

const _ = require('lodash'); //----------------------------------------------> imports lodash (library for js)
const JsonStore = require('./json-store'); //--------------------------------> imports json-store

//---> manage database of members <---//

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

  getClassById(classId) {
    return this.store.findOneBy(this.collection, { classId: classId }); //-------------> gets a single class by id
  },

  removeClass(classId) {
    const classes = this.getClassById(classId); //--------------------------------> gets class by id and stores it in classes
    this.store.remove(this.collection, classes); //--------------------------> the classes from the collection is removed from the store
    this.store.save(); //----------------------------------------------------> saves new results to store
  },
};

module.exports = classStore; //----------------------------------------------> this is the object that is then exported
