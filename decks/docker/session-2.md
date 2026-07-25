---
theme: default
title: Contenedores — Sesión 2
info: |
  Docker / Contenedores — Sesión 2
  Bind mounts, Dockerfile y Docker Compose
class: cover-slide text-center
transition: slide-left
mdc: true
# Hash routing so deep links / refresh work on GitHub Pages (no URL rewrites).
routerMode: hash
---

<div class="cover-kicker">Universidad del Norte · Estructura del Computador II</div>

# Contenedores

Construir tus propias imágenes y orquestar varios servicios

<div class="subtitle">Dockerfile · Imágenes propias · Docker Compose</div>

<div class="cover-meta">
  <div class="cover-prof">Augusto Salazar</div>
  <div class="cover-mail">augustosalazar@uninorte.edu.co</div>
</div>

<div class="abs-br m-6 text-sm opacity-80">Sesión 2 de 2</div>

---

# La ruta de hoy

En la Sesión 1 **usamos** imágenes que ya existían. Hoy damos el paso a
**construir las nuestras** y a **orquestar** aplicaciones con varios servicios.

<div class="flow">
  <div class="node ghost">Repaso</div>
  <div class="arr">→</div>
  <div class="node solid">Dockerfile</div>
  <div class="arr">→</div>
  <div class="node">docker build</div>
  <div class="arr">→</div>
  <div class="node">imagen propia</div>
  <div class="arr">→</div>
  <div class="node navy">Docker Compose</div>
</div>

- **Dockerfile** — la receta que describe cómo empaquetar tu aplicación.
- **build → run** — de la receta a una imagen, y de la imagen a un contenedor.
- **Docker Compose** — definir y levantar varios servicios de forma declarativa.

Meta de la sesión: pasar de *"ejecuto imágenes de otros"* a *"empaqueto y
ejecuto la mía, con toda su configuración en archivos versionables"*.

---

# Repaso rápido de la Sesión 1

Antes de construir imágenes, reactivemos lo esencial:

- **¿Qué es una imagen?** Una plantilla de solo lectura con la app y sus
  dependencias. **¿Un contenedor?** Una instancia en ejecución de esa imagen.
- **¿Por qué persisten los volúmenes?** Porque los administra Docker,
  **independientes del ciclo de vida** del contenedor: sobreviven a su borrado.
- **¿Qué hace `-p`?** Publica un puerto: conecta `host:contenedor` para que el
  servicio sea accesible desde tu máquina.

```bash
docker run -d --name web -p 8080:80 nginx
docker ps
```

<pre class="term">CONTAINER ID   IMAGE   STATUS         PORTS                  NAMES
3f2a1b6dd6c1   nginx   Up 3 seconds   0.0.0.0:8080->80/tcp   web</pre>

Con esto en mente, damos el salto: **construir la imagen en lugar de descargarla**.

---

# De usar imágenes a construir las tuyas

Hasta ahora todas las imágenes venían de Docker Hub (`nginx`, `debian`,
`node`). Sirven de **base**, pero no contienen *tu* aplicación.

En un proyecto real necesitas empaquetar **tu** código junto con su entorno, de
modo que corra igual en cualquier máquina. Para eso se **construye una imagen
propia** a partir de una receta: el **Dockerfile**.

<div class="flow">
  <div class="node ghost">Imagen base</div>
  <div class="arr">+</div>
  <div class="node ghost">Tu código</div>
  <div class="arr">+</div>
  <div class="node ghost">Dependencias</div>
  <div class="arr">→</div>
  <div class="node solid">Tu imagen</div>
</div>

La idea es sencilla: tomas una base (por ejemplo `node:18`), le añades tu
aplicación y sus dependencias, y obtienes una imagen que **cualquiera** puede
ejecutar con un solo `docker run`.

---

# Dockerfile

Un **Dockerfile** es un archivo de texto con una lista de **instrucciones** que
describen, paso a paso, cómo construir una imagen. Docker las ejecuta en orden y
produce una imagen reproducible.

