function bullet(friendly,dir,damage,velocity,x,y,width,height){
	this.friendly = friendly;
	this.direction=dir;
	this.dmg=damage;
	this.vel=velocity;
	this.vx=(this.direction=='LEFT')?-this.vel:((this.direction=="RIGHT")?this.vel:0);
	this.vy=(this.direction=='UP')?-this.vel:((this.direction=="DOWN")?this.vel:0);
	this.tw=width;
	this.th=height;
	this.dieTime=rt.canvas.c.width/(this.vel*2);
	this.birthTime=0;
	this.bh=rt.canvas.c.width/300;
	this.bw=rt.canvas.c.width/100;

	this.x=(this.direction=='LEFT') ? x-this.bw : ((this.direction=="RIGHT") ? x+this.tw : x+this.th/2-this.bh/2);//nozzle of tank position so x is normal
	
	this.y=(this.direction=='UP') ? y-this.bw : ((this.direction=="DOWN") ? y+this.tw : y+this.th/2-this.bh/2); //normalize y
	
	this.update=function(){
		this.x+=this.vx;
		this.y+=this.vy;
		this.birthTime++;
	}
	this.drawBullet = function(){
		rt.canvas.draw.fillStyle = "black";
		switch(this.direction){
			case 'LEFT':
				rt.canvas.draw.fillRect(this.x,this.y,this.bw,this.bh);
				break;
			case 'UP':
				rt.canvas.draw.fillRect(this.x,this.y,this.bh,this.bw);
				break;
			case 'RIGHT':
				rt.canvas.draw.fillRect(this.x,this.y,this.bw,this.bh);
				break;
			case 'DOWN':
				rt.canvas.draw.fillRect(this.x,this.y,this.bh,this.bw);
				break;
			default:
				break;
		}
	}
}