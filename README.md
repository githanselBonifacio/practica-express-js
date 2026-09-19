# Practica Express.js: servidor nativo y Express

Proyecto educativo para entender como funciona un servidor HTTP en Node.js y como Express simplifica la creacion de APIs. La aplicacion trabaja con una lista de tareas almacenada en memoria.

## Objetivos de aprendizaje

Al terminar esta practica deberias poder:

- Crear un servidor HTTP con el modulo nativo `http` de Node.js.
- Crear un servidor web usando Express.
- Entender la relacion entre solicitud (`request`) y respuesta (`response`).
- Diseñar rutas para una API REST.
- Leer parametros de ruta, parametros de consulta y cuerpos JSON.
- Crear y encadenar middlewares.
- Usar codigos de estado HTTP y respuestas JSON.
- Comparar el trabajo manual con Node.js nativo frente al trabajo con Express.

## Requisitos

- Node.js instalado, preferiblemente una version LTS.
- Un editor de codigo, como Visual Studio Code.
- Una terminal.
- Opcional: `curl`, Postman o Thunder Client para probar la API.

Comprueba la instalacion con:

```bash
node --version
npm --version
```

## Archivos del proyecto

| Archivo | Descripcion |
| --- | --- |
| `servidor.nativo.js` | Servidor creado con los modulos nativos `http` y `url`. El enrutamiento y los middlewares se hacen manualmente. |
| `servidor.express.js` | Servidor creado con Express. Incluye rutas, middleware integrado para JSON y creacion de tareas. |
| `README.md` | Guia, conceptos, instrucciones y ejercicios de la practica. |

## Instalacion

El servidor nativo no necesita dependencias externas. Para ejecutar el servidor Express, instala Express desde la carpeta del proyecto:

```bash
npm init -y
npm install express
```

Esto crea `package.json`, `package-lock.json` y la carpeta `node_modules`.

## Ejecucion

Ambos servidores utilizan el puerto `3000`, por lo que se debe ejecutar uno a la vez.

### Servidor nativo

```bash
node servidor.nativo.js
```

Mensaje esperado:

```text
Servidor Nativo corriendo en http://localhost:3000
```

### Servidor Express

Deten el servidor anterior con `Ctrl + C` y ejecuta:

```bash
node servidor.express.js
```

Mensaje esperado:

```text
practica jovenes creativos :: 3000
```

Abre `http://localhost:3000` en el navegador para comprobar la ruta principal.

## API disponible

Las rutas que comienzan por `/api` requieren el token de practica `123456` como parametro de consulta.

> **Importante: esto no es autenticacion real.** El token fijo y visible en la URL se usa
> unicamente para ejemplificar un middleware y practicar el uso de `req.query` (query
> parameters). Nunca se debe proteger una aplicacion real de esta manera: el token no
> deberia estar escrito en el codigo ni enviarse en la URL. En un proyecto real se
> utilizan mecanismos como sesiones, OAuth 2.0 o tokens seguros en headers, ademas de
> variables de entorno y HTTPS.

| Metodo | Ruta | Token | Respuesta |
| --- | --- | --- | --- |
| `GET` | `/` | No | Mensaje de bienvenida. |
| `GET` | `/api/tareas` | Si | Lista todas las tareas. |
| `GET` | `/api/tareas/:id` | Si | Busca una tarea por su identificador. |
| `POST` | `/api/tareas` | Si | Crea una tarea. Disponible en Express. |

El token se envia asi:

```text
http://localhost:3000/api/tareas?token=123456
```

### Obtener todas las tareas

```bash
curl "http://localhost:3000/api/tareas?token=123456"
```

Respuesta de ejemplo:

```json
[
  { "id": 1, "titulo": "Aprender Node.js", "completado": true },
  { "id": 2, "titulo": "Aprender Express", "completado": false }
]
```

### Obtener una tarea por ID

```bash
curl "http://localhost:3000/api/tareas/1?token=123456"
```

Si el ID no existe, la API responde con `404`:

```json
{ "error": "Tarea no encontrada" }
```

### Crear una tarea con Express

Esta ruta requiere el middleware `express.json()` para poder leer `req.body`.

```bash
curl -X POST "http://localhost:3000/api/tareas?token=123456" ^
  -H "Content-Type: application/json" ^
  -d "{\"titulo\":\"Practicar APIs\"}"
```

En PowerShell tambien puedes usar:

```powershell
Invoke-RestMethod -Method Post `
  -Uri "http://localhost:3000/api/tareas?token=123456" `
  -ContentType "application/json" `
  -Body '{"titulo":"Practicar APIs"}'
