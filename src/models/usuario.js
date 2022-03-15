import { DataTypes } from "sequelize";
import mysqlConnection from '../database'

const Usuario = mysqlConnection.define('Usuario', {
    nombre: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
})

module.exports = Usuario