# CoviDodge

## Descripción
CoviDodge es un juego basado en [FlappyBirds](https://flappybird.io/) creado para ser ejecutado tanto en la versión de escritorio como en dispositivos móviles. Nuestro personaje debe evitar el mayor número de virus y llegar al final del nivel, si existe, teniendo que interactuar con el doctor que aparece en el mapa para conseguir la vacuna contra la Covid-19.

## Principales mecánicas 
### Acción
El jugador debe clickar la pantalla, en caso de jugar en dispositivo móvil; la flecha de dirección superior si se juega en la versión de escritorio. Deberá esquivar y avanzar lo máximo posible en el nivel elegido.

### Escenario
El juego consta de 4 niveles, en función de la dificultad y longitud del mapa.
* Nivel fácil: Se compone de virus estáticos, menor longitud y por ende menor dificultad.
* Nivel normal: Compuesto por una mezcla de virus estáticos y virus con movimiento vertical, un tamaño del mapa mediano y una dificultad media.
* Nivel dificil: Lo componen una mezcla de 3 tipos de virus, los verdes(estáticos), azules(movimiento vertical) y los rojos(movimiento diagonal), un tamaño del mapa grande y una dificultad extrema.
* Nivel infinito: Es un nivel el cuál no tiene final, aparecen de manera aleatoria infinitos virus azules(movimiento vertical) según se avanza por el mapa. Su finalidad es el reto de conseguir la mayor puntuación sin morir.

### Obstáculos
Los niveles presentan una serie de obstáculos que incrementan su dificultad a medida que escogemos niveles más complicados. Dentro del juego tenemos 3 obstáculos distintos:
* Virus verde: Estático

![image](https://user-images.githubusercontent.com/42656687/122440703-1d1a2580-cf9d-11eb-9436-27f9274b7c7c.png)

* Virus azul: Movimiento vertical

![image](https://user-images.githubusercontent.com/42656687/122440791-34f1a980-cf9d-11eb-9fd1-b16c92f48dc6.png)

* Virus rojo: Movimiento diagonal

![image](https://user-images.githubusercontent.com/42656687/122440854-420e9880-cf9d-11eb-9538-07c9cf470c55.png)


### Puntuación
En cada nivel se obtiene una puntuación en función de la distancia que se llegue a recorrer. En todo momento vendrá indicada en el HUD que presenta el juego arriba a la izquierda.

![image](https://user-images.githubusercontent.com/42656687/122441088-7eda8f80-cf9d-11eb-96c5-d98840061759.png)

### Ranking
Se  ha implementado una escena que permite consultar las mejores puntuaciones que ha obtenido el usuario en la partida actual, para cada uno de los niveles del juego.

![image](https://user-images.githubusercontent.com/42656687/122441348-c234fe00-cf9d-11eb-8ee3-ca20757df293.png)


## Implementación
Para el desarrollo del juego se ha utilizado Quintus, Tiled y los lenguajes de HTML5 y Javascript. Además, ha sido necesario modificar las librerías de Quintus, para poder conseguir el comportamiento y aspecto deseado. Toda la lógica esta presente en "coviDodge.js".

### Sprites
Usados para crear los personajes del juego y representar los obstáculos, virus existentes en él. En este apartado es donde hemos creado el movimiento característico de cada virus y sus animaciones. Se incluyen las animaciones de muerte y movimiento del personaje así como el movimiento de los virus.

### Escenas
Se han creado todos los menús del juego, menu principal, créditos, visualización del ranking y cada nivel del juego. Además se han usado escenas tanto para el HUD del juego como para los mensajes que nos indican el resultado de la pártida.

### Touch
Ha sido modificado el comportamiento táctil del juego para hacer desaparecer los botones predeterminados en Quintus, permitiendo que toda la pantalla pueda ser pulsada. No teniendo visible ningún botón. 

## Equipo de trabajo
Hemos contribuido de manera equitativa en el desarrollo de todas las tareas del juego. Programando de manera simultánea cuando se implementaban funcionalidades nuevas así como la lógica del juego, diseño de niveles y sprites, búsqueda de música e imágenes, edición en PhotoShop, prueba y testeo, etc.
Los integrantes del equipo son:
* Carlos González Torres (carga de trabajo 33,33%)
* Jorge Millán García (carga de trabajo 33,33%)
* Sergio Villarroel Fernández (carga de trabajo 33,33%)

## Referencias 

Para la realización del proyecto se han utilizado los siguientes recursos: 

### Librerías
* [Quintus](http://www.html5quintus.com/)

### Recursos gráficos
* [spriters-resource](https://www.spriters-resource.com/)
* [Pinterest](https://www.pinterest.es/)
* [Thenounproject](thenounproject.com)
* [Iconos8](https://iconos8.es/)
* [Fmfspain](https://www.fmfspain.com/2020/03/como-explicar-a-los-ninos-lo-que-es-el-coronavirus/)

### Música y sonidos
* [Youtube](https://www.youtube.com/)

## Gameplay
[![Watch the video](https://img.youtube.com/vi/yhVfo0Pq-Qc/maxresdefault.jpg)](https://www.youtube.com/watch?v=yhVfo0Pq-Qc)

## Web del juego
[CoviDodge](https://armingul.github.io/CoviDodge/)
