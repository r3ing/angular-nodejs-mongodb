'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

function pruebas(req, res) {
    res.send({message: 'Probando controller usuario'});
}

function saveUser(req, res) {

    var user = new User();
    user.name = req.body.name;
    user.surname = req.body.surname;
    user.email = req.body.email;
    user.rol = 'ROLE_USER';
    user.image = 'null';

    if (req.body.password) {
        bcrypt.hash(req.body.password, null, null, (err, hash) => {
            user.password = hash;
            if (user.name != null && user.surname != null && user.email != null) {
                user.save((err, userStored) => {
                    if (err) {
                        res.status(500).send({message: 'Error al guardar el usuario'});
                    } else {
                        res.send({
                            message: 'Usuario creado correctamente',
                            user: userStored
                        });
                    }
                });
            } else {
                res.send({message: 'Rellena todos los campos'});
            }
        });
    } else {
        res.send({message: 'Introduzca la contraseña'});
    }
}

function loginUser(req, res) {

    var email = req.body.email;
    var password = req.body.password;

    User.findOne({
        email: email.toLowerCase()
    }, (err, user) => {
        if (err) {
            res.status(500).send({message: 'Error en la peticion'});
        } else {
            if (!user) {
                res.status(404).send({message: 'El usuario no existe'});
            }

            bcrypt.compare(password, user.password, (err, check) => {
                if (check) {
                    if (req.body.gethash) {
                        res.send({
                            token: jwt.createToken(user)
                        });
                    } else {
                        res.send({
                            user
                        })
                    }
                } else {
                    res.status(404).send({message: 'El usuario no ha podido loguearse'});
                }
            });
        }
    })
}

function updateUser(req, res) {

    var id = req.params.id;
    var update = req.body;
    
    User.findByIdAndUpdate(id, update, (err, userUpdated) => { 
        if (err) {
            res.status(500).send({ message: 'Error al actualizar el ususario' });
        } 

        if (!userUpdated) {
            res.status(404).send({ message: 'No se ha podido actualizar el ususario' });
        } else { 
            res.send({user: userUpdated});
        }
    });
}

function uploadImage(req, res) {
    var userId = req.params.id;
    var file_name = 'No subido...';

    if (req.files) {
        var file_path = req.files.image.path;
        //var file_split = file_path.split('\\');
        var file_name = file_path.split('\\')[2]; //file_split[2];
        var file_ext = file_name.split('.')[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            User.findByIdAndUpdate(userId, { image: file_name }, (err, userUpdated) => {
                if (!userUpdated) {
                    res.status(404).send({message: 'No se ha podido actualizar el ususario'});
                } else {
                    res.send({user: userUpdated});
                }
            });
        } else {
            res.status(500).send({
                message: 'Extension del archivo no valida'
            });
        }
    } else { 
        res.status(200).send({message: 'No has subido ninguna imagen'});
    }
}

function getImageFile(req, res) { 
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/' + imageFile;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else { 
            res.status(404).send('No exixste la imagen...');
        }
    });
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};