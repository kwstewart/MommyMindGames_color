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
	function loadImages(imageFilenames){
		var imageNames = imageFilenames.slice();
		var imagesLoaded = 0;
		var promise = new Promise();

		var imageHash = {};

		for(var idx = 0; idx < imageNames.length; idx += 2){

			var imageKey = imageNames[idx];
			var imagePath = imageNames[idx+1];
			var image = new Image();

			image.onload = function(){
				imageHash[imageKey] = image;
				imagesLoaded += 1;

				if(imagesLoaded == imageNames.length / 2)
					promise.isDone(imageHash);
			}

			image.src = imagePath;
		}

		return promise;
	}

  function loadSounds(soundFilenames) {
    var soundNames = soundFilenames.slice();
    var soundsLoaded = 0;
    var promise = new Promise();
    
    var soundHash = {};
    
    for(var idx = 0; idx < soundNames.length; idx += 2){
      
      var soundKey = soundNames[idx];
      var soundPath = soundNames[idx+1];
      
      var sound = document.createElement("audio");
      sound.id = "sound-"+soundKey;      
      
      sound.addEventListener('canplaythrough', function() { 
        console.log("loaded sound");
        soundHash[soundKey] = sound;
        soundsLoaded += 1;
        
				if(soundsLoaded == soundNames.length / 2)
					promise.isDone(soundHash);
        
      });
      console.log("sound.src: "+soundPath);
      
    }
    
    return promise;
  }
  
  function playAudio(soundKey) {
    var sound = soundHash[soundKey];
    sound.play();
    sound.addEventListener("onended", function(evt){ console.log("sound ended"); })
  }
  game.playAudio = playAudio;

	function TextureEx(webglContext, image, npot){

		this.gl = webglContext;

		this.texture = this.gl.createTexture();
		this.image = image;
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
		this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
		this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.image);

		var sqWidth = Math.sqrt(this.width),
			sqHeight = Math.sqrt(this.height);

		if(npot == undefined)
			npot = (sqWidth % 1 != 0 && sqHeight % 1 != 0);

		if(npot){
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
		}
		else{
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
		}

		this.gl.bindTexture(this.gl.TEXTURE_2D, null);
	};


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

		this.onEnter = function(){};
		this.onExit = function(){};

		this.onLoad = function(){};
		this.onRender = function(){};
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
		// modelView coords (2), color (3), texture coords (2), texture Index (1)
		// all floats or 4 bytes
		// 2*4 + 3*4 + 2*4 + 1*4 => 8 + 12 + 8 + 4 => 32

		var verts = [
			x, y,        0.1, 0.1, 0.4,    0.0, 1.0, // 1 - 0, 1
			x, y+h,      0.1, 0.1, 0.4,    0.0, 0.0, // 2 - 0, 0
			x+w, y+h,    0.1, 0.1, 0.4,    1.0, 0.0, // 3 - 1, 0
			x+w, y+h,    0.1, 0.1, 0.4,    1.0, 0.0, // 4
			x, y,        0.1, 0.1, 0.4,    0.0, 1.0, // 1
			x+w, y,      0.1, 0.1, 0.4,    1.0, 1.0  // 6
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

		globalTexture = null //new TextureEx(game.Screen.context, "./images/background.png");

		var doneLoadingImages = false;
		globalImagesMap = {};

		loadImages(["background", "./images/bg-glow-black.png"]).done(function(imagesHash){
			globalImagesMap = imagesHash;

			globalTexture = new TextureEx(game.Screen.context, globalImagesMap["background"]);

			doneLoadingImages = true;
		});
		
		loadSounds(["test","test.ogg"]).done(function(soundHash){
		  console.log("loaded sounds, hash is: "+soundHash);
		});

		game.Screen.context.enable(game.Screen.context.DEPTH_TEST);

		function loop(){

			game.Screen.context.clearColor(0.0, 0.0, 0.0, 1.0);
			game.Screen.context.clear(game.Screen.context.COLOR_BUFFER_BIT);

			// this will be handled by gamestates later, but for now this is a good test
			if(doneLoadingImages)
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