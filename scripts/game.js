GAME = (function(game){

	// *************************************
	// "classes"
	// *************************************

	function VertexData(texture, textureCoords){

	}

	function Entity(){
		this.vertecies = new List();
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

	}

	function loop(){

		requestAnimationFrame(loop);
	}

	return game;
})({});