---
theme: default
title: Contenedores — Sesión 1
info: |
  Docker / Contenedores — Sesión 1
  Fundamentos, ejecución y persistencia
class: cover-slide text-center
transition: slide-left
mdc: true
---

<div class="cover-kicker">Universidad del Norte · Estructura del Computador II</div>

# Contenedores

Docker como herramienta para empaquetar y ejecutar aplicaciones

<div class="subtitle">Fundamentos · Ejecución · Persistencia</div>

<div class="cover-meta">
  <div class="cover-prof">Augusto Salazar</div>
  <div class="cover-mail">augustosalazar@uninorte.edu.co</div>
</div>

<div class="abs-br m-6 text-sm opacity-80">Sesión 1 de 2</div>

---

# Por qué existen los contenedores

Un programa casi nunca corre solo: depende de un sistema operativo, de librerías
y de una configuración concreta. Cuando ese entorno cambia, el programa puede
comportarse distinto o directamente fallar.

Un **contenedor** empaqueta la aplicación **junto con todo lo que necesita para
ejecutarse** —código, librerías, dependencias y configuración— en una única
unidad estándar y autocontenida.

- **Portable y reproducible**: la misma unidad corre igual en tu laptop, en un
  servidor o en la nube.
- **Aislado**: no interfiere con otras aplicaciones que comparten el mismo host.
- **Liviano y rápido**: arranca en segundos y consume pocos recursos, porque no
  incluye un sistema operativo completo.
- **Efímero por diseño**: se crea, se ejecuta y se descarta con facilidad, lo
  que favorece entornos siempre idénticos.

---

# El problema clásico

## _"It works on my machine"_

La frase resume el problema: el código es el mismo, pero el **entorno** no. Esa
diferencia hace que un bug aparezca en un lugar y no en otro, y que sea difícil
de reproducir.

**Ejemplo típico**

- Tú desarrollas en Windows; el servidor corre Linux.
- Tu compañero tiene una versión distinta de Node.
- Falta una variable de entorno que en tu máquina sí estaba definida.

Resultado: horas de soporte para algo que "en mi máquina funciona".

---

# Dónde brillan los contenedores

Empaquetar la app y su entorno en una unidad portable habilita casos de uso hoy
fundamentales en la industria:

- **Nube y escalabilidad**: se despliegan igual en cualquier proveedor (AWS,
  Azure, GCP) y se replican fácilmente para atender más carga.
- **CI/CD**: cada etapa —construir, probar, desplegar— corre en un entorno
  idéntico y reproducible, eliminando el "pasó en pruebas, falla en producción".
- **Microservicios**: cada servicio se empaqueta y despliega de forma
  independiente.
- **Orquestación**: herramientas como **Kubernetes** gestionan miles de
  contenedores automáticamente.
- **Desarrollo local**: levantar bases de datos o servicios completos sin
  instalarlos directamente en tu máquina.

**Ejemplo**

Un pipeline de CI construye una imagen, ejecuta las pruebas **dentro de un
contenedor** y, si pasan, despliega esa **misma** imagen a la nube — todo en el
mismo entorno, sin sorpresas entre etapas.

---

# Docker

Docker es la herramienta **más popular** para trabajar con contenedores: permite
**empaquetar, distribuir y ejecutar** aplicaciones de forma estándar.

- **Empaquetar**: la app y sus dependencias en una *imagen*.
- **Distribuir**: compartir esa imagen a través de un *registry*.
- **Ejecutar**: crear *contenedores* a partir de la imagen.

> **Docker no es la única opción.** Los contenedores son una tecnología general
> con un estándar abierto (**OCI**). Existen alternativas como **Podman**,
> **containerd** o **LXC**, y soluciones nativas de cada sistema operativo, como
> **Windows Containers** (Microsoft) y el framework de **contenedores de Apple**
> en macOS. En este curso usamos Docker por ser el más extendido.

---
layout: two-cols
layoutClass: gap-8
---

# No es un sistema operativo completo

