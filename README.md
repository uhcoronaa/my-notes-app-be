# Manual de levantado de aplicación backend

A continuación se muestra el manual de levantado de la aplicación backend desarrollada para ejemplificar de mejor manera los ejemplos desarrollados en la aplicación frontend para el trabajo de graduación.

Para un fácil levantado de la aplicación backend, se incluye una configuración desarrollada con Docker-Compose. Esta configuración facilita el levantado de la aplicación backend. Si bien el despliegue es facilitado haciendo uso de Docker-Compose, es necesario configurar variables de ambiente para poder realizar el levantado de la aplicación. El repositorio de la aplicación se encuentra en el siguiente repositorio: https://github.com/uhcoronaa/my-notes-app-be.

Adicional al manual de levantado de la aplicación, se incluye un videotutorial en donde se ejemplifica el levantado de la aplicación backend con Docker-Compose y el levantado de la aplicación frontend del trabajo de graduación. El video puede ser encontrado en el siguiente enlace: [https://drive.google.com/file/d/15A1S6e5-vGihDNPdR2eQZTK86FMyD6F7/view?usp=sharing](https://drive.google.com/file/d/15A1S6e5-vGihDNPdR2eQZTK86FMyD6F7/view?usp=sharing).

También puede ser encontrado un videotutorial con una explicación mucho más detallada del levantado de la aplicación backend haciendo uso de NodeJS sin necesidad de hacer uso de Docker-Compose, el video puede ser encontrado en el siguiente enlace: https://drive.google.com/file/d/1YpB_gyVqpx2YCU9Gmf6X7AMz0Td3hwXA/view?usp=sharing.

## Configuración de variables de ambiente

Al igual que en la aplicación frontend, esta aplicación permite el manejo varios ambientes de ejecución a través del manejo de varios archivos con variables de ambiente.

![enter image description here](https://drive.google.com/uc?export=view&id=1LNocok7kELu9bDdEvxaRhTqJYDTMH-HN)

El manejo de múltiples ambientes es realizado a través del nombre del archivo de las variables de ambiente, este nombre funciona como diferenciador para el ambiente a ejecutar, por lo que al desplegar la aplicación se hará uso del nombre del archivo como diferenciador para definir el ambiente a utilizar. En este caso la configuración de los archivos Docker-Compose está hecha para el  manejo del ambiente de producción, por lo que el nombre del archivo por defecto es prod.env.

Dentro del repositorio puede encontrarse varios archivos con la estructura necesaria para el manejo de las variables de ambiente a configurar, basta con modificar los valores de las variables de ambiente con los valores deseados o crear nuevos archivos para crear nuevos ambientes de ejecución.

## Variables de ambiente a configurar

## NODE_ENV

Variable utilizada para especificar el tipo de ambiente en el que se ejecutara la aplicación. Por defecto se usa el valor dev para un ambiente de tipo desarrollo y production para un ambiente de tipo producción.

## PORT

Variable utilizada para especificar el puerto en el que se realizara el despliegue de la aplicación, esta variable es de utilidad para saber el puerto a configurar en las variables de ambiente para proyectos frontend o realizar el mapeado de puertos en caso de implementar servidores proxy.

## TOKEN_SECRET

Variable utilizada para especificar la llave con la que se creara los tokens de autorización de la aplicación. La longitud de esta llave debe de ser compatible con el algoritmo de encriptación HS256.

## TOKEN_REFRESH_SECRET

Variable utilizada para especificar la llave con la que se creara los tokens de actualización de la aplicación. La longitud de esta llave debe de ser compatible con el algoritmo de encriptación HS256.

## MONGO_DB_URL

Variable con la URL de conexión a base de datos de mongo, para esta aplicación la base de datos ya está incluida en el archivo de configuración de Docker-Compose por lo que la conexión debe realizarse a la dirección db o localhost como dirección de conexión a la base de datos, se deja un ejemplo de la cadena de conexión.

![enter image description here](https://drive.google.com/uc?export=view&id=1-cqdys3lK3Bxaf7kXjcoqh-Cx8ao2vRJ)

## SALT_ROUNDS

Variable de entorno que indica el número de iteraciones a realizar en la librería bcrypt para crear una cadena de caracteres aleatoria que permita la generación de cadenas de caracteres encriptadas.

# Configuración inicial de base de datos

La base de datos requiere una configuración de variables de ambiente. Esta configuración es necesaria para que Docker ejecute la configuración inicial de la base de datos a utilizar en la aplicación backend, dentro del repositorio se encuentra una carpeta con el nombre db con la estructura esperada de las variables de ambiente a utilizar, basta con cambiar los valores de muestra con nuevos valores para realizar el levantado de la base de datos.

# Variables de ambiente para configuración de base de datos

## MONGO_INITDB_ROOT_USERNAME

Variable dentro de archivo de variables de entorno con el nombre de usuario root para el manejo de la base de datos.

## MONGO_INITDB_ROOT_PASSWORD

Variable dentro de archivo de variables de entorno con la contraseña de usuario root para el manejo de la base de datos.

## MONGO_INITDB_DATABASE

Variable dentro de archivo de variables de entorno con el nombre de la base de datos a utilizar en la aplicación.

## User

Variable dentro de archivo JavaScript de inicialización que contiene las credenciales del usuario administrador de la base de datos. Las credenciales generadas en este objeto son las mismas a utilizar en la URL de conexión de la base de datos.

## Dbname

Variable dentro de archivo JavaScript de inicialización que contiene el nombre de la base de datos a crear.

## Rootuser

Variable dentro de archivo JavaScript de inicialización que contiene las credenciales del usuario root de la base de datos.

# Levantado con Docker-Compose

Una vez configurada las variables de ambiente, basta con modificar el mapeo de puertos en el archivo Docker-Compose para que coincidan con el puerto utilizado para la aplicación y hacer uso del comando de inicio de Docker-Compose para realizar el despliegue de la aplicación en el puerto especificado. El puerto utilizado por defecto en la aplicación es el puerto 27017.

![Levantado de backend](https://drive.google.com/uc?export=view&id=1fSDxJ4eIFGdzqeyzuZDH2NPF6p4DEHER)