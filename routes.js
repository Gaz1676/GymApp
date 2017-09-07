/**
 * Author: Gary Fleming
 * Student No: 20019497
 * Start Date: Aug 1st 2017
 */

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
router.post('/settings/updateprofilepicture', dashboard.updateProfilePicture);
router.post('/settings/updatefirstname', dashboard.updateFirstName);
router.post('/settings/updatelastname', dashboard.updateLastName);
router.post('/settings/updateemail', dashboard.updateEmail);
router.post('/settings/updatepassword', dashboard.updatePassword);
router.post('/settings/updateaddress', dashboard.updateAddress);
router.post('/settings/updategender', dashboard.updateGender);
router.post('/settings/updateheight', dashboard.updateHeight);
router.post('/settings/updatestartingweight', dashboard.updateStartingWeight);

// Member Assessments //

router.post('/dashboard/memberaddassessment', dashboard.memberAddAssessment);
router.get('/dashboard/removeassessment/:assessmentid', dashboard.removeAssessment);

// Member Classes //

router.get('/dashboard/viewmemberclasses', dashboard.viewMemberClasses);
router.get('/dashboard/enrollclass/:classid', dashboard.enrollClass);
router.get('/dashboard/unenrollclass/:classid', dashboard.unenrollClass);
router.get('/dashboard/:classid/enrollworkout/:workoutid', dashboard.enrollWorkout);
router.get('/dashboard/:classid/unenrollworkout/:workoutid', dashboard.unenrollWorkout);

// Member Bookings //

router.get('/dashboard/memberbookings', dashboard.memberBookings);
router.post('/dashboard/memberaddbooking', dashboard.memberAddBooking);
router.get('/dashboard/:trainerid/removebooking/:bookingid', dashboard.removeBooking);

router.post('/dashboard/membereditbooking/:bookingid', dashboard.memberEditBooking);
router.get('/dashboard/:memberid/memberupdatebooking/:bookingid', dashboard.memberUpdateBooking);

// Member Goals //

router.get('/dashboard/membergoals', dashboard.memberGoals);
router.post('/dashboard/memberaddgoal', dashboard.memberAddGoal);
router.get('/dashboard/removegoal/:goalid', dashboard.removeGoal);

// Trainer Members, Assessments & Update Comment //

router.get('/trainerDashboard/trainerviewassessments/:memberid', trainerDashboard.trainerViewAssessments);
router.get('/trainerDashboard/:memberid/removeassessment/:assessmentid', trainerDashboard.removeAssessment);
router.post('/trainerDashboard/:memberid/updatecomment/:assessmentid', trainerDashboard.updateComment);
router.get('/trainerDashboard/removemember/:memberid', trainerDashboard.removeMember);

// Trainer Classes //

router.get('/trainerDashboard/trainerclasses', trainerDashboard.trainerClasses);
router.post('/trainerDashboard/addclass', trainerDashboard.addClass);
router.get('/trainerDashboard/viewtrainerclasses', trainerDashboard.viewTrainerClasses);
router.get('/trainerDashboard/removeclass/:classid', trainerDashboard.removeClass);
router.get('/trainerDashboard/trainerupdateclass/:classid', trainerDashboard.trainerUpdateClass);
router.post('/trainerDashboard/traineredittime/:classid', trainerDashboard.trainerEditTime);
router.post('/trainerDashboard/trainereditduration/:classid', trainerDashboard.trainerEditDuration);
router.post('/trainerDashboard/trainereditdifficulty/:classid', trainerDashboard.trainerEditDifficulty);
router.post('/trainerDashboard/trainereditcapacity/:classid', trainerDashboard.trainerEditCapacity);

// Trainer Bookings //

router.get('/trainerDashboard/trainerbookings', trainerDashboard.trainerBookings);
router.post('/trainerDashboard/traineraddbooking', trainerDashboard.trainerAddBooking);
router.get('/trainerDashboard/:memberid/removebooking/:bookingid', trainerDashboard.removeBooking);

router.get('/trainerDashboard/:memberid/trainerupdatebooking/:bookingid', trainerDashboard.trainerUpdateBooking);
router.post('/trainerDashboard/trainereditbooking/:bookingid', trainerDashboard.trainerEditBooking);

// Trainer Goals //

router.get('/trainerDashboard/trainergoals', trainerDashboard.trainerGoals);
router.post('/trainerDashboard/traineraddgoal', trainerDashboard.trainerAddGoal);
router.get('/trainerDashboard/removegoal/:goalid', trainerDashboard.removeGoal);

router.get('/trainerDashboard/:memberid/trainerupdategoal/:goalid', trainerDashboard.trainerUpdateGoal);
router.post('/trainerDashboard/edittargetdate/:goalid', trainerDashboard.editTargetDate);
router.post('/trainerDashboard/edittargetarea/:goalid', trainerDashboard.editTargetArea);
router.post('/trainerDashboard/edittargetgoal/:goalid', trainerDashboard.editTargetGoal);
router.post('/trainerDashboard/editdescription/:goalid', trainerDashboard.editDescription);

module.exports = router;
