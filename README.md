# Prueba técnica

### 1. Sabiendo que desde almacén, necesitan saber las posiciones de stock de almacén que deben mover para satisfacer la propuesta de reparto para todas las tiendas y artículos que cumplan estos parámetros:

- grupoLocalizacionDesc = “CICLO 2 GRUPO A2” y “CICLO 1 GRUPO B” y “CICLO 1
  GRUPO A2”
- esEcommerce = 1

### Devolver una tabla con los siguientes campos:

1. Key (artículo a repartir)
2. idTienda
3. propuesta (unidades a repartir)
4. tipoStockDesc (zona del almacén de la que sale)
5. EstadoStock (nuevo campo que tendrá valores 1 o 5 según el estado del stock
   que ha cogido [stockEm05 o stockEM01])
6. posicioncompleta (id de la posición en el almacén)

### Por supuesto, esta tabla, debería tener tantas líneas por artículo como fuese necesario si ese artículo debiese ser repartido desde varias zonas del almacén, coger stock de diferentes estados, etc.

### Implementa tu solución en javascript, utiliza las librerías que consideres oportunas siempre y cuando no incurran en problemas de licenciamiento. Detalla las decisiones de tu solución que consideres pertinentes.

Como se solicita este proyecto está implementado en Javascript. Además se usa Typescript para mejorar la experiencia de desarrollo y evitar errores y React para levantar una pequeña app web en la que se muestre el resultado del problema.

He intentado separar el código en cuanto a responsabilidad de cada parte, separando renderizado, fetching de datos, lógica del problema, tipos de los datos usados y un código central que hace uso de todos los anteriores.
App.tsx es el fichero central, en el que:

- Se recuperan los datos de los ficheros json.
- Se hace un primer filtrado de los parámetros que se piden.
- Se le facilitan los datos filtrados a la sección de código que se encarga de hacer búsqueda de cada producto en los distintos lugares donde puede estar almacenado, siguiendo la lógica especficada en el problema.
- Se le pasa el resultado de la búsqueda a una tabla que los representa visualmente.

Para correrlo lanza los siguientes comandos:

```bash
npm install
npm run dev
```

Al abrir en un navegador la url de localhost que te sale tras ejecutar los comandos anteriores, podrás ver la tabla pedida.

### 2. Describe cómo implementarías esta solución si tuvieras que acabar mostrando el resultado en un sistema low code.

Implementar una solución low code para implementar filtros y lógicas complejas de manera eficiente, podría ser un desafío. En los sistemas low code, generalmente se proporciona una interfaz visual para crear aplicaciones sin necesidad de escribir mucho código, lo que puede ser útil para tareas simples y comunes.

Sin embargo, para implementar filtros avanzados y lógicas complejas, como es este caso, es posible encontrarse limitaciones en la capacidad del sistema low code para expresar estas lógicas de manera eficiente y flexible.

Mi propuesta es que si en el sistema low code no se puede hacer esta lógica se haga en otra parte, sea en un servidor que sirva los datos en bandeja listo para la app en low code los imprima o con alguna solución intermedia, con algún código intermedio que facilite el desarrollo de la lógica.

#### a) Consideraciones de rendimiento.

En cuanto a rendimiento es deseable minimizar la cantidad de datos que se use, optimizar las consultas, usar algún sistema de cacheado y hacer uso un sistema de paginación.

#### b) Requisitos que necesitarías del API.:

La API entre la lógica y el servicio de datos debe ser clara, definida y respetada por cliente y servidor, es recomendable usar APIs estándar como con el paradigma REST, en el que al servidor no se le sobrecarga con la responsabilidad de mantener el estado del cliente.

Sería necesario definir e implementar los endpoints y algún sistema de autenticación.

Para este problema concreto se me ocurre centralizar la lógica del cálculo de las localizaciones de los productos en un único endpoint. Sería un endpoint de consulta GET que recibiría 2 parámetros:

- Lista de grupo de localización
- Es comercio electrónico

El servidor devolvería una lista con los productos, su posición en el almacén y demás datos.

### 3. Si el json real del prerepato ocupase 20Gb, explica si el problema de forma distitna y porqué.

En general no sería necesario cambiar el paradigma de usar un modelo cliente-servidor comunicado por una API REST, pero si el JSON fuera muy pesado sí sería recomendable aplicar alguna técnica de optimización.

- Optimizar la lógica: minimizar las comparaciones y los bucles, usar librerías o técnicas que aporten mejoras de rendimiento.
- Usar estructuras de datos eficientes.
- Cacheado de resultados.
- Paralelización del trabajo.
- Partir el archivo y procesarlo por trozos hasta cumplir con el máximo de resultados que devolvemos por página.

### 4. Si tuvieras que de forma visual presentar en una pantalla desde que partes de un almacen se rellena un pedido, que propuesta de visualizacion plantearías teniendo en cuenta que se quiere implementar con una herramienta low code.

Una tabla me parece la forma más simple y compacta de mostrar tales datos.
Para agilizarle la vida al usario se podría usar algún código de colores para que de un golpe de vista se sepa si un producto viene de un lugar u otro (ZAR, MSR o SILO), o usar algún tipo de iconografía para cada procedencia. Esto es viable si no hay demasiados colores o demasiados iconos, en este caso como solo habría 3 puede ser una propuesta interesante.

Sería también importante ordenar los datos de las columnas por prioridad de izquierda a derecha, pués es cómo leemos, los datos más superfluos pueden quedar para al final. Así no obligamos a que si el usuario quiere consultar lo básico como ID del producto, cantidad y su localización no tenga que andar saltando entre columnas, serían ya las 3 primeras.

En cualquier caso se ha de tener en cuenta al usuario y sus necesidades además de las propias limitaciones de la plataforma lowcode usada.

---

#### Damián Cruz Carcía

#### dami.crugz@gmail.com
