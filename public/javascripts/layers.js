function changeLayer(event){
    var id = "viewBox" +event.target.id.replace(/[^0-9]/g,"");  //문자열에서 숫자만 추출

	viewCanvas = document.getElementById(id);
    viewCtx = viewCanvas.getContext("2d");

	alert(id +" Register");
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

	var newLayer = document.createElement("div");
	newLayer.className="layerBox";
	newLayer.id="layer"+layerCount;
	newLayer.innerText="Layer"+layerCount;
	newLayer.title="LAYER";
	newLayer.href="javascript:void(0)"
	newLayer.onclick=changeLayer;
	document.getElementById("optionBox").appendChild(newLayer);

	layerList.push(newLayer);

	layerCount++;
}

function mergeLayer() {
    var mergeCanvas, mergeCtx, i;

    mergeCanvas = document.createElement("canvas");
    mergeCanvas.className="canvasBox";
    mergeCanvas.width="500";
    mergeCanvas.height="500";

    mergeCtx = mergeCanvas.getContext("2d");

	for(i=0;i<canvasList.length;i++)
        mergeCtx.drawImage(canvasList[i], 0, 0);



}