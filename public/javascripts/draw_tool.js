var color;
function changeColor(){
    color = "#" + document.getElementById("colorBox").value;
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
    colorTool(event.target.id);
}

var tool;
function colorTool(id){
    if(tool)
        tool.style.backgroundColor = "#FFFFFF";
    tool = document.getElementById(id);
    tool.style.backgroundColor = 'pink';
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

function fileIn(obj) {
    var pathpoint = obj.value.lastIndexOf('.');
    var filepoint = obj.value.substring(pathpoint+1,obj.length);
    var filetype = filepoint.toLowerCase();
    if(filetype=='jpg'|| filetype=='jpeg'|| filetype=='png' || filetype=='gif'  || filetype=='bmp'){

        var reader = new FileReader();
        reader.readAsDataURL(obj.files[0]);
        reader.onload = function  () {
            var tempImage = new Image(); //drawImage 메서드에 넣기 위해 이미지 객체화
            tempImage.src = reader.result; //data-uri를 이미지 객체에 주입
            tempImage.onload = function () {
                viewCtx.drawImage(this, 0, 0);
            }
        }
    }
    else{
        alert("이미지 파일만 선택할 수 있습니다.");
    }
}

function loadImage() {
    var upload = document.getElementById("image_up_file");
    upload.click();
}

var auto_Color_Flag;
function autoColor() {
    alert("두개의 레이어를 선택해 주세요.");
    auto_Color_Flag = 1;
    main_canvas = 0;
}