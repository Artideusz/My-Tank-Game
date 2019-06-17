function Perk (type=Math.floor(Math.random()*7),x=Math.floor(Math.random()*(canvasObj.width-50)),y=Math.floor(Math.random()*(canvasObj.width-50)))
{
	this.x = x;
	this.y = y;
	this.type = type;
	this.clr = ['red','lightgreen','yellow','gray','black','purple','cyan'];
	this.size = canvasObj.width/60;
	this.draw = function(){
		canvasObj.draw.fillStyle = this.clr[this.type];
		canvasObj.draw.fillRect(this.x,this.y,this.size,this.size);
	}	
}