'use strict';

const express = require('express'); //--------------------------------------> accessing dependencies
const router = express.Router();

// Objects //

const dashboard = require('./controllers/dashboard.js');
const about = require('./controllers/about.js'); //-------------------------> imports these objects
const playlist = require('./controllers/playlist.js');
const accounts = require('./controllers/accounts.js');

// Links //

router.get('/', accounts.index);
router.get('/about', about.index);
router.get('/dashboard', dashboard.index); //-------------------------------> matches the objects with each of these links
router.get('/playlist/:id', playlist.index);

// Accounts //

router.get('/login', accounts.login); //------------------------------------> route to where the users can login
router.get('/signup', accounts.signup); //----------------------------------> route to where the new user can sign up
router.get('/logout', accounts.logout); //----------------------------------> route to where the user can logout
router.post('/register', accounts.register); //-----------------------------> creates a new user database object
router.post('/authenticate', accounts.authenticate); //---------------------> check database for given user -> create session object if user found

// Playlist - Song Capabilities //

router.get('/dashboard/deleteplaylist/:id', dashboard.deletePlaylist); //---> dashboard to where the playlist is deleted by id
router.post('/dashboard/addplaylist', dashboard.addPlaylist); //------------> dashboard to where the new playlist is to be added
router.get('/playlist/:id/deletesong/:songid', playlist.deleteSong); //-----> id of playlist containing song to delete/ id of song to delete
router.post('/playlist/:id/addsong', playlist.addSong); //------------------> id of the playlist to where the song is to be added

module.exports = router; //-------------------------------------------------> this is the object that is then exported
