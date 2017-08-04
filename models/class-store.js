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

  getClassById(id) {
    return this.store.findOneBy(this.collection, { id: id }); //-------------> gets a single class by id
  },

  removeClass(id) {
    const scheduledClass = this.getClassById(id); //-------------------------> gets class by id and stores it in scheduledClass
    this.store.remove(this.collection, scheduledClass); //-------------------> the scheduledClass from the collection is removed from the store
    this.store.save(); //----------------------------------------------------> saves new results to store
  },

  getClassById(memberId, id) {
    const member = this.getMemberById(id); //--------------------------------> get member by id
    for (let i = 0; i < member.classes.length; i++) { //---------------------> for 'i' is less than classes.length in member, increment by one
      if (member.classes[i].id === id) { //----------------------------------> if class id is equal to one found then
        return member.classes[i]; //-----------------------------------------> return that class from the classes in member
      }
    }
  },
};

module.exports = classStore; //---------------------------------------------> this is the object that is then exported
