'use strict'

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');

function getArtist(req, res) { 

    var id = req.params.id;

    Artist.findById(id, (err, artist) => {
        if (err) { 
            res.status(500).send({message: 'Error en la peticion'});
        } else {
            if (!artist) {
                res.status(404).send({ message: 'El artista no existe' });
            } else { 
                res.send({artist});
            }
        }
    });    
}

function getArtists(req, res) {
    
    if (req.params.page) {
        var page = req.params.page;
    } else { 
        var page = 1;
    }

    var itemsPage = 3;

    Artist.find().sort('name').paginate(page, itemsPage, (err, artists, total) => {
        if (err) {
            res.status(500).send({message: 'Error en la peticion'});
        } else {
            if (!artists) {
                res.status(404).send({message: 'No hay artistas !!'});
            } else {
                res.send({
                    items: total,
                    artists
                });
            }
        }
    });
}

function saveArtist(req, res) {
    var artist = new Artist();

    artist.name = req.body.name;
    artist.description = req.body.description;
    artist.image = 'null';//req.body.image;

    artist.save((err, artistStored) => { 
        if (err) {
            res.status(500).send({ message: 'Error al guardar el artista' });
        } else { 
            res.send({
                artist: artistStored
            });
        }
    });
}

function updateArtist(req, res) {

    var id = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(id, update, (err, artistUpdated) => {
        if (err) {
            res.status(500).send({
                message: 'Error al actualizar el artista'
            });
        }

        if (!artistUpdated) {
            res.status(404).send({
                message: 'No se ha podido actualizar el artista'
            });
        } else {
          res.send({artist: artistUpdated});
        }
    });
}

function deleteArtist(req, res) { 

    var id = req.params.id;

    Artist.findByIdAndRemove(id, (err, artistRemoved) => {
        if (err) {
            res.status(500).send({
                message: 'Error al eliminar el artista'
            });
        } else { 
            if (!artistRemoved) {
                res.status(404).send({
                    message: 'El artista no ha sido eliminado'
                });
            } else {

                Album.find({ artist: artistRemoved._id }).remove((err, albumRemoved) => {
                    if (err) {
                        res.status(500).send({
                            message: 'Error al eliminar el album asociado al artista ' + artistRemoved.name
                        });
                    } else {
                        if (albumRemoved){
                            Song.find({ album: albumRemoved._id }).remove((err, songRemoved) => {
                                if (err) {
                                    res.status(500).send({
                                        message: 'Error al eliminar las canciones asociadas al album ' + albumRemoved.title
                                    });
                                } else { 
                                    res.send({
                                        artist: 'El artista '+ artistRemoved.name +' ha sido eliminado'
                                    });
                                }                            
                            });
                        }
                    }
                });
            }
        }
    });
}

function uploadImage(req, res) { 
    var artistId = req.params.id;
    var file_name = 'No subido...';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_name = file_path.split('\\')[2];
        var file_ext = file_name.split('.')[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            Artist.findByIdAndUpdate(artistId, {
                image: file_name
            }, (err, artistUpdated) => {
                if (!artistUpdated) {
                    res.status(404).send({
                        message: 'No se ha podido actualizar el ususario'
                    });
                } else {
                    res.send({
                        user: artistUpdated
                    });
                }
            });
        } else {
            res.status(500).send({
                message: 'Extension del archivo no valida'
            });
        }
    } else {
        res.status(200).send({
            message: 'No has subido ninguna imagen'
        });
    }
}

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/artists/' + imageFile;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(404).send('No exixste la imagen...');
        }
    });
}


module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};