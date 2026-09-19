const http = require("http");
const url = require("url");

// Datos en memoria
const tareas = [
  { id: 1, titulo: "Aprender Node.js", completado: true },
  { id: 2, titulo: "Aprender Express", completado: false }
];

const servidor = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const partes = parsedUrl.pathname.split("/");

  if (req.method === "GET" && parsedUrl.pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>Servidor Node.js Nativo Activo</h1>");
  } 
  
  else if (req.method === "GET" && parsedUrl.pathname === "/api/tareas") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(tareas));

  }
  
  else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Ruta no encontrada" }));
  }
});

servidor.listen(3000, () => {
  console.log("Servidor Nativo corriendo en http://localhost:3000");
});
