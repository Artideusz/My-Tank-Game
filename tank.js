//Tank object
function Tank(colors,plr=false,hp=50,dmg=0,speed=0,x=Math.floor(Math.random()*(canvasObj.width-50)),y=Math.floor(Math.random()*(canvasObj.width-50)),size=1){
	this.colors = colors;
	this.hp = hp;
	this.maxHp = hp;
	this.pHp=1;
	this.x = x;
	this.y = y;
	this.scale = size;
	this.height = canvasObj.width/30*this.scale;
	this.width = canvasObj.width/20*this.scale;
	this.vx=0;
	this.vy=0;
	this.reload=false;
	this.reloadTime = 1000;
	this.speed=canvasObj.width/600*speed;
	this.barrelY=canvasObj.width/150*this.scale;
	this.barrelX=canvasObj.width/33*this.scale;
	this.dmg=dmg;
	this.randomizer;
	this.bVel=canvasObj.width/40;
	this.AI_FIELD=canvasObj.width/6;
	this.AI_DANGER=canvasObj.width/3;
	this.plr = plr;
	this.direction = 'UP';
	this.AI = function(){
		// canvasObj.draw.rect(this.x-this.AI_FIELD,this.y-this.AI_FIELD,this.AI_FIELD*2+this.width,this.AI_FIELD*2+this.width);
		// canvasObj.draw.stroke();
		if(this.reload != true){
			if(player.x+player.width>=this.x-this.AI_FIELD &&
			   player.x<=this.x+this.width+this.AI_FIELD &&
			   player.y+player.width>=this.y-this.AI_FIELD&&
			   player.y<=this.y+this.width+this.AI_FIELD){
				   if(this.y > player.y){
					   this.direction = 'UP';
					   this.tankController();
					   this.updateTank();
				   }
				   if(this.y < player.y){
					   this.direction = 'DOWN';
					   this.tankController();
					   this.updateTank();
				   }
				   if(this.y>=player.y && this.y<=player.y+player.width){
					   if(this.x+this.width<player.x){
						   this.direction='RIGHT';
						   this.tankController();
						   this.shoot()
					   }
					   if(this.x > player.x+player.width){
						   this.direction='LEFT';
						   this.tankController();
						   this.shoot();
					   }
				   }
			   }//if in the zone
			else if(player.x+player.width>=this.x-this.AI_DANGER &&
			   player.x<=this.x+this.width+this.AI_DANGER &&
			   player.y+player.width>=this.y-this.AI_DANGER&&
			   player.y<=this.y+this.width+this.AI_DANGER){
				if(this.x>player.x){
					this.direction = 'LEFT';
					this.tankController();
					this.updateTank();
				}
				if(this.x<player.x){
					this.direction = 'RIGHT';
					this.tankController();
					this.updateTank();
				}
				if(this.x>=player.x && this.x <= player.x+player.height){
					if(this.y+this.height>player.y){
						this.direction = 'UP';
						this.tankController();
						this.shoot();
					}
					if(this.y < player.y-player.height){
						this.direction = 'DOWN';
						this.tankController();
						this.shoot();
					}
				}
			}
			else{
				if(canvasObj.counter == 1){
					this.randomizer=Math.floor(Math.random()*1000)+1;
				}
				if(this.randomizer >= 0 && this.randomizer < 200){
					this.direction = 'LEFT';
					this.tankController();
					this.updateTank();
				}
				if(this.randomizer >= 200 && this.randomizer < 400){
					this.direction = 'UP';
					this.tankController();
					this.updateTank();
				}
				if(this.randomizer >= 400 && this.randomizer < 600){
					this.direction = 'RIGHT';
					this.tankController();
					this.updateTank();
				}
				if(this.randomizer >= 600 && this.randomizer < 800){
					this.direction = 'DOWN';
					this.tankController();
					this.updateTank();
				}
			}
		}
	}
	this.updateTank = function(){
		this.x+=this.vx;
		this.y+=this.vy;
	}
	this.drawHP = function(){
		this.pHp = this.hp/this.maxHp;
		canvasObj.draw.fillStyle="red";
		canvasObj.draw.fillRect(this.x+this.height/4,this.y+canvasObj.width/100,this.height/2,canvasObj.width/100);
		canvasObj.draw.fillStyle="lightgreen";
		canvasObj.draw.fillRect(this.x+this.height/4,this.y+canvasObj.width/100,(this.height/2)*this.pHp,canvasObj.width/100);
	}
	this.checkCollision = function(){ //for perks too ~
		for(let i = 0;i<=bulletList.length-1;i++){
			if(this.direction=='RIGHT' || this.direction=='LEFT'){
				if(bulletList[i].x>this.x && bulletList[i].x<this.x+this.width
				&& bulletList[i].y>this.y && bulletList[i].y<this.y+this.height){
					console.log(`HIT! for ${bulletList[i].dmg} damage!`);
					this.hp-=bulletList[i].dmg;
					bulletList.splice(i,1);
				}
			}
			else if(this.direction=='UP' || this.direction=='DOWN'){
				if(bulletList[i].x>this.x && bulletList[i].x<this.x+this.height
				&& bulletList[i].y>this.y && bulletList[i].y<this.y+this.width){
					console.log(`HIT! for ${bulletList[i].dmg} damage!`);
					this.hp-=bulletList[i].dmg;
					bulletList.splice(i,1);
				}
			}
			else{
				console.log('Error 404 - direction not found');
			}
		}
		for(let i = 0;i<=perkList.length-1;i++){
			if(this.direction=='RIGHT' || this.direction=='LEFT'){
				if(perkList[i].x>this.x && perkList[i].x<this.x+this.width
				&& perkList[i].y+perkList[i].size>this.y && perkList[i].y<this.y+this.height){
					this.giveUpgrade(perkList[i].type);
					perkList.splice(i,1);
				}
			}
			else if(this.direction=='UP' || this.direction=='DOWN'){
				if(perkList[i].x+perkList[i].size>this.x && perkList[i].x<this.x+this.height
				&& perkList[i].y>this.y && perkList[i].y<this.y+this.width){
					this.giveUpgrade(perkList[i].type);
					perkList.splice(i,1);
				}
			}
			else{
				console.log('Error 404 - direction not found');
			}
		}
	}
	this.giveUpgrade = function(perktype){
		switch(perktype){
		case 1:
			console.log(`UPGRADE! More Speed`);
			this.speed+=0.2;
			break;
		case 0:
			console.log(`UPGRADE! More Damage`);
			this.dmg+=10;
			break;
		case 2:
			console.log(`UPGRADE! Heal`);
			this.hp+=30;
			if(this.hp>this.maxHp){
				this.hp = this.maxHp;
			}
			break;
		case 3:
			console.log(`UPGRADE! Reload Time`);
			if(this.reloadTime>=300){
			this.reloadTime-=100;
			}
			break;
		case 4:
			console.log(`UPGRADE! DAMAGE BOOST 5 seconds`);
			this.dmg+=50;
			setTimeout(()=>{this.dmg-=50},5000);
			break;
		case 5:
			console.log(`UPGRADE! RELOAD BOOST 5 seconds`);
			if(this.reloadTime >= 600){
				this.reloadTime-=500;
				setTimeout(()=>{this.reloadTime+=500},5000);
			}
			break;
		case 6:
			console.log(`UPGRADE! SPEED BOOST 5 seconds`);
			if(this.speed <= 5){
				this.speed+=3;
				setTimeout(()=>{this.speed-=3},5000);
			}
			break;
		}
	}
	this.drawTank = function(){ //--!
		canvasObj.draw.fillStyle = this.colors;
		switch(this.direction){
			case 'LEFT':
				canvasObj.draw.fillRect(this.x,this.y,this.width,this.height);
				canvasObj.draw.fillRect(this.x-this.barrelX,this.y+this.height/2-this.barrelY/2,this.barrelX,this.barrelY);
				break;
			case 'UP':
				canvasObj.draw.fillRect(this.x,this.y,this.height,this.width);
				canvasObj.draw.fillRect(this.x+this.height/2-this.barrelY/2,this.y-this.barrelX,this.barrelY,this.barrelX);
				break;
			case 'RIGHT':
				canvasObj.draw.fillRect(this.x,this.y,this.width,this.height);
				canvasObj.draw.fillRect(this.x+this.width,this.y+this.height/2-this.barrelY/2,this.barrelX,this.barrelY);
				break;
			case 'DOWN':
				canvasObj.draw.fillRect(this.x,this.y,this.height,this.width);
				canvasObj.draw.fillRect(this.x+this.height/2-this.barrelY/2,this.y+this.width,this.barrelY,this.barrelX);
				break;
			default:
				break;
		}
	}
	this.shoot = function(){
		if(this.reload==false){
			console.log("SPACEBAR!");
			this.reload=true;
			bulletList[bulletList.length] = new bullet(this.direction,this.dmg,this.bVel,this.x,this.y,this.width,this.height);
			setTimeout(()=> {this.reload=false;},this.reloadTime);
		}
	}
	this.tankController = function(){ //-!
		if(this.plr){
			switch(canvasObj.key){
				case 37: //left
					this.vx=-this.speed;
					this.vy=0;
					this.direction = 'LEFT';
					break;
				case 38: //up
					this.vy=-this.speed;
					this.vx=0;
					this.direction = 'UP';
					break;
				case 39: //right
					this.vx=this.speed;
					this.vy=0;
					this.direction = 'RIGHT';
					break;
				case 40: //down
					this.vy=this.speed;
					this.vx=0;
					this.direction = 'DOWN';
					break;
				case 32:
					this.shoot();
					break;
				default:
					this.vx=0;
					this.vy=0;
					break;
			}
		}
		else{
			switch(this.direction){
				case 'LEFT':
					this.vx=-this.speed;
					this.vy=0;
					break;
				case 'UP':
					this.vy=-this.speed;
					this.vx=0;
					break;
				case 'RIGHT':
					this.vx=this.speed;
					this.vy=0;
					break;
				case 'DOWN':
					this.vy=this.speed;
					this.vx=0;
					break;
				default:
					break;
			}
		}
	}
	this.collisionBorder = function(){
		if(this.x+this.width >= canvasObj.width){ //RIGHT border
			this.x=canvasObj.width-this.width;
		}
		if(this.y+this.height >= canvasObj.height){ //DOWN border
			this.y=canvasObj.height-this.height;
		}
		if(this.x<=0){ // LEFT
			this.x=0;
		}
		if(this.y<=0){ // UP
			this.y=0;
		}
	}
}


