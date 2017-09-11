/**
 * Author: Gary Fleming
 * Student No: 20019497
 * Start Date: Aug 1st 2017
 */

'use strict';

const low = require('lowdb');
const fileAsync = require('lowdb/lib/storages/file-async');

class JsonStore {
  constructor(file, defaults) {
    this.db = low(file, { storage: fileAsync, });
    this.db.defaults(defaults).value();
  }

  save() {
    this.db.write();
  }

  add(collection, obj) {
    this.db.get(collection).push(obj).last().value();
  }

  remove(collection, obj) {
    this.db.get(collection).remove(obj).value();
  }

  removeAll(collection) {
    this.db.get(collection).remove().value();
  }

  findAll(collection) {
    return this.db.get(collection).value();
  }

  findOneBy(collection, filter) {
    const results = this.db.get(collection).filter(filter).value();
    return results[0];
  }

  findByIds(collection, ids) {
    return this.db.get(collection).keyBy('id').at(ids).value();
  }

  findBy(collection, filter) {
    return this.db.get(collection).filter(filter).value();
  }
}

module.exports = JsonStore;
