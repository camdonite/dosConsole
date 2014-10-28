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


canvas.addEventListener('click', function(){
	text.locate(7, 1);
	text.bgColor(6);
	text.fgColor(3);
	text.print("Hello, My name is Chase.\nI like beans.");
	text.debug();
});













