const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const conexion = require('../database');

const router = express.Router();

router.get('', (req, res, next) => {
  conexion.query(
    'SELECT zona, count(*) as cantidad FROM ventas v inner join clientes c on v.idCliente = c.id GROUP BY zona',
    (err, rows, fields) => {
      if (!err) {
        res.json(rows);
      } else {
        console.log(err);
      }
    }
  );
});
module.exports = router;
