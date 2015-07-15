
var level;
function addSquares(a,b) {
   return Math.sqrt(a * a + b * b);
}
function initialSet(){
	gamescore = 0;
	gamestate = true;
	currenttime = 60;
	frame = 0;
	buglist = [];
	bugfadelist = [];
	foodlist = new Array();
	foodlist[0] = new Food((20+Math.random()*360), (300+Math.random()*280));
	foodlist[1] = new Food((20+Math.random()*360), (300+Math.random()*280));
	foodlist[2] = new Food((20+Math.random()*360), (300+Math.random()*280));
	foodlist[3] = new Food((20+Math.random()*360), (300+Math.random()*280));
	foodlist[4] = new Food((20+Math.random()*360), (300+Math.random()*280));
}

function hitBug(event){
	var i = 0;
	
	while(buglist[i]){
		var leftborder = canvas.offsetLeft;
		var topborder = canvas.offsetTop;
		var clickdistance = addSquares(buglist[i].x+10 - (event.pageX-leftborder),buglist[i].y+10 - (event.pageY-topborder));
		
		if (clickdistance<=30){//hit the bug
			gamescore = gamescore + buglist[i].reward;
			score.innerHTML = 'Score: '+ gamescore;
			var length = bugfadelist.push(buglist[i]);
			buglist.splice(i,1);
			bugfadelist[length-1].fade();
		}
		
		i++;
	}
	
}
function updateTimes(){
	canvas.addEventListener("click",hitBug);
	frame++;
	canvasUpdate();
	if (frame%50 == 0){
		timeCounter();
	}
	if (frame%(50*(Math.floor(Math.random() * (4 - 1)) + 1))==0){
		buglist.push(new Bug());
	}
		
}
 function timeOff(){
 	clearInterval(times);
 	canvas.removeEventListener("click", hitBug);	

 }

function gameOver(){
	timeOff();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if ((level == 1)&&(gamescore > localStorage.getItem("highscore1"))){
		localStorage.setItem("highscore1",gamescore);
	}
	else if ((level == 2)&&(gamescore > localStorage.getItem("highscore2"))){
		localStorage.setItem("highscore2",gamescore);
	}

	var r = window.confirm("Your score is "+gamescore+", try again!")
	if (r == true) {
 		reStart();
    } else {
    	clearCanvas();
    }
}
function reStart(){
	canvas.style.display = "none";
	menu.style.display = "none";
	canvasInit();
	initialSet();

}
function clearCanvas(){
	canvas.style.display = "none";
	menu.style.display = "none";
	document.getElementById("startpage").style.display = "block";
	loadScore();
}

function timeCounter(){
    if (currenttime > 0){
 		currenttime--;
 		time.innerHTML=currenttime + " sec";
 	}
    else{
    	gameOver();
     }
 }
function gameStateChange(state){
 	if (this[state] == true){
 		this[state] = false;
 		pausebutton.innerHTML = 'play';
		timeOff();
 	}
 	else if (this[state] == false){
 		this[state] = true;
 		pausebutton.innerHTML = 'pause';
 		times = setInterval("updateTimes()",20);
		
 	}
 }
function Food(x, y){
	this.x =  x;
	this.y = y;
}

