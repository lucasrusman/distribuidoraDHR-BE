const express = require('express');

const conexion = require('../database');

const router = express.Router();

router.post('/crear', async (req, res, next) => {
  const { idCliente, fecha } = req.body;
  conexion.query(
    'INSERT INTO ventas (idCliente, fecha) VALUES (?, ?); ',
    [idCliente, fecha],
    (error, rows) => {
      if (error) {
        console.log(error);
      }
      res.json({ Status: 'Venta creada' });
    }
  );
});
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  conexion.query('SELECT * FROM ventas WHERE id = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});
router.get('', (req, res, next) => {
  conexion.query('SELECT * FROM ventas', (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { idCliente, fecha } = req.body;
  conexion.query(
    'UPDATE ventas SET idCliente = ?, fecha = ? WHERE id = ?',
    [idCliente, fecha, id],
    (err, rows, fields) => {
      if (!err) {
        res.json({ Status: 'Venta Actualizada' });
      } else {
        console.log(err);
      }
    }
  );
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  conexion.query('DELETE FROM ventas WHERE id = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json({ Status: 'Venta eliminada' });
    } else {
      console.log(err);
    }
  });
});

module.exports = router;
