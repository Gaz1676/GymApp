/**
 * Author: Gary Fleming
 * Student No: 20019497
 * Start Date: Aug 1st 2017
 */

'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');
const logger = require('../utils/logger.js');
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

const memberStore = {
  store: new JsonStore('./models/member-store.json', { members: [] }),
  collection: 'members',

  getAllMembers() {
    return this.store.findAll(this.collection);
  },

  addMember(member) {
    this.store.add(this.collection, member);
    this.store.save();
  },

  getMemberById(memberid) {
    return this.store.findOneBy(this.collection, { memberid: memberid });
  },

  removeMember(memberid) {
    const member = this.getMemberById(memberid);
    this.store.remove(this.collection, member);
    this.store.save();
  },

  getMemberByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },

  addAssessment(memberid, assessment) {
    const member = this.getMemberById(memberid);
    member.assessments.unshift(assessment);
    this.store.save();
  },

  getAssessmentById(memberid, assessmentid) {
    const member = this.getMemberById(memberid);
    for (let i = 0; i < member.assessments.length; i++) {
      if (member.assessments[i].assessmentid === assessmentid) {
        return member.assessments[i];
      }
    }
  },

  removeAssessment(memberid, assessmentid) {
    const member = this.getMemberById(memberid);
    _.remove(member.assessments, { assessmentid: assessmentid });
    this.store.save();
  },

  addBooking(memberid, booking) {
    const member = this.getMemberById(memberid);
    member.bookings.push(booking);
    this.store.save();
  },

  getBookingById(memberid, bookingid) {
    const member = this.getMemberById(memberid);
    for (let i = 0; i < member.bookings.length; i++) {
      if (member.bookings[i].bookingid === bookingid) {
        return member.bookings[i];
      }
    }
  },

  getAllMemberBookings(memberid) {
    const member = this.getMemberById(memberid);
    return member.bookings;
  },

  removeBooking(memberid, bookingid) {
    const member = this.getMemberById(memberid);
    _.remove(member.bookings, { bookingid: bookingid });
    this.store.save();
  },

  addGoal(memberid, goal) {
    const member = this.getMemberById(memberid);
    member.goals.push(goal);
    this.store.save();
  },

  removeGoal(memberid, goalid) {
    const member = this.getMemberById(memberid);
    _.remove(member.goals, { goalid: goalid });
    this.store.save();
  },

  getAllMemberGoals(memberid) {
    const member = this.getMemberById(memberid);
    return member.goals;
  },

  addPicture(member, imageFile, response) {
    const id = path.parse(member.img);
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

module.exports = memberStore;
