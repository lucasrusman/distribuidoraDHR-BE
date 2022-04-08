const mysql = require('mysql')

const conexion = mysql.createConnection({
    host : "us-cdbr-east-05.cleardb.net",
    user : "ba72e0398c8525",
    password : 'abff3d1f',
    database : "heroku_9fa1aeaa118cff5",
    port: 3306
})

conexion.connect((error) => {
    if (error) {
        throw error;
    }
    console.log('¡Conectado a la base de datos MySQL!')
})

module.exports = conexion