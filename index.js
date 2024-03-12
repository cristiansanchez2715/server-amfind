// const express = require("express")
// const cors = require("cors")
// const mysql = require("mysql")
// const app = express()
// const port = process.env.port || 4000
// const multer = require('multer');
// const path = require('path');
// const http = require('http');
// const server = http.createServer(app);
// const corsConfig = {
//   origin: 'https://cristiansanchez2715.github.io',
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
//   optionsSuccessStatus: 204,
// }
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'https://cristiansanchez2715.github.io');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   next();
// });

// app.use(cors(corsConfig))
// app.use(express.json());


// // app.listen(port, () => {
// //     console.log("servidor funcionando")
// // })
// server.listen(port, () => {
//   console.log("servidor socket")
// })


// app.get("/", (req, res) => {
//     res.send("el servidor esta en funcionamiento")
// })


// // FUNCIONES RELACIONADAS AL CHAT


// const io = require('socket.io')(server, {
//     path: '/socket',
//     cors: corsConfig,
//   });
  
//   io.on('connection', (socket) => {
//     console.log('Cliente conectado');
  
//     socket.on('nuevoMensajeDesdeCliente', (data) => {
//       console.log('Nuevo mensaje desde el cliente:', data.name, data.message, data.city, data.imagen);
  
  
//       io.emit('mensajeDesdeServidor', data);
//     });
//   });
  






// // logica imagenes

// app.use('/public', express.static('public'))
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null,  path.join(__dirname, './public/uploads')); // Directorio donde se guardarán los archivos
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname); // Utilizar el nombre original del archivo
//   }
//   });

// const upload = multer({ storage: storage });

// // 


// const connection = mysql.createConnection({
//   host: process.env.DB_HOST || '127.0.0.1',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || 'spizamarillo2715',
//   database: process.env.DB_NAME || 'amfind',
//   charset: 'utf8mb4'
// });
// // enviar nuevo usuario a la base de datos

// app.post("/introducirUsuario", (req, res) => {
// const {name, city} = req.body
// const sql = 'INSERT INTO usuarios (name, city) VALUES (?, ?)';
    
// const values = [name, city];

// connection.query(sql, values, (error, resultados) => {
//     if (error) {
//         console.error('Error al insertar usuario en la base de datos:', error);
//         res.status(500).send('Error al insertar usuario en la base de datos');
//         return;
//     }
//     console.log('Usuario insertado correctamente en la base de datos');
//     res.status(200).send('Usuario insertado correctamente en la base de datos');
// });
// });





// // enviar usuarios al frontend


// app.get("/traerUsuarios", (req, res) => {
//     const sql = "SELECT * FROM Usuarios;"
//     connection.query(sql, (err, results) => {
//       if (err) {
//         console.error('Error al ejecutar la consulta:', err);
//         res.status(500).json({ error: 'Error al obtener los usuarios' });
//         return;
//       }
//       res.json(results); // Enviar los resultados como respuesta en formato JSON
//     });
//     });
  




//     // ENVIAR IMAGEN A LA BASE DE DATOS Y GUARDAR ARCHIVO EN NUESTRO PUBLIC.UPLOADS

    
//     app.post("/enviarImagen/:userId", upload.single('imagen'), (req, res) => {
//         if (!req.file) {
//           return res.status(400).send('No se proporcionó ninguna imagen');
//         }
      
//         const fileName = req.file.originalname; 
//         const userId = req.params.userId;   // Obtener el nombre original del archivo
      
//         const sql = "UPDATE Usuarios SET imagen = ? WHERE id = ?";
//         const values = [fileName, userId]; // Usar el nombre original del archivo
        
//         connection.query(sql, values, (error, results) => {
//           if (error) {
//             console.error('Error al insertar imagen en la base de datos:', error);
//             res.status(500).send('Error al insertar imagen en la base de datos');
//             return;
//           }
//           console.log('Nombre del archivo insertado correctamente en la base de datos:', fileName);
//           res.status(200).json({ fileName }); // Enviar el nombre del archivo como parte de un objeto JSON en la respuesta
//         });
//       });



// NUEVA CONGIRUACION
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const multer = require('multer');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const port = process.env.PORT || 4000;
const { PORT, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = require('./config.js');
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://cristiansanchez2715.github.io');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


// Configuración CORS
const corsOptions = {
  // origin: 'https://diningexperiencesource.shop', // Reemplaza con la URL de tu aplicación frontend
    origin: 'https://cristiansanchez2715.github.io',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: 'Content-Type,Authorization',
};

// Middleware de CORS
app.use(cors(corsOptions));
app.use(express.json());

// Creación del servidor HTTP
const server = http.createServer(app);

// Creación del servidor de sockets
const io = socketIO(server, {
  path: '/socket',
  cors: corsOptions,
});

// Lógica del chat
io.on('connection', (socket) => {
  console.log('Cliente conectado');

  socket.on('nuevoMensajeDesdeCliente', (data) => {
    console.log('Nuevo mensaje desde el cliente:', data.name, data.message, data.city, data.imagen);

    io.emit('mensajeDesdeServidor', data);
  });
});

// Lógica para subir imágenes
app.use('/public', express.static('public'));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, './public/uploads')); // Directorio donde se guardarán los archivos
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Utilizar el nombre original del archivo
  }
});

const upload = multer({ storage: storage });

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'spizamarillo2715',
  database: process.env.DB_NAME || 'amfind',
  charset: 'utf8mb4'
});

// Endpoint para introducir un nuevo usuario en la base de datos
app.post("/introducirUsuario", (req, res) => {
  const { name, city } = req.body;
  const sql = 'INSERT INTO usuarios (name, city) VALUES (?, ?)';

  const values = [name, city];

  connection.query(sql, values, (error, resultados) => {
    if (error) {
      console.error('Error al insertar usuario en la base de datos:', error);
      res.status(500).send('Error al insertar usuario en la base de datos');
      return;
    }
    console.log('Usuario insertado correctamente en la base de datos');
    res.status(200).send('Usuario insertado correctamente en la base de datos');
  });
});

// Endpoint para obtener usuarios desde la base de datos
app.get("/traerUsuarios", (req, res) => {
  const sql = "SELECT * FROM Usuarios;";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).json({ error: 'Error al obtener los usuarios' });
      return;
    }
    res.json(results); // Enviar los resultados como respuesta en formato JSON
  });
});

// Endpoint para enviar una imagen a la base de datos y guardar el archivo
app.post("/enviarImagen/:userId", upload.single('imagen'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No se proporcionó ninguna imagen');
  }

  const fileName = req.file.originalname;
  const userId = req.params.userId;   // Obtener el nombre original del archivo

  const sql = "UPDATE Usuarios SET imagen = ? WHERE id = ?";
  const values = [fileName, userId]; // Usar el nombre original del archivo

  connection.query(sql, values, (error, results) => {
    if (error) {
      console.error('Error al insertar imagen en la base de datos:', error);
      res.status(500).send('Error al insertar imagen en la base de datos');
      return;
    }
    console.log('Nombre del archivo insertado correctamente en la base de datos:', fileName);
    res.status(200).json({ fileName }); // Enviar el nombre del archivo como parte de un objeto JSON en la respuesta
  });
});

// Iniciar el servidor
server.listen(port, () => {
  console.log("Servidor en funcionamiento en el puerto:", port);
});