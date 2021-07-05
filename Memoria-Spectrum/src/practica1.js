/*Esta clase guarda un array con las cartas y el estado en el que se encuentra el juego en
cada momento, por lo que es la responsable de decidir cuándo ha terminado el juego.
También guarda el mensaje que aparece en pantalla y que se irá cambiando a medida
que interactuamos con el juego. También ha de tener una referencia al servidor gráfico
para poder dibujar el estado del juego.*/

MemoryGame = function (gs) {
	var gs = gs;
	var cartas = ["perico", "mortadelo", "fernandomartin", "sabotaje", "phantomas", "poogaboo", "sevilla", "abadia"];
	var tablero = new Array(16);
	var mensaje;
	var cartaVolteada = null;
	var cartasEncontradas = 0;
	var cartasVolteadas =0;

	/* Inicializa el juego creando las cartas (recuerda que son 2 de cada
tipo de carta), desordenándolas y comenzando el bucle de juego.
*/
	this.initGame = function () {
		mensaje = "Juego Memoria Spectrum";
		
		//Inserta en el tablero las cartas y las ordena de manera aleatoria después para distribuirlas.
		var i =0; 
		for(var j=0; j < tablero.length; ++j){
			tablero[j] = new MemoryGameCard(cartas[i]);
			if(j%2 != 0) ++i;
		}
		tablero.sort(function() { return Math.random() - 0.5 });
		

		this.loop();

	}

	/*Dibuja el juego, esto es: (1) escribe el mensaje con el estado actual del
	juego y (2) pide a cada una de las cartas del tablero que se dibujen.*/

	this.draw = function () {
		gs.drawMessage(mensaje);
		for (var i = 0; i < tablero.length; ++i) {
			tablero[i].draw(gs, i);
		}

	}

	/* Es el bucle del juego. En este caso es muy sencillo: llamamos al método
draw cada 16ms (equivalente a unos 60fps). Esto se realizará con la función
setInterval de Javascript*/
	this.loop = function () {
		var that = this.draw;
		setInterval(that, 16);
	}

	/* Este método se llama cada vez que el jugador pulsa sobre
alguna de las cartas (identificada por el número que ocupan en el array de cartas
del juego). Es el responsable de voltear la carta y, si hay dos volteadas, comprobar
si son la misma (en cuyo caso las marcará como encontradas). En caso de no ser
la misma las volverá a poner boca abajo*/

	this.onClick = function (cardId) {
		if (tablero[cardId].estado == 0 && cartasVolteadas !=1) {
			tablero[cardId].flip();
			if (cartaVolteada == null){
				cartaVolteada = cardId;
			}
			else {
				if (tablero[cardId].compareTo(tablero[cartaVolteada])) {
					mensaje = "¡Pareja encontrada!";
					tablero[cardId].found();
					tablero[cartaVolteada].found();
					cartaVolteada = null;
					cartasEncontradas++;
					if (cartasEncontradas == 8)
						mensaje = "¡Has ganado!";
				}
				else {
					mensaje = "Inténtalo de nuevo";
					cartasVolteadas++;
					setTimeout(function () {
						tablero[cardId].estado = 0;
						tablero[cartaVolteada].estado = 0;
						cartaVolteada = null;
						cartasVolteadas=0;
					}, 1000);
				}
			}
		}
	}

}

/*Esta clase representa la cartas del juego. Una carta se identifica por el nombre del
sprite que la dibuja2 y puede estar en tres posibles estados: boca abajo, boca arriba o
encontrada.*/

MemoryGameCard = function (sprite) {
	this.nombre = sprite;
	this.estado = 0;

	this.flip = function () {
		this.estado = 1;

	}

	this.found = function () {
		this.estado = 2;
	}
	this.compareTo = function (otherCard) {
		return (this.nombre === otherCard.nombre);
	}

	this.draw = function (gs, pos) {
		if (this.estado == 0) {
			gs.draw("back", pos);
		}
		else
			gs.draw(this.nombre, pos);
	}
}