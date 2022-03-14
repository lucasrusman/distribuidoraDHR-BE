const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/', (req, res) => {
  mysqlConnection.query('SELECT * FROM products ORDER BY id DESC', (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  mysqlConnection.query('SELECT * FROM products WHERE id = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      console.log(err);
    }
  });
});

router.post('/', (req, res) => {
  
  const { description, price } = req.body;
  mysqlConnection.query(
    'INSERT INTO products (description, price) VALUES (?, ?); ',
    [description, price],
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
  const { description, price } = req.body;
  const { id } = req.params;
  mysqlConnection.query(
    'UPDATE INTO clients (description, price) VALUES (?, ?, ?, ?, ?); WHERE id = ?',
    [description, price, id],
    (err, rows, fields) => {
      if (!err) {
        res.json({ Status: 'Product update' });
      } else {
        console.log(err);
      }
    }
  );
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  mysqlConnection.query('DELETE FROM products WHERE id = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json({ Status: 'Product delete' });
    } else {
      console.log(err);
    }
  });
});

module.exports = router;
