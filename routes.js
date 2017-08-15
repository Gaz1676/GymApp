'use strict';

const express = require('express'); //--------------------------------------> accessing dependencies
const router = express.Router();

// Objects //

const index = require('./controllers/index.js');
const dashboard = require('./controllers/dashboard.js');
const trainerDashboard = require('./controllers/trainerDashboard.js'); //----> imports these objects
const about = require('./controllers/about.js');
const accounts = require('./controllers/accounts.js');
const classes = require('./controllers/classes.js');

// Links //

router.get('/', accounts.index);
router.get('/about', about.index);
router.get('/classes', classes.index);
router.get('/index', index.index); //----------------------------------------> matches the objects with each of these links
router.get('/dashboard', dashboard.index);
router.get('/trainerDashboard', trainerDashboard.index);

// Accounts //

router.get('/login', accounts.login);
router.get('/signup', accounts.signup);
router.get('/logout', accounts.logout);
router.post('/register', accounts.register);
router.post('/authenticate', accounts.authenticate);

// Dashboard //

router.post('/dashboard/addassessment', dashboard.addAssessment);
router.get('/dashboard/removeassessment/:assessmentid', dashboard.removeAssessment);
router.get('/dashboard/allmemberclasses', dashboard.allMemberClasses);
router.get('/settings', dashboard.settings);
router.post('/settings', dashboard.updateProfile);

// Trainer Dashboard //

router.get('/trainerDashboard/removemember/:memberid', trainerDashboard.removeMember);
router.get('/trainerDashboard/viewassessments/:memberid', trainerDashboard.viewAssessments);
router.get('/trainerDashboard/:memberid/removeassessment/:assessmentid', trainerDashboard.removeAssessment);
router.post('/assessment/:memberid/updatecomment/:assessmentid', trainerDashboard.updateComment);

router.post('/trainerDashboard/addclass', trainerDashboard.addClass);
router.get('/trainerDashboard/allclasses', trainerDashboard.allClasses);
router.get('/trainerDashboard/:trainerid/removeclass/:classid', trainerDashboard.removeClass);

router.post('/trainerDashboard/editclass/', trainerDashboard.editClass); //TODO
router.get('/trainerDashboard/editclass/:classid', trainerDashboard.viewEditClass); //TODO

module.exports = router;
