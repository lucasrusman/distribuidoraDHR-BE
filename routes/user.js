const express = require("express");
const bcryptjs = require('bcryptjs')
const jwt = require("jsonwebtoken");

const conexion = require("../database");

const router = express.Router();

router.post("/signup", async(req, res, next) => {
  const {email, password} = req.body
  const passHash = await bcryptjs.hash(password, 10)
  conexion.query('INSERT INTO users (email, password) VALUES (?, ?); ', [email, passHash], (error, rows)=>{
    if(error){console.log(error)}
    res.json({Status : "Usuario registrado"})
  })
});

router.post("/login", (req, res, next) => {
  try {
    const {email, password} = req.body
        //si no te manda email o pass
        if(!email || !password){
            res.json({Status : "Ingrese el email y/o password"})
        }else{
            conexion.query('SELECT * FROM users WHERE email = ?', [email], async(error, rows)=>{
                if( rows.length == 0 || !(await bcryptjs.compare(password, rows[0].password)) ){
                    res.json({Status : "Email y/o password incorrectos"})
                }else{
                    //inicio de sesión OK
                    const email = rows[0].email
                    const password = rows[0].password
                    // se crea el token
                    const token = jwt.sign(
                      { email, password},
                      "secret_this_should_be_longer",
                      { expiresIn: "1h" }
                    );
                    res.status(200).json({
                      token,
                      expiresIn: 3600,
                      Status : "Login correcto"
                    });
            }
        })
        }
  } catch (error) {
      return res.status(401).json({
        message: "Auth failed"
      });
  }
});

//NO FUNCIONA LOGOUT
router.post('/logout', (req, res, next) =>{
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
  if (!token){
    res.status(401).json({
      message: "Logout failed"
    });
  }
  res.status(200).json({
    Status : "Logout correcto"
  })
})


module.exports = router;
