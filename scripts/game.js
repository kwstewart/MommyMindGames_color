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
		var _id = getId();

		Object.defineProperty(this, "id", {
			set: function(){
				console.warn("Cannot set readonly property id.");
			},
			get: function(){
				return _id;
			}
		});

		var vertexShaderName = name+"-vertex";
		var fragmentShaderName = name+"-fragment";

		this.vertexShader = createShaderFromScriptElement(webglContext, vertexShaderName);
		this.fragmentShader = createShaderFromScriptElement(webglContext, fragmentShaderName);

		this.binary = createProgram(webglContext, [this.vertexShader, this.fragmentShader]);
		webglContext.useProgram(this.binary);
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

	function Entity(args){
		args = args || {};

		var _id = getId();

		Object.defineProperty(this, "id", {
			set: function(){
				console.warn("Cannot set readonly property id.");
			},
			get: function(){
				return _id;
			}
		});

		this.vertices = args.vertices;
		this.shaderProgram = args.shaderProgram;

		this.toFloat32Array = function(){
			return new Float32Array(this.vertices);
		}
	}

	function GameState(){
		this.scene = new Scene();
	}

	function Scene(){
		this.entities = [];

		this.addEntity = function(entity){
			this.entities.push(entity);
		}

		this.getFloat32Array = function(){
//			var obs = Object.keys(this.objects);
//			var total = 0;
//			for(var i = 0; i < obs.length; ++i) {
//				total += this.objects[obs[i]].getVerts().length;
//			}
//
//			var f = new Float32Array(total);
//			for(var i = 0; i < obs.length; ++i) {
//				var offset = (i==0)?0:obs[i-1].length;
//				f.set(this.objects[obs[i]].getVerts(), offset);
//			}
//			return f;
		}

		this.draw = function(webglContext){

			var buffer = webglContext.createBuffer();
			webglContext.bindBuffer(webglContext.ARRAY_BUFFER, buffer);
			webglContext.bufferData(
				webglContext.ARRAY_BUFFER,
				this.entities[0].toFloat32Array(),
				webglContext.STATIC_DRAW
			);


			webglContext.enableVertexAttribArray(this.entities[0].shaderProgram.a_position);
			webglContext.vertexAttribPointer(this.entities[0].shaderProgram.a_position, 2, webglContext.FLOAT, false, 20, 0);
			webglContext.enableVertexAttribArray(this.entities[0].shaderProgram.a_color);
			webglContext.vertexAttribPointer(this.entities[0].shaderProgram.a_color, 3, webglContext.FLOAT, false, 20, 8);

			webglContext.drawArrays(webglContext.TRIANGLES, 0, 6);

		}
	}

	// *************************************
	// Derived Classes
	// *************************************

	function Square(x, y, w, h, shader){
		var verts = [
			x, y,     0.0, 0.0, 1.0,  // 1
			x, y+h,   1.0, 1.0, 1.0,  // 2
			x+w, y+h, 1.0, 1.0, 0.0,  // 3
			x+w, y+h, 1.0, 1.0, 0.0,  // 4
			x, y,     0.0, 0.0, 1.0,  // 5
			x+w, y,   1.0, 1.0, 1.0   // 6
		];

		Entity.apply(this, [{
			vertices: verts,
			shaderProgram: shader
			}]
		);
	}

	// *************************************
	// Functions
	// *************************************

	var globalIdCounter = 0;
	function getId(){
		return ++globalIdCounter;
	}

	function init(){

		game.Screen = new CanvasEx({ width: 640, height: 960});
		game.Screen.attach("screen");

		var SimpleShader = new ShaderProgram(game.Screen.context, "simple", [], ["a_position", "a_color"]);
//		var StartScreen_GameState = new GameState();
		var gameScene = new Scene();
		var background = new Square(-0.2, 0.2, 0.2, 0.2, SimpleShader);

		gameScene.addEntity(background);



		function loop(){

			gameScene.draw(game.Screen.context);

			requestAnimationFrame(loop);
		}

		loop();
	}


	// *************************************
	// Expose API
	// *************************************

	game.init = init;
//	game.loop = loop;

	return game;
})({});