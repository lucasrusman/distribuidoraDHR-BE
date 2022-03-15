const {request , response}  = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require("bcryptjs");


const getClients = async(req = request, res = response) =>{
    const usuarios = await Usuario.findAll()
    res.json({usuarios})
}
const getClient = async(req = request, res = response) =>{
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

const postClient = async(req = request, res = response) =>{
    
    const {name, phone_number, zone, adress, email} = req.body;
    
    try {
        
        const existeMail = await Client.findOne({
            where : {
                email : email
            }
        })

        if(existeMail){
            return res.status(400).json({
                msg: "Ya existe este cliente con el email" + email
            })
        }

        const usuario = new Client(name, phone_number, zone, adress, email)
        await usuario.save()
        res.json(usuario)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg : "Problema interno del servidor"
        })
    }
}



module.exports = {
    getClients,
    getClient,
    postClient
}