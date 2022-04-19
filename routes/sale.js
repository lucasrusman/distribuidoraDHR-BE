const express = require('express');
const PDFDocument = require('pdfkit');
const { format } = require('date-fns');
const conexion = require('../database');
const { jsPDF } = require('jspdf');
var fs = require('fs');
const router = express.Router();
const { Base64Encode } = require('base64-stream');
const pdf2base64 = require('pdf-to-base64');

var pdf = require('html-pdf');

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
          producto.precio = producto.precio ? producto.precio : producto.precio_base;
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
        });
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

function generarVentaHTML(datosCliente, datosVenta) {

  console.log(datosVenta)
 


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
				font-size: 16px;
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

			/** RTL **/
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
			<table cellpadding="0" cellspacing="0">
				<tr class="top">
					<td colspan="2">
						<table>
							<tr>
								<td class="title">
									<img src="https://www.sparksuite.com/images/logo.png" style="width: 100%; max-width: 300px" />
								</td>

								<td>
									Fecha: [FECHA VENTA]<br />
								</td>
							</tr>
						</table>
					</td>
				</tr>

				<tr class="information">
					<td colspan="2">
						<table>
							<tr>
								<td>
									[datos distribuodra 1]<br />
									[datos distribuodra 2]<br />
									[datos distribuodra 3]<br />
								</td>

								<td>
                `+ datosCliente.nombre + `<br />
                `+ datosCliente.telefono + `<br />
                `+ datosCliente.direccion + `<br />
                `+ datosCliente.zona + `
								</td>
							</tr>
						</table>
					</td>
				</tr>


				<tr class="heading">
					<td>Producto</td>

					<td>Precio</td>
				</tr>
        `;

  datosVenta.forEach(producto => {
    html = html + `
          <tr class="item">
					<td>` + producto.descripcion + `</td>

					<td>$`+ producto.precio + `0</td>
				</tr>
          `
  });

  html = html + `

				
				<tr class="total">
					<td></td>

					<td>Total: $385.00</td>
				</tr>
			</table>
		</div>
	</body>
</html>
`

  return html;
}

function generarListadoVentasHTML(sales) {
  var doc = new jsPDF();
  var imgData = './logo-dygcombos.png';
  doc.addImage(imgData, 'PNG', 15, 40, 180, 160);
  var html = `<table border="1">  
  <tbody><tr>
  <p>Hola</p>
  <td>Fecha</td>
  <td>Monto</td>
  </tr>`;
  sales.forEach(sale => {
    html =
      html +
      `<tr>
    <td>` +
      sale[1] +
      `</td>
    <td>` +
      sale[2] +
      `</td>
    </tr>`;
  });
  html =
    html +
    `
  </tbody>
  </table>
  `;
  return html;
}

router.post('/crearPDF/exportarProductos', async (req, res, next) => {
  ventas = req.body.sales;
  ventas.forEach(venta => {
    const arraySale = [];
    conexion.query(
      'SELECT idProducto FROM productos_por_venta WHERE idVenta = ?',
      [venta.id],
      function (err, rows, fields) {
        console.log(rows);
        if (!err) {
          rows.forEach(descripcionPorProducto => {
            console.log(descripcionPorProducto);
            conexion.query(
              'SELECT * FROM productos WHERE id = ?',
              [descripcionPorProducto.idProducto],
              (err, rows) => {
                producto = [rows[0].descripcion];
                arraySale.push(producto);
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
              }
            );
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
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

router.get('', (req, res, next) => {
  conexion.query('SELECT * FROM ventas ORDER BY id DESC', (err, rows, fields) => {
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

router.post('/propiedades', async (req, res, next) => {
  const { idCliente, idVenta } = req.body;

  let exportSale = [];
  let array = [];
  conexion.query(
    'SELECT nombre, telefono, direccion, zona FROM clientes WHERE id = ?',
    [idCliente],
    (err, rows, fields) => {
      if (!err) {
        let datosClientes = rows[0]
        conexion.query('SELECT * FROM productos_por_venta ppv  inner join productos p on ppv.idProducto = p.id where ppv.idVenta = ?',
          [idVenta],
          (err, rows, fields) => {
            let productosVenta = rows
            //aca debemos generar el pdf
            ventaHTML = generarVentaHTML(datosClientes, productosVenta);
            pdf.create(ventaHTML).toFile('./venta.pdf', function (err, res2) {
              if (err) {
                console.log(err);
              } else {
                pdf2base64("./venta.pdf")
                  .then(
                    (response) => {
                      res.json({ finalString: response });
                    }
                  )
                  .catch(
                    (error) => {
                      console.log(error);
                    }
                  )
              };
            });
          });

      } else {
        console.log(err);
      }
    }
  );
});

module.exports = router;
