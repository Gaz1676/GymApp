/**
 * Author: Gary Fleming
 * Student No: 20019497
 * Start Date: Aug 1st 2017
 */

'use strict';

const logger = require('../utils/logger.js');
const uuid = require('uuid');
const memberStore = require('../models/member-store.js');
const trainerStore = require('../models/trainer-store.js');

const accounts = {
  index(request, response) {
    const viewData = {
      title: 'Home',
    };
    response.render('index', viewData);
  },

  login(request, response) {
    const viewData = {
      title: 'Login to the gym',
    };
    response.render('login', viewData);
  },

  logout(request, response) {
    response.cookie('member', '');
    response.redirect('/');
  },

  signup(request, response) {
    const viewData = {
      title: 'Sign up to the gym',
    };
    response.render('signup', viewData);
  },

  tAndC(request, response) {
    const viewData = {
      title: 'T&c\'s to the gym',
    };
    response.render('tAndC', viewData);
  },

  register(request, response) {
    const member = request.body;
    member.memberid = uuid();
    if (member.gender === 'male') {
      member.img = 'http://res.cloudinary.com/cloud101/image/upload/v1504124210/man_emkpmv.png';
    } else {
      member.img = 'http://res.cloudinary.com/cloud101/image/upload/v1504124216/woman_kfhqfq.png';
    }

    member.assessments = [];
    member.bookings = [];
    member.goals = [];

    if (memberStore.getMemberByEmail(member.email)) {
      logger.debug(`email: ${member.email} already registered to database`);
      response.render('signup');
    } else {
      memberStore.addMember(member);
      logger.debug(`registering ${member.email}`);
      response.redirect('/login');
    }
  },

  authenticate(request, response) {
    const member = memberStore.getMemberByEmail(request.body.email);
    const trainer = trainerStore.getTrainerByEmail(request.body.email);
    if (member && member.password === request.body.password) {
      response.cookie('member', member.memberid);
      logger.debug(`logging in ${member.email}`);
      response.redirect('/dashboard');
    } else if (trainer && trainer.password === request.body.password) {
      response.cookie('trainer', trainer.trainerid);
      logger.debug(`logging in ${trainer.email}`);
      response.redirect('/trainerDashboard');
    } else {
      logger.debug(`authentication failed`);
      response.redirect('/login');
    }
  },

  getCurrentMember(request) {
    const memberid = request.cookies.member;
    return memberStore.getMemberById(memberid);
  },

  getCurrentTrainer(request) {
    const trainerid = request.cookies.trainer;
    return trainerStore.getTrainerById(trainerid);
  },
};

module.exports = accounts;
