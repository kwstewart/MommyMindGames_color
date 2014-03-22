  function glCanvas(args) {
    if(args == undefined) args = {};
    
    this.gl = null;

    this.canvasName = args.canvasName || null;
    
    this.x = args.x || 0.0;
    this.y = args.y || 0.0;
    this.z = args.z || -5.0;
    
    this.maxX = args.maxX || 1;
    this.maxY = args.maxY || 1;
    this.maxZ = args.maxZ || 1;
    
        
    this.xRot = args.xRot || 0;
    this.xSpeed = args.xSpeed || 0;
    this.yRot = args.yRot || 0;
    this.ySpeed = args.ySpeed || 0;
    this.zRot = args.zRot || 0;
    this.zSpeed = args.zSpeed || 0;

    this.shaderProgram = null;
    
    this.defaultTexture = args.defaultTexture || "";
    
    this.mvMatrix = mat4.create();
    this.pMatrix = mat4.create();
    this.mvMatrixStack = [];
    
    var lastTime = 0;
  
    this.initGL = function(canvas) {
        try {
            this.gl = canvas.getContext("experimental-webgl");
            this.gl.viewportWidth = canvas.width;
            this.gl.viewportHeight = canvas.height;
        } catch (e) {
        }
        if (!this.gl) {
            alert("Could not initialise WebGL, sorry :-(");
        }
    };
  
    this.getShader = function(gl, id) {
      var shaderScript = document.getElementById(id);
      if (!shaderScript) {
          return null;
      }
  
      var str = "";
      var k = shaderScript.firstChild;
      while (k) {
          if (k.nodeType == 3) {
              str += k.textContent;
          }
          k = k.nextSibling;
      }
  
      var shader;
      if (shaderScript.type == "x-shader/x-fragment") {
          shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
      } else if (shaderScript.type == "x-shader/x-vertex") {
          shader = this.gl.createShader(this.gl.VERTEX_SHADER);
      } else {
          return null;
      }
  
      this.gl.shaderSource(shader, str);
      this.gl.compileShader(shader);
  
      if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
          alert(this.gl.getShaderInfoLog(shader));
          return null;
      }
  
      return shader;
    };
    
    this.initShaders = function() {
        var fragmentShader = this.getShader(this.gl, "shader-fs");
        var vertexShader = this.getShader(this.gl, "shader-vs");
    
        this.shaderProgram = this.gl.createProgram();
        this.gl.attachShader(this.shaderProgram, vertexShader);
        this.gl.attachShader(this.shaderProgram, fragmentShader);
        this.gl.linkProgram(this.shaderProgram);
    
        if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }
    
        this.gl.useProgram(this.shaderProgram);
    
        this.shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
        this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
    
        this.shaderProgram.textureCoordAttribute = this.gl.getAttribLocation(this.shaderProgram, "aTextureCoord");
        this.gl.enableVertexAttribArray(this.shaderProgram.textureCoordAttribute);
    
        this.shaderProgram.pMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
        this.shaderProgram.mvMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
        this.shaderProgram.samplerUniform = this.gl.getUniformLocation(this.shaderProgram, "uSampler");
    }; 

    this.handleLoadedTexture = function(texture) {
        
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.enable(this.gl.BLEND);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        
        // Set the parameters so we can render any size image.
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        
        // Upload the image into the texture.
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, texture.image);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);    
        
    };

    this.setMatrixUniforms = function() {
      this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
      this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
    };


    this.mvPushMatrix = function() {
        var copy = mat4.create();
        mat4.set(this.mvMatrix, copy);
        this.mvMatrixStack.push(copy);
    };
    
    this.mvPopMatrix = function() {
        if (this.mvMatrixStack.length == 0) {
            throw "Invalid popMatrix!";
        }
        this.mvMatrix = this.mvMatrixStack.pop();
    };

    this.drawScene = function() {
        this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    
        mat4.perspective(45, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 100.0, this.pMatrix);
    
        mat4.identity(this.mvMatrix);
    
        mat4.translate(this.mvMatrix, [this.x, this.y, this.z]);
        
    }
    
    this.animate = function() {
      /*
        var timeNow = new Date().getTime();
        if (this.lastTime != 0) {
            var elapsed = timeNow - this.lastTime;
    
            //xRot += (xSpeed * elapsed) / 1000.0;
            this.xRot = x;
            //yRot += (ySpeed * elapsed) / 1000.0;
            this.yRot = y;
        }
        this.lastTime = timeNow;
        */
    }
    
    
    this.tick = function() {
        this.drawScene();
        this.animate();
        self = this;
        requestAnimFrame(function(){self.tick();});
    }
    
    
    
    this.init = function() {
        var canvas = document.getElementById(this.canvasName);
        this.initGL(canvas);
        this.initShaders();
        
        
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
    
        this.tick();
    }
    
    this.init();
  }
  