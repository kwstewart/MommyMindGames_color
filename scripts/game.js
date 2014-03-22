GAME = (function(game){

	// *************************************
	// "classes"
	// *************************************

	function VertexData(texture, textureCoords){

	}

	function Entity(){
		this.vertecies = new List.List();
	}

	function GameState(){
		this.scene = new Scene();
	}

	function Scene(){

	}

	// *************************************
	// functions
	// *************************************

	var StartScreen_GameState = new GameState();
	var background = new Entity();

	function init(){

		game.Screen = new CanvasEx({ width: 640, height: 960});
	}

	function loop(){

		requestAnimationFrame(loop);
	}

	game.init = init;

	return game;
})({});