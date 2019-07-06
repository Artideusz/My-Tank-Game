function Perk (type=Math.floor(Math.random()*7),x=Math.floor(Math.random()*(rt.canvas.c.width-50)),y=Math.floor(Math.random()*(rt.canvas.c.width-50)))
{
	this.x = x;
	this.y = y;
	this.type = type;
	this.clr = ['red','lightgreen','yellow','gray','black','purple','cyan'];
	this.size = rt.canvas.c.width/60;
	this.draw = function(){
		rt.canvas.draw.fillStyle = this.clr[this.type];
		rt.canvas.draw.fillRect(this.x,this.y,this.size,this.size);
	}	
}