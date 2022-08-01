const express = require('express');
const { format } = require('date-fns');
const conexion = require('../database');
const router = express.Router();
const pdf2base64 = require('pdf-to-base64');
var pdf = require('html-pdf');
const generarVentaHTML = require('../pdf_routes/generarVentaHTML.ts');
const generarListadoVentasHTML = require('../pdf_routes/generarListadoVentasHTML.ts')
const generarExportarClientesHTML = require('../pdf_routes/generarExportarClientesHTML.ts')
const generarExportarProductosHTML = require('../pdf_routes/generarExportarProductosHTML.ts')
router.post('/crear', async (req, res, next) => {
  const { idCliente, total, deuda } = req.body.sale;
  console.log(req.body.sale.fecha);
  let ventaCreada;
  if (!deuda) {
    deuda = 0;
  }
  conexion.query(
    'INSERT INTO ventas (idCliente, fecha, total, deuda) VALUES (?, ?, ?, ?);',
    [idCliente, format(Date.parse(req.body.sale.fecha), 'yyyy-MM-dd'), total, deuda],
    (error, rows) => {
      if (error) {
        console.log(error);
      } else {
        ventaCreada = rows.insertId;
        req.body.productos.forEach(producto => {
          if (!producto.cantidad) {
            producto.cantidad = '1';
          }
          producto.precio = producto.precio ? producto.precio : producto.precio_base;
          conexion.query(
            'INSERT INTO productos_por_venta (idVenta, idProducto, precio, cantidad) VALUES (?, ?,?, ?);',
            [rows.insertId, producto.id, producto.precio, producto.cantidad],
            (error, rows) => {
              if (error) {
                console.log(error);
              } else {
                console.log(rows);
              }
            }
          );
        });
      }
      res.json({ idVentaCreada: ventaCreada });
    }
  );
});

router.post('/crearPDF', async (req, res, next) => {
  const arraySale = [];
  ventas = [];
  ventas = conexion.query('SELECT * FROM ventas', function (err, rows, fields) {
    if (!err) {
      rows.forEach(row => {
        allSales = [row.idCliente, row.fecha, row.total];
        arraySale.push(allSales);
      });
      listadoVentasHTML = generarListadoVentasHTML(arraySale);
      pdf.create(listadoVentasHTML).toFile('./listadoVentas.pdf', function (err, res2) {
        if (err) {
          console.log(err);
        } else {
          pdf2base64('./listadoVentas.pdf')
            .then(response => {
              res.json({ finalString: response });
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
    }
  });
});

router.post('/crearPDF/exportarClientes', async (req, res, next) => {
  ventas = req.body.sales;
  const arraySale = [];
  let query =
    'SELECT DISTINCT c.nombre FROM ventas v inner join clientes c on v.idCliente = c.id where v.id in (';
  ventas.forEach(venta => {
    query = query + ' ' + venta.id + ',';
  });
  query = query.slice(0, -1);
  query = query + ')';
  conexion.query(query, function (err, rows, fields) {
    if (!err) {
      rows.forEach(row => {
        allSales = [row.nombre];
        arraySale.push(allSales);
      });
      listadoClientesPorVentaHTML = generarExportarClientesHTML(arraySale);
      pdf
        .create(listadoClientesPorVentaHTML)
        .toFile('./clientesPorVenta.pdf', function (err, res2) {
          if (err) {
            console.log(err);
          } else {
            pdf2base64('./clientesPorVenta.pdf')
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

router.post('/crearPDF/exportarProductos', async (req, res, next) => {
  ventas = req.body.sales;
  console.log(ventas);
  const arraySale = [];
  let query =
    'SELECT p.descripcion, sum(ppv.cantidad) as cantidad FROM productos_por_venta ppv inner join productos p on ppv.idProducto = p.id where ppv.idVenta in (';
  ventas.forEach(venta => {
    query = query + ' ' + venta.id + ',';
  });
  query = query.slice(0, -1);
  query = query + ') GROUP BY ppv.idProducto;';
  console.log(query);
  conexion.query(query, function (err, rows, fields) {
    if (!err) {
      rows.forEach(row => {
        allSales = [row.descripcion, row.cantidad];
        arraySale.push(allSales);
      });

      listadoProductosPorVentaHTML = generarExportarProductosHTML(arraySale);
      pdf
        .create(listadoProductosPorVentaHTML)
        .toFile('./productosPorVenta.pdf', function (err, res2) {
          if (err) {
            console.log(err);
          } else {
            pdf2base64('./productosPorVenta.pdf')
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
  //trae las ventas por cliente
  const { id } = req.params;
  conexion.query('SELECT * FROM ventas WHERE idCliente = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

router.get('', (req, res, next) => {
  conexion.query(
    'SELECT *, v.id FROM ventas v inner join clientes c on v.idCliente = c.id ORDER BY v.id DESC',
    (err, rows, fields) => {
      if (!err) {
        res.json(rows);
      } else {
        console.log(err);
      }
    }
  );
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
  const { fecha_inicial_pipe, fecha_final_pipe } = req.body;
  conexion.query(
    'SELECT *, v.id FROM ventas v inner join clientes c on v.idCliente = c.id WHERE fecha BETWEEN ? and ? ORDER BY v.id DESC ',
    [fecha_inicial_pipe, fecha_final_pipe],
    (err, rows, fields) => {
      if (!err) {
        res.json(rows);
      } else {
        console.log(err);
      }
    }
  );
});

router.post('/propiedades', async (req, res, next) => {
  const { idCliente, idVenta } = req.body;
  conexion.query(
    'SELECT nombre, telefono, direccion, zona FROM clientes WHERE id = ?',
    [idCliente],
    (err, rows, fields) => {
      if (!err) {
        let datosClientes = rows[0];
        conexion.query(
          'SELECT * FROM productos_por_venta ppv  inner join productos p on ppv.idProducto = p.id inner join ventas v on ppv.idVenta = v.id where ppv.idVenta = ?',
          [idVenta],
          (err, rows, fields) => {
            let productosVenta = rows;
            console.log( rows);
            //aca debemos generar el pdf
            var options = { type: 'pdf', timeout: '1000000' };
            if (!productosVenta[0].deuda) {
              productosVenta[0].deuda = 0;
            }
            console.log(productosVenta[0] );
            ventaHTML = generarVentaHTML(datosClientes, productosVenta);  
            console.log(productosVenta);
            pdf.create(ventaHTML, options).toFile('./venta.pdf', function (err, res2) {
              if (err) {
                console.log(err);
              } else {
                pdf2base64('./venta.pdf')
                  .then(response => {
                    res.json({ finalString: response });
                  })
                  .catch(error => {
                    console.log(error);
                  });
              }
            });
          }
        );
      } else {
        console.log(err);
      }
    }
  );
});

module.exports = router;
