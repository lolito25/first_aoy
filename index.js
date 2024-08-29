// backend/index.js
const express = require("express");
const cors = require("cors");
const path = require('path');
//cors: mecanismo que permite que una aplicación web
//que se ejecuta en un dominio (origen) realice
//solicitudes a recursos en un dominio diferente.
//CORS es esencial para controlar y permitir el acceso seguro a
//las API RESTful desde diferentes orígenes, lo que es común en
//aplicaciones web modernas donde el frontend y el backend suelen
//estar en diferentes dominios.
const bodyParser = require("body-parser");
//middleware de Node.js utilizado en aplicaciones Express para
//analizar y procesar el cuerpo de las solicitudes HTTP entrantes.
//útil para trabajar con datos enviados en el cuerpo de la solicitud,
//como los datos de un formulario o un JSON en una API RESTful.
const mysql = require("mysql2");
const app = express();
const port = 3000;
// Middleware
app.use(cors());
app.use(bodyParser.json());
//maneja la seguridad de las solicitudes de diferentes orígenes y el
//análisis de los cuerpos de las solicitudes HTTP entrantes
// Conexión a MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "sena", // Cambia esto a tu contraseña de MySQL
  database: "testdb", // Cambia esto a tu base de datos
});
db.connect((err) => {
  if (err) {
    console.error("Error conectando a MySQL:", err);
    return;
  }
  console.log("Conectado a MySQL.");
});
app.use(express.static(path.join(__dirname, "./frontend")));

//ruta para la raiz
app.get("/", (req, res)=>{
  res.sendFile(path.join(__dirname, "frontend/index.html"));
});

// Ejemplo de rutas de la API RESTfulc
app.get("/api/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});
// Ruta POST para crear un usuario por su ID
app.post("/api/users", (req, res) => {
  const { name, email } = req.body;
  db.query(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json({ id: results.insertId, name, email });
    }
  );
});
// Ruta DELETE para eliminar un usuario por su ID
app.delete("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  db.query("DELETE FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (results.affectedRows === 0) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }
    res.send({ message: "Usuario eliminado" });
  });
});
// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
