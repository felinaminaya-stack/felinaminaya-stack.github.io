frontend estático
        │
        │
        ├── API serverless
        │
        ├── base de datos ligera
        │
        └── almacenamiento de imágenes


Modelo de datos

Tabla principal: gatos
id
nombre
edad
sexo
descripcion
estado
foto
fecha_rescate
colonia

Estados posibles:
disponible
en_proceso
adoptado
acogida





Panel de voluntarios

Interfaz privada accesible desde:
/admin

Funciones:

añadir gato
subir foto
marcar adopción
editar ficha

Ejemplo de formulario:
<form id="nuevoGato">

<input type="text" placeholder="Nombre">

<select>
<option>Macho</option>
<option>Hembra</option>
</select>

<textarea placeholder="Descripción"></textarea>

<input type="file">

<button>Guardar</button>

</form>

El formulario envía datos a la API serverless.

API serverless

Ejemplo conceptual.

export default {

async fetch(request, env){

if(request.method === "POST"){

let data = await request.json()

await env.DB.prepare(
"INSERT INTO gatos (nombre,edad,descripcion) VALUES (?,?,?)"
).bind(data.nombre,data.edad,data.descripcion).run()

return new Response("ok")

}

}

}




Visualización pública

Los gatos se renderizan desde la base de datos.

Ejemplo JS:

async function cargarGatos(){

let r = await fetch("/api/gatos")
let gatos = await r.json()

gatos.forEach(g=>{

document.body.innerHTML += `
<div class="gato">
<img src="${g.foto}">
<h3>${g.nombre}</h3>
<p>${g.descripcion}</p>
</div>
`

})

}



Mapa de colonias felinas

Se puede integrar un mapa:

var map = L.map('map').setView([38.95,-1.72], 13)

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
).addTo(map)

L.marker([38.95,-1.72])
.addTo(map)
.bindPopup("Colonia Plaza Norte")




Sistema de adopción inteligente

Cuando alguien solicita adopción:

se guarda en base de datos
llega email a voluntarios
cambia estado del gato

Tabla adicional:
solicitudes_adopcion

Campos:

nombre
email
telefono
gato_id
mensaje
fecha




QR para eventos

Cada gato genera automáticamente un QR.

Ejemplo:
protectora.org/gato/luna

En eventos de adopción:

persona escanea QR
      ↓
abre ficha
      ↓
envía solicitud

Esto mejora mucho las adopciones.


----------------------------------------------------------------------------------------------------------------


1. Arquitectura general

Diagrama lógico:

usuario
   │
   ▼
frontend estático
(HTML / CSS / JS)
   │
   ▼
API REST
(Supabase)
   │
   ▼
base de datos
(PostgreSQL)

Componentes:

capa	función
frontend	web pública + panel voluntarios
API	lectura/escritura de datos
DB	gatos, colonias, adopciones
XR	visualización 3D opcional
2. Estructura del proyecto
protectoras-xr-ready/

index.html
gatos.html
gato.html
adopcion.html
mapa.html
admin.html

/css
style.css

/js
api.js
gatos.js
admin.js
mapa.js

/xr
gatoXR.html

/assets
img/
modelos3d/

/data
config.js

Separación clara entre:

UI
lógica
datos
3. Modelo de datos (Supabase)

Tabla gatos

campo	tipo
id	uuid
nombre	text
edad	text
sexo	text
descripcion	text
foto	text
estado	text
fecha_rescate	date
colonia	text

Estados:

disponible
en_adopcion
reservado
adoptado
acogida

Tabla solicitudes_adopcion

campo	tipo
id	uuid
gato_id	uuid
nombre	text
email	text
telefono	text
mensaje	text
fecha	timestamp

Tabla colonias

campo	tipo
id	uuid
nombre	text
lat	float
lon	float
descripcion	text

6. Ficha individual de gato

gato.html

/gato.html?id=uuid

Script:

async function cargarFicha(){

let params = new URLSearchParams(location.search)
let id = params.get("id")

let r = await fetch(
`${SUPABASE_URL}/rest/v1/gatos?id=eq.${id}`
)

let gato = (await r.json())[0]

document.getElementById("nombre").innerText = gato.nombre
document.getElementById("descripcion").innerText = gato.descripcion
document.getElementById("foto").src = gato.foto

}

cargarFicha()
7. Panel de voluntarios

admin.html

Funciones:

