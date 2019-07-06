//Tank object
function Tank(plr=false,hp=50,dmg=10,speed=1,x=Math.floor(Math.random()*(rt.canvas.c.width-50)),y=Math.floor(Math.random()*(rt.canvas.c.width-50)),size=1){
	this.colors = (plr)?'green':'darkred';
	this.hp = hp;
	this.maxHp = hp;
	this.pHp=this.hp/this.maxHp;
	this.x = x;
	this.y = y;
	this.scale = size;
	this.height = rt.canvas.c.width/30*this.scale;
	this.width = rt.canvas.c.width/20*this.scale;
	this.vx=0;
	this.vy=0;
	this.reload=false;
	this.reloadTime = 1000;
	this.speed=rt.canvas.c.width/600*speed;
	this.barrelY=rt.canvas.c.width/150*this.scale;
	this.barrelX=rt.canvas.c.width/33*this.scale;
	this.dmg=dmg;
	this.randomizer;
	this.bVel=rt.canvas.c.width/200;
	this.AI_FIELD=rt.canvas.c.width/6;
	this.AI_DANGER=rt.canvas.c.width/3;
	this.plr = plr;
	this.direction = 'UP';
	this.AI = function(target){
		// rt.canvas.draw.rect(this.x-this.AI_FIELD,this.y-this.AI_FIELD,this.AI_FIELD*2+this.width,this.AI_FIELD*2+this.width);
		// rt.canvas.draw.stroke();
		if(this.reload != true){
			if(target.x+target.width>=this.x-this.AI_FIELD &&
			   target.x<=this.x+this.width+this.AI_FIELD &&
			   target.y+target.width>=this.y-this.AI_FIELD&&
			   target.y<=this.y+this.width+this.AI_FIELD){
				   if(this.y > target.y){
					   this.direction = 'UP';
					   this.tankController();
					   this.updateTank();
				   }
				   if(this.y < target.y){
					   this.direction = 'DOWN';
					   this.tankController();
					   this.updateTank();
				   }
				   if(this.y>=target.y && this.y<=target.y+target.width){
					   if(this.x+this.width<target.x){
						   this.direction='RIGHT';
						   this.tankController();
						   this.shoot()
					   }
					   if(this.x > target.x+target.width){
						   this.direction='LEFT';
						   this.tankController();
						   this.shoot();
					   }
				   }
			   }//if in the zone
			else if(target.x+target.width>=this.x-this.AI_DANGER &&
			   target.x<=this.x+this.width+this.AI_DANGER &&
			   target.y+target.width>=this.y-this.AI_DANGER&&
			   target.y<=this.y+this.width+this.AI_DANGER){
				if(this.x>target.x){
					this.direction = 'LEFT';
					this.tankController();
					this.updateTank();
				}
				if(this.x<target.x){
					this.direction = 'RIGHT';
					this.tankController();
					this.updateTank();
				}
				if(this.x>=target.x && this.x <= target.x+target.height){
					if(this.y+this.height>target.y){
						this.direction = 'UP';
						this.tankController();
						this.shoot();
					}
					if(this.y < target.y-target.height){
						this.direction = 'DOWN';
						this.tankController();
						this.shoot();
					}
				}
			}
			else{
				if(rt.canvas.counter == 1){
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
		rt.canvas.draw.fillStyle="red";
		rt.canvas.draw.fillRect(this.x+this.height/4,this.y+rt.canvas.c.width/100,this.height/2,rt.canvas.c.width/100);
		rt.canvas.draw.fillStyle="lightgreen";
		rt.canvas.draw.fillRect(this.x+this.height/4,this.y+rt.canvas.c.width/100,(this.height/2)*this.pHp,rt.canvas.c.width/100);
	}
	this.checkCollision = function(){ //for perks too ~
		for(let i = 0;i<=data.projList.length-1;i++){
			if(this.direction=='RIGHT' || this.direction=='LEFT'){
				if(data.projList[i].x>this.x && data.projList[i].x<this.x+this.width
				&& data.projList[i].y>this.y && data.projList[i].y<this.y+this.height){
					if(data.projList[i].friendly != this.plr){
						console.log(`HIT! for ${data.projList[i].dmg} damage!`);
						this.hp-=data.projList[i].dmg;
						data.projList.splice(i,1);
					}
				}
			}
			else if(this.direction=='UP' || this.direction=='DOWN'){
				if(data.projList[i].x>this.x && data.projList[i].x<this.x+this.height
				&& data.projList[i].y>this.y && data.projList[i].y<this.y+this.width){
					if(data.projList[i].friendly != this.plr){
						console.log(`HIT! for ${data.projList[i].dmg} damage!`);
						this.hp-=data.projList[i].dmg;
						data.projList.splice(i,1);
					}
				}
			}
			else{
				console.log('Error 404 - direction not found');
			}
		}
		for(let i = 0;i<=data.perkList.length-1;i++){
			if(this.direction=='RIGHT' || this.direction=='LEFT'){
				if(data.perkList[i].x>this.x && data.perkList[i].x<this.x+this.width
				&& data.perkList[i].y+data.perkList[i].size>this.y && data.perkList[i].y<this.y+this.height){
					this.giveUpgrade(data.perkList[i].type);
					data.perkList.splice(i,1);
				}
			}
			else if(this.direction=='UP' || this.direction=='DOWN'){
				if(data.perkList[i].x+data.perkList[i].size>this.x && data.perkList[i].x<this.x+this.height
				&& data.perkList[i].y>this.y && data.perkList[i].y<this.y+this.width){
					this.giveUpgrade(data.perkList[i].type);
					data.perkList.splice(i,1);
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
		rt.canvas.draw.fillStyle = this.colors;
		switch(this.direction){
			case 'LEFT':
				rt.canvas.draw.fillRect(this.x,this.y,this.width,this.height);
				rt.canvas.draw.fillRect(this.x-this.barrelX,this.y+this.height/2-this.barrelY/2,this.barrelX,this.barrelY);
				break;
			case 'UP':
				rt.canvas.draw.fillRect(this.x,this.y,this.height,this.width);
				rt.canvas.draw.fillRect(this.x+this.height/2-this.barrelY/2,this.y-this.barrelX,this.barrelY,this.barrelX);
				break;
			case 'RIGHT':
				rt.canvas.draw.fillRect(this.x,this.y,this.width,this.height);
				rt.canvas.draw.fillRect(this.x+this.width,this.y+this.height/2-this.barrelY/2,this.barrelX,this.barrelY);
				break;
			case 'DOWN':
				rt.canvas.draw.fillRect(this.x,this.y,this.height,this.width);
				rt.canvas.draw.fillRect(this.x+this.height/2-this.barrelY/2,this.y+this.width,this.barrelY,this.barrelX);
				break;
			default:
				break;
		}
	}
	this.shoot = function(){
		if(this.reload==false){
			console.log("SPACEBAR!");
			this.reload=true;
			data.projList[data.projList.length] = new bullet(this.plr,this.direction,this.dmg,this.bVel,this.x,this.y,this.width,this.height);
			setTimeout(()=> {this.reload=false;},this.reloadTime);
		}
	}
	this.tankController = function(){ //-!
		if(this.plr){
			switch(rt.canvas.key){
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
		if(this.x+this.width >= rt.canvas.c.width){ //RIGHT border
			this.x=rt.canvas.c.width-this.width;
		}
		if(this.y+this.height >= rt.canvas.c.height){ //DOWN border
			this.y=rt.canvas.c.height-this.height;
		}
		if(this.x<=0){ // LEFT
			this.x=0;
		}
		if(this.y<=0){ // UP
			this.y=0;
		}
	}
	//All In One
	this.AIO = function(){
		if(!this.plr){
			this.AI(data.player);
		}else{
			this.tankController();
			this.updateTank();	
		}
		this.checkCollision();
		this.collisionBorder();


	}
}


