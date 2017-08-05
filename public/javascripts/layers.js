function changeLayer(event){
    var id = "viewBox" +event.target.id.replace(/[^0-9]/g,"");  //문자열에서 숫자만 추출

	viewCanvas = document.getElementById(id);
    viewCtx = viewCanvas.getContext("2d");

    colorLayer(event.target.id);

    //Auto Draw Layer선택
    if(auto_Color_Flag == 1) {
        sendCanvas(viewCanvas,2);
        auto_Color_Flag = 0;
    }
}

var lay;
function colorLayer(id){
    if(lay)
        lay.style.backgroundColor = "#FFFFFF";
    lay = document.getElementById(id);
    lay.style.backgroundColor = 'pink';
}

var layerCount = 1;
var canvasList = new Array(); //canvas를 저장
var layerList = new Array(); //옵션 Box의 Layer DIV를 저장

function addLayer() {
	var newCanvas = document.createElement("canvas");
	newCanvas.className="canvasBox";
	newCanvas.id="viewBox"+layerCount;
	newCanvas.width="500";
	newCanvas.height="500";
	newCanvas.zindex=-layerCount;	//작을수록 앞으로 나온다.
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

function mergeAllLayer() {
    var mergeCanvas, mergeCtx, i;

    mergeCanvas = document.createElement("canvas");
    mergeCanvas.className="canvasBox";
    mergeCanvas.width="500";
    mergeCanvas.height="500";

    mergeCtx = mergeCanvas.getContext("2d");

	for(i=0;i<canvasList.length;i++)
        mergeCtx.drawImage(canvasList[i], 0, 0);
}

function sendCanvas(main_canvas, flag) {

    var xhr = new XMLHttpRequest();
    var url = '/image_receiver?';
    if(flag==1)
        url+='image='+main_canvas.toDataURL('image/jpeg');
    else
        url+='image='+main_canvas.toDataURL('image/png');
    url+='&flag='+flag;

    xhr.open('GET', url);
    xhr.onreadystatechange = mergeUpLayer();
    xhr.send(null);
}

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

function clearLayer() {
    var parentLayer = this.parentNode;

    var id = "viewBox" + parentLayer.id.replace(/[^0-9]/g, "");  //문자열에서 숫자만 추출
    viewCanvas = document.getElementById(id);
    viewCtx = viewCanvas.getContext("2d");

    viewCtx.clearRect(0,0,viewCanvas.width,viewCanvas.height);

    colorLayer(parentLayer.id);
}

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