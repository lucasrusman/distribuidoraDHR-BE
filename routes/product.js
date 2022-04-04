const express = require('express');

const conexion = require('../database');

const router = express.Router();

router.post('/crear', async (req, res, next) => {
  const { descripcion, precio_base } = req.body;
  conexion.query(
    'INSERT INTO productos (descripcion, precio_base) VALUES (?, ?); ',
    [descripcion, precio_base],
    (error, rows) => {
      if (error) {
        console.log(error);
      }
      res.json({ Status: 'Producto creado' });
    }
  );
});
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  conexion.query('SELECT * FROM productos WHERE id = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});
router.get('', (req, res, next) => {
  conexion.query('SELECT * FROM productos', (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { descripcion, precio_base } = req.body;
  conexion.query(
    'UPDATE clientes SET descripcion = ?, precio_base = ? WHERE id = ?',
    [descripcion, precio_base, id],
    (err, rows, fields) => {
      if (!err) {
        res.json({ Status: 'Producto Actualizado' });
      } else {
        console.log(err);
      }
    }
  );
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  conexion.query('DELETE FROM productos WHERE id = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json({ Status: 'Producto eliminado' });
    } else {
      console.log(err);
    }
  });
});

module.exports = router;