añadir gato
editar estado
subir foto

Formulario básico:

<form id="nuevoGato">

<input id="nombre" placeholder="Nombre">
<input id="edad" placeholder="Edad">

<textarea id="descripcion"></textarea>

<input id="foto" placeholder="URL foto">

<button>Añadir gato</button>

</form>

Script:

document
.getElementById("nuevoGato")
.addEventListener("submit",async e=>{

e.preventDefault()

let data = {

nombre: nombre.value,
edad: edad.value,
descripcion: descripcion.value,
foto: foto.value,
estado:"disponible"

}

await fetch(
`${SUPABASE_URL}/rest/v1/gatos`,
{
method:"POST",
headers:{
apikey:SUPABASE_KEY,
Authorization:`Bearer ${SUPABASE_KEY}`,
"Content-Type":"application/json"
},
body:JSON.stringify(data)
})

alert("Gato añadido")

})
8. Mapa de colonias

mapa.html

var map = L.map('map').setView([38.95,-1.72], 13)

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
).addTo(map)

async function cargarColonias(){

let r = await fetch(
`${SUPABASE_URL}/rest/v1/colonias`
)

let colonias = await r.json()

colonias.forEach(c=>{

L.marker([c.lat,c.lon])
.addTo(map)
.bindPopup(c.nombre)

})

}

cargarColonias()
9. Solicitud de adopción

adopcion.html

Formulario:

<form id="solicitud">

<input id="nombre">
<input id="email">
<input id="telefono">

<textarea id="mensaje"></textarea>

<button>Enviar</button>

</form>

Script:

async function enviarSolicitud(){

let data = {

gato_id:gatoID,
nombre:nombre.value,
email:email.value,
telefono:telefono.value,
mensaje:mensaje.value

}

await fetch(
`${SUPABASE_URL}/rest/v1/solicitudes_adopcion`,
{
method:"POST",
headers:{
apikey:SUPABASE_KEY,
Authorization:`Bearer ${SUPABASE_KEY}`,
"Content-Type":"application/json"
},
body:JSON.stringify(data)
})

}
10. Modo XR

xr/gatoXR.html

<a-scene>

<a-entity
gltf-model="../assets/modelos3d/gato.glb"
position="0 0 -3"
rotation="0 180 0">
</a-entity>

</a-scene>

Esto permite visualizar el animal en 3D.

Uso:

protectora.org/xr/gatoXR.html
11. QR para adopciones

Cada ficha tiene URL:

protectora.org/gato?id=uuid

El QR puede generarse con cualquier generador simple.

Uso típico:

ferias de adopción
veterinarios
carteles callejeros
12. Seguridad mínima recomendada

Configurar en Supabase:

Row Level Security
tabla pública solo lectura
escritura solo desde panel autenticado
13. Escalabilidad

Capacidad aproximada:

elemento	capacidad
gatos	miles
visitas	CDN global
imágenes	ilimitado

Hosting estático escala muy bien.

14. Resultado

El sistema ofrece:

web pública
panel de voluntarios
gestión de adopciones
mapa de colonias
fichas individuales
XR opcional

Coste: 0 €

------------------------------------------------------------------------------------------------------------------



1. Arquitectura general v3

Arquitectura lógica:

usuario
 │
 ▼
Frontend (HTML / JS)
 │
 ▼
API REST
(Supabase)
 │
 ▼
PostgreSQL
 │
 ├── gatos
 ├── colonias
 ├── adopciones
 └── voluntarios

Servicios adicionales:

servicio	función
CDN	entrega rápida de la web
storage	fotos de gatos
auth	login voluntarios
2. Estructura del proyecto
protectoras-xr-v3/

index.html
gatos.html
gato.html
mapa.html
adopcion.html
admin.html

/js
api.js
ui.js
admin.js
mapa.js

/css
style.css

/xr
ar-gato.html
vr-refugio.html

/assets
img/
modelos3d/

/components
gatoCard.js
tablaAdmin.js

Se introduce una capa componentizada para reutilización.

3. Modelo de datos ampliado

Tabla gatos

campo	tipo
id	uuid
nombre	text
edad	text
sexo	text
descripcion	text
foto	text
modelo3d	text
estado	text
fecha_rescate	date
colonia_id	uuid

Estados:

disponible
en_adopcion
reservado
acogida
adoptado

Tabla colonias

campo	tipo
id	uuid
nombre	text
lat	float
lon	float
descripcion	text