Es común confundir un contenedor con una máquina virtual. La diferencia clave
está en el **kernel**.

- Una **VM** incluye un sistema operativo completo, con su propio kernel.
- Un **contenedor** comparte el kernel del host y solo aísla el proceso.

Por eso un contenedor arranca en segundos y pesa mucho menos que una VM.

**Ejemplo**

Una VM de Ubuntu puede ocupar varios GB. Un contenedor `debian:12` base ronda
los ~120 MB, porque reutiliza el kernel del host.

::right::

<div class="cmp">
  <div class="stack">
    <div class="stack-title">Máquina virtual</div>
    <div class="layer app">App</div>
    <div class="layer">Bins / Libs</div>
    <div class="layer os">Guest OS + kernel</div>
    <div class="layer hyp">Hypervisor</div>
    <div class="layer host">Kernel del host</div>
    <div class="layer hw">Hardware</div>
  </div>
  <div class="stack">
    <div class="stack-title">Contenedor</div>
    <div class="layer app">App</div>
    <div class="layer">Bins / Libs</div>
    <div class="layer proc">Proceso aislado</div>
    <div class="layer host shared">Kernel del host</div>
    <div class="layer hw">Hardware</div>
  </div>
</div>

---

# ¿Cómo se logra el aislamiento?

Compartir el kernel no basta. El kernel de Linux aporta tres mecanismos que
hacen que un proceso se comporte como si estuviera en "una máquina aparte", sin
serlo.

<div class="flow">
  <div class="node solid">Namespaces</div>
  <div class="node solid">cgroups</div>
  <div class="node solid">Overlay FS</div>
</div>

- **Namespaces** — aíslan *lo que el contenedor ve*: su propio conjunto de
  procesos (PID), red, sistema de archivos, usuarios y hostname. Dentro, parece
  el único proceso del sistema.
- **cgroups** (*control groups*) — *limitan y controlan lo que consume*: cuánta
  CPU, memoria o E/S puede usar, evitando que un contenedor acapare el host.
- **Union / overlay filesystem** — arma el sistema de archivos por **capas** de
  solo lectura (la imagen) más una capa escribible propia de cada contenedor.

> **Docker orquesta estas capacidades del kernel; no las reinventa.** En Windows
> y macOS ejecuta un kernel Linux ligero dentro de una VM para ofrecerlas.

---

# Conceptos clave

El vocabulario mínimo que usaremos durante toda la unidad:

| Concepto      | Qué es                                              | Ejemplo               |
|---------------|-----------------------------------------------------|-----------------------|
| **Image**     | Plantilla de solo lectura con la app y dependencias | `nginx`, `node:18`    |
| **Container** | Instancia en ejecución de una imagen                | `webserver` corriendo |
| **Host**      | Máquina donde corre Docker                          | tu laptop             |
| **Engine**    | Runtime que construye y ejecuta contenedores        | Docker Engine         |
| **Registry**  | Repositorio de imágenes                             | Docker Hub            |

La relación básica: un **registry** guarda **imágenes**; de una imagen se crean
**contenedores** que ejecuta el **engine** sobre el **host**.

---

# Imagen

Una imagen es una **plantilla de solo lectura**: un sistema de archivos ya
preparado (aplicación + librerías + configuración) más metadatos como qué
comando ejecutar. Se construye en **capas** y se identifica con un *tag* de
versión.

De una misma imagen puedes crear muchos contenedores idénticos.

**Ejemplo**

```bash
docker images
```

<pre class="term">REPOSITORY   TAG   IMAGE ID       SIZE
debian       12    a1b2c3d4e5f6   117MB
node         18    9f8e7d6c5b4a   1.1GB</pre>

`debian:12` trae un Debian mínimo; `node:18` es ese mismo tipo de base **más**
Node.js instalado encima.

---

# Errores comunes: imágenes

**Confundir imagen con contenedor.** La imagen es la plantilla estática; el
contenedor es la ejecución. Borrar un contenedor no borra la imagen.

