const {request , response}  = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require("bcryptjs");


export const getUsuarios = async(req = request, res = response) =>{
    const usuarios = await Usuario.findAll()
    res.json({usuarios})
}
export const getUsuario = async(req = request, res = response) =>{
    const {id} = req.params
    const usuario = await Usuario.findByPk(id)
    if(usuario){
    res.json(usuario)
    }else{
        res.status(400).json({
            msg : `No existe un usuario con el id ${id}`
        })
    }
}

const usuariosPost = async(req, res = response) => {

    const { nombre, correo, password, rol} = req.body
    const usuario = new Usuario({nombre, correo, password, rol})
    //verificar si el correo existe

    //encriptar la contrasena
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt)

    //guardar en DB
    await usuario.save()

    res.json({
        usuario
    })
    }

const usuariosDelete = async(req, res = response) => {

    const {id} = req.params

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false})
    res.json({usuario})
}

const usuariosPatch = (req, res = response) => {
    res.json({
        ok: 'pacho',
        msg : 'patch - controller'
    })
    }


module.exports = {
    usuariosGet,
    usuariosDelete,
    usuariosPut,
    usuariosPost,
    usuariosPatch
}