function bullet(dir,damage,velocity,x,y,width,height){
	this.direction=dir;
	this.dmg=damage;
	this.vel=velocity;
	this.vx=(this.direction=='LEFT')?-this.vel:((this.direction=="RIGHT")?this.vel:0);
	this.vy=(this.direction=='UP')?-this.vel:((this.direction=="DOWN")?this.vel:0);
	this.tw=width;
	this.th=height;
	this.dieTime=this.vel;
	this.birthTime=0;
	this.bh=canvasObj.width/300;
	this.bw=canvasObj.width/100;

	this.x=(this.direction=='LEFT') ? x-this.bw : ((this.direction=="RIGHT") ? x+this.tw : x+this.th/2-this.bh/2);//nozzle of tank position so x is normal
	
	this.y=(this.direction=='UP') ? y-this.bw : ((this.direction=="DOWN") ? y+this.tw : y+this.th/2-this.bh/2); //normalize y
	
	this.update=function(){
		this.x+=this.vx;
		this.y+=this.vy;
		this.birthTime++;
	}
	this.drawBullet = function(){
		canvasObj.draw.fillStyle = "black";
		switch(this.direction){
			case 'LEFT':
				canvasObj.draw.fillRect(this.x,this.y,this.bw,this.bh);
				break;
			case 'UP':
				canvasObj.draw.fillRect(this.x,this.y,this.bh,this.bw);
				break;
			case 'RIGHT':
				canvasObj.draw.fillRect(this.x,this.y,this.bw,this.bh);
				break;
			case 'DOWN':
				canvasObj.draw.fillRect(this.x,this.y,this.bh,this.bw);
				break;
			default:
				break;
		}
	}
}