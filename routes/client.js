const express = require('express');
const PDFDocument = require('pdfkit');
const conexion = require('../database');
var fs = require('fs');
const router = express.Router();
const { Base64Encode } = require('base64-stream');

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
function createTable(doc, data, width = 500) {
  const startY = doc.y,
    startX = doc.x,
    distanceY = 15,
    distanceX = 10;

  doc.fontSize(10);

  let currentY = startY;
  let i = 1;
  data.forEach(value => {
    let currentX = startX,
      size = value.length;
    console.log(currentX + distanceX, currentY);
    let blockSize = width / size;

    value.forEach(text => {
      //Write text
      doc.text(text, currentX + distanceX, currentY);

      //Create rectangles
      doc.lineJoin('miter').rect(currentX, currentY, blockSize, distanceY).stroke();

      currentX += blockSize;
    });
    console.log(i);
    if (i % 40 == 0) {
      currentY = startY;
      doc.addPage();
    }
    currentY += distanceY;
    i++;
  });
}

router.post('/crearPDF', async (req, res, next) => {
  const arrayClientes = [];
  clientes = [];
  clientes = conexion.query('SELECT * FROM clientes limit 90', function (err, rows, fields) {
    if (!err) {
      rows.forEach(row => {
        allClients = [row.nombre, row.telefono, row.email];
        arrayClientes.push(allClients);
      });
      doc = new PDFDocument();
      createTable(doc, arrayClientes, 500);

      var finalString = ''; // contains the base64 string
      var stream = doc.pipe(new Base64Encode());

      doc.end();

      stream.on('data', function (chunk) {
        finalString += chunk;
      });

      stream.on('end', function () {
        res.json({ finalString });
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
