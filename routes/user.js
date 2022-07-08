const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const conexion = require('../database');

const router = express.Router();
router.post('/signup', async (req, res, next) => {
  const { email, password } = req.body.user;
  const rol = 2
  const passHash = await bcryptjs.hash(password, 10);
  conexion.query(
    'INSERT INTO users (email, password, rol) VALUES (?, ?, ?); ',
    [email, passHash, rol],
    (error, rows) => {
      if (error) {
        console.log(error);
      }
      res.json({ Status: 'Usuario registrado' });
    } 
  );
});

router.post('/login', (req, res, next) => {
  try {
    const { email, password } = req.body;
    //si no te manda email o pass
    if (!email || !password) {
      res.json({ Status: 'Ingrese el email y/o password' });
    } else {
      conexion.query('SELECT * FROM users WHERE email = ?', [email], async (error, rows) => {
        if (rows.length == 0 || !(await bcryptjs.compare(password, rows[0].password))) {
          res.json({ Status: 'Email y/o password incorrectos' });
        } else {
          //inicio de sesión OK
          const email = rows[0].email;
          const password = rows[0].password
          const rol = rows[0].rol;
          // se crea el token
          const token = jwt.sign({ email, password }, 'secret_this_should_be_longer', {
            expiresIn: '1h'
          });
          res.status(200).json({
            token,
            expiresIn: 3600,
            rol,
            Status: 'Login correcto'
          });
        }
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed'
    });
  }
});

//NO FUNCIONA LOGOUT
router.post('/logout', (req, res, next) => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  if (!token) {
    res.status(401).json({
      message: 'Logout failed'
    });
  }
  res.status(200).json({
    Status: 'Logout correcto'
  });
});


router.get('', (req, res, next) => {
  conexion.query('SELECT * FROM users ORDER BY id DESC', (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  conexion.query('SELECT * FROM users WHERE id = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  conexion.query('DELETE FROM users WHERE id = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json({ Status: 'Usuario eliminado' });
    } else {
      console.log(err);
    }
  });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { email, password, rol } = req.body;
  const passHash = await bcryptjs.hash(password, 10);
  conexion.query(
    'UPDATE users SET email = ?, rol = ?, password=? WHERE id = ?',
    [email, rol, passHash, id],
    (err, rows, fields) => {
      if (!err) {
        res.json({ Status: 'Usuario Actualizado' });
      } else {
        console.log(err);
      }
    }
  );
});

module.exports = router;
