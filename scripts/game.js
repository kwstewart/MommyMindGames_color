GAME = (function(game){
	// *************************************
	// "classes"
	// *************************************


	// this function works off of naming conventions
	// webglContext => a context object as webgl
	// name => first part of the ids following -vertex and -fragment respectively
	// uniforms => an array of uniform names as strings
	// attribs => an array of attribs as strings
	function ShaderProgram(webglContext, name, uniforms, attribs){
		var _id = 0;

		Object.setProperty(this, "id", {
			set: function(){
				console.warn("Cannot set readonly property id.");
			},
			get: function(){
				return _id;
			}
		})

		var vertexShaderName = name+"-vertex";
		var fragmentShaderName = name+"-fragment";

		this.vertexShader = createShaderFromScriptElement(webglContext, vertexShaderName);
		this.fragmentShader = createShaderFromScriptElement(webglContext, fragmentShaderName);

		this.binary = createProgram(webglContext, [this.vertexShader, this.fragmentShader]);

		// go through the vars and attach them to the program


		// make it so we can just reference the vars later off the ShaderProgram instance
		// var shader = new ShaderProgram(ctx, "shaderIdPrefix", ["u_view_matrix"], ["a_position"])
		// shader.a_position || shader.u_view_matrix || shader["a_position"] || shader["u_view_matrix"]
		for(var uniIdx in uniforms){
			this[uniforms[uniIdx]] = webglContext.getUniformLocation(this.binary, uniforms[uniIdx]);
		}

		for(var attrIdx in attribs){
			this[attribs[attrIdx]] = webglContext.getAttribLocation(this.binary, [attribs[attrIdx]]);
		}
	}

	function VertexData(texture, textureCoords){

	}

	function ImageEx(filepath){
		var filename = filepath;

		this.img = new Image();
		this.img.src = filename;
	}

	function Entity(){
		this.vertecies = new List.List();
		this.shaderProgram = null;
	}

	function GameState(){
		this.scene = new Scene();
	}

	function Scene(){
		this.objects = new List.List();

		this.draw = function(){
			this.objects.eachValue(function(n){

			});
		}
	}

	// *************************************
	// Functions
	// *************************************

	var StartScreen_GameState = new GameState();
	var background = new Entity();

	function init(){

		game.Screen = new CanvasEx({ width: 640, height: 960});
		game.Screen.attach("screen");
	}

	function loop(){

		requestAnimationFrame(loop);
	}

	// *************************************
	// Expose API
	// *************************************

	game.init = init;
	game.loop = loop;

	return game;
})({});