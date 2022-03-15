const {request , response} = require('express');
const bcryptjs = require('bcryptjs')
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async(req = request, res = response) => {
    const { correo , password} = req.body

    try {

        // verificar si el mail existe
        const usuario = await Usuario.findOne({correo})
        if (!usuario){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }
        // verificar si el estado es true
        if (!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            })
        }
        
        // verificar la contraseña
        const validContra = bcryptjs.compareSync(password , usuario.password)
        if (!validContra){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }

        // Generar JWT
        const token = await generarJWT( usuario.id)
        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error)
        return res.json({
            msg: 'Hable con el administrador'
        })
    }


}

module.exports = {
    login
}