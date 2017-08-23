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

router.get('/tAndC', accounts.tAndC);
router.get('/login', accounts.login);
router.get('/signup', accounts.signup);
router.get('/logout', accounts.logout);
router.post('/register', accounts.register);
router.post('/authenticate', accounts.authenticate);

// Member Settings //

router.get('/settings', dashboard.settings);
router.post('/settings', dashboard.updateProfile);

// Member Assessments //

router.post('/dashboard/addassessment', dashboard.addAssessment);
router.get('/dashboard/removeassessment/:assessmentid', dashboard.removeAssessment);

// Member Classes //

router.get('/dashboard/viewmemberclasses', dashboard.viewMemberClasses);
router.post('/dashboard/searchforclass/:classid', dashboard.searchForClass); // TODO
router.get('/dashboard/viewclass/:classid', dashboard.viewClass); // TODO

// Member Bookings //

router.get('/dashboard/memberbookings', dashboard.memberBookings);
router.post('/dashboard/memberaddbooking', dashboard.memberAddBooking);
router.get('/dashboard/removebooking/:bookingid', dashboard.removeBooking);
router.post('/dashboard/editbooking/:bookingid', dashboard.editBooking); // TODO
router.get('/dashboard/updatebooking/:bookingid', dashboard.updateBooking); // TODO

// Trainer Members, Assessments & Update Comment //

router.get('/trainerDashboard/viewassessments/:memberid', trainerDashboard.viewAssessments);
router.get('/trainerDashboard/:memberid/removeassessment/:assessmentid', trainerDashboard.removeAssessment);
router.post('/trainerDashboard/:memberid/updatecomment/:assessmentid', trainerDashboard.updateComment);
router.get('/trainerDashboard/removemember/:memberid', trainerDashboard.removeMember);

// Trainer Classes //

router.get('/trainerDashboard/trainerclasses', trainerDashboard.trainerClasses);
router.post('/trainerDashboard/addclass', trainerDashboard.addClass);
router.get('/trainerDashboard/viewtrainerclasses', trainerDashboard.viewTrainerClasses);
router.get('/trainerDashboard/removeclass/:classid', trainerDashboard.removeClass);
router.post('/trainerDashboard/editclass/:classid', trainerDashboard.editClass);
router.get('/trainerDashboard/updateclass/:classid', trainerDashboard.updateClass);

// Trainer Bookings //

router.get('/trainerDashboard/trainerbookings', trainerDashboard.trainerBookings);
router.post('/trainerDashboard/traineraddbooking', trainerDashboard.trainerAddBooking);
router.get('/trainerDashboard/removebooking/:bookingid', trainerDashboard.removeBooking);
router.post('/trainerDashboard/editbooking/:bookingid', trainerDashboard.editBooking); // TODO
router.get('/trainerDashboard/updatebooking/:bookingid', trainerDashboard.updateBooking); // TODO

//router.get('/dashboard/enrollmember/:memberid/intoclass/:classid', dashboard.enrollMember);
//router.get('/dashboard/unenroll/:memberid/fromclass/:classid', dashboard.unenrollMember);

module.exports = router;