**Usar `latest` sin control.** `latest` no significa "estable": es solo el tag
por defecto y puede cambiar sin aviso, rompiendo la reproducibilidad.

```bash
docker pull node
docker pull node:18.19
```

El primero trae implícitamente `node:latest` (puede cambiar mañana); el segundo
**fija la versión** y da un build reproducible.

**Asumir que toda imagen trae las mismas herramientas.** Una imagen mínima
puede no incluir `curl`, `ping` o incluso `bash`.

---

# Contenedor

Un contenedor es una **instancia en ejecución** de una imagen: un proceso
aislado del resto del sistema, con su propio sistema de archivos derivado de la
imagen y una **capa escribible** propia mientras existe.

La imagen no cambia; los cambios que hace el contenedor viven en esa capa
escribible y se pierden al eliminarlo.

**Ejemplo**

```bash
docker run -it --name mydebian debian:12 /bin/bash
```

<pre class="term"># ya dentro del contenedor (proceso aislado)
root@3f2a:/# echo "hola" > /tmp/nota.txt   # vive solo en este contenedor</pre>

Si eliminas `mydebian`, `nota.txt` desaparece con él.

---

# Ciclo de vida de un contenedor

Un contenedor pasa por varios estados. Entenderlos evita la mayoría de las
confusiones iniciales.

<div class="flow">
  <div class="node solid">Crear</div>
  <div class="arr">→</div>
  <div class="node">Iniciar</div>
  <div class="arr">→</div>
  <div class="node ghost">Detener</div>
  <div class="arr">⇄</div>
  <div class="node">Reiniciar</div>
  <div class="arr">→</div>
  <div class="node danger">Eliminar</div>
</div>

- **Crear / iniciar**: `run` lo crea y arranca de una vez.
- **Detener**: el contenedor para, pero **sigue existiendo** con su capa escribible.
- **Reiniciar**: `start` reutiliza el contenedor detenido.
- **Eliminar**: `rm` lo borra definitivamente.

> Idea clave: **detener no es eliminar.** Un contenedor detenido se puede volver
> a arrancar; uno eliminado, no.

---

# Errores comunes: contenedores

**Tratarlos como servidores completos.** Un contenedor está pensado para
ejecutar **un proceso principal**, no un sistema entero con varios servicios.

**Esperar persistencia automática.** Lo que escribes dentro se pierde al
eliminar el contenedor (lo resolveremos con *volúmenes*).

**No nombrarlos.** Sin `--name`, Docker asigna nombres aleatorios como
`nostalgic_bohr`, difíciles de rastrear.

```bash
docker run debian:12                 # nombre aleatorio, difícil de referenciar
docker run --name prueba debian:12   # nombre claro
```

---

# Arquitectura de Docker

Tú no hablas directamente con los contenedores: usas la **CLI**, que envía
órdenes al **Docker Engine**, y este construye o ejecuta imágenes y
contenedores. Las imágenes que no tienes localmente se descargan de un registry.

<div class="flow">
  <div class="node">Usuario</div>
  <div class="arr">→</div>
  <div class="node">Docker CLI</div>
  <div class="arr">→</div>
  <div class="node solid">Docker Engine</div>
  <div class="arr">→</div>
  <div class="node-col">
    <div class="node ghost">Images</div>
    <div class="node ghost">Containers</div>
  </div>
</div>

<div class="flow">
  <div class="node navy">Docker Hub</div>
  <div class="arr">→</div>
  <div class="flow-note">pull de imágenes que no están en el host</div>
</div>

**Ejemplo**: `docker run nginx` → la CLI pide a Engine ejecutar `nginx`; si la
imagen no está local, Engine la baja de Docker Hub y luego crea el contenedor.

---

# Docker Hub

Docker Hub es un **registry público**: un repositorio en línea de imágenes.
Desde ahí descargas imágenes base oficiales y, si quieres, publicas las tuyas.

Antes de usar una imagen conviene revisar su **fuente** (¿es oficial?) y su
**versión** (¿qué tag estás trayendo?).

