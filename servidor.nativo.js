const http = require("http");
const url = require("url");

// Datos en memoria
const tareas = [
  { id: 1, titulo: "Aprender Node.js", completado: true },
  { id: 2, titulo: "Aprender Express", completado: false }
];
//si quiero un solo objeto y tengo un atributo id que lo hace, puedo usar en la url el recurso  api/tareas/1

//definicion de middlewares manuales
function loggerMiddleware(req, res, next) {
  const fecha = new Date();
  console.log(`[${fecha}] ${req.method} ${req.url}`);
  next(); //importante por que nos permite continuar con la ejecucion del servidor, si no se coloca se queda en el middleware y no continua con la ejecucion del servidor
}
function authMiddleware(req, res, next) {
    const parserUrl = url.parse(req.url, true);
    if (parserUrl.pathname.startsWith("/api") && parserUrl.query.token !== "123456") {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "No autorizado" }));
        return;
    }
    next();
}
// url/api/createtareas  Incorrecto
// url/api/tareas GET , POST, PUT, DELETE
const servidor = http.createServer((req, res) => { // req request y resp . response o respuesta
  const parsedUrl = url.parse(req.url, true);
  const partes = parsedUrl.pathname.split("/");
  console.log("Partes de la URL:", partes);
  loggerMiddleware(req, res, () => {});
  authMiddleware(req, res, () => {
    if (req.method === "GET" && parsedUrl.pathname === "/") {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }); // estructura de la respuesta,es un html, se coloca en el header
        res.end("<h1 style='color: blue;'>Servidor Node.js Nativo Activo</h1>");
    
    } 
    
    else if (req.method === "GET" && parsedUrl.pathname === "/api/tareas") {
        res.writeHead(200, { "Content-Type": "application/json" }); // respouesta en json 
        res.end(JSON.stringify(tareas));

    }
    else if (req.method === "GET" && partes[1] === "api" && partes[2] === "tareas" && partes[3]) {
        const tareaId = parseInt(partes[3]);
        const tarea = tareas.find(t => t.id === tareaId);
        if (tarea) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(tarea));
        } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Tarea no encontrada" }));
        }
    }
    
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Ruta no encontrada" }));
    }
    });

  }); // el orden es importante, primero se ejecuta el middleware de autenticacion y luego el de logger
  
  

  

servidor.listen(3000, () => {
  console.log("Servidor Nativo corriendo en http://localhost:3000");
});
