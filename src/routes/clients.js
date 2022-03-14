const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/', (req, res) => {
  mysqlConnection.query('SELECT * FROM clients ORDER BY popularity DESC', (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  mysqlConnection.query('SELECT * FROM clients WHERE id = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      console.log(err);
    }
  });
});

router.post('/', (req, res) => {
  const { name, phone_number, zone, adress, email } = req.body;
  mysqlConnection.query(
    'INSERT INTO clients (name, phone_number, zone, adress, email) VALUES (?, ?, ?, ?, ?); ',
    [name, phone_number, zone, adress, email],
    (err, rows, fields) => {
      if (!err) {
        res.json(rows[0]);
      } else {
        console.log(err);
      }
    }
  );
});

router.put('/:id', (req, res) => {
  const { name, phone_number, zone, adress, email } = req.body;
  const { id } = req.params;
  const query = `
        CALL popularEdit(?, ?, ?, ?, ?, ?)
    `;
  mysqlConnection.query(
    query,
    [id, name, phone_number, zone, adress, email],
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
