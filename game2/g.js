var canvas=document.getElementById("canvas");
c=canvas.getContext("2d");
var grid=[];
var w=5;
var col=20,row=20;
var a1=80;
var a2=20;
var a3=a1;
var a4=a2;

var sound = new Howl({
    src: ['start.mp3']
});
sound.play();

var sound1 = new Howl({
    src: ['eat.mp3']
});

function index(i,j){
    if(i<0 || j<0 || i>=row || j>=col)
      return -1;
    
    return (col*(i)+j);
}

function chneighbours(node){
    var i=node.i;
    var j=node.j;

    var top=grid[index(i-1,j)];
    var bottom=grid[index(i+1,j)];
    var left=grid[index(i,j-1)];
    var right=grid[index(i,j+1)];

    if(top && top.visited===false)
    node.neighbours.push(top);
    if(bottom && bottom.visited===false)
    node.neighbours.push(bottom);
    if( left &&  left.visited===false)
    node.neighbours.push(left);
    if(right && right.visited===false)
    node.neighbours.push(right);
}

function draw(){
    for(var i=0;i<row;i++)
    {
        for(var j=0;j<col;j++)
        {   
            var x=new cell(a1,a2,i,j);
            grid.push(x);
            if(x.wall[0]===true)
            { c.beginPath();
              c.moveTo(a1,a2);
              c.lineTo(a1+w,a2);
              c.strokeStyle="white";
              c.stroke();
            }
            if(x.wall[1]===true)
            {   c.beginPath();
                c.moveTo(a1+w,a2);
                c.lineTo(a1+w,a2+w);
                c.strokeStyle="white";
                c.stroke();
            }
            if(x.wall[2]===true)
            {  c.beginPath();
                c.moveTo(a1+w,a2+w);
                c.lineTo(a1,a2+w);
                c.strokeStyle="white";
                c.stroke();
            }
            if(x.wall[3]===true)
            {   c.beginPath();
                c.moveTo(a1,a2+w);
                c.lineTo(a1,a2);
                c.strokeStyle="white";
                c.stroke();
                
            }

            a1+=w;
        }
        a2+=w;
        a1=a3;
    }
}

function clear(){
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height)
}

function cell(a,b,i,j){
  this.i=i;
  this.j=j;
  this.x=a;
  this.y=b;
  this.width=w;
  this.height=w;
  this.wall=[true,true,true,true];
  this.visited=false;
  this.neighbours=[];
}

function redraw(){
    for(var i=0;i<grid.length;i++)
    {
            var x=grid[i].x;
            var y=grid[i].y;

            if(grid[i].wall[0]===true)
            { c.beginPath();
              c.moveTo(x,y);
              c.lineTo(x+w,y);
              c.strokeStyle="white";
              c.stroke();
            }
            if(grid[i].wall[1]===true)
            {   c.beginPath();
                c.moveTo(x+w,y);
                c.lineTo(x+w,y+w);
                c.strokeStyle="white";
                c.stroke();
            }
            if(grid[i].wall[2]===true)
            {  c.beginPath();
                c.moveTo(x+w,y+w);
                c.lineTo(x,y+w);
                c.strokeStyle="white";
                c.stroke();
            }
            if(grid[i].wall[3]===true)
            {   c.beginPath();
                c.moveTo(x,y+w);
                c.lineTo(x,y);
                c.strokeStyle="white";
                c.stroke();
                
            }
    }
    
}


function current(node){
    var a=node.x;
    var b=node.y;
    node.visited=true;
}

function removewall(node1,node2){
    var a1=node1.i;
    var a2=node1.j;
    var b1=node2.i;
    var b2=node2.j;
    if((a2-b2)===-1)
    {  node1.wall[1]=false;
       node2.wall[3]=false;
    }
    if((a2-b2)===1)
    {  node1.wall[3]=false;
       node2.wall[1]=false;
    }
    if((a1-b1)===-1)
    {  node1.wall[2]=false;
       node2.wall[0]=false;
    }
    if((a1-b1)===1)
    {  node1.wall[0]=false;
       node2.wall[2]=false;
    }
    clear();
    redraw();
    
}


function traverse(node){
    current(node);
    chneighbours(node);
    while(node.neighbours.length>0){
        var a = Math.floor(Math.random()*50000);
        var b = a%(node.neighbours.length);
        if(node.neighbours[b].visited===false){
            removewall(node,node.neighbours[b]);
            traverse(node.neighbours[b]);
        }
            node.neighbours.splice(b,1);   
    }
}

draw();
traverse(grid[0]);
sound.play();

function component(i,j,x,y,color){
    this.i=i;
    this.j=j;
    this.x=x;
    this.y=y;
    this.draw=function(){
        c.fillStyle=color;
        c.fillRect(this.x,this.y,w,w);
    }
}

var gamepiece = new component(0,0,a3,a4,"red");
gamepiece.draw();

var food=new component(row-1,col-1,a3+(row-1)*w,a4+(col-1)*w,"green");
food.draw();

function checkwin(){
    if(gamepiece.x===food.x  && gamepiece.y===food.y)
    return true;
    
    return false;
}


window.addEventListener("keydown",function(e){
    var a=gamepiece.i;
    var b=gamepiece.j;
    var g=gamepiece.x;
    var f=gamepiece.y;

    var d=grid[index(a,b)];
    if(e.keyCode===38){
        //up
        if(d.wall[0]===false){
          gamepiece.i=a-1;
          gamepiece.y=f-w;
          clear();
          redraw();
          gamepiece.draw();
          food.draw();
        }
        else{
            sound1.play();
        }
    }
    if(e.keyCode===40){

        if(d.wall[2]===false){
            gamepiece.i=a+1;
            gamepiece.y=f+w;
            clear();
            redraw();
            gamepiece.draw();
            food.draw();
          }
        else{
            sound1.play();
        }
    }
    if(e.keyCode===37){

        if(d.wall[3]===false){
            gamepiece.j=b-1;
            gamepiece.x=g-w;
            clear();
            redraw();
            gamepiece.draw();
            food.draw();
        }
        else{
            sound1.play();
        }

    }if(e.keyCode===39){

        if(d.wall[1]===false){
            gamepiece.j=b+1;
            gamepiece.x=g+w;
            clear();
            redraw();
            gamepiece.draw();
            food.draw();
        }
        else{
            sound1.play();
        }
    }

    if(checkwin()===true)
    alert("you won");
})