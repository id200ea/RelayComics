var color;
function changeColor(){
    color = "#" + document.getElementById("colorBox").value;
}
//현재 선택된 컬러의 값을 가져오는 함수 자동 실행되므로, color 변수만 사용하면 된다.

//함수 포인터, 그리기 도구를 함수 포인터에 넣어 각각 다르게 사용하는 것.
function selectFunc(event){
    switch(event.target.id){
        case "pencil":  //id 값을 사용한다.
    		draw = drawPen;  //함수 포인터 사용 기본 Pen 등록
            break;
        case "line":
    		draw = drawLine;  //함수 포인터 사용
            break;
        case "rect":
    		draw = drawRect;  //함수 포인터 사용
            break;
        case "auto":
            draw = 0; //draw기능 초기화.
            if(auto_Color_Flag == 1 || auto_Color_Flag == 2) {
                auto_Color_Flag = 0;
                alert("취소되었습니다.");
            }
            else autoColor();
            break;
        case "edge":
            CannyJS.canny(viewCanvas);

            break;
    }
    colorTool(event.target.id);
}

//selectFunc에 포함된 기능들 중에서 선택을 하면 색이 바뀌는 기능
var tool;
function colorTool(id){
    if(tool)
        tool.style.backgroundColor = "#FFFFFF";
    tool = document.getElementById(id);
    tool.style.backgroundColor = 'pink';
}

//Pen 그닥 어렵진 않다. 찬찬히 살펴보자.
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

//Line 순서대로 보면 어려운건 없을 듯하다.
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

//사각형 기능
function drawRect(event){
    drwaCtx.beginPath();
    var cur = getPosition(event);
    drwaCtx.clearRect(0,0,drawCanvas.width,drawCanvas.height);
    drwaCtx.fillStyle=color;      //color
    drwaCtx.fillRect(pos.X, pos.Y, cur.X - pos.X, cur.Y - pos.Y);
    drwaCtx.closePath();
}

//Load 기능, (볼필요 없을 듯하다)
function fileIn(obj) {
    var pathpoint = obj.value.lastIndexOf('.');
    var filepoint = obj.value.substring(pathpoint+1,obj.length);
    var filetype = filepoint.toLowerCase();
    if(filetype=='jpg'|| filetype=='jpeg'|| filetype=='png' || filetype=='gif'  || filetype=='bmp'){
        var reader = new FileReader();
        reader.readAsDataURL(obj.files[0]);
        reader.onload = function () {
            var tempImage = new Image(); //drawImage 메서드에 넣기 위해 이미지 객체화
            tempImage.src = reader.result; //data-url를 이미지 객체에 주입
            tempImage.onload = function () {
              var width = tempImage.width;
              var height = tempImage.height;

              var scalex = 500 / width;
              var scaley = 500 / height;

              // 캔버스를 full로 채울경우 주석처리
              var scale = (scalex < scaley) ? scalex : scaley;

              tempImage.width = scale * width;
              tempImage.height = scale * height;

              viewCtx.drawImage(this, 0, 0, tempImage.width, tempImage.height);
            }
        }
    }
    else{
        alert("이미지 파일만 선택할 수 있습니다.");
    }
}
//위의 함수를 호출하기 위한 함수. (볼 필요는 없다)
function loadImage() {
    var upload = document.getElementById("image_up_file");
    upload.click();
}

//오토 컬러를 하기위해 Flag값을 바뀌가며 레이어를 선택하려는 함수, Layer.js 에 changeLayer와 연관이 있다.
var auto_Color_Flag;
function autoColor() {
    alert("두개의 레이어를 선택해 주세요.");
    auto_Color_Flag = 1;
}