function Bug(){
	
	var speciesNum = Math.floor(Math.random() * (11 - 1)) + 1; //min include, max exclude
	this.x = Math.floor(Math.random() * (391 - 10)) + 10;
	this.y = 0;
	this.targetindex = 6;
	this.update = update;
	this.direction = direction;
	this.fadetime = 0;
	this.fade = fade;
	if (speciesNum <= 3){//123
		this.species = 'black';
		this.imageurl = 'https://cdn2.iconfinder.com/data/icons/windows-8-metro-style/512/bug.png';
		this.speed1 = 150;
		this.speed2 = 200;
		this.reward = 5;
	}
	else if ((speciesNum >= 4)&&(speciesNum<=6)){//456
		this.species = 'red';
		this.imageurl = 'http://lifegoo.pluskid.org/wp-content/uploads/2008/05/bug.png';
		this.speed1 = 75;
		this.speed2 = 100;
		this.reward = 3;

	}
	else if (speciesNum >= 7){//78910
		this.species = 'orange';
		this.imageurl = 'http://icons.iconarchive.com/icons/umut-pulat/tulliana-2/128/bug-icon.png';
		this.speed1 = 60;
		this.speed2 = 80;
		this.reward = 1;
	}

	function direction(){
		
		var i = 0;
		var targetindex = 0;
		var targetdistance = Math.sqrt(400 *400 + 600 *600);
		var fooddistance = [];
		var theta = 0;
		while(foodlist[i]){

			fooddistance[i] = addSquares(this.x - foodlist[i].x,this.y - foodlist[i].y);
			if (fooddistance[i] < targetdistance){
				targetdistance = fooddistance[i];
				targetindex = i;
			}
			i++;
		}
		this.targetindex = targetindex;
		if (foodlist[targetindex].y >= this.y){
			theta = Math.PI + Math.atan((this.x - foodlist[targetindex].x)/(foodlist[targetindex].y - this.y));
		}
		else{
			theta = Math.atan((foodlist[targetindex].x - this.x)/(this.y - foodlist[targetindex].y));
		}
		return theta;//angle from canvas -y direction
	}
	function update(){
		var speed = 0;
		if (level == 1){
			speed = this.speed1;
		}
		else{
			speed = this.speed2;
		}
		this.x = this.x + speed * 20 / 1000 * Math.sin(this.direction());
		this.y = this.y - speed * 20 / 1000 * Math.cos(this.direction());
	}
	function fade(){
		this.fadetime = currenttime;
	}

}
function loadScore(){
	if (level == 1){
		if (localStorage.getItem("highscore1")==null){
			localStorage.setItem("highscore1",0);
		}
		document.getElementById("highscore").innerHTML = "High score: "+ localStorage.getItem("highscore1");
	}
	else{
		if (localStorage.getItem("highscore2")==null){
			localStorage.setItem("highscore2",0);
		}
		document.getElementById("highscore").innerHTML = "High score: "+ localStorage.getItem("highscore2");
	}
}
function loadLevel(){
	var i = 0;
	var radios = document.getElementsByName("level");
	for(i = 0; i < radios.length; i++){
	    if(radios[i].checked){
	        level = radios[i].value;
	    }
	}
}
function canvasInit(){
	document.getElementById("startpage").style.display = "none";
//////////////////
//////menu////////
//////////////////
	menu = document.createElement("div");
	menu.style.width ="378px";
	menu.style.height = "20px";
	menu.style.background = "url('http://c1.staticflickr.com/1/366/18465171399_f57a9ecba4_c.jpg')"
	menu.style.padding="15px";
	menu.style.fontSize = "20px";

	time =document.createElement("div");
	time.innerHTML = '60 Sec';
	time.style.padding="10px";
	time.style.display = 'inline';
	menu.appendChild(time);
	
	pause = document.createElement("div");
	pause.style.width="240px";
	pause.style.align="center";
	pause.style.padding="0px 60px"
	pause.style.display = 'inline';
	pausebutton = document.createElement('button');
	pausebutton.innerHTML = 'pause';
	pausebutton.onclick = function(){
		gameStateChange("gamestate");
	};
	pausebutton.innerHTML = 'pause';
	pausebutton.style.width="80px";
	pausebutton.style.fontSize ="18px";
	pause.appendChild(pausebutton);
	menu.appendChild(pause);


    score = document.createElement("div");
	score.style.width="70px";
	score.style.align="right";
	score.style.padding="10px";
	score.style.display = 'inline';
	score.innerHTML = 'Score: 0';
    menu.appendChild(score);

	document.body.appendChild(menu);

	canvas = document.createElement('canvas');
	canvas.width = "400";
    canvas.height = "600";
    canvas.style.border ="4px solid YellowGreen ";
	document.body.appendChild(canvas);
	ctx = canvas.getContext("2d");

	times = setInterval("updateTimes()",20);
}
/////////////////////////////////////////////////////////
///canvas update every 20ms//////////////////////////////
/////////////////////////////////////////////////////////
function canvasUpdate(){
	if (!foodlist.length){
		gameOver();
	}
	else{
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawFood();
		drawBug();
		drawFadeBug();
	}
}
function drawFadeBug(){
	var i = 0;
	while(bugfadelist[i]){
		if (bugfadelist[i].fadetime - currenttime >= 2){
			bugfadelist.splice(i,1);
		}
		var bugImg = new Image();
		bugImg.src = bugfadelist[i].imageurl;
		ctx.globalAlpha = 0.4;
		ctx.translate(bugfadelist[i].x+10,bugfadelist[i].y+10);
		ctx.rotate(bugfadelist[i].direction());
		ctx.drawImage(bugImg, 0, 0,20,20);
		ctx.rotate(-bugfadelist[i].direction());
		ctx.translate(-(bugfadelist[i].x+10),-(bugfadelist[i].y+10));
		ctx.globalAlpha = 1;
		i++;
	}
}
function drawBug(){
	var i = 0;
	while(buglist[i]){
	
		buglist[i].update();
		var targetindex = buglist[i].targetindex;
		var targetdistance = addSquares(foodlist[targetindex].x - buglist[i].x,foodlist[targetindex].y - buglist[i].y);

		if (targetdistance < 10 ){
			foodlist.splice(buglist[i].targetindex, 1);
		}
		var bugImg = new Image();
		bugImg.src = buglist[i].imageurl;
		ctx.translate(buglist[i].x+10,buglist[i].y+10);
		ctx.rotate(buglist[i].direction());
		ctx.drawImage(bugImg, 0, 0,20,20);
		ctx.rotate(-buglist[i].direction());
		ctx.translate(-(buglist[i].x+10),-(buglist[i].y+10));
		i++;
	}
}
function drawFood(){
	var foodImg = new Image();
	foodImg.src = 'http://pngimg.com/upload/apple_PNG4731.png';
	//foodImg.src = 'http://i268.photobucket.com/albums/jj6/SK_CRISIS/Emblem%20BG%20PNGs/Circle.png';
	var i = 0;
	while(foodlist[i]){
		ctx.drawImage(foodImg, foodlist[i].x, foodlist[i].y,20,20);
		i++;
	}		
}