- Cada instrucción parte de una base y añade algo encima.
- **El orden importa**: influye en el resultado y en el aprovechamiento de la
  caché (lo veremos en `docker build`).
- Se guarda en la raíz del proyecto, normalmente con el nombre `Dockerfile`
  (sin extensión).

> **La receta, no el plato.** El Dockerfile *describe* cómo construir la imagen;
> no es la imagen en sí. La imagen se obtiene al ejecutar `docker build` sobre él.

---

# Anatomía de un Dockerfile

Un Dockerfile típico para una aplicación Node:

```dockerfile {3-4}
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

Leído como receta: *parte de `node:18`, sitúate en `/app`, copia primero las
dependencias e instálalas, luego copia el resto del código, documenta el puerto
3000 y, al arrancar, ejecuta `npm start`.*

El detalle de copiar `package*.json` **antes** que el resto del código es
intencional: permite reutilizar la caché de `npm install` cuando solo cambia el
código de la app, no las dependencias.

---

# Instrucciones clave

Las instrucciones que aparecen en casi todo Dockerfile:

| Instrucción | Qué hace |
|-------------|----------|
| `FROM`    | imagen **base** de la que se parte |
| `WORKDIR` | carpeta de trabajo dentro de la imagen (se crea si no existe) |
| `COPY`    | copia archivos del **contexto** (tu proyecto) a la imagen |
| `RUN`     | ejecuta un comando **durante la construcción** (p. ej. instalar) |
| `EXPOSE`  | **documenta** el puerto que la app usará (no lo publica) |
| `CMD`     | comando por defecto **al iniciar** el contenedor |

Dos matices útiles: `EXPOSE` es informativo (para publicar de verdad sigues
usando `-p` en `docker run`), y `CMD` puede sobreescribirse pasando otro comando
al final del `docker run`.

---
layout: two-cols
layoutClass: gap-8
---

# `RUN` vs `CMD`

Se confunden porque ambos ejecutan comandos, pero ocurren en **momentos
distintos** del ciclo.

- **`RUN`** sucede **al construir la imagen**. Su resultado queda *horneado* en
  una capa: instalar dependencias, compilar, crear carpetas.
- **`CMD`** sucede **al arrancar el contenedor**. Define el proceso principal
  que se ejecuta con cada `docker run`.

Regla mental: `RUN` prepara la imagen **una vez**; `CMD` se ejecuta **cada vez**
que corres un contenedor.

::right::

<div class="flow" style="flex-direction: column; align-items: stretch;">
  <div class="node ghost">docker build</div>
  <div class="node solid">RUN npm install</div>
  <div class="arr">↓</div>
  <div class="node navy">Imagen</div>
  <div class="arr">↓</div>
  <div class="node ghost">docker run</div>
  <div class="node solid">CMD npm start</div>
  <div class="arr">↓</div>
  <div class="node">Contenedor en marcha</div>
</div>

---

# `docker build` · construir la imagen

Toma un Dockerfile y un **contexto** (los archivos disponibles para copiar) y
produce una imagen local.

**Estructura**

```bash
docker build -t <nombre>:<tag> <contexto>
```

**Ejemplo mínimo** — construir desde el Dockerfile de la carpeta actual:

```bash
docker build -t miapp-node .
```

<pre class="term">[+] Building 12.3s (10/10) FINISHED
 => [2/5] WORKDIR /app
 => [4/5] RUN npm install
 => [5/5] COPY . .
 => => naming to docker.io/library/miapp-node:latest</pre>

- `-t miapp-node` → **nombra** (tag) la imagen para poder referenciarla luego.
- `.` → el **contexto de construcción**: la carpeta actual, de donde salen los
  archivos que `COPY` puede usar.

---

# `docker build` · contexto y caché

**El contexto es lo que envías al motor.** Ese `.` no es "el Dockerfile", sino
**toda la carpeta**. Docker la empaqueta y la manda al engine; por eso conviene
excluir lo pesado o innecesario con un archivo **`.dockerignore`**:

```bash
node_modules
.git
*.log
```

**La caché acelera reconstrucciones.** Docker cachea cada instrucción; si nada
cambió por encima, reutiliza la capa en lugar de rehacerla.

<pre class="term"> => CACHED [3/5] COPY package*.json ./
 => CACHED [4/5] RUN npm install        ← no reinstala: nada cambió antes
 => [5/5] COPY . .                      ← solo esto se rehace al tocar el código</pre>

Por eso `COPY package*.json` va **antes** que `COPY . .`: cambiar tu código no
invalida la costosa capa de `npm install`.

---

# `docker build` · opciones frecuentes

| Opción | Qué hace |
|--------|----------|
| `-t <nombre>:<tag>` | **nombra** (tag) la imagen; se puede repetir para varios tags |
| `-f <ruta>` | usa un Dockerfile con **otro nombre o ubicación** (por defecto `./Dockerfile`) |
| `--build-arg <clave>=<valor>` | pasa un valor a un `ARG` declarado en el Dockerfile |
| `--no-cache` | **ignora la caché** y reconstruye todas las capas desde cero |
| `--platform <os/arch>` | construye para otra arquitectura (p. ej. `linux/arm64`) |

**Ejemplos** — un Dockerfile alterno, un argumento de build y un build limpio:

```bash
docker build -f docker/Dockerfile.prod -t miapp-node:prod .
docker build --build-arg NODE_ENV=production -t miapp-node .
docker build --no-cache -t miapp-node .
```

---

# `docker image ls` · verificar la imagen

Tras construir, confirma que la imagen existe localmente (equivale a
`docker images`):

```bash
docker image ls
```

<pre class="term">REPOSITORY    TAG      IMAGE ID       SIZE
miapp-node    latest   7c3e9a1b2d4f   1.1GB
node          18       9f8e7d6c5b4a   1.02GB</pre>

Ahí aparece tu imagen `miapp-node` junto a la base `node:18` de la que partió.
Revisa **nombre**, **tag** y **tamaño**: si `miapp-node` no aparece, el build no
terminó bien.

---

# Ejecutar tu propia imagen

La imagen recién construida se ejecuta **igual** que cualquier otra: cierra el
ciclo `build → run`.

```bash
docker run -d --name miapp -p 3000:3000 miapp-node
```

<div class="flow">
  <div class="node ghost">Dockerfile</div>
  <div class="arr">→</div>
  <div class="node solid">docker build</div>
  <div class="arr">→</div>
  <div class="node navy">Imagen (miapp-node)</div>
  <div class="arr">→</div>
  <div class="node solid">docker run</div>
  <div class="arr">→</div>
  <div class="node">Contenedor</div>
</div>

- `-d` → en segundo plano; `-p 3000:3000` → publica el puerto de la app.
- Abre `http://localhost:3000` y verás **tu** aplicación, ya empaquetada.

