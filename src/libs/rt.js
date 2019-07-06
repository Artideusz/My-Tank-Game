const rt = {
	//Browser inner width
	scrW : window.innerWidth,
	//Browser inner height
	scrH : window.innerHeight,
	//Maths object
	math : {
		//Adds all arguments together and returns value
		add : (...nums)=>{
			return nums.reduce((total,cur)=>{return total+cur});
		},
		//Subtracts first argument from the rest
		sub : function(main,...subt){
			return main - this.add(...subt);
		},
		//Returns distance between 2 objects
		dist : (a,b)=>{
			return Math.sqrt(Math.pow(Math.abs(a.x - b.x),2)+Math.pow(Math.abs(a.y - b.y),2));
		},
		//Returns difference between 2 values
		diff : (p1,p2)=>{
			return Math.abs(p1-p2);
		},
		//Returns random number (Minimum val, Maximum val)
		random : (min,max)=>{
			return Math.floor(Math.random()*(+max-min+1)+min);
		}
	},
	canvas : {
		//canvas Element
		c : null,
		//Loop function
		main_loop_function : null,
		//Interval storage variable
		interval : null,
		//context of canvas (c)
		draw : null,
		//Mouse position
		mouseX : null,
		mouseY : null,
		//Key that is pressed
		key:null,
		//Frames speed
		counter : 0,
		seconds : 0,
		//Creates canvas
		create : function(w=rt.scrW,h=rt.scrH,x=0,y=0){
			if(this.c){
				console.error('canvas already created');
			}else{
				this.c = document.createElement('canvas');
				this.c.width = w-2;
				this.c.height = h-2;
				this.draw = this.c.getContext('2d');
				this.c.style = `position:absolute;z-index:-1; top:${y}px; left:${x}px; border:1px solid black`;
				document.body.appendChild(this.c);
				window.addEventListener("keydown",(e)=>{rt.canvas.key = e.keyCode;});
				window.addEventListener("keyup",()=>{rt.canvas.key = false;});
				this.c.addEventListener('mousemove',function(e){
					rt.canvas.mouseX = e.clientX;
					rt.canvas.mouseY = e.clientY;
				});
			}
		},
		//Object shapes
		Object : {
			//Creates a point
			point : function(x=0,y=0,other={}){
				return Object.assign({
					x:x,
					y:y,
					draw : function(clr='#000'){
						if(!rt.canvas.c){
							console.error('No where to draw');
						}else{
							rt.canvas.draw.fillStyle = clr;
							rt.canvas.draw.fillRect(this.x,this.y,1,1);
						}
					}
				},other);
			},
			text : function(text,font='12px sans-serif',x,y,other={}){
				return Object.assign({
					text : text,
					font : font,
					x : x,
					y : y,
					offsetX : null,
					draw : function(clr='#000'){
						if(!rt.canvas.c){
							console.error('No where to draw');
						}else{
							rt.canvas.draw.font = this.font;
							this.offsetX = rt.canvas.draw.measureText(text).width
							rt.canvas.draw.fillStyle = clr;
							rt.canvas.draw.fillText(this.text,this.x-this.offsetX/2,this.y);
						}
					}
				
				},other)
			},
			line : function(pa={x:0,y:0},pb={x:50,y:50},other={}){
				return Object.assign({
					x1:pa.x,
					x2:pb.x,
					y1:pa.y,
					y2:pb.y,
					draw:function(clr='#000'){
						if(!rt.canvas.c){
							console.error('No where to draw');
						}else{
							rt.canvas.draw.strokeStyle = clr;
							rt.canvas.draw.beginPath();
							rt.canvas.draw.moveTo(this.x1,this.y1);
							rt.canvas.draw.lineTo(this.x2,this.y2);
							rt.canvas.draw.stroke();
						}
					}
				},other)
			},
			rect : function(x,y,w,h,other = {}){
				return Object.assign({
					x:x,
					y:y,
					w:w,
					h:h,
					offsetX:w/2,
					offsetY:h/2,
					draw:function(clr='#000'){
						if(!rt.canvas.c){
							console.error('No where to draw');
						}else{
							rt.canvas.draw.fillStyle = clr;
							rt.canvas.draw.fillRect(this.x-this.offsetX,this.y-this.offsetY,this.w,this.h);
						}
					}
				},other)
			},
			circle : function(x,y,r,other = {}){
				return Object.assign({
					x:x,
					y:y,
					r:r,
					draw : function(clr='#000'){
						if(!rt.canvas.c){
							console.error('No where to draw');
						}else{
							rt.canvas.draw.strokeStyle = clr;
							rt.canvas.draw.beginPath();
							rt.canvas.draw.arc(this.x,this.y,this.r,0,2*Math.PI);
							rt.canvas.draw.stroke();
						}
					}
				},other)
			},
			poly : function(){
				
			},
			Collision : {
				pointToPoint : function(p1,p2){
					console.log(rt.math.dist(p1.x,p2.x,p1.y,p2.y));
					if(rt.math.dist(p1.x,p2.x,p1.y,p2.y)<=0.1){
						return true;
					}else{
						return false;
					}
				},
				pointToCircle : function(p,c){
					if(rt.math.dist(p.x,c.x,p.y,c.y)<=c.r){
						return true;
					}else{
						return false;
					}
				},
				pointToRect : function(p,r){
					if(	p.x > r.x - r.offsetX && //Left side |.
						p.x < r.x + r.offsetX && //Right side .|
						p.y > r.y - r.offsetY && // Top side -.
						p.y < r.y + r.offsetY){
						return true;
					}else{
						return false;
					}
				}
			}
		},
		remove : function(){
			if(this.c == null || !this.c){
				console.error('no canvas to remove');
			}else{
				document.body.removeChild(this.c);
				this.c = null;
				this.draw = null;
				if(typeof this.interval == 'function'){
					clearInterval(this.interval);
				}
				this.interval = null;
			}
		},
		setLoop : function(func){
			this.main_loop_function = func;
		},
		startLoop : function(fps=30){
			if(!this.main_loop_function){
				console.error('Cannot start without loop (Please Set loop function)');
			}else if(typeof this.interval == 'function'){
				console.error('loop already running');
			}else if(fps <= 0 ){
				console.log('fps less than 0');
			}else{
				this.interval = setInterval(this.main_loop_function,1000/fps);
			}
		},
		stopLoop : function(){
			if(!this.interval){
				console.error('Loop already stopped');
			}else{
				clearInterval(this.interval);
				this.interval = null;
			}
		},
		clear : function(){
			if(!this.draw){
				console.error('draw function not set');
			}else{
				this.draw.clearRect(0,0,this.c.width,this.c.height);
			}
		},
		//Does somthing after TIME = second ***Change to Object***
		Counter : function(time=1,callback=()=>{}){
			this.counter++;
			if(this.counter>=time*60){
				this.counter = 0;
				this.seconds++;
				callback();
			}
		},
		resetCounter : function(){
			this.counter = 0;
			this.seconds = 0;
		}
	},
	help : function(){
		console.log(this.desc);
	},
	randomName : function(){
		let o = ['Hentai','Pu$$y','Bear','Troll','Toxic','Money','Creep','Gay','Lesbian','One-legged','Polish','Poor','Freaky'];
		let t = ['Licker','F*cker','Cuddler','Leader','Maker','Wrestler','Grabber','Thrower','Swimmer','Hiker'];
		return o[rt.math.random(0,o.length-1)]+t[rt.math.random(0,t.length)]+rt.math.random(0,999);
	}
}