**Ejemplo**

```bash
docker pull nginx:1.27        # imagen oficial de nginx, versión fija
```

En hub.docker.com verías que `nginx` es una imagen *oficial*, con sus tags
disponibles (`1.27`, `1.26`, `alpine`, …).

---

# Nuestro entorno de trabajo

El resto de la sesión es práctico y ocurre en la **terminal**. Puedes trabajar
en tu máquina local (con Docker instalado) o en un sandbox/lab.

Un hábito importante: **leer la salida de cada comando**. Docker te dice qué
imagen bajó, qué contenedor creó y qué ID le asignó; esa información es parte
del aprendizaje.

**Ejemplo de salida a observar**

```bash
docker run -d --name web nginx
```

<pre class="term">Unable to find image 'nginx:latest' locally   ← la está descargando
latest: Pulling from library/nginx
9c1b6dd6c1e6   ← ID corto del contenedor creado</pre>

---

# Docker desde la línea de comandos

Casi todo en Docker sigue la forma `docker <acción> [opciones] <imagen>
[comando]`. Leer un comando por partes lo hace predecible.

```bash
docker run -it --name mydebian debian:12 /bin/bash
```

| Parte        | Significado                 |
|--------------|-----------------------------|
| `docker`     | la herramienta              |
| `run`        | la acción (crear + iniciar) |
| `-it`        | `-i` interactivo + `-t` pseudo-terminal |
| `--name`     | nombre del contenedor       |
| `debian:12`  | la imagen                   |
| `/bin/bash`  | comando a ejecutar dentro   |

Leído completo: "crea un contenedor llamado `mydebian` desde `debian:12` y ábreme
una terminal `bash` interactiva".

---

# `docker pull` · descargar una imagen

Descarga una imagen al host desde un *registry*, pero **no** crea ningún
contenedor. Útil para tener la imagen lista y **fijar la versión** exacta.

**Estructura**

```bash
docker pull <imagen>[:<tag>]
```

**Ejemplo mínimo**

```bash
docker pull debian:12
```

<pre class="term">12: Pulling from library/debian
Status: Downloaded newer image for debian:12</pre>

La imagen queda local (la ves con `docker images`); todavía no se ejecuta nada.

---

# `docker pull` · opciones y formas

| Forma / opción | Qué hace |
|----------------|----------|
| `<imagen>:<tag>` | fija una versión concreta (`debian:12`) |
| `<imagen>` | sin tag, usa `:latest` (puede cambiar con el tiempo) |
| `-a`, `--all-tags` | descarga **todas** las etiquetas del repositorio |
| `--platform <os/arch>` | fuerza una arquitectura (p. ej. `linux/arm64`) |
| `-q`, `--quiet` | descarga sin mostrar el progreso |

---

# `docker pull` · ejemplos

**Fijar una versión oficial** — reproducible, no cambia sola:

```bash
docker pull nginx:1.27
```

**Traer la última** — sin tag, Docker asume `:latest`:

```bash
docker pull redis
```

**Forzar arquitectura** — útil en Mac o servidores ARM:

```bash
docker pull --platform linux/arm64 debian:12
```

---

# `docker images` · listar imágenes locales

Muestra las imágenes ya descargadas en el host (equivale a `docker image ls`).

**Estructura**

```bash
docker images [opciones]
```

**Ejemplo**

```bash
docker images
```

<pre class="term">REPOSITORY   TAG        IMAGE ID       SIZE
python       3.12       a1b2c3d4e5f6   1.02GB
nginx        1.27       0a1b2c3d4e5f   192MB
debian       12         9f8e7d6c5b4a   117MB</pre>

La columna **SIZE** indica cuánto ocupa cada imagen: conviene vigilarla.

---

# Tamaño de imagen · el ejemplo de Python

Un mismo lenguaje puede empaquetarse sobre **bases distintas**. Tres variantes
oficiales de Python:

```bash
docker pull python:3.12
docker pull python:3.12-slim
docker pull python:3.12-alpine
```

