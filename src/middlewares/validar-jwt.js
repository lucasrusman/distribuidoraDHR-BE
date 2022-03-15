const { request, response } = require('express')
const jwt = require('jsonwebtoken')

const Usuario = require('../models/usuario')

const validarJWT = async(req = request, res = response, next) =>{
    const token = req.header('Authorization')
    if(!token){
        res.status(401).json({
            msg: 'No tiene permiso para accerder'
        })
    }
    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        //leer el usuario que corresponde al uid

        const usuario = await Usuario.findById(uid)

        // Verificar que el usuario no sea undefined
        if(!usuario){
            return res.status(401).json({
                msg: 'Usuario no existe en la DB, token no valido'
            })
        }
        //Verificar si el uid tiene estado true
        if (!usuario.estado){
            return res.status(401).json({
                msg: 'Token no valido'
            })
        }

        req.usuario = usuario
        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: 'Token no valido'
        })
    }


}

module.exports= {
    validarJWT
}