```

La respuesta exitosa utiliza el codigo `201 Created`:

```json
{ "message": "Tarea creada" }
```

> Los datos viven solamente en memoria. Al detener el proceso, las tareas creadas desaparecen.

## Conceptos principales

### 1. Servidor HTTP

Un servidor HTTP recibe solicitudes de clientes, decide que hacer con cada solicitud y devuelve una respuesta.

- **Cliente:** navegador, Postman, Thunder Client o `curl`.
- **Solicitud:** metodo HTTP, URL, headers, parametros y posiblemente un cuerpo.
- **Servidor:** programa que escucha un puerto, en este caso el `3000`.
- **Respuesta:** codigo de estado, headers y contenido.

En Node.js nativo, el punto de entrada es:

```js
const servidor = http.createServer((req, res) => {
  // Analizar la solicitud y construir la respuesta
});
```

En Express, el servidor se crea con una aplicacion y las rutas se registran de forma declarativa:

```js
const app = express();
app.get('/api/tareas', (req, res) => {
  res.json(tareas);
});
```

### 2. API

Una API es un contrato que permite que dos programas se comuniquen. En este proyecto, la API expone recursos de tareas.

- Recurso: `tareas`.
- Coleccion: `/api/tareas`.
- Recurso individual: `/api/tareas/1`.
- Formato: JSON.
- Operaciones: se expresan con metodos HTTP.

Los metodos mas usados son:

| Metodo | Proposito | Ejemplo |
| --- | --- | --- |
| `GET` | Consultar datos | `GET /api/tareas` |
| `POST` | Crear un dato | `POST /api/tareas` |
| `PUT` | Reemplazar un dato | `PUT /api/tareas/1` |
| `PATCH` | Actualizar parte de un dato | `PATCH /api/tareas/1` |
| `DELETE` | Eliminar un dato | `DELETE /api/tareas/1` |

Esta practica implementa `GET` en ambos servidores y `POST` en Express. `PUT`, `PATCH` y `DELETE` quedan como ejercicios.

### 3. Middleware

Un middleware es una funcion que se ejecuta durante el ciclo de una solicitud. Puede:

- Leer o modificar la solicitud.
- Registrar informacion.
- Validar autenticacion.
- Transformar datos.
- Terminar la respuesta.
- Entregar el control al siguiente middleware con `next()`.

La forma general es:

```js
function miMiddleware(req, res, next) {
  // Trabajo previo
  next();
}
```

En este proyecto hay dos middlewares principales. El siguiente `authMiddleware` es
**solo un ejemplo educativo**: no implementa seguridad y no debe copiarse para
autenticar usuarios en una aplicacion real.

- `loggerMiddleware`: muestra en consola la fecha, el metodo y la URL.
- `authMiddleware`: verifica que las rutas `/api` reciban `token=123456`, para mostrar
  como leer un query parameter con `req.query.token`.

Si la autenticacion falla, el middleware responde con `401 Unauthorized` y no llama a `next()`. Si llama a `next()`, la solicitud continua hacia el siguiente middleware o hacia la ruta.

En Express, la cadena se registra asi:

```js
app.use(express.json());
app.use(loggerMiddleware);
app.use(authMiddleware);
```

El orden importa. Por ejemplo, `express.json()` debe ejecutarse antes de la ruta `POST` para que `req.body` contenga el JSON enviado.

En el servidor nativo, los middlewares se invocan manualmente dentro de `createServer`, porque Node.js no trae un sistema de middleware como Express.

### 4. `req` y `res`

En Node.js nativo:

- `req.method` contiene el metodo HTTP.
- `req.url` contiene la URL solicitada.
- `res.writeHead()` define el codigo y los headers.
- `res.end()` termina y envia la respuesta.

En Express:

- `req.params.id` obtiene un parametro de ruta.
- `req.query.token` obtiene `token` desde la URL.
- `req.body` obtiene el cuerpo JSON, gracias a `express.json()`.
- `res.status(404)` establece el codigo HTTP.
- `res.json(datos)` envia una respuesta JSON.
- `res.send(texto)` envia texto.

## Diferencias entre Node.js nativo y Express

| Aspecto | Node.js nativo | Express |
| --- | --- | --- |
| Enrutamiento | Se compara manualmente `method` y URL. | Se declara con `app.get`, `app.post`, etc. |
| Parseo de URL | Se realiza con `url.parse`. | Express ofrece `req.params`, `req.query` y utilidades propias. |
| Respuestas | Se usan `writeHead`, `write` y `end`. | Se usan `status`, `json` y `send`. |
| JSON recibido | Hay que leer y procesar el stream del request. | `express.json()` lo deja disponible en `req.body`. |
| Middleware | Se diseña y ejecuta manualmente. | Se registra con `app.use` y se integra con las rutas. |
| Dependencias | No necesita Express. | Requiere instalar Express. |
| Control y aprendizaje | Mayor control y claridad sobre HTTP. | Mayor productividad y codigo mas legible. |
| Escalabilidad del codigo | Puede volverse repetitivo. | Facilita organizar muchas rutas y middlewares. |

### Ventajas del servidor nativo

- Permite comprender que ocurre realmente en HTTP.
- Tiene pocas dependencias.
- Ofrece control detallado sobre cada respuesta.
- Es apropiado para aprender, crear servidores muy especializados o construir herramientas pequenas.

### Ventajas de Express

- Reduce codigo repetitivo.
- Hace el enrutamiento mas claro.
- Tiene un ecosistema amplio de middlewares.
- Facilita validar datos, manejar errores y separar rutas.
- Es una opcion practica para APIs y aplicaciones web de mayor tamano.

Express no reemplaza Node.js: funciona sobre Node.js y aprovecha sus capacidades.

## Codigos de estado usados

- `200 OK`: solicitud exitosa.
- `201 Created`: recurso creado correctamente.
- `401 Unauthorized`: falta autenticacion valida.
- `404 Not Found`: ruta o tarea inexistente.

## Errores frecuentes

### `Cannot find module 'express'`

Ejecuta `npm install express` en la carpeta del proyecto.

### `EADDRINUSE: address already in use`

Ya hay un proceso usando el puerto `3000`. Detenlo con `Ctrl + C` o cambia el puerto en el archivo que vas a ejecutar.

### La API responde `No autorizado` en esta practica

Para seguir los ejemplos de esta practica, verifica que la URL incluya exactamente
`?token=123456`. Esta validacion es intencionalmente simple y no representa un sistema
de autenticacion seguro.

### `req.body` aparece como `undefined`

Confirma que:

1. Estas ejecutando `servidor.express.js`.
2. La solicitud tiene el header `Content-Type: application/json`.
3. El JSON es valido.
4. `app.use(express.json())` se ejecuta antes de la ruta `POST`.

### Los datos se pierden

Es el comportamiento esperado: el arreglo `tareas` esta en memoria y no utiliza una base de datos.

## Retos para continuar

1. Agrega validacion para impedir tareas sin `titulo`.
2. Extrae las rutas de Express a un archivo `routes/tareas.js`.
3. Agrega un middleware global para manejar errores.
4. Usa variables de entorno para el puerto y el token.
5. Reemplaza el arreglo en memoria por una base de datos.
6. Agrega pruebas automatizadas para las rutas.
7. Compara el mismo endpoint implementado en ambos servidores.
8. Documenta la API con OpenAPI o Swagger.

## Reto de la clase: actualizar y eliminar tareas

Completa en `servidor.express.js` las operaciones que faltan para tener un CRUD
basico. Conserva el formato actual de la aplicacion y utiliza el token de practica en
las solicitudes.

### `PUT /api/tareas/:id`

Debe actualizar la tarea cuyo ID coincida con `req.params.id`. Recibe un JSON como:

```json
{
  "titulo": "Repasar middleware",
  "completado": true
}
```

Requisitos:

- Responder `200` y devolver la tarea actualizada si existe.
- Responder `404` con `{ "error": "Tarea no encontrada" }` si el ID no existe.
- Validar que el cuerpo incluya los datos necesarios.
- Mantener el mismo `id`; no crear una tarea nueva.

Ejemplo de solicitud:

```bash
curl -X PUT "http://localhost:3000/api/tareas/1?token=123456" ^
  -H "Content-Type: application/json" ^
  -d "{\"titulo\":\"Repasar middleware\",\"completado\":true}"
