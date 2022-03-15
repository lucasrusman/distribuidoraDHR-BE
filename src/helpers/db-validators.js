const Role = require('../models/role')
const Usuario = require('../models/usuario')



const existeMail = async(correo = '')=>{
    const existEmail = await Usuario.findOne({correo})
    if (existEmail){
        throw new Error(`El correo ${correo} ya existe en nuestra DB, por favor ingrese uno nuevo`)
}
}

const esUsuarioSQL = async(id)=>{
    const existeUser = await Usuario.findById(id)
    if (!existeUser){
        return new Error(`El id: ${id} no existe en la base de datos`)
    }
}
module.exports = {existeMail, esUsuarioSQL}