- **`3.12`** · ~1.0 GB — Debian completo + herramientas de compilación. Cómoda, pero pesada.
- **`3.12-slim`** · ~130 MB — Debian recortado, sin extras. Buen equilibrio para producción.
- **`3.12-alpine`** · ~55 MB — base Alpine (*musl* en vez de *glibc*). Mínima, pero a veces hay que compilar librerías (*wheels* precompiladas no siempre sirven).

Misma versión de Python, **~18× de diferencia** en tamaño según la base.

---

# `docker run` · ejecutar un contenedor

Crea un contenedor **nuevo** a partir de una imagen y lo **inicia**. Si la imagen
no está local, la descarga primero. Es el comando que más usarás.

**Estructura**

```bash
docker run [opciones] <imagen> [comando]
```

**Ejemplo mínimo**

```bash
docker run hello-world
```

Descarga `hello-world` si falta, crea el contenedor y ejecuta su programa, que
imprime un mensaje de bienvenida y termina.

---

# `docker run` · opciones frecuentes

| Opción | Qué hace |
|--------|----------|
| `--name <n>` | nombra el contenedor (si no, Docker asigna uno aleatorio) |
| `-d` | *detached*: lo ejecuta en segundo plano y te devuelve la terminal |
| `-it` | `-i` mantiene STDIN abierto y `-t` asigna una pseudo-terminal → **shell interactivo** dentro del contenedor |
| `-p <host>:<cont>` | publica un puerto del contenedor en el host |
| `-v <vol>:<ruta>` | monta un volumen para **persistir** datos |
| `--rm` | elimina el contenedor automáticamente al detenerse |

---

# `docker run` · ejemplos

**Shell interactivo en Debian**

```bash
docker run -it --name mydebian debian:12 /bin/bash
```

<pre class="term">root@3f2a1b:/#   ← ya estás dentro; escribe exit para salir</pre>

**Servidor web en segundo plano**

```bash
docker run -d --name web -p 8080:80 nginx
```

Corre *detached* y publica el puerto: abre `http://localhost:8080` en el host y
verás la página de nginx.

---

# Imagen vs. contenedor

Una imagen es la plantilla; cada `run` produce un contenedor **independiente**.
La misma imagen puede generar muchos contenedores que conviven a la vez.

```bash
docker run -it --name deb1 debian:12 /bin/bash
docker run -it --name deb2 debian:12 /bin/bash
```

`deb1` y `deb2` parten de la **misma** imagen `debian:12`, pero son procesos
distintos con su propia capa escribible: un archivo creado en `deb1` no existe
en `deb2`.

---

# Listar contenedores: `ps`

`docker ps` muestra los contenedores. Por defecto solo los que están
**corriendo**; con `-a` incluye también los detenidos.

```bash
docker ps
docker ps -a
```

<pre class="term">CONTAINER ID   IMAGE       STATUS         NAMES
3f2a1b6dd6c1   nginx       Up 2 minutes   web          ← aparece con docker ps
9c1b6dd6c1e6   debian:12   Exited (0)     mydebian     ← detenido, solo con -a</pre>

`ps` es tu principal herramienta para ver el **estado** de cada contenedor.

---

# Iniciar, detener y eliminar

Tres operaciones básicas del ciclo de vida, fáciles de confundir:

```bash
docker stop mydebian
docker start mydebian
docker rm mydebian
```

- `stop` → el contenedor deja de correr, pero `docker ps -a` lo sigue mostrando.
- `start` → reutiliza ese mismo contenedor (con su capa escribible intacta).
- `rm` → lo borra; para eliminarlo, primero debe estar detenido (o usar `rm -f`).

---

# Errores comunes del ciclo de vida

**Reusar un nombre existente.** No puedes crear dos contenedores con el mismo
`--name`:

```bash
docker run --name mydebian debian:12
```

<pre class="term">Error: Conflict. The container name "/mydebian" is already in use</pre>

