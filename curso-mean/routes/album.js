'use strict'

var express = require('express');
var AlbumController = require('../controllers/album');
var md_auth = require('../middelwares/uthenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({
    uploadDir: './uploads/albums'
});

var api = express.Router();

api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);
api.get('/albums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums);

/*



api.put('/artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);
api.post('/upload-image-artist/:id', [md_auth.ensureAuth, md_upload], ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);
*/
module.exports = api;