// Especifica lo que se debe pintar al cargar el juego
var level =[];
var startGame = function () {
    Game.setBoard(0, new BackGround());
    Game.setBoard(1, new Logo());
    Game.setBoard(2, new TitleScreen("START",
        "Press enter to start playing",
        playGame));
}
// Indica que se llame al método de inicialización una vez
// se haya terminado de cargar la página HTML
// y este después de realizar la inicialización llamará a
// startGame
window.addEventListener("load", function () {
    Game.initialize("game", sprites, startGame);
});

var playGame = function () {
    Game.setBoard(1, new BackGround());
    var board = new GameBoard();
    board.add(new Water());
    board.add(new Home());
    board.add(new Spawner());
    board.add(new Frog());
    Game.setBoard(2, board);
};

var seGana = function () {
    Game.setBoard(1, new Logo());
    Game.setBoard(2, new TitleScreen("Has ganado", "Press enter to start playing",
        playGame));
}

var sePierde = function () {
    Game.setBoard(1, new Logo());
    Game.setBoard(2, new TitleScreen("Has perdido", "Press enter to start playing",
        playGame));
}