**Usar `run` cuando querías `start`.** `run` crea uno **nuevo**; para volver a
tu contenedor anterior usa `start`.

**Salir del proceso principal.** Si haces `exit` en el `bash` interactivo, el
proceso principal termina y el contenedor se detiene.

**Eliminar algo que aún necesitas.** `rm` no tiene deshacer.

---

# `docker exec` · ejecutar en un contenedor en marcha

Ejecuta un comando **dentro de un contenedor que ya está corriendo**; no crea uno
nuevo. Es la diferencia clave con `run`:

- `run` → arranca un contenedor **nuevo**.
- `exec` → entra en uno **que ya corre**.

**Estructura**

```bash
docker exec [opciones] <contenedor> <comando>
```

**Ejemplo mínimo**

```bash
docker exec web ls /usr/share/nginx/html
```

Ejecuta `ls` dentro del contenedor `web` (que debe estar en marcha) y muestra el
resultado.

---

# `docker exec` · ejemplos

**Abrir un shell interactivo** en un contenedor que ya corre:

```bash
docker exec -it web bash
```

<pre class="term">root@web:/#   ← estás dentro del contenedor "web" en ejecución</pre>

**Ejecutar un comando puntual** (sin abrir un shell):

```bash
docker exec web cat /etc/hostname
```

`-it` funciona igual que en `run`: `-i` mantiene la entrada abierta y `-t` asigna
una pseudo-terminal.

---
layout: center
class: section-slide
---

# Actividad 1 — Ciclo de vida de un contenedor

<div class="repo-cta">
  <a class="repo-btn" href="https://github.com/openlabun/docker/tree/master/basicActivity" target="_blank" rel="noopener">📦 Abrir repositorio de la actividad →</a>
  <div class="repo-hint">El repositorio incluye las instrucciones y el código de la práctica.</div>
</div>

<div class="abs-br m-6 opacity-80">⏱ ~15 min</div>

---

# ¿Qué deberías observar?

La actividad no es solo teclear comandos, sino **observar cómo cambia el
estado**:

- `docker ps` muestra el contenedor cuando corre y lo oculta cuando lo detienes;
  con `-a` reaparece como *Exited*.
- `stop` **no** elimina: el contenedor sigue en la lista.
- `start` reutiliza el mismo contenedor, no crea uno nuevo.
- `rm` sí lo borra: después de eliminarlo, ni siquiera `docker ps -a` lo muestra.

Si algo no coincide con esto, vuelve a mirar la salida de los comandos.

---

# Exponer servicios

Muchos contenedores ejecutan un **servicio** (un servidor web, una base de
datos). Que el servicio escuche **dentro** del contenedor no significa que sea
accesible desde tu host: la red del contenedor está aislada.

Para llegar a él, hay que **publicar el puerto**.

**Ejemplo del problema**

```bash
docker run -d --name web nginx
```

nginx escucha en el puerto 80 **dentro** del contenedor, pero abrir
`http://localhost:80` en el host **no responde**: el puerto no está publicado.

---

# Publicar puertos: `-p`

El flag `-p` conecta un puerto del **host** con un puerto del **contenedor**. El
orden es `host:contenedor`.

```bash
docker run -p <host_port>:<container_port> <image>
```

<div class="flow">
  <div class="node solid">host&nbsp;: 8080</div>
  <div class="arr">→</div>
  <div class="node">contenedor&nbsp;: 80</div>
</div>

- **Izquierda** = puerto del host (el que abres en tu máquina).
- **Derecha** = puerto donde el servicio escucha dentro del contenedor.

```bash
docker run -p 8080:80 nginx
```

Con eso, abrir `http://localhost:8080` en el host llega al nginx del contenedor.

---

# Ejemplo: nginx en el puerto 8080

Un caso completo, de principio a fin:

```bash
docker run -d --name webserver -p 8080:80 nginx
```

- `-d` → *detached*: corre en segundo plano y te devuelve la terminal.
- `--name webserver` → nombre claro para referenciarlo.
- `-p 8080:80` → publica el puerto 80 del contenedor en el 8080 del host.

