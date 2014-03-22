function CanvasEx(args) {
	args = args || {};

	var _width = 0,
		_height = 0,
		_parentId = null,
		_canvas = null,
		_context = null;

	var canvasElement = document.createElement("canvas");


	Object.defineProperty(this, "width", {
		set: function(value){
			if(!isFinite(value))
				throw "Setting non-finite value to width: "+value;

			if(value <= 0)
				throw "Setting value <= 0 to width is invalid";

			_width = value;
			canvasElement.width = _width;

		},

		get: function(){
			return _width;
		}
	});

	Object.defineProperty(this, "height", {
		set: function(value){
			if(!isFinite(value))
				throw "Setting non-finite value to height: "+value;

			if(value <= 0)
				throw "Setting value <= 0 to width is invalid";

			_height = value;
			canvasElement.height = _height;
		},

		get: function(){
			return _height;
		}
	});

	Object.defineProperty(this, "css_width", {
		set: function(value){
			if(!isFinite(value))
				throw "Setting non-finite value to width: "+value;

			if(value <= 0)
				throw "Setting value <= 0 to width is invalid";

			canvasElement.style.width = value;

		},

		get: function(){
			return parseInt(canvasElement.style.width);
		}
	});

	Object.defineProperty(this, "css_height", {
		set: function(value){
			if(!isFinite(value))
				throw "Setting non-finite value to height: "+value;

			if(value <= 0)
				throw "Setting value <= 0 to width is invalid";

			canvasElement.style.height = value;
		},

		get: function(){
			return parseInt(canvasElement.style.height);
		}
	});

	Object.defineProperty(this, "canvas", {
		get: function(){
			return canvasElement;
		}
	});

	Object.defineProperty(this, "context", {
		get: function(){
			return _context;
		}
	});


	this.attach = function(parentId){
		var parent = document.getElementById(parentId);
		parent.appendChild(canvasElement);
	}

	this.width = args.width || 1;
	this.height = args.height || 1;

	var ratio = this.width/this.height;

	var self = this;
	window.addEventListener("resize", function(evt){
		self.css_width = parseInt(window.innerWidth);
		self.css_height = self.css_width/(ratio);
	});

	_context = canvasElement.getContext("webgl");

}