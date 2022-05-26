const express = require('express');
const conexion = require('../database');
const router = express.Router();
var pdf = require('html-pdf');
const pdf2base64 = require('pdf-to-base64');

router.post('/crear', async (req, res, next) => {
  const { nombre, telefono, email, zona, direccion, detalle, deuda } = req.body;
  conexion.query(
    'INSERT INTO clientes (nombre, telefono, email, zona, direccion, detalle, deuda) VALUES (?, ?, ?, ?, ?, ?, ?); ',
    [nombre, telefono, email, zona, direccion, detalle, deuda],
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
  const { nombre, telefono, email, zona, direccion, detalle, deuda } = req.body;
  conexion.query(
    'UPDATE clientes SET nombre = ?, telefono = ?, email = ?, zona = ?, direccion = ?, detalle = ?, deuda = ? WHERE id = ?',
    [nombre, telefono, email, zona, direccion, detalle, deuda, id],
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

/* 
  Funciones auxiliares
*/

function generarClientesHTML(clientes) {
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
				font-size: 10px;
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
				padding-bottom: 0px;
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
								<td class="title">
                  <img src="https://dyg-frontend.herokuapp.com/assets/images/logo-dygcombos.png" style="width: 100%; max-width: 60px; height: 50px" />
								</td>
								<td style="text-align: end;" >
									Fecha: ` +
    date +
    '-' +
    month +
    '-' +
    year +
    ` <br />
                 https://dyg-frontend.herokuapp.com/ <br />
								</td>
							</tr>
						</table>
					</td>
				</tr>
				<tr class="heading">
					<td>Nombre</td>
          <td>Telefono</td>
					<td>Direccion</td>
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
                  <td>` +
      cliente[1] +
      `</td>
      <td>` +
      cliente[2] +
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
  console.log(html);
  return html;
}

module.exports = router;