Luego, en el navegador:

<pre class="term">http://localhost:8080   →   página de bienvenida de nginx</pre>

Para verlo funcionando: `docker ps` debe mostrarlo como *Up*.

---

# Errores comunes: puertos

**Invertir el orden.** `-p 80:8080` no es lo mismo que `-p 8080:80`; recuerda
`host:contenedor`.

**Elegir mal el puerto interno.** El puerto de la derecha debe ser donde el
servicio realmente escucha (nginx → 80, no 8080).

**Puerto del host ocupado.** Si el 8080 ya está en uso, el `run` falla:

```bash
docker run -p 8080:80 nginx
```

<pre class="term">Error: port is already allocated   ← usa otro puerto de host, p. ej. 8081</pre>

**Olvidar `-p`.** Sin publicar, el servicio corre pero es inaccesible desde el host.

---

# Almacenamiento por defecto

Por defecto, lo que un contenedor escribe va a su **capa escribible**, que existe
solo mientras el contenedor existe. Esa capa está pensada para datos temporales,
**no** para persistencia duradera.

**Ejemplo**

```bash
docker run -it --name tmp debian:12 /bin/bash
```

<pre class="term">root@..:/# echo "datos" > /root/importante.txt
root@..:/# exit</pre>

```bash
docker rm tmp
```

Al eliminar el contenedor, su capa escribible se va con él: `importante.txt` ya
no existe en ningún lado. Si esos datos importaban, se perdieron. La siguiente
sección resuelve esto.

---

# El problema de la persistencia

Muchos datos **deben sobrevivir** a la recreación de un contenedor. Es normal
recrear contenedores (para actualizar la imagen, cambiar configuración, etc.),
y no queremos perder la información cada vez.

Casos típicos que necesitan persistir:

- Bases de datos (el contenido de una tabla).
- Archivos subidos por usuarios.
- Logs que queremos conservar.
- Estado general de la aplicación.

La solución de Docker para esto son los **volúmenes**.

---

# `docker volume` · almacenamiento persistente

Un **volumen** es almacenamiento administrado por Docker, **independiente del
ciclo de vida** del contenedor: los datos sobreviven aunque el contenedor se
elimine.

**Estructura**

```bash
docker volume <subcomando>                # gestionar volúmenes
docker run -v <volumen>:<ruta> <imagen>   # usarlo en un contenedor
```

**Ejemplo mínimo**

```bash
docker volume create datos
docker run -v datos:/app ubuntu
```

Todo lo que se escriba en `/app` vive en el volumen `datos`, no en la capa
escribible del contenedor.

---

# `docker volume` · subcomandos

| Subcomando | Qué hace |
|------------|----------|
| `create <nombre>` | crea un volumen |
| `ls` | lista los volúmenes existentes |
| `inspect <nombre>` | muestra sus metadatos (dónde vive, driver) |
| `rm <nombre>` | elimina un volumen |
| `prune` | elimina los volúmenes que no usa ningún contenedor |

<pre class="term">$ docker volume ls
DRIVER    VOLUME NAME
local     datos</pre>

---

# `docker volume` · ejemplo: persistencia

Demostremos que los datos sobreviven a la eliminación del contenedor:

**1) Contenedor con un volumen montado en `/data`**

```bash
docker run -it --name testvol -v myvolume:/data ubuntu /bin/bash
```

<pre class="term">root@..:/# echo "persisto" > /data/nota.txt
root@..:/# exit</pre>

**2) Eliminamos el contenedor · 3) creamos otro con el MISMO volumen**

```bash
docker rm testvol
docker run -it --name testvol2 -v myvolume:/data ubuntu /bin/bash
```

<pre class="term">root@..:/# cat /data/nota.txt
persisto            ← el archivo sigue ahí</pre>

---
layout: center
class: section-slide
---

# Actividad 2 — Persistencia con volúmenes