De aquí en adelante, cualquiera con esa imagen ejecuta tu app con un solo
comando, sin instalar Node ni dependencias en su máquina.

---

# Construir una vez, iterar rápido

La imagen fija el **entorno** (Node, dependencias); un **bind mount** (Sesión 1)
comparte tu **código en vivo**. Combinados, obtienes el mejor flujo de
desarrollo: entorno reproducible + cambios inmediatos.

```bash
docker run -d --name miapp-dev -p 3000:3000 -v $(pwd):/app miapp-node
```

- La **imagen** aporta el entorno ya construido (no reinstalas nada).
- El **bind mount** monta tu carpeta sobre `/app`: editas en el host y el
  contenedor ve el cambio al instante.

> Regla práctica: **construyes la imagen una vez** para fijar el entorno, y
> **montas el código** para iterar sin reconstruir en cada cambio.

---
layout: center
class: section-slide
---

# Actividad 4 — Construir tu propia imagen

<div class="repo-cta">
  <!-- TODO: apuntar href al repositorio de la actividad -->
  <a class="repo-btn" href="#" target="_blank" rel="noopener">📦 Abrir repositorio de la actividad →</a>
  <div class="repo-hint">El repositorio incluye las instrucciones y el código de la práctica.</div>
</div>

<div class="abs-br m-6 opacity-80">⏱ ~20 min</div>

