const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'sqluser',
  password: 'password',
  database: 'dhr'
});

mysqlConnection.connect(function (err) {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log('Db is connected');
  }
});

module.exports = mysqlConnection;