<div class="repo-cta">
  <a class="repo-btn" href="https://github.com/openlabun/docker/tree/master/volumeActivity" target="_blank" rel="noopener">📦 Abrir repositorio de la actividad →</a>
  <div class="repo-hint">El repositorio incluye las instrucciones y el código de la práctica.</div>
</div>

<div class="abs-br m-6 opacity-80">⏱ ~15 min</div>

---

# Bind mounts · montar una carpeta del host

Un **bind mount** enlaza una **carpeta real del host** con una ruta dentro del
contenedor. La diferencia con un volumen: aquí **tú** eliges la ruta del host
(Docker no la administra).

**Estructura**

```bash
docker run -v <ruta_host>:<ruta_contenedor> <imagen>
```

**Ejemplo** — montar el proyecto actual dentro del contenedor:

```bash
docker run -it -v $(pwd):/app node:18 bash
```

Lo que edites en el host aparece **al instante** en `/app`, y al revés. Ideal
para **desarrollar**: cambias el código en tu máquina y el contenedor lo ejecuta
sin reconstruir la imagen.

---

# Bind mounts · según tu sistema

Montar la **carpeta actual** en `/app` solo cambia en cómo cada shell nombra el
directorio actual:

**Linux / macOS** — bash, zsh

```bash
docker run -it -v $(pwd):/app node:18 bash
```

**Windows · CMD**

```bash
docker run -it -v %cd%:/app node:18 bash
```

**Windows · PowerShell**

```bash
docker run -it -v ${PWD}:/app node:18 bash
```

Con ruta absoluta también sirve: `/home/ana/proyecto` (Linux/Mac) o
`C:\Users\ana\proyecto` (Windows).

---

# Volumen vs. bind mount

|  | Volumen | Bind mount |
|--|---------|------------|
| **Ruta del host** | la administra Docker | la eliges tú |
| **Portabilidad** | alta | baja (depende del host) |
| **Uso típico** | datos persistentes (BD, uploads) | desarrollo (código en vivo) |
| **Sintaxis con `-v`** | `nombre:/ruta` | `/ruta/host:/ruta` |

Regla práctica: **volumen** para los datos que la app produce; **bind mount**
para el código y archivos que tú editas.

---

# Errores comunes: volúmenes

**Escribir fuera de la ruta montada.** Solo persiste lo que está bajo el punto
de montaje. Un archivo en `/root` no se guarda si el volumen está en `/data`.

**Confundir volumen con la capa del contenedor.** Son cosas distintas: la capa
muere con el contenedor; el volumen no.

**Creer que `rm` del contenedor borra el volumen.** No lo borra: el volumen
queda (y hay que limpiarlo aparte con `docker volume rm`).

**Montar en la ruta equivocada.** Si la app guarda en `/var/lib/mysql` pero
montas en `/data`, no estás persistiendo lo que crees.

---
layout: center
class: section-slide
---

# Actividad 3 — Bind mounts

<div class="repo-cta">
  <a class="repo-btn" href="https://github.com/openlabun/docker/tree/master/bindVolumeActivity" target="_blank" rel="noopener">📦 Abrir repositorio de la actividad →</a>
  <div class="repo-hint">El repositorio incluye las instrucciones y el código de la práctica.</div>
</div>

<div class="abs-br m-6 opacity-80">⏱ ~15 min</div>

---
layout: center
class: section-slide
---

# Cierre de la Sesión 1

<div class="text-left inline-block mt-2">

- Docker mejora la **consistencia** entre ambientes: empaqueta app + entorno.
- **Image ≠ Container**: la imagen es la plantilla; el contenedor, la ejecución.
- Los contenedores tienen un **ciclo de vida** — detener no es eliminar.
- `-p host:contenedor` **publica** servicios para que el host los alcance.
- Los **volúmenes** resuelven la persistencia, sobreviviendo al contenedor.
- Los **bind mounts** conectan una carpeta del host: ideales para desarrollar.

</div>

<div class="mt-6 opacity-80">
Sesión 2: <code>Dockerfile</code> y Docker Compose.
</div>
