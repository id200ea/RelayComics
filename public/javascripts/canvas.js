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

var autoFlag = 0;
var canvas, objs;
var GetElement = function (id) {
    return document.getElementById(id)
};

window.onload = function() {

    //기본 호출.
    canvas = new fabric.Canvas('c', {isDrawingMode: true});
    fabric.Object.prototype.transparentCorners = false;
    canvas.selection = false;  // 버그가 존재하는데 어떻게 고쳐야 하려나....?

    //옵션들
    var drawingModeEl = GetElement('drawing-mode'),
        drawingOptionsEl = GetElement('drawing-mode-options'),
        drawingColorEl = GetElement('drawing-color'),
        drawingShadowColorEl = GetElement('drawing-shadow-color'),
        drawingLineWidthEl = GetElement('drawing-line-width'),
        drawingShadowWidth = GetElement('drawing-shadow-width'),
        drawingShadowOffset = GetElement('drawing-shadow-offset'),
        clearEl = GetElement('clear-canvas');

    //드로윙 모드
    drawingModeEl.onclick = function () {
        canvas.isDrawingMode = !canvas.isDrawingMode;
        if (canvas.isDrawingMode) {
            drawingModeEl.innerHTML = 'Cancel drawing mode';
            drawingOptionsEl.style.display = '';
        }
        else {
            drawingModeEl.innerHTML = 'Enter drawing mode';
            drawingOptionsEl.style.display = 'none';
        }
    };

    //클리어 버튼
    clearEl.onclick = function () {
        if (confirm('Are you sure?')) {
            canvas.clear();
        }
    };

    //패턴 브러쉬
    if (fabric.PatternBrush) {
        var vLinePatternBrush = new fabric.PatternBrush(canvas);
        vLinePatternBrush.getPatternSrc = function () {

            var patternCanvas = fabric.document.createElement('canvas');
            patternCanvas.width = patternCanvas.height = 10;
            var ctx = patternCanvas.getContext('2d');

            ctx.strokeStyle = this.color;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(0, 5);
            ctx.lineTo(10, 5);
            ctx.closePath();
            ctx.stroke();

            return patternCanvas;
        };

        var hLinePatternBrush = new fabric.PatternBrush(canvas);
        hLinePatternBrush.getPatternSrc = function () {

            var patternCanvas = fabric.document.createElement('canvas');
            patternCanvas.width = patternCanvas.height = 10;
            var ctx = patternCanvas.getContext('2d');

            ctx.strokeStyle = this.color;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(5, 0);
            ctx.lineTo(5, 10);
            ctx.closePath();
            ctx.stroke();

            return patternCanvas;
        };

        var squarePatternBrush = new fabric.PatternBrush(canvas);
        squarePatternBrush.getPatternSrc = function () {

            var squareWidth = 10, squareDistance = 2;

            var patternCanvas = fabric.document.createElement('canvas');
            patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
            var ctx = patternCanvas.getContext('2d');

            ctx.fillStyle = this.color;
            ctx.fillRect(0, 0, squareWidth, squareWidth);

            return patternCanvas;
        };

        var diamondPatternBrush = new fabric.PatternBrush(canvas);
        diamondPatternBrush.getPatternSrc = function () {

            var squareWidth = 10, squareDistance = 5;
            var patternCanvas = fabric.document.createElement('canvas');
            var rect = new fabric.Rect({
                width: squareWidth,
                height: squareWidth,
                angle: 45,
                fill: this.color
            });

            var canvasWidth = rect.getBoundingRectWidth();

            patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
            rect.set({left: canvasWidth / 2, top: canvasWidth / 2});

            var ctx = patternCanvas.getContext('2d');
            rect.render(ctx);

            return patternCanvas;
        };
    }

    //모드 변경
    GetElement('drawing-mode-selector').onchange = function () {
        isLine = false;
        if (this.value === 'hline') {
            canvas.freeDrawingBrush = vLinePatternBrush;
        }
        else if (this.value === 'vline') {
            canvas.freeDrawingBrush = hLinePatternBrush;
        }
        else if (this.value === 'square') {
            canvas.freeDrawingBrush = squarePatternBrush;
        }
        else if (this.value === 'diamond') {
            canvas.freeDrawingBrush = diamondPatternBrush;
        }
        else {
            canvas.freeDrawingBrush = new fabric[this.value + 'Brush'](canvas);
        }

        if (canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush.color = drawingColorEl.value;
            canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
            canvas.freeDrawingBrush.shadow = new fabric.Shadow({
                blur: parseInt(drawingShadowWidth.value, 10) || 0,
                offsetX: 0,
                offsetY: 0,
                affectStroke: true,
                color: drawingShadowColorEl.value,
            });
        }
    };

    drawingColorEl.onchange = function () {
        canvas.freeDrawingBrush.color = this.value;
    };
    drawingShadowColorEl.onchange = function () {
        canvas.freeDrawingBrush.shadow.color = this.value;
    };
    drawingLineWidthEl.onchange = function () {
        canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
        this.previousSibling.innerHTML = this.value;
    };
    drawingShadowWidth.onchange = function () {
        canvas.freeDrawingBrush.shadow.blur = parseInt(this.value, 10) || 0;
        this.previousSibling.innerHTML = this.value;
    };
    drawingShadowOffset.onchange = function () {
        canvas.freeDrawingBrush.shadow.offsetX = parseInt(this.value, 10) || 0;
        canvas.freeDrawingBrush.shadow.offsetY = parseInt(this.value, 10) || 0;
        this.previousSibling.innerHTML = this.value;
    };

    if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = drawingColorEl.value;
        canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
        canvas.freeDrawingBrush.shadow = new fabric.Shadow({
            blur: parseInt(drawingShadowWidth.value, 10) || 0,
            offsetX: 0,
            offsetY: 0,
            affectStroke: true,
            color: drawingShadowColorEl.value,
        });
    }

    var isRedoing = false;
    var h = [];
    objs = canvas._objects;
    canvas.on('object:added', function () {
        if (!isRedoing) {
            h = [];
        }
        isRedoing = false;
        objs[objs.length-1].layer = curLayer.innerText;  //추가한 오브젝트 Layer 추가
    });
    GetElement('undo-canvas').onclick = function undo() {
        if (canvas._objects.length > 0) {
            h.push(canvas._objects.pop());
            canvas.renderAll();
        }
    }
    GetElement('redo-canvas').onclick = function redo() {
        if (h.length > 0) {
            isRedoing = true;
            canvas.add(h.pop());
        }
    }
    GetElement('delete-object').onclick = function deleteObjects() {
        var activeObject = canvas.getActiveObject();
        if (activeObject && confirm('Are you sure?')) {
            canvas.remove(activeObject);
        }
    }
    GetElement('load-object').onclick = function loadImage() {
        GetElement("image_up_file").click();
    }


    var tempCanvas;
    GetElement('Color-object').onclick = function () {
        if(autoFlag == 0) {
            autoFlag = 1;
            if(canvas.isDrawingMode)
                drawingModeEl.click();
            canvas.discardActiveObject();
            canvas.requestRenderAll();

            alert('자동채색 시작, 오브젝트 하나를 선택해 주세요.');
        }
        else {
            //캔버스 삭제
            var canvasBox = GetElement('canvas-box');
            while ( canvasBox.hasChildNodes() ) {
                canvasBox.removeChild(canvasBox.firstChild );
            }

            if(tempCanvas)
                canvas = tempCanvas;
            tempCanvas = null;

            if(canvas.isDrawingMode)
                drawingModeEl.click();
            autoFlag = 0;

            alert('자동채색 취소');
        }
    }

    GetElement('save-canvas').onclick = function () {
        canvas.renderAll();
        sendCanvas(GetElement('c'),3);
    }


    canvas.on('object:selected', function () {
        if(autoFlag === 1) {
            var selected = fabric.util.object.clone(canvas.getActiveObject());

            var canvasForColor = document.createElement("canvas");
            canvasForColor.id = 'canvasForColor';
            canvasForColor.width = selected.width.valueOf()+selected.strokeWidth;
            canvasForColor.height = selected.height.valueOf()+selected.strokeWidth;
            canvasForColor.style.border = "1px solid gold";
            GetElement('canvas-box').appendChild(canvasForColor);

            var sendButton = document.createElement("button");
            sendButton.innerText="Send";
            sendButton.style.width = "100%";
            sendButton.onclick = function sendObject() {
                canvas.remove(selected);
                canvas.renderAll();

                sendCanvas(GetElement('canvasForColor'), 2);  //canvas 보내기
                //캔버스 삭제 부분.
                var canvasBox = GetElement('canvas-box');
                while ( canvasBox.hasChildNodes() ) {
                    canvasBox.removeChild(canvasBox.firstChild );
                }
                canvas = tempCanvas;
                tempCanvas = null;
                drawingModeEl.click();  //무조건 열린다.
                autoFlag = 0;
            }
            GetElement('canvas-box').appendChild(sendButton);

            tempCanvas = canvas;
            canvas = new fabric.Canvas('canvasForColor', {isDrawingMode: false});
            fabric.Object.prototype.transparentCorners = false;
            canvas.selection = false;
            selected.selectable= false;

            canvas.freeDrawingBrush.color = drawingColorEl.value;
            canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
            canvas.freeDrawingBrush.shadow = new fabric.Shadow({
                blur: parseInt(drawingShadowWidth.value, 10) || 0,
                offsetX: 0,
                offsetY: 0,
                affectStroke: true,
                color: drawingShadowColorEl.value,
            });

            canvas.centerObject(selected);
            canvas.add(selected);

            canvas.renderAll(); //canvas에 그린다.
            sendCanvas(GetElement('canvasForColor'), 1);  //canvas 보내기
        }
    });

    GetElement('add-layer').onclick = addLayer; addLayer();
    GetElement('merge-layer-objects').onclick = mergeObjectsByLayer;
}