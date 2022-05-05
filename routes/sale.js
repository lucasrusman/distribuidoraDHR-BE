const express = require('express');
const { format } = require('date-fns');
const conexion = require('../database');
const router = express.Router();
const { Base64Encode } = require('base64-stream');
const pdf2base64 = require('pdf-to-base64');
var pdf = require('html-pdf');
const { query } = require('express');

router.post('/crear', async (req, res, next) => {
  const { idCliente, total } = req.body.sale;
  let ventaCreada;
  conexion.query(
    'INSERT INTO ventas (idCliente, fecha, total) VALUES (?, ?, ?);',
    [idCliente, format(Date.parse(req.body.sale.fecha), 'yyyy-MM-dd'), total],
    (error, rows) => {
      if (error) {
        console.log(error);
      } else {
		ventaCreada = rows.insertId;
        req.body.productos.forEach(producto => {
          if(!producto.cantidad) {
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
                console.log('creamos la venta');
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
function generarExportarClientesHTML(clientes) {
  let date_ob = new Date();
  let date = ('0' + date_ob.getDate()).slice(-2);
  let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();

  var html =
    `
  <!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>A simple, clean, and responsive HTML invoice template</title>

		<style>
			.invoice-box {
				max-width: 800px;
				margin: auto;
				padding: 30px;
				border: 1px solid #eee;
				box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
				font-size: 12px;
				line-height: 24px;
				font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
				color: #555;
			}

			.invoice-box table {
				width: 100%;
				line-height: inherit;
				text-align: left;
			}

			.invoice-box table td {
				padding: 5px;
				vertical-align: top;
				width: 33%;
			}

			.invoice-box table tr td:nth-child(2) {
				text-align: right;
			}

			.invoice-box table tr.top table td {
				padding-bottom: 20px;
			}

			.invoice-box table tr.top table td.title {
				font-size: 45px;
				line-height: 45px;
				color: #333;
			}

			.invoice-box table tr.information table td {
				padding-bottom: 40px;
			}

			.invoice-box table tr.heading td {
				background: #eee;
				border-bottom: 1px solid #ddd;
				font-weight: bold;
			}

			.invoice-box table tr.details td {
				padding-bottom: 20px;
			}

			.invoice-box table tr.item td {
				border-bottom: 1px solid #eee;
			}

			.invoice-box table tr.item.last td {
				border-bottom: none;
			}

			.invoice-box table tr.total td:nth-child(2) {
				border-top: 2px solid #eee;
				font-weight: bold;
			}

			@media only screen and (max-width: 600px) {
				.invoice-box table tr.top table td {
					width: 100%;
					display: block;
					text-align: center;
				}

				.invoice-box table tr.information table td {
					width: 100%;
					display: block;
					text-align: center;
				}
			}
			.invoice-box.rtl {
				direction: rtl;
				font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
			}

			.invoice-box.rtl table {
				text-align: right;
			}

			.invoice-box.rtl table tr td:nth-child(2) {
				text-align: left;
			}
		</style>
	</head>

	<body>
		<div class="invoice-box">
			<table cellpadding="0" cellspacing="0" border="1">
				<tr class="top">
					<td colspan="3">
						<table>
							<tr>
								<td class="title" colspan="2">
                  <img src="https://dyg-frontend.herokuapp.com/assets/images/logo-dygcombos.png" style="width: 100%; max-width: 100px" />
								</td>
              
								<td>
									Fecha: ` +
    date +
    '-' +
    month +
    '-' +
    year +
    ` <br />
								</td>
							</tr>
						</table>
					</td>
				</tr>
				<tr class="heading">
					<td>Nombre</td>
          			<td>-</td>
					<td>-</td>
				</tr>

          <tr class="item">
          `;
  clientes.forEach(cliente => {
    html =
      html +
      `<tr>
      <td>` +
      cliente[0] +
      `</td>
	  <td></td>
	  <td></td>
                  </tr>`;
  });
  html =
    html +
    `</tr>
			</table>
		</div>
	</body>
</html>
`;
  return html;
}
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
function generarExportarProductosHTML(productos_por_venta) {
  let date_ob = new Date();
  let date = ('0' + date_ob.getDate()).slice(-2);
  let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();


  var html =
    `
  <!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>A simple, clean, and responsive HTML invoice template</title>

		<style>
			.invoice-box {
				max-width: 800px;
				margin: auto;
				padding: 30px;
				border: 1px solid #eee;
				box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
				font-size: 12px;
				line-height: 24px;
				font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
				color: #555;
			}

			.invoice-box table {
				width: 100%;
				line-height: inherit;
				text-align: left;
			}

			.invoice-box table td {
				padding: 5px;
				vertical-align: top;
			}

			.invoice-box table tr td:nth-child(2) {
				text-align: right;
			}

			.invoice-box table tr.top table td {
				padding-bottom: 20px;
			}

			.invoice-box table tr.top table td.title {
				font-size: 45px;
				line-height: 45px;
				color: #333;
			}

			.invoice-box table tr.information table td {
				padding-bottom: 40px;
			}

			.invoice-box table tr.heading td {
				background: #eee;
				border-bottom: 1px solid #ddd;
				font-weight: bold;
			}

			.invoice-box table tr.details td {
				padding-bottom: 20px;
			}

			.invoice-box table tr.item td {
				border-bottom: 1px solid #eee;
			}

			.invoice-box table tr.item.last td {
				border-bottom: none;
			}

			.invoice-box table tr.total td:nth-child(2) {
				border-top: 2px solid #eee;
				font-weight: bold;
			}

			@media only screen and (max-width: 600px) {
				.invoice-box table tr.top table td {
					width: 100%;
					display: block;
					text-align: center;
				}

				.invoice-box table tr.information table td {
					width: 100%;
					display: block;
					text-align: center;
				}
			}
			.invoice-box.rtl {
				direction: rtl;
				font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
			}

			.invoice-box.rtl table {
				text-align: right;
			}

			.invoice-box.rtl table tr td:nth-child(2) {
				text-align: left;
			}
		</style>
	</head>

	<body>
		<div class="invoice-box">
			<table cellpadding="0" cellspacing="0" border="1">
				<tr class="top">
					<td colspan="3">
						<table>
							<tr>
								<td class="title" colspan="2">
                  <img src="https://dyg-frontend.herokuapp.com/assets/images/logo-dygcombos.png" style="width: 100%; max-width: 100px" />
								</td>
              
								<td>
									Fecha: ` +
    date +
    '-' +
    month +
    '-' +
    year +
    ` <br />
								</td>
							</tr>
						</table>
					</td>
				</tr>
				<tr class="heading">
					<td>Descripción</td>
          			<td>Cantidad</td>
				</tr>

          <tr class="item">
          `;
  productos_por_venta.forEach(producto => {
    html =
      html +
      `<tr>
      <td>` +
      producto[0] +
      `</td>
      <td>` +
      producto[1] +
      `</td>
                  </tr>`;
  });
  html =
    html +
    `</tr>
			</table>
		</div>
	</body>
</html>
`;
  return html;
}
router.post('/crearPDF/exportarProductos', async (req, res, next) => {
  ventas = req.body.sales;
  console.log(ventas);
  const arraySale = [];
  let query =
    'SELECT p.descripcion, COUNT(*) as cantidad FROM productos_por_venta ppv inner join productos p on ppv.idProducto = p.id where ppv.idVenta in (';
  ventas.forEach(venta => {
    query = query + ' ' + venta.id + ',';
  });
  query = query.slice(0, -1);
  query = query + ') GROUP BY ppv.idProducto;';
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
  const { fecha_inicial, fecha_final } = req.body;
  conexion.query(
    'SELECT *, v.id FROM ventas v inner join clientes c on v.idCliente = c.id WHERE fecha BETWEEN ? and ? ORDER BY v.id DESC ',
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

router.post('/propiedades', async (req, res, next) => {
  const { idCliente, idVenta } = req.body;

  let exportSale = [];
  let array = [];
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
            //aca debemos generar el pdf

            var options = { type: 'pdf', timeout: '1000000' };

            ventaHTML = generarVentaHTML(datosClientes, productosVenta);
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

/* 

Funciones auxiliares
*/

function generarVentaHTML(datosCliente, datosVenta) {
  var html =
    `
  <!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>A simple, clean, and responsive HTML invoice template</title>

		<style>
			.invoice-box {
				max-width: 800px;
				margin: auto;
				padding: 30px;
				border: 1px solid #eee;
				box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
				font-size: 10px;
				line-height: 14px;
				font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
				color: #555;
			}

			.invoice-box table {
				width: 100%;
				line-height: inherit;
				text-align: left;
			}

			.invoice-box table td {
				padding: 5px;
				vertical-align: top;
			}

			.invoice-box table tr td:nth-child(2) {
				text-align: right;
			}

			.invoice-box table tr.top table td {
				padding-bottom: 0px;
			}

			.invoice-box table tr.top table td.title {
				font-size: 45px;
				line-height: 45px;
				color: #333;
			}

			.invoice-box table tr.information table td {
				padding-bottom: 0px;
			}

			.invoice-box table tr.heading td {
				background: #eee;
				border-bottom: 1px solid #ddd;
				font-weight: bold;
			}

			.invoice-box table tr.details td {
				padding-bottom: 0px;
			}

			.invoice-box table tr.item td {
				border-bottom: 1px solid #eee;
			}

			.invoice-box table tr.item.last td {
				border-bottom: none;
			}

			.invoice-box table tr.total td:nth-child(2) {
				border-top: 2px solid #eee;
				font-weight: bold;
				font-size: 14px;
			}

			@media only screen and (max-width: 600px) {
				.invoice-box table tr.top table td {
					width: 100%;
					display: block;
					text-align: center;
				}

				.invoice-box table tr.information table td {
					width: 100%;
					display: block;
					text-align: center;
				}
			}
			.invoice-box.rtl {
				direction: rtl;
				font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
			}

			.invoice-box.rtl table {
				text-align: right;
			}

			.invoice-box.rtl table tr td:nth-child(2) {
				text-align: left;
			}
		</style>
	</head>

	<body>
		<div class="invoice-box">
			<table cellpadding="0" cellspacing="0" border="1">
				<tr class="top">
					<td colspan="4">
						<table>
							<tr>
								<td class="title">
									<img src="https://dyg-frontend.herokuapp.com/assets/images/logo-dygcombos.png" style="width: 100%; max-width: 100px" />
								</td>

								<td>
								info@dygcombos.com.ar<br />
								11 5461-9635<br />
								</td>
							</tr>
						</table>
					</td>
				</tr>

				<tr class="information">
					<td colspan="4">
						<table>
							<tr>
								<td>
								Cliente: ` +
    datosCliente.nombre +
    `<br />
								Telefono: ` +
    datosCliente.telefono +
    `<br />
								</td>

								<td>
                ` +
    `Direccion: ` +
    datosCliente.direccion +
    `<br />
                ` +
    `Zona: ` +
    datosCliente.zona +
    `
								</td>
							</tr>
						</table>
					</td>
				</tr>


				<tr class="heading">
					<td>Producto</td>

					<td>Precio unit.</td>
					<td>Cantidad</td>
					<td>Precio Total</td>
				</tr>
        `;

  datosVenta.forEach(producto => {
    html =
      html +
      `
          <tr class="item">
					<td>` +
      producto.descripcion +
      `</td>

					<td>$` +
					producto.precio +
      `</td>
	  <td>` +
      producto.cantidad + 
      `</td>
	  <td>$` +
      producto.precio*producto.cantidad +
      `</td>
				</tr>
          `;
  });

  html =
    html +
    `

				
				<tr class="total">
					<td></td>
					<td></td>
					<td></td>
					<td>Total: $`+datosVenta[0].total+`</td>
				</tr>

				<tr class="total">
				<td>Deuda: </td>
				<td></td>
				<td></td>
				<td></td>
				
		</tr>
		
			</table>
		</div>
	</body>
</html>
`;

  html = html + html;

  return html;
}

function generarListadoVentasHTML(sales) {
  var html = `
  <!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>A simple, clean, and responsive HTML invoice template</title>

		<style>
			.invoice-box {
				max-width: 800px;
				margin: auto;
				padding: 30px;
				border: 1px solid #eee;
				box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
				font-size: 14px;
				line-height: 24px;
				font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
				color: #555;
			}

			.invoice-box table {
				width: 100%;
				line-height: inherit;
				text-align: left;
			}

			.invoice-box table td {
				padding: 5px;
				vertical-align: top;
			}

			.invoice-box table tr td:nth-child(2) {
				text-align: right;
			}

			.invoice-box table tr.top table td {
				padding-bottom: 20px;
			}

			.invoice-box table tr.top table td.title {
				font-size: 45px;
				line-height: 45px;
				color: #333;
			}

			.invoice-box table tr.information table td {
				padding-bottom: 40px;
			}

			.invoice-box table tr.heading td {
				background: #eee;
				border-bottom: 1px solid #ddd;
				font-weight: bold;
			}

			.invoice-box table tr.details td {
				padding-bottom: 20px;
			}

			.invoice-box table tr.item td {
				border-bottom: 1px solid #eee;
			}

			.invoice-box table tr.item.last td {
				border-bottom: none;
			}

			.invoice-box table tr.total td:nth-child(2) {
				border-top: 2px solid #eee;
				font-weight: bold;
			}
			.invoice-box.rtl {
				direction: rtl;
				font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
			}

			.invoice-box.rtl table {
				text-align: right;
			}

			.invoice-box.rtl table tr td:nth-child(2) {
				text-align: left;
			}
		</style>
	</head>

	<body>
		<div class="invoice-box">
			<table cellpadding="0" cellspacing="0" border="1">
				<tr class="top">
					<td colspan="2">
						<table>
							<tr>
								<td class="title">
									<img src="https://dyg-frontend.herokuapp.com/assets/images/logo-dygcombos.png" style="width: 100%; max-width: 100px" />
								</td>

						
							</tr>
						</table>
					</td>
				</tr>


				<tr class="heading">
        <td>Fecha</td>
        <td>Monto</td>
				</tr>
        `;

  sales.forEach(sale => {
    html =
      html +
      `<tr>
          <td>` +
      sale[1].substring(0, 10) +
      `</td>
          <td>$` +
      sale[2] +
      `</td>
          </tr>`;
  });

  html =
    html +
    `

			</table>
		</div>
	</body>
</html>
  
`;
  return html;
}

module.exports = router;
