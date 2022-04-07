const express = require('express');

const conexion = require('../database');

const router = express.Router();

router.post('/crear', async (req, res, next) => {
  const { nombre, telefono, email, zona, direccion, detalle } = req.body;
  conexion.query(
    'INSERT INTO clientes (nombre, telefono, email, zona, direccion, detalle) VALUES (?, ?, ?, ?, ?, ?); ',
    [nombre, telefono, email, zona, direccion, detalle],
    (error, rows) => {
      if (error) {
        console.log(error);
      }
      res.json({ Status: 'Cliente creado' });
    }
  );
});
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  conexion.query('SELECT * FROM clientes WHERE id = ?', [id], (err, rows, fields) => {
    if (!err) {

      res.json(rows);
    } else {
      console.log(err);
    }
  });
});
router.get('', (req, res, next) => {
  conexion.query('SELECT * FROM clientes', (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, telefono, email, zona, direccion, detalle } = req.body;
  conexion.query(
    'UPDATE clientes SET nombre = ?, telefono = ?, email = ?, zona = ?, direccion = ?, detalle = ? WHERE id = ?',
    [nombre, telefono, email, zona, direccion, detalle, id],
    (err, rows, fields) => {
      if (!err) {
        res.json({ Status: 'Cliente Actualizado' });
      } else {
        console.log(err);
      }
    }
  );
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  conexion.query('DELETE FROM clientes WHERE id = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json({ Status: 'Cliente eliminado' });
    } else {
      console.log(err);
    }
  });
});

module.exports = router;
