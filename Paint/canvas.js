var pos = {
    drawable: false,
    x: -1,
    y: -1
};

var drawCanvas, drwaCtx;
var viewCanvas, viewCtx;
var draw;  //함수 포인터


window.onload = function(){
	//캔버스에 그림을 그릴려면 '그리기 컨텍스트'를 얻어야 한다.
	//canvas의 DOM 객체를 얻는다
    drawCanvas = document.getElementById("drawBox");
    viewCanvas = document.getElementById("viewBox1");
    //DOM 객체로부터 2D 컨텍스트를 얻는다
    drwaCtx = drawCanvas.getContext("2d");
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