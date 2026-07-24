# Tabla completa del deck — Docker / Containers

> Audiencia: **estudiantes**  
> Formato: **dos sesiones completas de 3 horas**  
> Enfoque: contenido visible para estudiantes, sin instrucciones para profesor dentro de las diapositivas.

## Convención de la tabla
- **Sesión**: 1 o 2
- **Tiempo**: estimado para tratar esa diapositiva dentro de clase
- **Contenido para estudiantes**: texto o estructura sugerida visible en la diapositiva
- **Tipo**: conceptual, CLI, ejemplo, actividad, cierre, comparación
- **Acción**: conservar, reescribir, crear, fusionar

| Sesión | # | Título de la diapositiva | Objetivo | Contenido para estudiantes | Tipo | Tiempo |
|---|---:|---|---|---|---|---:|
| 1 | 1 | Containers | Abrir la unidad y situar el tema | **Containers**  
Docker como herramienta para empaquetar y ejecutar aplicaciones  
Fundamentos, ejecución y persistencia | Portada | 3 min |
| 1 | 2 | Why containers exist | Introducir el problema antes de la herramienta | - Las aplicaciones fallan por diferencias de entorno  
- Versiones, librerías y configuración pueden cambiar el comportamiento  
- Necesitamos entornos reproducibles  
- Los contenedores reducen fricción al desarrollar y desplegar | Conceptual | 8 min |
| 1 | 3 | The classic problem | Hacer tangible el problema "it works on my machine" | **It works on my machine**  
- Diferente sistema operativo  
- Diferentes versiones de dependencias  
- Bugs difíciles de reproducir  
- Mayor costo de soporte y despliegue | Conceptual | 6 min |
| 1 | 4 | Docker | Dar una definición clara de Docker | - Plataforma para desarrollar, distribuir y ejecutar aplicaciones  
- Usa contenedores como unidad de ejecución  
- Permite mayor consistencia entre ambientes | Conceptual | 6 min |
| 1 | 5 | Not a full OS | Corregir la confusión con máquinas virtuales | - Un contenedor **no** incluye un kernel completo  
- Comparte el kernel del host  
- Ejecuta procesos aislados  
- Es más liviano que una máquina virtual | Conceptual / comparación | 8 min |
| 1 | 6 | Core concepts | Introducir el vocabulario mínimo | Tabla breve:  
- **Image**: plantilla con app y dependencias  
- **Container**: instancia en ejecución  
- **Host**: máquina donde corre Docker  
- **Engine**: runtime que construye y ejecuta  
- **Registry**: repositorio de imágenes | Conceptual | 8 min |
| 1 | 7 | Image | Explicar qué es una imagen | - Una imagen es una plantilla  
- Incluye lo necesario para ejecutar una aplicación  
- Se versiona con tags como `debian:12`, `node:18`  
- Una misma imagen puede generar muchos contenedores | Conceptual | 7 min |
| 1 | 8 | Common mistakes: images | Prevenir errores tempranos | - Confundir image con container  
- Usar `latest` sin control  
- Ignorar el tag  
- Asumir que todas las imágenes traen las mismas herramientas | Errores comunes | 5 min |
| 1 | 9 | Container | Definir contenedor desde ejecución | - Instancia en ejecución de una imagen  
- Proceso aislado  
- Tiene ciclo de vida  
- Tiene una capa escribible mientras existe | Conceptual | 7 min |
| 1 | 10 | Container lifecycle | Mostrar que el contenedor cambia de estado | - Crear  
- Iniciar  
- Detener  
- Reiniciar  
- Eliminar  
Idea clave: detener no es eliminar | Conceptual | 8 min |
| 1 | 11 | Common mistakes: containers | Corregir expectativas erróneas | - Tratar contenedores como servidores completos  
- Esperar persistencia automática  
- No nombrar contenedores  
- Confundir stopped con removed | Errores comunes | 5 min |
| 1 | 12 | Docker architecture | Mostrar cómo se conectan CLI, engine, imágenes y contenedores | Diagrama simple:  
Usuario → Docker CLI → Docker Engine → Images / Containers  
Docker Hub como fuente externa de imágenes | Conceptual / diagrama | 8 min |
| 1 | 13 | Docker Hub | Explicar de dónde salen las imágenes | - Registro público de imágenes  
- Permite descargar imágenes base y compartir imágenes propias  
- Verificar fuente y versión antes de usar | Conceptual | 6 min |
| 1 | 14 | Our playground | Alinear el entorno de trabajo | - Trabajaremos en terminal  
- Podemos usar máquina local o sandbox/lab  
- Leer la salida de cada comando es parte del aprendizaje | Contexto | 4 min |
| 1 | 15 | Docker from the command line | Enseñar a leer un comando estructuralmente | ```bash
docker run -it --name mydebian debian:12 /bin/bash
```  
- `docker`: herramienta  
- `run`: acción  
- `-it`: terminal interactiva  
- `--name`: nombre  
- `debian:12`: imagen  
- `/bin/bash`: comando interno | CLI | 10 min |
| 1 | 16 | Pull | Separar descargar de ejecutar | ```bash
docker pull debian:12
```  
- Descarga la imagen localmente  
- No crea contenedor  
- Útil para controlar la versión exacta | CLI | 6 min |
| 1 | 17 | Run | Presentar el comando central | ```bash
docker run -it --name mydebian debian:12 /bin/bash
```  
- Crea un contenedor nuevo  
- Lo inicia inmediatamente  
- Abre una sesión interactiva | CLI | 10 min |
| 1 | 18 | Image vs container | Reforzar la distinción con ejemplos | ```bash
docker run -it --name deb1 debian:12 /bin/bash
docker run -it --name deb2 debian:12 /bin/bash
```  
Una imagen, múltiples contenedores | Comparación | 6 min |
| 1 | 19 | List command: ps | Inspeccionar contenedores | ```bash
docker ps
docker ps -a
```  
- `docker ps`: solo ejecución actual  
- `docker ps -a`: todos los contenedores | CLI | 6 min |
| 1 | 20 | Start, stop, rm | Presentar las operaciones básicas del ciclo de vida | ```bash
docker stop mydebian
docker start mydebian
docker rm mydebian
```  
- `stop` conserva el objeto  
- `start` reutiliza un contenedor existente  
- `rm` lo elimina | CLI | 10 min |
| 1 | 21 | Common lifecycle mistakes | Consolidar troubleshooting básico | - Reusar un nombre existente  
- Volver a usar `run` cuando querías `start`  
- Salir del proceso principal y detener el contenedor  
- Eliminar un contenedor que todavía se necesita | Errores comunes | 5 min |
| 1 | 22 | Time to practice — Activity 1 | Practicar el ciclo de vida | **Actividad**  
1. Descargar una imagen  
2. Crear un contenedor  
3. Listarlo  
4. Detenerlo  
5. Reiniciarlo  
6. Eliminarlo | Actividad | 15 min |
| 1 | 23 | What should you observe? | Guiar la observación de la práctica | - `docker ps` cambia según el estado  
- `stop` no elimina  
- `start` reutiliza  
- `rm` borra el registro del contenedor | Observación | 5 min |
| 1 | 24 | Exposing services | Pasar de procesos a servicios accesibles | - Un servicio puede correr dentro del contenedor  
- Eso no significa que el host pueda acceder  
- Para acceder, debemos publicar puertos | Conceptual | 6 min |
| 1 | 25 | The publish flag `-p` | Explicar la sintaxis de publicación de puertos | ```bash
docker run -p <host_port>:<container_port> <image>
```  
Izquierda: puerto del host  
Derecha: puerto del contenedor | CLI | 8 min |
| 1 | 26 | Example: nginx on port 8080 | Mostrar un caso completo | ```bash
docker run -d --name webserver -p 8080:80 nginx
```  
Luego visitar: `http://localhost:8080` | Ejemplo | 8 min |
| 1 | 27 | Common mistakes: ports | Prevenir errores con publicación | - Invertir el orden de puertos  
- Elegir un puerto interno incorrecto  
- Usar un puerto del host ya ocupado  
- Asumir acceso sin `-p` | Errores comunes | 5 min |
| 1 | 28 | Storage by default | Introducir el problema de persistencia | - Los archivos escritos dentro del contenedor van a su capa escribible  
- Esa capa depende del ciclo de vida del contenedor  
- Por defecto, el almacenamiento no está pensado para persistencia duradera | Conceptual | 7 min |
| 1 | 29 | The persistence problem | Justificar volúmenes | - Bases de datos  
- Archivos subidos por usuarios  
- Logs  
- Estado de aplicación  
Necesitan sobrevivir a recreaciones del contenedor | Conceptual | 6 min |
| 1 | 30 | Volumes | Introducir almacenamiento persistente administrado por Docker | ```bash
docker run -v myvolume:/data ubuntu
```  
- Volumen administrado por Docker  
- Desacoplado del contenedor  
- Útil para datos persistentes | Conceptual / CLI | 10 min |
| 1 | 31 | Volume CLI view | Mostrar que el volumen es un objeto de Docker | ```bash
docker volume ls
docker volume inspect myvolume
```  
- Listar volúmenes  
- Inspeccionar metadatos  
- Reutilizar entre contenedores | CLI | 7 min |
| 1 | 32 | Example: persistence with a volume | Demostrar persistencia real | ```bash
docker run -it --name testvol -v myvolume:/data ubuntu /bin/bash
```  
Crear archivo en `/data`, eliminar contenedor, montar el mismo volumen en otro contenedor y verificar que el archivo sigue ahí | Ejemplo | 10 min |
| 1 | 33 | Common mistakes: volumes | Evitar errores de persistencia | - Escribir fuera de la ruta montada  
- Confundir volumen con almacenamiento del contenedor  
- Asumir que eliminar contenedor elimina volumen  
- Montar en la ruta equivocada | Errores comunes | 5 min |
| 1 | 34 | Time to practice — Activity 2 | Validar persistencia con un ejercicio | **Actividad**  
- Crear volumen  
- Montarlo en un contenedor  
- Escribir un archivo  
- Eliminar contenedor  
- Crear otro contenedor con el mismo volumen  
- Leer el archivo | Actividad | 15 min |
| 1 | 35 | Session 1 wrap-up | Cerrar la primera sesión | - Docker mejora consistencia entre ambientes  
- Image ≠ Container  
- Los contenedores tienen ciclo de vida  
- Los puertos publican servicios  
- Los volúmenes resuelven persistencia | Cierre | 8 min |
| 2 | 1 | Containers — Session 2 | Abrir la segunda sesión | **Containers — Session 2**  
Bind mounts, Dockerfile y Docker Compose | Portada | 3 min |
| 2 | 2 | Today’s learning path | Mostrar la ruta de la sesión | - Bind mounts  
- Volume vs bind mount  
- Dockerfile  
- Build de imagen propia  
- Docker Compose | Roadmap | 5 min |
| 2 | 3 | Quick review | Reactivar conocimientos previos | - ¿Qué es una imagen?  
- ¿Qué es un contenedor?  
- ¿Por qué los volúmenes persisten?  
- ¿Qué hace `-p`? | Repaso | 8 min |
| 2 | 4 | Bind mount | Introducir el segundo mecanismo de almacenamiento | ```bash
docker run -v <host_path>:<container_path> <image>
```  
- Ruta real del host compartida con el contenedor  
- Muy útil para desarrollo | Conceptual / CLI | 10 min |
| 2 | 5 | Great for development | Justificar bind mounts | - Permiten editar archivos desde el host  
- El contenedor ve los cambios  
- Útiles cuando el código cambia frecuentemente | Conceptual | 6 min |
| 2 | 6 | Bind mount examples | Mostrar sintaxis práctica | Linux/macOS:  
```bash
docker run -d -p 3000:3000 -v $(pwd):/app node:18
```  
Windows:  
```bash
docker run -d -v C:\path\to\project:/app node:18
``` | Ejemplo / CLI | 8 min |
| 2 | 7 | Common mistakes: bind mounts | Evitar errores típicos | - Montar la carpeta equivocada  
- Ocultar archivos del contenedor con el mount  
- Problemas de permisos  
- Diferencias de sintaxis según sistema operativo | Errores comunes | 6 min |
| 2 | 8 | Time to practice — Activity 3 | Observar sincronización host-contenedor | **Actividad**  
- Montar una carpeta del host  
- Modificar un archivo  
- Ver el cambio desde el contenedor o desde la app | Actividad | 15 min |
| 2 | 9 | Volume vs bind mount | Dar criterio de elección | Tabla comparativa:  
- Volumen: administrado por Docker, mejor portabilidad, útil para datos persistentes  
- Bind mount: usa ruta del host, excelente para desarrollo, menos portable | Comparación | 10 min |
| 2 | 10 | From using images to building images | Hacer la transición hacia Dockerfile | - Hasta ahora usamos imágenes existentes  
- En proyectos reales necesitamos empaquetar nuestra propia aplicación  
- Para eso usamos un Dockerfile | Transición | 5 min |
| 2 | 11 | Dockerfile | Definir el artefacto | - Archivo de texto con instrucciones para construir una imagen  
- Describe cómo empaquetar una aplicación  
- El orden de instrucciones importa | Conceptual | 7 min |
| 2 | 12 | Dockerfile anatomy | Explicar las instrucciones básicas | ```Dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
``` | Conceptual / código | 12 min |
| 2 | 13 | Key distinctions in Dockerfile | Destacar diferencias semánticas | - `FROM`: imagen base  
- `WORKDIR`: carpeta de trabajo  
- `COPY`: copiar archivos  
- `RUN`: ejecutar durante build  
- `EXPOSE`: documentar puerto  
- `CMD`: comando por defecto al iniciar | Conceptual | 8 min |
| 2 | 14 | RUN vs CMD | Resolver una confusión frecuente | - `RUN` sucede al construir la imagen  
- `CMD` sucede cuando el contenedor arranca  
- No cumplen el mismo propósito | Comparación | 6 min |
| 2 | 15 | docker build | Conectar Dockerfile con la CLI | ```bash
docker build -t miapp-node .
```  
- `-t`: tag de la imagen  
- `.`: contexto de construcción | CLI | 8 min |
| 2 | 16 | docker image ls | Verificar que la imagen fue construida | ```bash
docker image ls
```  
- Confirmar nombre, tag y tamaño  
- Verificar que la imagen existe localmente | CLI | 5 min |
| 2 | 17 | Run your custom image | Cerrar el ciclo build → run | ```bash
docker run -d --name miapp-container -p 3000:3000 miapp-node
```  
Ejecutar nuestra aplicación empaquetada | CLI / ejemplo | 8 min |
| 2 | 18 | Build once, edit fast | Conectar Dockerfile con bind mounts | ```bash
docker run -d --name miapp-dev -p 3000:3000 -v $(pwd):/app miapp-node
```  
La imagen define el entorno; el bind mount facilita cambios rápidos | Conceptual / ejemplo | 8 min |
| 2 | 19 | Time to practice — Activity 5 | Construir y ejecutar una imagen propia | **Actividad**  
- Completar el Dockerfile  
- Construir la imagen  
- Ejecutarla  
- Verificar servicio  
- Comparar build y run | Actividad | 20 min |
| 2 | 20 | Why Docker Compose? | Justificar Compose desde el problema | - `docker run` funciona, pero acumula muchos flags  
- Repetir comandos complejos es difícil  
- Queremos configuración declarativa y compartible | Conceptual | 6 min |
| 2 | 21 | Docker Compose | Definir la herramienta | - Permite definir y ejecutar aplicaciones con uno o más servicios  
- Usa YAML para describir configuración  
- Facilita reproducibilidad | Conceptual | 7 min |
| 2 | 22 | Compose file anatomy | Mostrar estructura mínima de `compose.yaml` | ```yaml
services:
  web:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
    command: npm start
``` | Código / conceptual | 12 min |
| 2 | 23 | What each field means | Interpretar el archivo | - `services`: define servicios  
- `build`: cómo construir  
- `ports`: publicación de puertos  
- `volumes`: mounts  
- `command`: comando de arranque | Conceptual | 8 min |
| 2 | 24 | Compose from the CLI | Ejecutar servicios con Compose | ```bash
docker compose up
docker compose up -d --build
docker compose down
docker compose restart
``` | CLI | 10 min |
| 2 | 25 | Services and networks | Introducir la idea de red por defecto | - Compose crea servicios  
- Los servicios comparten una red por defecto  
- Esto simplifica aplicaciones con más de un contenedor | Conceptual | 6 min |
| 2 | 26 | docker run vs docker compose | Comparar enfoque manual y declarativo | Tabla comparativa:  
- `docker run`: rápido para pruebas  
- Compose: mejor para repetir, compartir y mantener configuración | Comparación | 8 min |
| 2 | 27 | Time to practice — Activity 6 | Pasar de comando manual a servicio declarativo | **Actividad**  
- Crear o revisar `compose.yaml`  
- Levantar servicio  
- Verificar acceso  
- Hacer cambios  
- Bajar servicio con `docker compose down` | Actividad | 20 min |
| 2 | 28 | Common mistakes and edge cases | Reunir errores de toda la unidad | - Confundir image y container  
- Usar mal puertos  
- Escribir fuera del mount  
- Confundir volume y bind mount  
- Mal contexto de build  
- Errores de indentación en YAML | Errores comunes | 10 min |
| 2 | 29 | Clean up commands | Recuperar orden en el laboratorio | ```bash
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
docker rm -f $(docker ps -aq)
docker rmi $(docker images -q)
docker system prune -a
```  
Usar con cuidado | CLI | 6 min |
| 2 | 30 | Final synthesis | Cerrar la unidad con mapa mental integrado | - Docker empaqueta y ejecuta aplicaciones de forma consistente  
- Images son plantillas; containers son instancias  
- Volumes preservan datos  
- Bind mounts conectan archivos del host  
- Dockerfile construye imágenes propias  
- Compose organiza servicios declarativamente | Cierre | 10 min |
| 2 | 31 | Check your understanding | Verificar comprensión final | Explica la diferencia entre:  
- image vs container  
- stop vs remove  
- volume vs bind mount  
- Dockerfile vs Compose | Cierre / reflexión | 8 min |