```

### `DELETE /api/tareas/:id`

Debe eliminar la tarea cuyo ID coincida con `req.params.id`.

Requisitos:

- Responder `204 No Content` si la tarea fue eliminada, sin enviar un cuerpo; o usar
  `200` con un mensaje claro.
- Responder `404` si el ID no existe.
- No eliminar otras tareas.
- Comprobar despues con `GET /api/tareas` que la tarea ya no aparece.

Ejemplo de solicitud:

```bash
curl -X DELETE "http://localhost:3000/api/tareas/2?token=123456"
```

### Comprobacion del reto

La solucion se considera completa cuando se puede crear una tarea, consultarla,
actualizarla con `PUT`, eliminarla con `DELETE` y demostrar que los casos de ID
inexistente devuelven `404`.

## Ruta recomendada de estudio

1. Ejecuta el servidor nativo y prueba `/` y `/api/tareas`.
2. Cambia el token para observar la respuesta `401`.
3. Prueba una tarea existente y una inexistente.
4. Ejecuta el servidor Express y repite las pruebas.
5. Crea una tarea con `POST`.
6. Lee nuevamente la lista y observa que los datos se modificaron en memoria.
7. Revisa el orden de los middlewares y recuerda que el middleware de autenticacion es
  solamente una demostracion.
8. Resuelve el reto de `PUT` y `DELETE` implementando una operacion a la vez.

## Resultado esperado

Al finalizar, deberias poder explicar con tus propias palabras:

- Como una solicitud llega a un servidor.
- Como se selecciona una ruta.
- Por que una API utiliza metodos HTTP y codigos de estado.
- Que problema resuelve un middleware.
- Que simplifica Express frente al modulo `http`.
- Por que los datos de esta practica no son persistentes.

Este proyecto es una base pequena pero completa para comenzar a construir APIs con Node.js y Express.
