'use strict';

const express = require('express'); //--------------------------------------> accessing dependencies
const router = express.Router();

// Objects //

const dashboard = require('./controllers/dashboard.js');
const about = require('./controllers/about.js'); //-------------------------> imports these objects
const accounts = require('./controllers/accounts.js');

// Links //

router.get('/', accounts.index);
router.get('/about', about.index);
router.get('/dashboard', dashboard.index); //-------------------------------> matches the objects with each of these links

// Accounts //

router.get('/login', accounts.login); //------------------------------------> route to where the users can login
router.get('/signup', accounts.signup); //----------------------------------> route to where the new user can sign up
router.get('/logout', accounts.logout); //----------------------------------> route to where the user can logout
router.post('/register', accounts.register); //-----------------------------> creates a new user database object
router.post('/authenticate', accounts.authenticate); //---------------------> check database for given user -> create session object if user found

module.exports = router; //-------------------------------------------------> this is the object that is then exported
