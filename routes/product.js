const express = require('express');
const conexion = require('../database');
const router = express.Router();
var pdf = require('html-pdf');
const pdf2base64 = require('pdf-to-base64');
const generarProductosHTML = require('../pdf_routes/generarProductosHTML.ts');

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

router.post('/crearPDF', async (req, res, next) => {
  const arrayProduct = [];
  productos = [];
  productos = conexion.query('SELECT * FROM productos', function (err, rows, fields) {
    if (!err) {
      rows.forEach(row => {
        allProducts = [row.descripcion, row.precio_base];
        arrayProduct.push(allProducts);
      });
      listadoProductosHTML = generarProductosHTML(arrayProduct);
      pdf.create(listadoProductosHTML).toFile('./productos.pdf', function (err, res2) {
        if (err) {
          console.log(err);
        } else {
          pdf2base64('./productos.pdf')
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
  const { productos } = req.body;
  let { valor } = req.body;
  productos.forEach(producto => {
    let precio = Number((producto.precio_base * valor) / 100);
    let precioFinal = Number(producto.precio_base) + precio;
    conexion.query(
      'UPDATE productos SET precio_base = ? WHERE id = ?',
      [precioFinal, producto.id],
      (error, rows) => {
        if (error) {
          console.log(error);
        } else {
          res.json({ Status: 'Precio de los productos actualizados correctamente' });
        }
      }
    );
  });
});

router.put('/aumentarValor', (req, res, next) => {
  const { productos } = req.body;
  let { valorNum } = req.body
  productos.forEach(producto => {
    let precioFinal = Number(Number(producto.precio_base) + Number(valorNum))
    conexion.query(
      'UPDATE productos SET precio_base = ? WHERE id = ?',
      [precioFinal, producto.id],
      (error, rows) => {
        if (error) {
          console.log(error);
        } else {
          res.json({ Status: "Precio de los productos actualizados correctamente" });
        }
      }
    );
  }
  );
});

router.get('/byClient/:id', (req, res, next) => {
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
  conexion.query('SELECT * FROM productos ORDER BY id DESC', (err, rows, fields) => {
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

/* 
  Funciones auxiliares
*/

module.exports = router;
