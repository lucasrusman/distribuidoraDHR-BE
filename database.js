const mysql = require('mysql');

const conexion = mysql.createPool({
  host: 'us-cdbr-east-05.cleardb.net',
  user: 'b0b0d900c72fbb',
  password: 'dd261749', //'1682951!Abmtoba',
  database: 'heroku_e537f72d273dba4',
  //port: 3306
});

// conexion.connect(error => {
//   if (error) {
//     throw error;
//   }
//   console.log('¡Conectado a la base de datos MySQL!');
// });

module.exports = conexion;
