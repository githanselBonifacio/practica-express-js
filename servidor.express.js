// instalar express npm install express
const express = require('express');
const app = express();
const port = 3000;

// Datos en memoria
const tareas = [
  { id: 1, titulo: "Aprender Node.js", completado: true },
  { id: 2, titulo: "Aprender Express", completado: false }
];

function loggerMiddleware(req, res, next) {
  const fecha = new Date();
  console.log(`[${fecha}] ${req.method} ${req.url}`);
  next(); //importante por que nos permite continuar con la ejecucion del servidor, si no se coloca se queda en el middleware y no continua con la ejecucion del servidor
}
function authMiddleware(req, res, next) {
     if (req.path.startsWith("/api") && req.query.token !== "123456") {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "No autorizado" }));
        return;
    }
    next();

}
app.use(express.json())
app.use(loggerMiddleware); //validar el orden de los middlewares, si se coloca primero el authMiddleware y luego el loggerMiddleware, el loggerMiddleware no se ejecutara si el authMiddleware no pasa la validacion
app.use(authMiddleware);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/tareas', (req, res) => {
  res.json(tareas);
});

//comodin :id para capturar el id de la url, se puede usar req.params.id para obtener el valor del id
app.get('/api/tareas/:id', (req, res) => {
  const tareaId = parseInt(req.params.id);
  const tarea = tareas.find(t => t.id === tareaId); 
  if (tarea) {
    res.json(tarea);
  } else {
    res.status(404).json({ error: "Tarea no encontrada" });
  }
});

app.post('/api/tareas', (req, res) => {
  // Lógica para crear una nueva tarea
  console.log(req.body); // Asegúrate de que el cuerpo de la solicitud contenga los datos de la tarea
  const  titulo  = req.body.titulo; // Asegúrate de que el cuerpo de la solicitud contenga el título de la tarea
  const nuevaTarea = {
    id: tareas.length + 1,
    titulo,
    completado: false
  };
  tareas.push(nuevaTarea);
  res.status(201).json({ message: "Tarea creada" });
});

app.listen(port, () => {
  console.log(`practica jovenes creativos :: ${port}`);
});