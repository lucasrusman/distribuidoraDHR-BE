

const validarCampos  = require('../middlewars/validar-campos')
const validarJWT  = require('../middlewars/validar-jwt')


module.exports = {
    ...validarCampos,
    ...validarJWT

}
