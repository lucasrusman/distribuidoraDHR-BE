const express = require('express');
const PDFDocument = require('pdfkit');
const { format } = require('date-fns');
const conexion = require('../database');
var fs = require('fs');
const router = express.Router();
const { Base64Encode } = require('base64-stream');

router.post('/crear', async (req, res, next) => {
  // TODO save sale on 'productos_por_venta' table
  const { idCliente, total } = req.body.sale;
  conexion.query(
    'INSERT INTO ventas (idCliente, fecha, total) VALUES (?, ?, ?); ',
    [idCliente, format(Date.parse(req.body.sale.fecha), 'yyyy-MM-dd'), total],
    (error, rows) => {
      if (error) {
        console.log(error);
      } else {
        req.body.productos.forEach(producto => {
          producto.precio = producto.precio ? producto.precio : producto.precio_base
          conexion.query(
            'INSERT INTO productos_por_venta (idVenta, idProducto, precio) VALUES (?, ?,?);',
            [rows.insertId, producto.id, producto.precio],
            (error, rows) => {
              if (error) {
                console.log(error);
              } else {
                res.json({ Status: 'Venta OK' });
              }
            }
          );
        })
      }
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
      doc.lineJoin('miter').rect(currentX, currentY, blockSize, distanceY).stroke();

      currentX += blockSize;
    });

    currentY += distanceY;
  });
}

router.post('/crearPDF', async (req, res, next) => {
  const arraySale = [];
  ventas = [];
  ventas = conexion.query('SELECT * FROM ventas', function (err, rows, fields) {
    if (!err) {
      rows.forEach(row => {
        allSales = [row.idCliente, row.fecha, row.total];
        arraySale.push(allSales);
      });
      doc = new PDFDocument();
      createTable(doc, arraySale, 500);

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
//TODO
router.post('/crearPDF/exportarClientes', async (req, res, next) => {
  const { sales } = req.body;
  console.log(sales);
  sales.forEach(venta => {
    const arraySale = [];
    ventas = [];
    ventas = conexion.query(
      'SELECT * FROM ventas WHERE idCliente = ?',
      [venta.idCliente],
      function (err, rows, fields) {
        if (!err) {
          rows.forEach(row => {
            allSales = [row.idCliente, row.fecha, row.total];
            arraySale.push(allSales);
          });
          doc = new PDFDocument();
          createTable(doc, arraySale, 500);

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
      }
    );
  });
});

//get sales by client
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  conexion.query('SELECT * FROM ventas WHERE idCliente = ?', [id], (err, rows, fields) => {
    if (!err) {
      console.log(rows);
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

router.post('', (req, res, next) => {
  const { fecha_inicial, fecha_final } = req.body;
  conexion.query(
    'SELECT * FROM ventas WHERE fecha BETWEEN ? AND ?;',
    [fecha_inicial, fecha_final],
    (err, rows, fields) => {
      if (!err) {
        res.json(rows);
      } else {
        console.log(err);
      }
    }
  );
});

module.exports = router;
