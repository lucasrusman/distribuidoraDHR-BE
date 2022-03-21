const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database');

const { check } = require("express-validator")

const {
    validarCampos,
    validarJWT,
} = require('../middlewares');
const {     getClients,getClient,
  postClient } = require('../controllers/clients');


router.post('/', postClient);

router.put('/:id', (req, res) => {
  const { name, phone_number, zone, adress, email } = req.body;
  const { id } = req.params;
  mysqlConnection.query(
    'UPDATE INTO clients (name, phone_number, zone, adress, email) VALUES (?, ?, ?, ?, ?); WHERE id = ?',
    [name, phone_number, zone, adress, email, id],
    (err, rows, fields) => {
      if (!err) {
        res.json({ Status: 'Client update' });
      } else {
        console.log(err);
      }
    }
  );
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  mysqlConnection.query('DELETE FROM clients WHERE id = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json({ Status: 'Client delete' });
    } else {
      console.log(err);
    }
  });
});

module.exports = router;
