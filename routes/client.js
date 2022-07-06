const express = require('express');
const conexion = require('../database');
const router = express.Router();
var pdf = require('html-pdf');
const pdf2base64 = require('pdf-to-base64');
const generarClientesHTML = require('../pdf_routes/generarClientesHTML.ts')
router.post('/crear', async (req, res, next) => {
  const { nombre, telefono, email, zona, direccion, detalle, lista} = req.body;
  conexion.query(
    'INSERT INTO clientes (nombre, telefono, email, zona, direccion, detalle, lista) VALUES (?, ?, ?, ?, ?, ?, ?); ',
    [nombre, telefono, email, zona, direccion, detalle, lista],
    (error, rows) => {
      if (error) {
        console.log(error);
      }
      res.json({ Status: 'Cliente creado' });
    }
  );
});

router.post('/crearPDF', async (req, res, next) => {
  const arrayClientes = [];
  clientes = [];
  clientes = conexion.query('SELECT * FROM clientes', function (err, rows, fields) {
    if (!err) {
      rows.forEach(row => {
        allClients = [row.nombre, row.telefono, row.direccion];
        arrayClientes.push(allClients);
      });

      listadoClientesHTML = generarClientesHTML(arrayClientes);
      pdf.create(listadoClientesHTML).toFile('./clientes.pdf', function (err, res2) {
        if (err) {
          console.log(err);
        } else {
          pdf2base64('./clientes.pdf')
            .then(response => {
              res.status(200).json({ finalString: response });
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
    } else {
      console.log(err);
    }
  });
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
  conexion.query('SELECT * FROM clientes ORDER BY id DESC', (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, telefono, email, zona, direccion, detalle, lista } = req.body;
  conexion.query(
    'UPDATE clientes SET nombre = ?, telefono = ?, email = ?, zona = ?, direccion = ?, detalle = ?, lista = ? WHERE id = ?',
    [nombre, telefono, email, zona, direccion, detalle, lista, id],
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
