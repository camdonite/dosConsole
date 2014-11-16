/**
 * @author Chase
 */

'use strict';

function dosText(element, w, h, r, c){
	var throwError = true;
	//"constants"
	var spritePath = "ascii.png";
	var charHeight = 16;
	var charWidth = 8;
	var charsPerRow = 32;
	var totalChars = 256;
	var chars = new Array(totalChars);
	
	var space = 32;
	var privateFgColor = 7;
	var privateBgColor = 0;
	var privateScreenColor = 0;
	var textColors = 
	//                  Red Green Blue
		{   black:     [0  , 0  , 0  ], 0:  [0  , 0  , 0  ],
			blue:      [0  , 0  , 128], 1:  [0  , 0  , 128],
			green:     [0  , 128, 0  ], 2:  [0  , 128, 0  ],
			cyan:      [0  , 128, 128], 3:  [0  , 128, 128],
			red:       [128, 0  , 128], 4:  [128, 0  , 128],
			magenta:   [128, 0  , 128], 5:  [128, 0  , 128],
			yellow:    [128, 128, 0  ], 6:  [128, 128, 0  ],
			white:     [128, 128, 128], 7:  [128, 128, 128],
			gray:      [64 , 64 , 64 ], 8:  [64 , 64 , 64 ],
			HTblue:    [0  , 0  , 255], 9:  [0  , 0  , 255],
			HTgreen:   [0  , 255, 0  ], 10: [0  , 255, 0  ],
			HTcyan:    [0  , 255, 255], 11: [0  , 255, 255],
			HTred:     [255, 0  , 0  ], 12: [255, 0  , 0  ],
			HTmagenta: [255, 0  , 255], 13: [255, 0  , 255],
			HTyellow:  [255, 255, 0  ], 14: [255, 255, 0  ],
			HTwhite:   [255, 255, 255], 15: [255, 255, 255]
		};
		
	var textColorValues = [
		"black",
		"blue",
		"green",
		"cyan",
		"red",
		"magenta",
		"yellow"
	];
	
	//dos terminal defaults, if parameters not givin
	var width = (w ? w : 640);
	var height = (h ? h : 480);
	var rows = (r ? r : 30);
	var cols = (c ? c : 80);
	
	var posCol = 1;
	var posRow = 1;
	
	var isImageLoaded = false;
	
	if (!element) {
		throw new error("don't know where to put it,\nplease provide an element");
	}
	//var tempCanvas;
	var canvas;
	if (element.tagName.toLowerCase() == "canvas"){
		canvas = element;
	} else {
		canvas = document.createElement("canvas");
		element.appendChild(canvas);
	}
	canvas.width = width;
	canvas.height = height;
	
	var ctx = canvas.getContext("2d");
	
	var sprite = new Image();
	
	var screenBuffer;
	var colorBuffer;
	var me; //Use me in call back functions!
	
	function colorStyle(color){
		return 'rgb(' + textColors[color][0] + ',' + textColors[color][1] + ',' + textColors[color][2] + ')';
	}
	
	
	this.putChar = function(character, row, col, color, bgColor){
		if (!row) {
			renderChar(character, posRow, posCol);
		} else {
			renderChar(character, row, col, color, bgColor);
		}
	};
	
	//TODO: get rid of args checks?
	function renderChar(character, row, col, color, bgColor){
		if((row < 1) || (row > rows) || (col < 1) || (col > cols) || (character < 0) || (character > totalChars)) {
			//something out of bounds
			if (throwError) {
				throw new Error("Index out of bounds");
			} else {
				return;
			}
		}
		color = (color ? color : privateFgColor);
		bgColor = (bgColor ? bgColor : privateBgColor);

		//TODO: Force character to be a number?		
		if (typeof(character) == "string"){
			character = character.charCodeAt(0);
		}
		var screenRow = row - 1;
		var screenCol = col - 1;
		var xStart = screenCol * charWidth;
		var yStart = screenRow * charHeight;
		screenBuffer[row][col] = character;
		if (!isImageLoaded) return;

		ctx.fillStyle = colorStyle(bgColor);
		
		ctx.fillRect(xStart, yStart, //output start
			charWidth, charHeight);
		//ctx.fill();
		
		ctx.fillStyle = colorStyle(color);
		var curChar = chars[character];
		for (var i = 0; i < curChar.length; i ++){
			var curRow = curChar[i];
			for (var j = 0; j < curRow.length; j ++){
				if (curRow[j]) {
					ctx.fillRect(xStart + j, yStart + i, 1, 1);
				}
			}
		}
	}
	
	function newRow(){
		//character = (character ? character : space);
			var row = new Array(cols + 1);
			for (var j = 1; j <= cols; j ++){
				row[j] = space;
			}
			return row;		
	}
	
	function newColorRow(){
			var rowColors = new Array(cols + 1);
			for (var j = 1; j <= cols; j ++){
				rowColors[j] = textColors[privateScreenColor];
			}
			return rowColors;			
	}

	/**
	 * Creates empty 2D screenBuffer array
	 */
	function initScreenBuffer(){
		screenBuffer = new Array(rows + 1);
		colorBuffer = new Array(rows + 1);
		for (var i = 1; i <= rows; i ++){
			screenBuffer[i] = newRow();
			colorBuffer[i] = newColorRow();
		}
	}
	/**
	 * redraws everthing on the screen
	 */
	this.refreshScreen = function(){
		for (var i = 1; i <= rows; i ++){
			for (var j = 1; j <= cols; j ++){
				renderChar(screenBuffer[i][j], i, j);
			}
		}
	};
	
	/**
	 * Callback when the image loads
	 */
	function imageDidLoad(){

		//create invisible canvas in order to transfer image data
		var tempCanvas = document.createElement("canvas");
		tempCanvas.width = sprite.width;
		tempCanvas.height = sprite.height;
		element.appendChild(tempCanvas);
		tempCanvas.style.background = 'rgb(0,0,0)';
		var tempCtx = tempCanvas.getContext('2d');
		
		//draw the image
		tempCtx.drawImage(sprite, 0, 0);
		var spriteImgData = tempCtx.getImageData(0, 0, sprite.width, sprite.height);
		var spriteData = spriteImgData.data;

		for (var i = 0; i < totalChars; i ++){
			var character = new Array(charHeight);
			var sourceRow = Math.floor(i / charsPerRow);// * charHeight;
			var sourceCol = Math.floor(i % charsPerRow);// * charWidth;
			//var pixelsPerRow = (charsPerRow * charWidth);
			var pixelsPerRow = spriteImgData.width;//TODO: Put this where pixelsPerRow is used
			
			var sourceStartIndex = (pixelsPerRow * (sourceRow * charHeight)) + (sourceCol * charWidth);
			var pixelRowOffset = sourceStartIndex;
			for (var j = 0; j < charHeight; j ++){
				var curRow = new Array(charWidth);//TODO: Maybe change this to uint8array? Or change to 1D array
				for (var k = 0; k < charWidth; k ++){
					curRow[k] = (spriteData[(/*sourceStartIndex + */pixelRowOffset + k) * 4] < 128) ? 0 : 1;
				}
				character[j] = curRow;
				pixelRowOffset += pixelsPerRow;
			}
			chars[i] = character;
		}
		
		isImageLoaded = true;
		me.refreshScreen();
	}
	
	this.loadSprite = function(fileName){
		spritePath = (fileName ? fileName : spritePath);
		sprite.src = spritePath;
		isImageLoaded = false;

		me = this;
		sprite.addEventListener('load', imageDidLoad);
	};
	
	this.carriageReturn = function(){
		posCol = 1;
		posRow ++;
		if (posRow > rows) {
			//bump screen
			for (var i = 1; i < rows; i ++){
				screenBuffer[i - 1] = screenBuffer[i];
				colorBuffer[i - 1] = colorBuffer[i];
			}
			screenBuffer[rows] = newRow();
			colorBuffer[rows] = newColorRow();
			posRow = rows;
			//me.refreshScreen(); //too slow
			var imgData = ctx.getImageData(0, charHeight, width, (charHeight * (rows - 1)));
			ctx.putImageData(imgData, 0, 0);
			
			ctx.fillStyle=colorStyle(privateScreenColor);
			ctx.fillRect(0, (charHeight * (rows - 1)), width, charHeight);
		}
	};
	
	this.print = function(text) {
		if (typeof text == "number"){
			text = "" + text;
		}
		for (var i = 0; i < text.length; i ++){
			var curChar = text.charAt(i);
			
			if (curChar == "\n" || curChar == "\r"){
				me.carriageReturn();
			} else {
				if (posCol > cols) {
					me.carriageReturn();
				}
				renderChar(curChar, posRow, posCol);
				posCol ++;
			}
			
		}
	};
	
	this.println = function(text) {
		this.print(text);
		this.carriageReturn();
	};
	
	this.locate = function(row, col){
		if ((row < 1) || (row > rows) || (col < 1) || (col > cols)) {
			throw new Error("Position outside of bounds");
		}
		posRow = row;
		posCol = col;
	};
	
	this.bgColor = function(color){
		privateBgColor = color;
		
	};
	
	this.screenColor = function(color){
		privateScreenColor = color;
		canvas.style.background = colorStyle(color);
	};
	
	this.fgColor = function(color){
		privateFgColor = color;
	};
	
	this.debug = function(){
		var tempCtx = canvas.getContext('2d');
		spriteData = tempCtx.getImageData(0, 0, width, height).data;
	};
	
	me = this;
	//this.bgColor(privateBgColor);
	initScreenBuffer();
	this.loadSprite();
	//var img2 = sprite.getImageData(0, 0, 8, 16);
}