---

# ¿Por qué Docker Compose?

`docker run` funciona, pero para una app real el comando **crece**: puertos,
volúmenes, variables, nombre… y encima cada servicio (app, base de datos) es su
propio `run`.

```bash
docker run -d --name web -p 3000:3000 -v $(pwd):/app -e NODE_ENV=dev miapp-node
docker run -d --name db -e POSTGRES_PASSWORD=secret postgres:16
```

Repetir y recordar esos comandos es frágil y difícil de compartir. Queremos la
configuración **escrita, versionada y reproducible** en un archivo, no en el
historial de la terminal.

Esa es la motivación de **Docker Compose**: describir la aplicación completa en
un archivo y levantarla con un solo comando.

---

# Docker Compose

**Docker Compose** permite **definir y ejecutar** aplicaciones de uno o varios
servicios a partir de un archivo **YAML** (`compose.yaml`).

- Cada **servicio** es un contenedor con su configuración declarada.
- Todo queda en un archivo **versionable**, fácil de compartir con el equipo.
- Un solo comando (`docker compose up`) levanta la aplicación completa.

En lugar de recordar largos `docker run`, describes el **estado deseado** y
Compose se encarga de crear imágenes, contenedores y la red que los conecta.

> De imperativo a **declarativo**: pasas de *"ejecuta estos comandos en este
> orden"* a *"así debe verse mi aplicación"*.

---

# Anatomía de un `compose.yaml`

Un archivo mínimo para nuestra app Node:

```yaml
services:
  web:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
    command: npm start
```

Es la traducción directa del `docker run` de antes: `build: .` construye desde
el Dockerfile, `ports` publica el puerto, `volumes` monta el código y `command`
define qué ejecutar.

**Cuidado con la indentación:** YAML usa **espacios** (nunca tabuladores) y la
jerarquía se define por sangría. Un espacio de más o de menos cambia el
significado o rompe el archivo.

---

# Qué significa cada campo

| Campo | Qué declara |
|-------|-------------|
| `services` | la lista de servicios (cada uno será un contenedor) |
| `build`    | construir la imagen desde un Dockerfile (ruta del contexto) |
| `image`    | usar una imagen existente en vez de construirla |
| `ports`    | publicación de puertos, igual que `-p` (`host:contenedor`) |
| `volumes`  | montajes: volúmenes o bind mounts, igual que `-v` |
| `command`  | comando de arranque (sobrescribe el `CMD` de la imagen) |

`build` e `image` son las dos formas de decir **de dónde sale** el contenedor:
la construyes tú, o la tomas de un registry.

---

# `docker compose` · desde la CLI

Los comandos se ejecutan en la carpeta donde está el `compose.yaml`:

| Comando | Qué hace |
|---------|----------|
| `docker compose up` | crea y arranca todos los servicios |
| `docker compose up -d --build` | reconstruye imágenes y corre en segundo plano |
| `docker compose ps` | lista los servicios del proyecto y su estado |
| `docker compose logs -f` | muestra y sigue los logs de los servicios |
| `docker compose down` | **detiene y elimina** contenedores y la red |

`up` levanta todo el proyecto y `down` lo desmonta por completo: **una app
entera** arriba o abajo con un solo comando. Con `up -d --build` reconstruyes la
imagen y corres en segundo plano en un mismo paso.

---

# Servicios y redes

Al levantar varios servicios, Compose crea una **red por defecto** y conecta
todos los contenedores del proyecto a ella. Dentro de esa red, **cada servicio
es alcanzable por su nombre**.

```yaml
services:
  web:
    build: .
    ports:
      - "3000:3000"
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
```

<div class="flow">
  <div class="node navy">Red del proyecto</div>
  <div class="arr">⊃</div>
  <div class="node solid">web</div>
  <div class="arr">→</div>
  <div class="node">db</div>
