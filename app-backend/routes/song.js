'use strict'

var express = require('express');
var SongController = require('../controllers/song');
var md_auth = require('../middelwares/uthenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({
    uploadDir: './uploads/songs'
});

var api = express.Router();

api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.get('/songs/:album?', md_auth.ensureAuth, SongController.getSongs);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);
api.put('/song/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong);

/*
api.post('/upload-image-artist/:id', [md_auth.ensureAuth, md_upload], SongController.uploadImage);
api.get('/get-image-artist/:imageFile', SongController.getImageFile);
*/

module.exports = api;