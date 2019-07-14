'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res) {

    var id = req.params.id;

    Album.findById(id).populate({
        path: 'artist'
    }).exec((err, album) => {
        if (err) {
            res.status(500).send({
                message: 'Error en la peticion'
            });
        } else {
            if (!album) {
                res.status(404).send({
                    message: 'El album no existe'
                });
            } else {
                res.send({
                    album
                });
            }
        }
    });
}

function getAlbums(req, res) {

    var artistId = req.params.artist;

    if (!artistId) {
        var find = Album.find().sort('title');
    } else {
        var find = Album.findById({
            artist: artistId
        }).sort('year');
    }

    find.populate({
        path: 'artist'
    }).exec((err, albums) => {
        if (err) {
            res.status(500).send({
                message: 'Error en la peticion'
            });
        } else {
            if (!albums) {
                res.status(404).send({
                    message: 'No hay albums !!'
                });
            } else {
                res.send({
                    albums
                });
            }
        }
    });
}

function saveAlbum(req, res) {
    var album = new Album();

    album.title = req.body.title;
    album.description = req.body.description;
    album.year = req.body.year;
    album.image = 'null'; //req.body.image;
    album.artist = req.body.artist;

    album.save((err, albumStored) => {
        if (err) {
            res.status(500).send({
                message: 'Error al guardar el album'
            });
        } else {
            res.send({
                album: albumStored
            });
        }
    });
}

function updateAlbum(req, res) {

    var id = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(id, update, (err, albumUpdated) => {
        if (err) {
            res.status(500).send({
                message: 'Error al actualizar el album'
            });
        }

        if (!albumUpdated) {
            res.status(404).send({
                message: 'No se ha podido actualizar el album'
            });
        } else {
            res.send({
                album: albumUpdated
            });
        }
    });
}

function deleteAlbum(req, res) {

    var id = req.params.id;

    Album.findByIdAndRemove(id, (err, albumRemoved) => {
        if (err) {
            res.status(500).send({
                message: 'Error al eliminar el album'
            });
        } else {
            if (!albumRemoved) {
                res.status(404).send({message: 'El album no pudo ser eliminado'});
            } else {
                Song.find({
                    album: albumRemoved._id
                }).remove((err, songRemoved) => {
                    if (err) {
                        res.status(500).send({
                            message: 'Error al eliminar las canciones asociadas al album ' + albumRemoved.title
                        });
                    } else {
                        res.send({
                            album: 'El album ha sido eliminado'
                        });
                    }
                });
            }
        }
    });
}

function uploadImage(req, res) {
    var albumId = req.params.id;
    var file_name = 'No subido...';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_name = file_path.split('\\')[2];
        var file_ext = file_name.split('.')[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            Album.findByIdAndUpdate(albumId, {
                image: file_name
            }, (err, albumUpdated) => {
                if (!albumUpdated) {
                    res.status(404).send({message: 'No se ha podido actualizar el album'});
                } else {
                    res.send({
                        album: albumUpdated
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
    var path_file = './uploads/albums/' + imageFile;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(404).send('No exixste la imagen...');
        }
    });
}


module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
};