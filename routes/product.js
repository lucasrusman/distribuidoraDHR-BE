const express = require('express');
const PDFDocument = require('pdfkit');
const conexion = require('../database');
var fs = require('fs');
const router = express.Router();
const { Base64Encode } = require('base64-stream');

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

function createTable(doc, data, width = 500) {
  const startY = doc.y,
    startX = doc.x,
    distanceY = 15,
    distanceX = 10;

  doc.fontSize(10);

  let currentY = startY;

  data.forEach(value => {
    let currentX = startX,
      size = value.length;

    let blockSize = width / size;

    value.forEach(text => {
      //Write text
      doc.text(text, currentX + distanceX, currentY);

      //Create rectangles
      doc
        .lineJoin("miter")
        .rect(currentX, currentY, blockSize, distanceY)
        .stroke();

      currentX += blockSize;
    });

    currentY += distanceY;
  });
}

router.post('/crearPDF', async (req, res, next) => {
  doc = new PDFDocument();
  createTable(doc, [["Producto 1", 123123], ["Producto 1", 123123], ["Producto 1", 123123]], 500);
  
  var finalString = ''; // contains the base64 string
  var stream = doc.pipe(new Base64Encode());
  doc.end();

  stream.on('data', function (chunk) {
    finalString += chunk;
  });

  stream.on('end', function () {
    res.json({ finalString });
  });

});

router.get('/:id', (req, res, next) => {
  console.log("asdasd")
  const { id } = req.params;
  conexion.query('Select p.id, p.precio_base, p.descripcion, pec.precio, pec.idCliente from productos p left join precio_espeicla_cliente pec on p.id = pec.idProducto and pec.idCliente = 2', (err, rows, fields) => {
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
    'UPDATE productos SET descripcion = ?, precio_base = ? WHERE id = ?',
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
