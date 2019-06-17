"use strict";

window.onload = ()=>{
	canvasObj.createCanvas();
}
//lets
let player;
let debugMode = false;
let enemyList = []; //enemies
let perkList = [];
let bulletList = []; //friendly bullets
let c = ['green','darkred'];
let sc = [400,600,800];
let scc = 1;
let btns = document.getElementsByTagName('button');
document.body.style.backgroundColor = "#000";
document.getElementById("tankGameName").style.color = "#fff";
let diff = [{amount:0,hp:1000,plrHp:1},{amount:3,hp:50,dmg:5,spd:1,plrHp:200},{amount:5,hp:100,dmg:10,spd:1.5,plrHp:180},{amount:7,hp:150,dmg:15,spd:2,plrHp:150}];

//Canvas -!
const canvasObj = {
	width:600,
	height:600,
	fps:30,
	counter:0,
	sec:0,
	img:null,
	canvas:document.createElement("canvas"),
	createCanvas: function(){
		this.canvas.setAttribute('id','canvas');
		this.canvas.width=this.width;
		this.canvas.height=this.height;
		this.canvas.style="position:absolute;margin:auto;left:0;right:0;top:0;bottom:0;";
		this.canvas.style.border="1px solid black";
		document.body.appendChild(this.canvas);
		this.draw = this.canvas.getContext("2d");
		this.clear();
	},
	menu: function(){
		this.draw.fillStyle="blue";
		this.draw.fillRect(0,0,this.width,this.height);
	},
	startThis: function(){
		fetch('maps/mapList.json')
			.then((response)=>{
				return response.json();
			})
			.then((v)=>{
				this.img = new Image();
				this.img.src = v[`map${Math.floor(Math.random()*Object.keys(v).length)+1}`].mapData.backgroundURL;
				this.draw.drawImage(this.img,0,0);
			}).then(()=>{
				this.interval = setInterval(loop,1000/this.fps);
				window.addEventListener("keydown",(e)=>{canvasObj.key = e.keyCode;});
				window.addEventListener("keyup",(e)=>{canvasObj.key = false;});
			}).catch((err)=>{
				console.log('No map : '+ err.message);
				this.interval = setInterval(loop,1000/this.fps);
				window.addEventListener("keydown",(e)=>{canvasObj.key = e.keyCode;});
				window.addEventListener("keyup",(e)=>{canvasObj.key = false;});
			})

	},
	clear: function(){
		if(!this.img){
			this.draw.fillStyle = "#fff";
			this.draw.fillRect(0,0,this.width,this.height);
		}else{
			this.draw.drawImage(this.img,0,0,this.width,this.height);
		}
	}
}



//Start game - initialize tanks and map
function start(){ // TANK(clr,plr,hp,dmg,spd,x,y,size);
	for(let i = 0;i<btns.length;i++){
		btns[i].style='display:block';
	}
	canvasObj.img=null;
	canvasObj.clear();
}

function start_sp(){
	let p = +prompt("Difficulty 1-3","");
	if(p==null || p==""){
		return start();
	}else if(p==1 || p==2 || p==3 || p==666){
	difficulty(p);
	for(let i = 0;i<btns.length;i++){
		btns[i].style='display:none';
	}
	canvasObj.startThis();
	}else{
		alert("No such difficulty!");
	}
}

function resize(){
	if(scc>=2){
		scc=0;
		canvasObj.width = sc[scc];
		canvasObj.height = sc[scc];
		canvasObj.createCanvas();
		console.log(scc);
	}
	else{
		scc++;
		canvasObj.width = sc[scc];
		canvasObj.height = sc[scc];
		canvasObj.createCanvas();
		console.log(scc);
	}
}

function difficulty(lvl){
	switch(lvl){
		case 3:
			spawn(diff[3]);
			break;
		case 2:
			spawn(diff[2]);
			break;
		case 1:
			spawn(diff[1]);
			break;
		case 666:
			debugMode = true;
			spawn(diff[0]);
		default:
			break;
	}
}

//the game loop
function loop(){
	canvasObj.clear();
	canvasObj.counter++;
	if(canvasObj.counter > canvasObj.fps){ // game counter -- fake interval
		canvasObj.counter=0;
		canvasObj.sec++;
		if(canvasObj.sec >=3){
			canvasObj.sec = 0;
			perkList[perkList.length] = new Perk();
		}
	}
	player.tankController(); // check kbd and ai
	player.updateTank(); //update tanks
	player.collisionBorder(); //check tank collision
	for(let i=0;i<=bulletList.length-1;i++){
		bulletList[i].update();
		bulletList[i].drawBullet();
		if(bulletList[i].birthTime>=bulletList[i].dieTime){
			bulletList.splice(i,1);
		}
	}
	player.checkCollision();
	for(let i=0;i<=enemyList.length-1;i++){
		enemyList[i].checkCollision();
		if(enemyList[i].hp<=0){
			enemyList.splice(i,1);
		}
		else{
			enemyList[i].AI();
			enemyList[i].collisionBorder();
			enemyList[i].drawTank();
			enemyList[i].drawHP();
		}
	}
	for(let i=0;i<perkList.length;i++){
		perkList[i].draw();
	}
	player.drawTank();
	player.drawHP();
	if(!debugMode){
		if(enemyList.length==0){
			clearInterval(canvasObj.interval);
			canvasObj.clear();
			player=null;
			enemyList=[];
			perkList=[];
			alert("You WIN!");
			start();
		}
		else if(player.hp <=0){
			clearInterval(canvasObj.interval);
			canvasObj.clear();
			player=null;
			enemyList=[];
			perkList=[];
			alert("You LOSE!");
			start();
		}
	}
}

function spawn(obj){
	player = new Tank(c[0],true,obj.plrHp,20,2);
	for(let i=0;i<obj.amount;i++){
		enemyList[enemyList.length] = new Tank(c[1],false,obj.hp,obj.dmg,obj.spd);
	}
}

//Debug object

const Debug = {
	hurtMe: function(tank){
		tank.hp-=10;
	},
	changeSpeed: function(tank,spd){
		tank.speed=spd;
	},
	
}