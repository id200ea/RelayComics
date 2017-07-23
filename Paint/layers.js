function changeLayer(event){
    var id = "viewBox" +event.target.id.replace(/[^0-9]/g,"");  //문자열에서 숫자만 추출

	viewCanvas = document.getElementById(id);
    viewCtx = viewCanvas.getContext("2d");

	alert(id +" Register");
}

var layerCount = 2;

function addLayer() {
	var newCanvas = document.createElement("canvas");
	newCanvas.className="canvasBox";
	newCanvas.id="viewBox"+layerCount;
	newCanvas.width="500";
	newCanvas.height="500";
	document.getElementById("centerBox").appendChild(newCanvas);

	var newLayer = document.createElement("div");
	newLayer.className="layerBox";
	newLayer.id="layer"+layerCount;
	newLayer.innerText="Layer"+layerCount;
	newLayer.title="LAYER";
	newLayer.href="javascript:void(0)"
	newLayer.onclick=changeLayer;
	document.getElementById("optionBox").appendChild(newLayer);

	layerCount++;
}	