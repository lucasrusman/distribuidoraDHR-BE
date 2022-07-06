const express = require('express');
const { format } = require('date-fns');
const conexion = require('../database');
const router = express.Router();
const { Base64Encode } = require('base64-stream');
const pdf2base64 = require('pdf-to-base64');
var pdf = require('html-pdf');
const { query } = require('express');
const generarListasHTML = require('../pdf_routes/generarListasHTML.ts')
router.post('/crear', async (req, res, next) => {
  const { nombre, porcentaje } = req.body;
  conexion.query(
    'INSERT INTO listas (nombre, porcentaje) VALUES (?, ?); ',
    [nombre, porcentaje],
    (error, rows) => {
      if (error) {
        console.log(error);
      }
      res.json({ Status: 'Lista creada' });
    }
  );
});

router.post('/crearPDF', async (req, res, next) => {
  const arrayListas = [];
  listas = [];
  listas = conexion.query('SELECT * FROM listas', function (err, rows, fields) {
    if (!err) {
      rows.forEach(row => {
        allList = [row.nombre, row.porcentaje];
        arrayListas.push(allList);
      });

      listadoHTML = generarListasHTML(arrayListas);
      pdf.create(listadoHTML).toFile('./listas.pdf', function (err, res2) {
        if (err) {
          console.log(err);
        } else {
          pdf2base64('./listas.pdf')
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
  conexion.query('SELECT * FROM listas WHERE id = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

router.get('', (req, res, next) => {
  conexion.query('SELECT * FROM listas ORDER BY id DESC', (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, porcentaje } = req.body;
  conexion.query(
    'UPDATE listas SET nombre = ?, porcentaje = ? WHERE id = ?',
    [nombre, porcentaje, id],
    (err, rows, fields) => {
      if (!err) {
        res.json({ Status: 'Lista Actualizada' });
      } else {
        console.log(err);
      }
    }
  );
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  conexion.query('DELETE FROM listas WHERE id = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json({ Status: 'Lista eliminada' });
    } else {
      console.log(err);
    }
  });
});

module.exports = router;