Tabla adopciones

campo	tipo
id	uuid
gato_id	uuid
nombre	text
email	text
telefono	text
mensaje	text
fecha	timestamp

Tabla voluntarios

campo	tipo
id	uuid
nombre	text
email	text
rol	text

Roles:

admin
voluntario
veterinario
4. Panel administrativo (mini-CRM)

El panel incluye tres vistas:

vista	función
gatos	gestionar fichas
adopciones	revisar solicitudes
colonias	mapa de colonias

Interfaz conceptual:

ADMIN PANEL

[ GATOS ] [ ADOPCIONES ] [ COLONIAS ]

--------------------------------
| nombre | estado | editar |
--------------------------------
| Luna   | disponible | ✎ |
| Simba  | adoptado   | ✎ |
5. Subida directa de imágenes

Se usa el storage de Supabase.

Ejemplo JS:

async function subirFoto(file){

let { data, error } =
await supabase.storage
.from("gatos")
.upload(`foto-${Date.now()}`, file)

return data.path

}

En el formulario:

arrastrar foto
      ↓
subida automática
      ↓
URL guardada en base de datos
6. Generación automática de fichas

Cada gato obtiene automáticamente una página:

/gato.html?id=uuid

Script:

async function cargarFicha(){

let params = new URLSearchParams(location.search)
let id = params.get("id")

let { data } =
await supabase
.from("gatos")
.select("*")
.eq("id",id)

let g = data[0]

nombre.innerText = g.nombre
foto.src = g.foto
descripcion.innerText = g.descripcion

}
7. Mapa operativo de colonias

Mapa con Leaflet.

var map = L.map("map").setView([38.95,-1.72],13)

L.tileLayer(
"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
).addTo(map)

async function cargarColonias(){

let { data } =
await supabase
.from("colonias")
.select("*")

data.forEach(c=>{

L.marker([c.lat,c.lon])
.addTo(map)
.bindPopup(c.nombre)

})

}

Uso real:

gestión de colonias
planificación de alimentación
control sanitario
8. Flujo de adopción

Proceso completo:

visitante
   ↓
ficha del gato
   ↓
formulario adopción
   ↓
registro en base datos
   ↓
notificación voluntarios

Formulario:

await supabase
.from("adopciones")
.insert({
gato_id:gatoID,
nombre:nombre.value,
email:email.value,
telefono:telefono.value,
mensaje:mensaje.value
})
9. Modo XR / AR

Cada gato puede tener un modelo 3D.

Página AR:

/xr/ar-gato.html?id=uuid

Ejemplo A-Frame:

<a-scene embedded arjs>

<a-marker preset="hiro">

<a-entity
gltf-model="gato.glb"
scale="0.5 0.5 0.5">
</a-entity>

</a-marker>

<a-entity camera></a-entity>

</a-scene>

Esto permite:

visualizar gato en realidad aumentada
experiencias educativas
10. Experiencia VR del refugio

Opcionalmente se puede crear:

vr-refugio.html

con recorrido virtual del refugio.

11. QR automáticos

Cada ficha produce:

protectora.org/gato?id=uuid

QR útiles en:

clínicas veterinarias
ferias de adopción
carteles urbanos
12. Analítica ética

Alternativas recomendadas:

Plausible Analytics
Matomo

Permiten analizar:

métrica	utilidad
visitas ficha	interés adopción
formularios	conversión
colonias vistas	actividad territorial
13. Escalabilidad del sistema

Capacidad aproximada:

recurso	límite práctico
gatos registrados	miles
colonias	cientos
visitas	millones (CDN)
14. Coste real

Infraestructura gratuita:

servicio	coste
hosting	0 €
base de datos	0 €
storage	0 €
mapas	0 €
15. Resultado

El sistema se convierte en una infraestructura digital para bienestar animal:

web pública
mini-CRM para voluntarios
gestión de colonias
solicitudes de adopción
XR educativo
QR para campañas

Si se desea ir todavía más lejos (algo que encaja mucho con su perfil tecnológico), se puede diseñar una Protectoras XR-Ready v4, donde aparecen:

gemelo digital del refugio
panel de datos para ayuntamientos
IA para clasificación de gatos rescatados
visualización XR educativa para colegios

Ese tipo de sistema ya empieza a parecerse más a infraestructura cívica digital para bienestar animal, no simplemente a una web.