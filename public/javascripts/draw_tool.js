var color;

function changeColor(){
    color = "#" + document.getElementById("colorBox").value;
    alert(color);
}


function selectFunc(event){
    switch(event.target.id){
        case "pencil":
    		draw = drawPen;  //함수 포인터 사용 기본 Pen 등록
            break;
        case "line":
    		draw = drawLine;  //함수 포인터 사용 기본 Pen 등록
            break;
        case "rect":
    		draw = drawRect;  //함수 포인터 사용 기본 Pen 등록
            break;
    }
    alert(event.target.title +" Register");
}

function drawPen(event){
    drwaCtx.save();
    drwaCtx.beginPath();
    drwaCtx.lineCap = "round";
    drwaCtx.moveTo(pos.X,pos.Y);

    var cur = getPosition(event);
    drwaCtx.lineTo(cur.X, cur.Y);
    pos.X = cur.X;
    pos.Y = cur.Y;
    drwaCtx.strokeStyle=color;      //color
    drwaCtx.stroke();

    drwaCtx.closePath();
    drwaCtx.restore();
}

function drawLine(event){
    drwaCtx.beginPath();
    drwaCtx.moveTo(pos.X,pos.Y);
    var cur = getPosition(event);
    drwaCtx.clearRect(0,0,drawCanvas.width,drawCanvas.height);
    drwaCtx.strokeStyle=color;      //color
    drwaCtx.lineTo(cur.X,cur.Y);
    drwaCtx.stroke();
    drwaCtx.closePath();
}

function drawRect(event){
    drwaCtx.beginPath();
    var cur = getPosition(event);
    drwaCtx.clearRect(0,0,drawCanvas.width,drawCanvas.height);
    drwaCtx.fillStyle=color;      //color
    drwaCtx.fillRect(pos.X, pos.Y, cur.X - pos.X, cur.Y - pos.Y);
    drwaCtx.closePath();
}

function drawClear(event){
    viewCtx.clearRect(0,0,viewCanvas.width,viewCanvas.height);
    drwaCtx.clearRect(0,0,drawCanvas.width,drawCanvas.height);
}