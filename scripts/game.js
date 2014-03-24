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

	// for now this function accepts an array of texture keys and texture filenames as a flat array... I know
	function loadTextures(textureFilenames){
		this.imageNames = textureFilenames;
		this.done = 0;



		for(var idx in this.imageNames){
			this.imageNames[idx].done(
				function(){

				}
			)
		}
	}

	function TextureEx(webglContext, filepath, npot){

		this.gl = webglContext;

		this.texture = this.gl.createTexture();
		this.image = new Image();

		this.load = function(){
			var self = this,
				promise = new Promise();

			this.image.onload = function(){
				self.gl.bindTexture(self.gl.TEXTURE_2D, self.texture);
				self.gl.pixelStorei(self.gl.UNPACK_FLIP_Y_WEBGL, true);
				self.gl.texImage2D(self.gl.TEXTURE_2D, 0, self.gl.RGBA, self.gl.RGBA, self.gl.UNSIGNED_BYTE, this);

				var sqWidth = Math.sqrt(this.width),
					sqHeight = Math.sqrt(this.height);

				if(npot == undefined)
					npot = (sqWidth % 1 != 0 && sqHeight % 1 != 0);

				if(npot){
					self.gl.texParameteri(self.gl.TEXTURE_2D, self.gl.TEXTURE_MAG_FILTER, self.gl.LINEAR);
					self.gl.texParameteri(self.gl.TEXTURE_2D, self.gl.TEXTURE_MIN_FILTER, self.gl.LINEAR);
					self.gl.texParameteri(self.gl.TEXTURE_2D, self.gl.TEXTURE_WRAP_S, self.gl.CLAMP_TO_EDGE);
					self.gl.texParameteri(self.gl.TEXTURE_2D, self.gl.TEXTURE_WRAP_T, self.gl.CLAMP_TO_EDGE);
				}
				else{
					self.gl.texParameteri(self.gl.TEXTURE_2D, self.gl.TEXTURE_MAG_FILTER, self.gl.NEAREST);
					self.gl.texParameteri(self.gl.TEXTURE_2D, self.gl.TEXTURE_MIN_FILTER, self.gl.NEAREST);
				}

				self.gl.bindTexture(self.gl.TEXTURE_2D, null);
				promise.isDone();
			};
			this.image.src = filepath;

			return promise;
		}



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

		this.draw = function(webglContext){

			var mvp = new Matrix4();
			mvp.setOrtho(0, 640, 960, 0, 1, -100);

			var buffer = webglContext.createBuffer();
			webglContext.bindBuffer(webglContext.ARRAY_BUFFER, buffer);
			webglContext.bufferData(
				webglContext.ARRAY_BUFFER,
				this.entities[0].toFloat32Array(),
				webglContext.STATIC_DRAW
			);

			webglContext.uniformMatrix4fv(this.entities[0].shaderProgram.u_mvp, false, mvp.elements);

			webglContext.activeTexture(webglContext.TEXTURE0);
			webglContext.bindTexture(webglContext.TEXTURE_2D, globalTexture.texture);
			webglContext.uniform1i(this.entities[0].shaderProgram.u_sampler, 0);

			webglContext.enableVertexAttribArray(this.entities[0].shaderProgram.a_position);
			webglContext.vertexAttribPointer(this.entities[0].shaderProgram.a_position, 2, webglContext.FLOAT, false, 28, 0);

			webglContext.enableVertexAttribArray(this.entities[0].shaderProgram.a_color);
			webglContext.vertexAttribPointer(this.entities[0].shaderProgram.a_color, 3, webglContext.FLOAT, false, 28, 8);

			webglContext.enableVertexAttribArray(this.entities[0].shaderProgram.a_texture_coord);
			webglContext.vertexAttribPointer(this.entities[0].shaderProgram.a_texture_coord, 2, webglContext.FLOAT, false, 28, 20);

			webglContext.drawArrays(webglContext.TRIANGLES, 0, 6);

		}
	}

	// *************************************
	// Derived Classes
	// *************************************

	function Square(x, y, w, h, shader){
		var verts = [
			x, y,     0.0, 0.0, 0.3,    0.0, 1.0, // 1 - 0, 1
			x, y+h,   0.0, 0.0, 0.3,    0.0, 0.0, // 2 - 0, 0
			x+w, y+h, 0.0, 0.0, 0.3,    1.0, 0.0, // 3 - 1, 0
			x+w, y+h, 0.0, 0.0, 0.3,    1.0, 0.0, // 4
			x, y,     0.0, 0.0, 0.3,    0.0, 1.0, // 1
			x+w, y,   0.0, 0.0, 0.3,    1.0, 1.0  // 6
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

		var SimpleShader = new ShaderProgram(game.Screen.context, "simple", ["u_mvp", "u_sampler"], ["a_position", "a_color", "a_texture_coord"]);
//		var StartScreen_GameState = new GameState();
		var gameScene = new Scene();
		var background = new Square(0, 0, 640, 960, SimpleShader);

		gameScene.addEntity(background);

		globalTexture = new TextureEx(game.Screen.context, "./images/background.png");



		game.Screen.context.enable(game.Screen.context.DEPTH_TEST);
//		game.Screen.context.enable(game.Screen.context.TEXTURE_2D)

		function loop(){
			game.Screen.context.clearColor(0.0, 0.0, 0.0, 1.0);
			game.Screen.context.clear(game.Screen.context.COLOR_BUFFER_BIT);
			gameScene.draw(game.Screen.context);

			requestAnimationFrame(loop);
		}

		setTimeout(function(){
			loop();
		}, 500);

	}


	// *************************************
	// Expose API
	// *************************************

	game.init = init;
//	game.loop = loop;

	return game;
})({});