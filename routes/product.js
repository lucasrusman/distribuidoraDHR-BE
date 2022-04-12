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
  const arrayProduct = [];
  productos = [];
  productos = conexion.query('SELECT * FROM productos limit 90', function (err, rows, fields) {
    if (!err) {
      rows.forEach(row => {
        allProducts = [row.descripcion, row.precio_base];
        arrayProduct.push(allProducts);
      });
      doc = new PDFDocument();
      createTable(doc, arrayProduct, 500);

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

router.post('/editarPrecioPorCliente', (req, res, next) => {
  const { idCliente, productos } = req.body;
  productos.forEach(producto => {
    conexion.query(
      'SELECT * FROM precio_espeicla_cliente where idCliente= ? and idProducto=?',
      [idCliente, producto.id],
      (err, rows, fields) => {
        if (rows.length != 0) {
          //tengo que actualizar

          conexion.query(
            'UPDATE precio_espeicla_cliente SET precio = ? WHERE idProducto = ? and idCliente = ?;',
            [producto.precio_mostrar, producto.id, idCliente],
            (error, rows) => {
              if (error) {
                console.log(error);
              }
            }
          );
        } else {
          //tengo que insertar
          conexion.query(
            'INSERT INTO precio_espeicla_cliente(idProducto,idCliente,precio) VALUES (?, ?, ?);',
            [producto.id, idCliente, producto.precio_mostrar],
            (error, rows) => {
              if (error) {
                console.log(error);
              }
            }
          );
        }
      }
    );
  });
});

router.put('/aumentarPrecios', (req, res, next) => {
  // const { valor } = req.body;
  // conexion.query('SELECT precio_base FROM productos', (err, rows, fields) => {
  //   if (!err) {
  //     rows.map(value => {
  //       valor + 1;
  //       console.log(value);
  //     });
  //     conexion.query('UPDATE productos SET precio_base = ?', [], (err, rows, fields) => {
  //       if (!err) {
  //         res.json({ Status: 'Todos los productos fueron actualizados correctametne' });
  //       } else {
  //         console.log(err);
  //       }
  //     });
  //   }
  // });

  const { valor, productos } = req.body;
  console.log(productos);
  productos.forEach(producto => {
    conexion.query(
      'SELECT precio_base FROM productos where id = ?',
      [producto.id],
      (err, rows, fields) => {
      
        conexion.query(
          'UPDATE productos SET precio_base = ? WHERE id = ?',
          [valor, producto.id],
          (error, rows) => {
            if (error) {
              console.log(error);
            } else {
              console.log({ Status: "Precio de los productos actualizados correctamente" });
            }
          }
        );
      }
    );
  });
});
router.get('/byClient/:id', (req, res, next) => {
  console.log('asdasd');
  const { id } = req.params;
  conexion.query(
    'Select p.id, p.precio_base, p.descripcion, pec.precio, pec.idCliente from productos p left join precio_espeicla_cliente pec on p.id = pec.idProducto and pec.idCliente = ?',
    [id],
    (err, rows, fields) => {
      if (!err) {
        res.json(rows);
      } else {
        console.log(err);
      }
    }
  );
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
    conexion.query(
      'DELETE FROM precio_espeicla_cliente WHERE idProducto = ?',
      [id],
      (err, rows, fields) => {}
    );
    if (!err) {
      res.json({ Status: 'Producto eliminado' });
    } else {
      console.log(err);
    }
  });
});

module.exports = router;
