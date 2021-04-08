const express = require('express');
const fileUpload = require('express-fileupload');
const usuario = require('../models/usuario');
const app = express();

const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');


// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {


    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: true,
            err: {
                message: 'No se ha encontrado ningun archivo'
            }
        });
    }

    // ###valida tipo
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Los tipos permitidos son : ${tiposValidos.join(', ')}`
            },
        })
    }
    //valida id

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    let splitFile = archivo.name.split('.');
    let extension = splitFile[splitFile.length - 1];

    //#extensiones permitidas
    let extensionesValidas = ['jpg', 'png', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Las extension es permitidas son ${extensionesValidas.join(', ')}`
            },
            ext: extension
        })
    }

    // cambiar nombre al archivo
    let nombreArchivo = `${ id }-${new Date().getMilliseconds()}.${ extension }`

    //path para enviar las imagenes
    // Use the mv() method to place the file somewhere on your server
    let uploadPath = `uploads/${ tipo }/${nombreArchivo}`;
    archivo.mv(uploadPath, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        /*GUARADO EN LA DB */
        /**
         * @param id clave unica de usuario o producto
         * @param res respuesta que va aresponder el servicio
         * @param nombre del archivo o imagen
         */
        tipo === 'usuarios' ? imagenUsuario(id, res, nombreArchivo) : imagenProducto(id, res, nombreArchivo);

    });
});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        /**borra la imagen anterior para que no se dupliquen */
        borraArchivo(usuarioDB.img, 'usuarios');
        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usaurioGuardado) => {
            res.status(200).json({
                ok: true,
                usuario: usaurioGuardado,
                img: nombreArchivo
            })
        });
    });
}


function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(productoDB.img, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borraArchivo(productoDB.img, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        /**borra la imagen anterior para que no se dupliquen */
        borraArchivo(productoDB.img, 'productos');
        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.status(200).json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        });
    });
}


function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;