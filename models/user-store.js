//---> manage database of users <---//

'use strict';

const _ = require('lodash'); //----------------------------------------------> library for javascript
const JsonStore = require('./json-store');

const userStore = {

  store: new JsonStore('./models/user-store.json', { users: [] }),
  collection: 'users',

  getAllUsers() {
    return this.store.findAll(this.collection); //---------------------------> gets all users from the store
  },

  addUser(user) {
    this.store.add(this.collection, user); //--------------------------------> adds a user to the store
    this.store.save(); //----------------------------------------------------> saves user to user-store.json
  },

  getUserById(id) {
    return this.store.findOneBy(this.collection, { id: id }); //-------------> gets a single user by id from results
  },

  getUserByEmail(email) {

    return this.store.findOneBy(this.collection, { email: email }); //-------> gets a single user by email from result
  },
};

module.exports = userStore; //------------------------------------------------> this is the object that is then exported
