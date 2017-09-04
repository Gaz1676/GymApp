/**
 * Author: Gary Fleming
 * Student No: 20019497
 * Start Date: Aug 1st 2017
 */

'use strict';

const _ = require('lodash'); //-------------------------------------------------> imports lodash (library for js)
const JsonStore = require('./json-store'); //-----------------------------------> imports json-store
const logger = require('../utils/logger.js'); //--------------------------------------------------------> imports logger
const cloudinary = require('cloudinary');
const path = require('path');

try {
  const env = require('../.data/.env.json');
  cloudinary.config(env.cloudinary);
}
catch (e) {
  logger.info('You must provide a Cloudinary credentials file - see README.md');
  process.exit(1);
}

//---> manage database of members <---//

const memberStore = {
  store: new JsonStore('./models/member-store.json', { members: [] }),
  collection: 'members',

  getAllMembers() {
    return this.store.findAll(this.collection); //------------------------------> gets all members from the store
  },

  addMember(member) {
    this.store.add(this.collection, member); //---------------------------------> adds a member to the store
    this.store.save(); //-------------------------------------------------------> saves new results to store
  },

  getMemberById(memberid) {
    return this.store.findOneBy(this.collection, { memberid: memberid }); //----> gets a single member by id
  },

  removeMember(memberid) {
    const member = this.getMemberById(memberid); //-----------------------------> getsMemberById and stores it in member
    this.store.remove(this.collection, member); //------------------------------> the member from the collection is removed from the store
    this.store.save(); //-------------------------------------------------------> saves new results to store
  },

  getMemberByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email }); //----------> gets a single member by email
  },

  addAssessment(memberid, assessment) {
    const member = this.getMemberById(memberid); //-----------------------------> getsMemberById and stores it in member
    member.assessments.unshift(assessment); //----------------------------------> loads assessment to the front of the pile
    this.store.save(); //-------------------------------------------------------> saves new results to store
  },

  getAssessmentById(memberid, assessmentid) {
    const member = this.getMemberById(memberid); //-----------------------------> getsMemberById and stores it in member
    for (let i = 0; i < member.assessments.length; i++) { //--------------------> for loop
      if (member.assessments[i].assessmentid === assessmentid) { //-------------> if assessmentid is equal to one found then
        return member.assessments[i]; //----------------------------------------> return that assessment from the assessments in member
      }
    }
  },

  removeAssessment(memberid, assessmentid) {
    const member = this.getMemberById(memberid); //-----------------------------> getsMemberById and stores it in member
    _.remove(member.assessments, { assessmentid: assessmentid }); //------------> remove assessment by id from members assessments
    this.store.save(); //-------------------------------------------------------> saves new results to store
  },

  addBooking(memberid, booking) {
    const member = this.getMemberById(memberid); //-----------------------------> getsMemberById and stores it in member
    member.bookings.push(booking); //-------------------------------------------> loads booking to the end of the pile
    this.store.save(); //-------------------------------------------------------> saves new results to store
  },

  getBookingById(memberid, bookingid) {
    const member = this.getMemberById(memberid); //-----------------------------> getsMemberById and stores it in member
    for (let i = 0; i < member.bookings.length; i++) { //-----------------------> for loop
      if (member.bookings[i].bookingid === bookingid) { //----------------------> if bookingid is equal to one found then
        return member.bookings[i]; //-------------------------------------------> return that booking from the bookings in member
      }
    }
  },

  getAllMemberBookings(memberid) {
    const member = this.getMemberById(memberid); //-----------------------------> getsMemberById and stores it in member
    return member.bookings; //--------------------------------------------------> returns bookings of the member
  },

  removeBooking(memberid, bookingid) {
    const member = this.getMemberById(memberid); //-----------------------------> getsMemberById and stores it in member
    _.remove(member.bookings, { bookingid: bookingid }); //---------------------> removes bookingid from the bookings of member
    this.store.save(); //-------------------------------------------------------> saves new results to store
  },

  addGoal(memberid, goal) {
    const member = this.getMemberById(memberid); //-----------------------------> getsMemberById and stores it in member
    member.goals.push(goal); //-------------------------------------------------> loads assessment to the front of the pile
    this.store.save(); //-------------------------------------------------------> saves new results to store
  },

  getAllMemberGoals(memberid) {
    const member = this.getMemberById(memberid); //-----------------------------> getsMemberById and stores it in member
    return member.goals; //-----------------------------------------------------> return goals of the member
  },

  removeGoal(memberid, goalid) {
    const member = this.getMemberById(memberid); //-----------------------------> getsMemberById and stores it in member
    _.remove(member.goals, { goalid: goalid }); //------------------------------> removes goalid from the goals of member
    this.store.save(); //-------------------------------------------------------> saves new results to store
  },

  addPicture(member, imageFile, response) {
    const id = path.parse(member.img); //---------------------------------------> gets img from member and stores it in id
    cloudinary.api.delete_resources([id.name], function (result) {
          console.log(result);
        }
    );
    imageFile.mv('tempimage', err => {
      if (!err) {
        cloudinary.uploader.upload('tempimage', result => {
          console.log(result);
          member.img = result.url;
          this.store.save();
          response();
        });
      }
    });
  },
};

module.exports = memberStore; //------------------------------------------------> this is the object that is then exported
