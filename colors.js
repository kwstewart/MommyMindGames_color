COLORGAME = (function(){
  var colorGame = {};
  
  // Use HTML or WebGL mode
  colorGame.drawMode = "HTML";
  
  
  function initColors() {
    
    colorGame.colors = {};
    
    // WebGL colors
    colorGame.colors.WebGL = {};
    colorGame.colors.WebGL.red = [1,0,0,1];
    colorGame.colors.WebGL.green = [0,1,0,1];
    colorGame.colors.WebGL.blue = [0,0,1,1];
    colorGame.colors.WebGL.yellow = [1,1,0,1];
    colorGame.colors.WebGL.cyan = [0,1,1,1];
    colorGame.colors.WebGL.magenta = [1,0,1,1];
    
    // HTML colors
    colorGame.colors.HTML= {};
    colorGame.colors.HTML.red = "#F00";
    colorGame.colors.HTML.green = "#0F0";
    colorGame.colors.HTML.blue = "#00F";
    colorGame.colors.HTML.yellow = "#FF0";
    colorGame.colors.HTML.cyan = "#0FF";
    colorGame.colors.HTML.magenta = "#F0F";
  }
  
  
  function pickColor() {
    
    var colorWord = pickRand(colorGame.colors[colorGame.drawMode]);
    var wordColor = pickRand(colorGame.colors[colorGame.drawMode],colorWord)
    
    return {"colorWord":colorWord,"wordColor":wordColor,"hex":colorGame.colors[colorGame.drawMode][wordColor]};
    
  }
  
  function pickRand(obj, notProp) {
        var result;
        var count = 0;
        var rand = Math.random();   // # between 0 and 1
        notProp = notProp || null;
        
        for (var prop in obj) {
          if (rand < 1/++count) 
            result = prop;
        }    
        if(notProp == result) return pickRand(obj, notProp);
        else return result;
  }
  
  colorGame.updateWord = function() {
    
    var word = pickColor();
    if(colorGame.drawMode == "WebGL") {
      
    }
    else if(colorGame.drawMode == "HTML") {
      
      $("#HTML-canvas").css("color", word.hex).html(word.colorWord);
    }
  }
  
  
  
  initColors();
  
  return colorGame;
})();
