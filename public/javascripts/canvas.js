var pos = {
    drawable: false,
    x: -1,
    y: -1
};
//pos 좌표

var drawCanvas, drwaCtx;    //가장 화면 앞쪽에 뛰어지는 Canvas
var viewCanvas, viewCtx;    //DrawCanvas 의 뒤쪽에 존재하며, 여러개의 Canvas를 생성하여 Layer로 활용하는데, 이때 선택된 레이어의 Canvas값이다.
var draw;  //함수 포인터

//getQuerystring 주소에서 변수를 읽어오기 위한 함수, (볼필요없음)
function getQuerystring(paramName){
    var _tempUrl = window.location.search.substring(1); //url에서 처음부터 '?'까지 삭제
    var _tempArray = _tempUrl.split('&'); // '&'을 기준으로 분리하기

    for(var i = 0; _tempArray.length; i++) {
        var _keyValuePair = _tempArray[i].split('=');
        if(_keyValuePair[0] == paramName){
             return _keyValuePair[1];
        }
    }
}
var parentNum; //부모 번호

//첫 화면 로드시 제일 처음 불러와 지는 함수.
window.onload = function(){
    parentNum =getQuerystring("parentNum");

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
    colorTool("pencil");

    changeColor(); //ColorBox
}

//마우스 이벤트 발생시 함수를 호출 해주는 역할
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

//마우스의 XY값을 초기화
function initDraw(event){
    var cur = getPosition(event);
    pos.drawable = true;
    pos.X = cur.X;
    pos.Y = cur.Y;
}

//DrawCanvas에 그림을 그리게 되는데, 한 획의 그림이 끝나면, 현재 선택된 ViewCanvas로 그림을 덮어 준다.
function finishDraw(){
    if(viewCtx)
        viewCtx.drawImage(drawCanvas, 0, 0);
    drwaCtx.clearRect(0,0,drawCanvas.width,drawCanvas.height);
    pos.drawable = false;
    pos.X = -1;
    pos.Y = -1;
}

//현재 마우스 포지션을 불러오는 함수.
function getPosition(event){
    var x = event.pageX - drawCanvas.offsetLeft;
    var y = event.pageY - drawCanvas.offsetTop;
    return {X: x, Y: y};
}