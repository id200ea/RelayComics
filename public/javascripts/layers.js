function changeLayer(event){
    var id = "viewBox" +event.target.id.replace(/[^0-9]/g,"");  //******************************************클릭된 Layer는 카운트되어 있는데, 이 카운트을 찾아 같은 카운트를 가져온다.

	viewCanvas = document.getElementById(id);
    viewCtx = viewCanvas.getContext("2d");                      //*******************************************해당 캔버스를 view캔버스로 만든다.

    colorLayer(event.target.id);

    //Auto Draw Layer선택
    if(auto_Color_Flag == 1) {
        sendCanvas(viewCanvas,1);
        auto_Color_Flag = 2;
        alert("첫번째 레이어 선택완료 두번째 레이어를 선택하세요.");
    }
    else if(auto_Color_Flag == 2) {
        sendCanvas(viewCanvas,2);
        auto_Color_Flag = 0;
        alert("레이어 모두 전송.");
    }
}

//Layer색상을 바꾸기 위한 함수. 클릭시 호출
var lay;
function colorLayer(id){
    if(lay)
        lay.style.backgroundColor = "#FFFFFF";
    lay = document.getElementById(id);
    lay.style.backgroundColor = 'pink';
}

var layerCount = 1;
var canvasList = new Array(); //canvas를 저장
var layerList = new Array(); //옵션 Box의 Layer 저장*****************************************************************************
//이 리스트 두개는 중요하다. Layer를 생성할때 마다. 연결리스트에 하나씩 순서대로 들어가게 된다. (하나는 Canvas의 리스트이며, 하나는 Layer의 리스트이다)
//캔버스를 추가할때는 아래의 함수를 사용하고, 삽입이나 삭제를 따로 만들려면 연락하시길.

//레이어를 추가하려면 선택하면 된다. 호출시 클릭도 함께 되기 때문에, ChangeLayer도 호출된다.
function addLayer() {
	var newCanvas = document.createElement("canvas");
	newCanvas.className="canvasBox";
	newCanvas.id="viewBox"+layerCount;
	newCanvas.width="500";
	newCanvas.height="500";
	newCanvas.zindex=layerCount;	//작을수록 앞으로 나온다.
	document.getElementById("centerBox").appendChild(newCanvas);

	canvasList.push(newCanvas);

    var deleteButton = document.createElement("div");
    deleteButton.id = 'deleteButton';
    deleteButton.title='DELETE';
    deleteButton.href="javascript:void(0)";
    deleteButton.onclick=deleteLayer;

    var clearButton = document.createElement("div");
    clearButton.id = 'clearButton';
    clearButton.title='CLEAR';
    clearButton.href="javascript:void(0)";
    clearButton.onclick=clearLayer;

	var mergeButton = document.createElement("div");
    mergeButton.id = 'mergeButton';
    mergeButton.title='MERGE_UP';
    mergeButton.href="javascript:void(0)";
    mergeButton.onclick=mergeUpLayer;

    var newLayer = document.createElement("div");
    newLayer.className="layerBox";
    newLayer.id="layer"+layerCount;
    newLayer.innerText="Layer"+layerCount;
    newLayer.title="LAYER";
    newLayer.href="javascript:void(0)"
    newLayer.onclick=changeLayer;
    newLayer.appendChild(deleteButton);
    newLayer.appendChild(clearButton);
    newLayer.appendChild(mergeButton);
    document.getElementById("optionBox").appendChild(newLayer);

    layerList.push(newLayer);

	layerCount++;

    newLayer.click();
}

//Canvas리스트를 순차로 탐색하며 모두 한 화면에 합쳐서 서버로 보낸다.
function mergeAllSave() {
    var mergeCanvas, mergeCtx, i;

    mergeCanvas = document.createElement("canvas");
    mergeCanvas.className="canvasBox";
    mergeCanvas.width="500";
    mergeCanvas.height="500";

    mergeCtx = mergeCanvas.getContext("2d");

	for(i=0;i<canvasList.length;i++)
        mergeCtx.drawImage(canvasList[i], 0, 0);

	sendCanvas(mergeCanvas, 3);
}

//서버로 캔버스를 보내는 함수이다. mainCanvas에 캔버스를 넣고, flag는 서버에 저장하려면 3을 사용하면 된다. (1과 2는 오토드로우 용이므로 사용 X)
function sendCanvas(main_canvas, flag) {

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/image_receiver', true);
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");

    var params = "image=";
    params += main_canvas.toDataURL('image/png');
    params +='&flag='+flag;

    if(flag==3) {
        url += '&parent=' + parentNum;  //주소에서 부모의 정보를 읽어온다.

        var xhr_To_DB = new XMLHttpRequest();
        var url_To_DB  = '/add_cut?';
        url_To_DB +='src='+'../images/new_' + parentNum.toString() +".png"
        url_To_DB+='&pnum=' + parentNum.toString();
        xhr_To_DB.open('GET', url_To_DB);
        xhr_To_DB.send(null);
    }
    else if(flag==2) {
        xhr.onreadystatechange = function rspns() {
            if (xhr.readyState == 4) {
                addLayer();
                var img = new Image();
                img.onload = function () {
                    viewCtx.drawImage(img, 0, 0);
                };
                img.src = "data:image/png;base64," + xhr.responseText;
            }
        };
    }

    xhr.send(params);
    //window.location="http://localhost:3000/";
}

//바로위 레이어와 합치는 함수이다.
function mergeUpLayer() {
    var parentLayer = this.parentNode;
    var v2, i;

    for(i=1;i<canvasList.length; i++) {
        if(layerList[i] == parentLayer) {
            viewCanvas = document.getElementById("viewBox" + layerList[i-1].id.replace(/[^0-9]/g, ""));
            viewCtx = viewCanvas.getContext("2d");

            v2 = document.getElementById("viewBox" + layerList[i].id.replace(/[^0-9]/g, ""));
            viewCtx.drawImage(v2, 0, 0);

            colorLayer(layerList[i-1].id);

            layerList.splice(i, 1);
            canvasList.splice(i, 1);

            parentLayer.parentNode.removeChild(parentLayer);
            v2.parentNode.removeChild(v2);
            break;
        }
    }

}

//레이어를 깨끗하게
function clearLayer() {
    var parentLayer = this.parentNode;

    //
    var id = "viewBox" + parentLayer.id.replace(/[^0-9]/g, "");  //문자열에서 숫자만 추출
    viewCanvas = document.getElementById(id);
    viewCtx = viewCanvas.getContext("2d");

    viewCtx.clearRect(0,0,viewCanvas.width,viewCanvas.height);

    colorLayer(parentLayer.id);
}

//레이어를 삭제 한다.
function deleteLayer() {
    var parentLayer = this.parentNode;

    var id = "viewBox" + parentLayer.id.replace(/[^0-9]/g, "");  //문자열에서 숫자만 추출
    viewCanvas = document.getElementById(id);
    viewCtx = viewCanvas.getContext("2d");

    var i;
    for(i=0;i<canvasList.length; i++) {
        if(canvasList[i] == viewCanvas)
            canvasList.splice(i, 1);
        if(layerList[i] == parentLayer)
            layerList.splice(i, 1);
    }
    //리스트도 제거

    parentLayer.parentNode.removeChild(parentLayer);
    viewCanvas.parentNode.removeChild(viewCanvas);

    colorLayer(parentLayer.id);
}