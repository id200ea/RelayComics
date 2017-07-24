﻿var pos = {
    drawable: false,
    x: -1,
    y: -1
};

var drawCanvas, drwaCtx;
var viewCanvas, viewCtx;
var draw;  //함수 포인터


window.onload = function(){
    drawCanvas = document.getElementById("drawBox");
    drwaCtx = drawCanvas.getContext("2d");

    addLayer();
    viewCanvas = document.getElementById("viewBox1");
    viewCtx = viewCanvas.getContext("2d");
 
    drawCanvas.addEventListener("mousemove", listener);
    drawCanvas.addEventListener("mousedown", listener);
    drawCanvas.addEventListener("mouseup", listener);
    drawCanvas.addEventListener("mouseout", listener);

    draw = drawPen;  //함수 포인터 사용 기본 Pen 등록
    changeColor();
}
 
function listener(event){
    switch(event.type){
        case "mousedown":
            initDraw(event);
            break;
        case "mousemove":
            if(pos.drawable)
                draw(event);
            break;
        case "mouseout":
            finishDraw();
            break;
        case "mouseup":
            finishDraw();
            break;
    }
}

function initDraw(event){
    var cur = getPosition(event);
    pos.drawable = true;
    pos.X = cur.X;
    pos.Y = cur.Y;
}

function finishDraw(){
    viewCtx.drawImage(drawCanvas, 0, 0);
    drwaCtx.clearRect(0,0,drawCanvas.width,drawCanvas.height);
    pos.drawable = false;
    pos.X = -1;
    pos.Y = -1;
}

function getPosition(event){
    var x = event.pageX - drawCanvas.offsetLeft;
    var y = event.pageY - drawCanvas.offsetTop;
    return {X: x, Y: y};
}