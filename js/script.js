/* Author: 

*/
canvas = document.getElementById("main");
text = new dosText(canvas);
text.screenColor(1);
console.log("return char:" + ("\n".charAt(0)));

//text.bgColor(0);
text.print("Hello, My name is Chase. I like beans.");
text.locate(2, 70);
text.print("Hello, My name is Chase. I like beans.");
text.locate(5, 1);
text.bgColor(5);
text.print("Hello, My name is Chase.\nI like beans.");
//text.putChar("H", 3, 3);
text.putChar(145, 3, 1);
var n = 1;
for (var i = 1; i <= 30; i ++){
	n = ((n == 1) ? 2 : 1);
	for (var j = 1; j <= 80; j++){
		text.putChar(n, i, j);
		n = ((n == 1) ? 2 : 1);
	}
}

canvas.addEventListener('click', function(){
	text.locate(29, 1);
	text.bgColor(6);
	text.fgColor(3);
	text.print("Hello, My name is Chase.\nI like beans.");
	text.print("Hello, My name is Chase.\nI like beans.");
});













