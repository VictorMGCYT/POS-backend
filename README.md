<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Sistema de Punto de Venta Ventry

Hola, este es backend de un sistema de punto de venta desarrollado con NestJS. El objetivo es proporcionar una solución completa para la gestión de ventas, inventario y clientes.  
La licencia de este proyecto te permite usarlo de forma gratuita, ya sea para fines personales o educativos. Sin embargo, si deseas utilizarlo con fines comerciales, se requiere una licencia comercial. Para más detalles, contáctame personalmente [manuelvgc2233@gmail.com](mailto:manuelvgc2233@gmail.com), si deseas más información consulta el archivo LICENSE del repositorio.

### Índice
[Versión en inglés](#documentation)  
[Instalación](#instalación)  
[Documentación de Open API](#documentación-de-open-api)  
[Módulos del Proyecto](#módulos-del-proyecto)  
[Carpetas de Recursos](#carpetas-de-recursos)  
[Manejo de autenticación de usuarios](#manejo-de-autenticación-de-usuarios)  
[Requisitos](#requisitos)

## Requisitos
El proyecto se ha desarrollado utilizando la siguiente versión de Node.js, para evitar problemas de compatibilidad, asegúrate de tener instalada la misma versión o una superior:
- **Node.js**: v22.13.1

## Instalación
1. Clona el repositorio:
    ```bash
    git clone https://github.com/VictorMGCYT/POS-backend.git
    ```
2. Navega al directorio del proyecto:
    ```bash
    cd POS-backend
    ```
3. Instala las dependencias:
    ```bash
    npm install
    ```
4. Renombra el archivo `.env.template` a `.env` y configura las variables de entorno según tus necesidades.

5. Ejecutar el comando de docker para crear la imagen base de datos, revisa el archivo `docker-compose.yaml` para más detalles:
    ```bash
    docker compose up -d
    ```
6. Inicia la aplicación:
    ```bash
    npm run start:dev
    ```
7. Accede a la aplicación en tu navegador en `http://localhost:3001`.

## Documentación de Open API
Todos los endpoints de la API están documentados utilizando Swagger. Puedes acceder a la documentación en `http://localhost:3001/api`, una vez que hayas ejecutado el proyecto.

![Open API](images-readme/open-api.png)

Puedes ver ejemplos de las peticiones y respuestas, así como los parámetros requeridos para cada endpoint.

## Módulos del Proyecto
- **Auth**: Maneja la autenticación y autorización de usuarios, además de permitir el registro y la gestión de los mismos.
- **Products**: Permite la gestión de productos, incluyendo creación, actualización y eliminación.
- **Sales**: Registra y gestiona las ventas realizadas en el sistema.
- **Sale-Items**: Maneja los artículos individuales dentro de una venta, para llevar el registro de cada transacción.
- **Printer**: Maneja la impresora de la librería PDFmake, permitiendo la generación de los reportes en formato PDF.
- **Reports**: Contiene los endpoints para generar reportes de ventas, strock etc.

## Carpetas de Recursos
Dentro de `src` encontrarás las siguientes carpetas que son importantes para el funcionamiento del proyecto:
- **assets**: Contiene la carpeta de `images` dónde se encuentra el logo del sistema y que además es utilizado en los reportes. También incluye la carpeta `reports`... OJO, no confundir con el módulo `reports` que contiene los endpoint, en esta carpeta están las funciones de PDFmake qué se encargan de la estructura de los reportes.
- **utils**: Por el momento únicamente contiene la carpeta de `functions`, que incluye funciones de utilidad que pueden ser utilizadas en diferentes partes del proyecto, como formatear fechas y normalizar los nombres que provienen de la base de datos.

## Manejo de autenticación de usuarios
Para manejar la autenticación de usuarios, el proyecto utiliza JWT (JSON Web Tokens). Los usuarios pueden registrarse y luego iniciar sesión para obtener un token que les permitirá acceder a los endpoints protegidos.

Para ello se utiliza una estrategia de autenticación basada en JWT, que se configura en el módulo `AuthModule`.  
El flujo de autenticación es el siguiente:

1. **Inicio de sesión**: El usuario envía sus datos (nombre de usuario y contraseña) a través del endpoint `/auth/login`.
2. **Generación del token**: Si las credenciales son válidas, el servidor genera un token JWT y lo devuelve al usuario mediante el uso de una cookie llamada `jwt`.
3. **Acceso a endpoints protegidos**: Los endpoints que se encuentran decorados con `@Auth()` requieren que el usuario envíe el token en las cookies de la solicitus.
4. **Verificación del token**: El servidor por defecto utiliza la librería `Passport` la cuál establece por defecto una estrategia de autenticación basada en JWT. Esta estrategia verifica la validez del token en cada solicitud a los endpoints protegidos, puedes verlos en el archivo `auth/strategy/jwt.strategy.ts`.
5. **Colocación del token en la request**: La estrategia valida el token y, si es válido verifica que el usuario que contiene el `payload` del token exista en la base de datos, si es así, permite el acceso al endpoint protegido y además coloca la información del usuario en la request mediante el método `validate` de la estrategia, lo que permite acceder a los datos del usuario autenticado en los controladores.

 
## Documentation

Hello, this is the backend of a point of sale system developed with NestJS. The goal is to provide a complete solution for managing sales, inventory, and customers.
The license of this project allows you to use it for free, either for personal or educational purposes. However, if you want to use it for commercial purposes, a commercial license is required. For more details, contact me personally at manuelvgc2233@gmail.com. For more information, check the LICENSE file in the repository.

### Index
[Spanish version](#sistema-de-punto-de-venta-ventry)  
[Installation](#installation)  
[Open API Documentation](#open-api-documentation)  
[Project Modules](#project-modules)  
[Resource Folders](#resource-folders)  
[User Authentication Management](#user-authentication-management)  
[Requirements](#requirements)

## Requirements
This project was developed using the following Node.js version. To avoid compatibility issues, make sure you have the same or a higher version installed:
- **Node.js**: v22.13.1

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/VictorMGCYT/POS-backend.git
    ```
2. Go to the project directory:
    ```bash
    cd POS-backend
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Rename the `.env.template` file to `.env` and configure the environment variables as needed.

5. Run the docker command to create the database image. Check the `docker-compose.yaml` file for more details:
    ```bash
    docker compose up -d
    ```
6. Start the application:
    ```bash
    npm run start:dev
    ```
7. Access the application in your browser at `http://localhost:3001`.

## Open API Documentation
All API endpoints are documented using Swagger. You can access the documentation at `http://localhost:3001/api` once the project is running.

![Open API](images-readme/open-api.png)

You can see examples of requests and responses, as well as the required parameters for each endpoint.

## Project Modules
- **Auth**: Handles user authentication and authorization, as well as user registration and management.
- **Products**: Manages products, including creation, updating, and deletion.
- **Sales**: Records and manages sales made in the system.
- **Sale-Items**: Manages individual items within a sale, keeping track of each transaction.
- **Printer**: Handles the PDFmake library printer, allowing the generation of PDF reports.
- **Reports**: Contains endpoints to generate sales, stock, etc. reports.

## Resource Folders
Inside `src` you will find the following folders, which are important for the project's operation:
- **assets**: Contains the `images` folder where the system logo is located and used in reports. It also includes the `reports` folder... NOTE: do not confuse it with the `reports` module that contains the endpoints; this folder contains the PDFmake functions responsible for the report structure.
- **utils**: Currently only contains the `functions` folder, which includes utility functions that can be used in different parts of the project, such as formatting dates and normalizing names from the database.

## User Authentication Management
To manage user authentication, the project uses JWT (JSON Web Tokens). Users can register and then log in to obtain a token that will allow them to access protected endpoints.

A JWT-based authentication strategy is used, configured in the `AuthModule`.  
The authentication flow is as follows:

1. **Login**: The user sends their data (username and password) through the `/auth/login` endpoint.
2. **Token generation**: If the credentials are valid, the server generates a JWT token and returns it to the user using a cookie called `jwt`.
3. **Access to protected endpoints**: Endpoints decorated with `@Auth()` require the user to send the token in the request cookies.
4. **Token verification**: By default, the server uses the `Passport` library, which sets a JWT-based authentication strategy. This strategy verifies the token's validity on each request to protected endpoints. You can see it in the `auth/strategy/jwt.strategy.ts` file.
5. **Placing the token in the request**: The strategy validates the token and, if valid, checks that the user contained in the token's payload exists in the database. If so, it allows access to the protected endpoint and also places the user information in the request via the strategy's `validate` method, allowing access to the authenticated user's data in the controllers.