</div>

`web` se conecta a la base de datos usando el **hostname `db`** —el nombre del
servicio—, sin necesidad de IPs. Esto es lo que hace a Compose tan cómodo para
aplicaciones con más de un contenedor.

---

# `docker run` vs `docker compose`

|  | `docker run` | `docker compose` |
|--|--------------|------------------|
| **Estilo** | imperativo (un comando por contenedor) | declarativo (un archivo) |
| **Varios servicios** | un `run` por cada uno | todos en `compose.yaml` |
| **Configuración** | vive en la terminal | versionada en el repositorio |
| **Ideal para** | pruebas rápidas y puntuales | apps reales, repetibles y compartibles |

Regla práctica: **`docker run`** para probar algo suelto; **Compose** cuando la
configuración importa y quieres repetirla, compartirla o mantenerla.

---
layout: center
class: section-slide
---

# Actividad 5 — De comando manual a servicio

<div class="repo-cta">
  <!-- TODO: apuntar href al repositorio de la actividad -->
  <a class="repo-btn" href="#" target="_blank" rel="noopener">📦 Abrir repositorio de la actividad →</a>
  <div class="repo-hint">El repositorio incluye las instrucciones y el código de la práctica.</div>
</div>

<div class="abs-br m-6 opacity-80">⏱ ~20 min</div>

---

# Errores comunes de toda la unidad

Un repaso de las trampas frecuentes, de la Sesión 1 a hoy:

- **Confundir imagen y contenedor** — la imagen es la plantilla; el contenedor,
  la ejecución.
- **Invertir puertos** — recuerda `-p host:contenedor`.
- **Escribir fuera del punto de montaje** — solo persiste lo que cae bajo el
  volumen o bind mount.
- **Confundir volumen y bind mount** — Docker administra el volumen; tú eliges
  la ruta del bind mount.
- **Mal contexto de build** — si `COPY` no encuentra un archivo, suele ser que
  está fuera del contexto (o excluido en `.dockerignore`).
- **Indentación de YAML** — espacios, no tabuladores; la sangría es la estructura.

---

# Comandos de limpieza

Tras varias prácticas se acumulan contenedores e imágenes. Para recuperar orden
en el laboratorio:

```bash
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
docker rmi $(docker images -q)
docker system prune -a
```

- `$(docker ps -aq)` → lista los **IDs** de todos los contenedores y los pasa
  como argumento.
- `system prune -a` → elimina de golpe contenedores parados, redes sin uso e
  **imágenes** no referenciadas.

> **Úsalos con cuidado.** Son **irreversibles** y borran a lo ancho: en una
> máquina compartida podrías eliminar el trabajo de otros. Verifica con
> `docker ps -a` antes de barrer.

---

# Comprueba tu comprensión

Si puedes explicar estas distinciones con tus palabras, dominas la unidad:

- **Imagen vs. contenedor** — plantilla de solo lectura frente a instancia en
  ejecución.
- **`stop` vs. `rm`** — detener conserva el contenedor; eliminar lo borra.
- **Volumen vs. bind mount** — almacenamiento administrado por Docker frente a
  una carpeta del host que tú eliges.
- **Dockerfile vs. Compose** — cómo **construir una imagen** frente a cómo
  **orquestar servicios** ya definidos.

Si alguna todavía se siente borrosa, vuelve a la diapositiva correspondiente y
revisa el ejemplo.

---
layout: center
class: section-slide
---

# Cierre de la unidad

<div class="text-left inline-block mt-2">

- Docker **empaqueta y ejecuta** aplicaciones de forma consistente.
- **Image ≠ Container**: plantilla frente a ejecución.
- Los **volúmenes** preservan datos; los **bind mounts** conectan el host.
- Un **Dockerfile** construye tu **propia imagen** (`docker build`).
- **Docker Compose** organiza varios servicios de forma **declarativa**.

</div>

<div class="mt-6 opacity-80">
De ejecutar imágenes de otros a empaquetar y orquestar las tuyas.
</div>
