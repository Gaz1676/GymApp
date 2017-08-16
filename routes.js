'use strict';

const express = require('express'); //--------------------------------------> accessing dependencies
const router = express.Router();

// Objects //

const index = require('./controllers/index.js');
const dashboard = require('./controllers/dashboard.js');
const trainerDashboard = require('./controllers/trainerDashboard.js'); //----> imports these objects
const about = require('./controllers/about.js');
const accounts = require('./controllers/accounts.js');

// Links //

router.get('/', accounts.index);
router.get('/about', about.index);
router.get('/index', index.index); //----------------------------------------> matches the objects with each of these links
router.get('/dashboard', dashboard.index);
router.get('/trainerDashboard', trainerDashboard.index);

// Accounts //

router.get('/login', accounts.login);
router.get('/signup', accounts.signup);
router.get('/logout', accounts.logout);
router.post('/register', accounts.register);
router.post('/authenticate', accounts.authenticate);

// Member Dashboard //
router.post('/dashboard/addassessment', dashboard.addAssessment);
router.get('/dashboard/removeassessment/:assessmentid', dashboard.removeAssessment);
router.get('/dashboard/memberclasses', dashboard.memberClasses);

// Trainer Dashboard //

router.get('/trainerDashboard/removemember/:memberid', trainerDashboard.removeMember);
router.get('/trainerDashboard/viewassessments/:memberid', trainerDashboard.viewAssessments);
router.get('/trainerDashboard/:memberid/removeassessment/:assessmentid', trainerDashboard.removeAssessment);
router.post('/trainerDashboard/:memberid/updatecomment/:assessmentid', trainerDashboard.updateComment);

router.get('/trainerDashboard/createclasses', trainerDashboard.createClasses);
router.post('/trainerDashboard/addclass', trainerDashboard.addClass);
router.get('/trainerDashboard/viewtrainerclasses', trainerDashboard.viewTrainerClasses);
router.get('/trainerDashboard/removeclass/:classid', trainerDashboard.removeClass);

// Settings //

router.get('/settings', dashboard.settings);
router.post('/settings', dashboard.updateProfile);
router.get('/classSettings', trainerDashboard.classSettings); //TODO
router.post('/classSettings', trainerDashboard.updateClass); //TODO

//router.get('/dashboard/enrollmember/:memberid/intoclass/:classid', dashboard.enrollMember);
//router.get('/dashboard/unenroll/:memberid/fromclass/:classid', dashboard.unenrollMember);

module.exports = router;
