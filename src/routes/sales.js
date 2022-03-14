const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/', (req, res) => {
  mysqlConnection.query('SELECT * FROM sales ORDER BY id DESC', (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  mysqlConnection.query('SELECT * FROM sales WHERE id = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      console.log(err);
    }
  });
});

router.post('/', (req, res) => {
  const { name, total, date } = req.body;
  mysqlConnection.query(
    'INSERT INTO clients (name, total, date) VALUES (?, ?, ?); ',
    [name, total, date],
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
  const { name, total, date } = req.body;
  const { id } = req.params;
  mysqlConnection.query(
    'UPDATE INTO sales (name, total, date) VALUES (?, ?, ?); WHERE id = ?',
    [name, total, date, id],
    (err, rows, fields) => {
      if (!err) {
        res.json({ Status: 'Sale update' });
      } else {
        console.log(err);
      }
    }
  );
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  mysqlConnection.query('DELETE FROM sales WHERE id = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json({ Status: 'Sale delete' });
    } else {
      console.log(err);
    }
  });
});

module.exports = router;
