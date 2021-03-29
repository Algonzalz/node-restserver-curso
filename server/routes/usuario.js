const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt') // eccriptar
const _ = require('underscore'); // libreria para solo tomar los elementos del obejto al que quiero actualñzar
const { verificaToken } = require('../middlewares/auth');
const app = express();

app.get('/usuario', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);


    let limit = req.query.limit || 5;
    limit = Number(limit);

    Usuario.find({ estado: true }, 'nombre email rol estado google')
        .skip(desde)
        .limit(limit)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }


            Usuario.countDocuments({ estado: true }, (err, cont) => {

                res.json({
                    ok: true,
                    usuarios,
                    cont
                })
            })

        })
});

app.post('/usuario', verificaToken, (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });


    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });


    });


});

app.put('/usuario/:id', verificaToken, (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    /**
     * @param new para actualizar y mostrar el objeto nuevo
     * @param runValidators para correr las validaciones del schema
     */
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }


        //en caso de que solo quiera el mensaje pono k y nada mas
        res.json({
            ok: true,
            usuarioDB
        });
    })

});

app.delete('/usuario/:id', verificaToken, (req, res) => {
    let id = req.params.id

    // no elimina completamente el objeto, solo lo cambia de estado
    let estadoCambiado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, estadoCambiado, { new: true }, (err, UsuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!UsuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }


        //en caso de que solo quiera el mensaje pono k y nada mas
        res.json({
            ok: true,
            usuario: UsuarioBorrado
        });
    })
});

module.exports = app;