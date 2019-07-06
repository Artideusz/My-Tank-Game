let data = {
    //config object
    fps : 60,
    gameScreen : [300,600,900],
    buttons : {
        mainMenu : [new cBTN(
            {
                text : 'Play Single Player',
                hidden : false,
                width : 300,
                height : 50,
                x : rt.scrW/2,
                y : rt.scrH/4,
            },()=>{mapSelect(false)}),
        new cBTN(
            {
                text : 'Play Multi-Player',
                hidden : false,
                width : 300,
                height : 50,
                x : rt.scrW/2,
                y : (2*rt.scrH)/4,
            },()=>{mapSelect(true)}
        ),
        new cBTN(
            {
                text : 'Options',
                hidden : false,
                width : 300,
                height : 50,
                x : rt.scrW/2,
                y : (3*rt.scrH)/4
        },()=>{options()})
        ],
        mapSelect : [
            new cBTN({
                text : 'Map 1',
                width : 300,
                height : 50,
                x : rt.scrW/2,
                y : (rt.scrH*2)/6
            },()=>maps(1)),
            new cBTN({
                text : 'Map 2',
                width : 300,
                height : 50,
                x : rt.scrW/2,
                y : rt.scrH/2
            },()=>maps(2))
        ],
        options : [],
    },
    difficulty : [
        {
            amount : 0,
            enemyHp : 0,
            playerHp : 1000,
            isDebug : true,
        },
        {
            amount : 4,
            enemyHp : 100,
            playerHp : 200,
        },
        {
            amount : 5,
            enemyHp : 150,
            playerHp : 150,
        },
        {
            amount : 7,
            enemyHp : 250,
            playerHp : 100,
        }
    ],
    player : null,
    enemyList : [],
    perkList : [],
    projList: [],
}

onload = ()=>{
    document.body.style = 'padding:0;margin:0;';
    rt.canvas.create(data.gameScreen[1],data.gameScreen[1],rt.scrW/2-data.gameScreen[1]/2,rt.scrH/2-data.gameScreen[1]/2);
}

function menu(){
    rt.canvas.clear();
    for(let i = 0 ; i < data.buttons.mainMenu.length ; i++){
        data.buttons.mainMenu[i].buttonElement.style.display = 'block';
    }
}

function mapSelect(isMulti){
    for(let i = 0 ; i < data.buttons.mainMenu.length ; i++){
        data.buttons.mainMenu[i].buttonElement.style.display = 'none';
    }
    for(let i = 0 ; i < data.buttons.mapSelect.length ; i++){
        data.buttons.mapSelect[i].buttonElement.style.display = 'block';
    }
}

function options(){
    for(let i = 0 ; i < data.buttons.mainMenu.length ; i++){
        data.buttons.mainMenu[i].buttonElement.style.display = 'none';
    }
}

function maps(number){
    map.currMap.mapImage = new Image();
    map.currMap.mapImage.src = map.maps['map'+number].backgroundURL;
    let p = prompt('Type in diff 0-3',"");
    initDiff(data.difficulty[p]);
}

function initDiff(d){
    data.player = new Tank(true,d.playerHp);
    for(let i = 0 ; i < d.amount ; i++){
        data.enemyList[data.enemyList.length] = new Tank(false,d.enemyHp);
    }
    sP();
}

function sP(){
    for(let i = 0 ; i < data.buttons.mapSelect.length ; i++){
        data.buttons.mapSelect[i].buttonElement.style.display = 'none';
    }
    //Main Game Loop
    rt.canvas.setLoop(()=>{
        rt.canvas.clear();
        if(map.currMap.mapImage){
            rt.canvas.draw.drawImage(map.currMap.mapImage,0,0);
        }
        rt.canvas.Counter(3,()=>{
            data.perkList[data.perkList.length] = new Perk();
        })
        data.player.AIO();

        //Bullets
        for( let i = 0; i < data.projList.length ; i++){
            data.projList[i].update();
            data.projList[i].drawBullet();
            if(data.projList[i].birthTime>=data.projList[i].dieTime){
                data.projList.splice(i,1);
            }
        }
        //Perks
        for(let i = 0 ; i < data.perkList.length ; i++){
            data.perkList[i].draw();
        }
        for( let i = 0 ; i < data.enemyList.length ; i++){
            data.enemyList[i].AIO();
            if(data.enemyList[i].hp<=0){
                data.enemyList.splice(i,1);
            }
            data.enemyList[i].drawTank();
            data.enemyList[i].drawHP();
        }
        data.player.drawTank();
        data.player.drawHP();
        if(data.enemyList.length<=0){
            rt.canvas.stopLoop();
            data.player=null;
            data.projList=[];
            data.enemyList=[];
            alert("You've won!!");
            currMap=null;
            menu();
        }
        if(data.player.hp<=0){
            rt.canvas.stopLoop();
            data.player=null;
            data.projList=[];
            data.enemyList=[];
            alert("You've lost!");
            currMap=null;
            menu();
        }


    });

    rt.canvas.startLoop(data.fps);    
}