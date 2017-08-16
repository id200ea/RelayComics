function edgeDetector(){
    this.ctx = undefined;

    this.pixelData = undefined;
    this.threshold = 100;

    this.findEdges = function(){
        this.copyImage();
        this.coreLoop();
    };

    this.copyImage = function(){
        this.pixelData = viewCtx.getImageData(0,0,500, 500);
        viewCtx.clearRect(0,0,500,500);
    };

    this.coreLoop = function(){
        var x = 0;
        var y = 0;

        var left = undefined;
        var top = undefined;
        var right = undefined;
        var bottom = undefined;

        for(y=0;y<500;y++){
            for(x=0;x<500;x++){
                index = (x + y * 500) * 4;
                pixel = this.pixelData.data[index+2];

                left = this.pixelData.data[index-4];
                right = this.pixelData.data[index+2];
                top = this.pixelData.data[index-(500*4)];
                bottom = this.pixelData.data[index+(500*4)];

                if(pixel>left+this.threshold)
                    this.plotPoint(x,y);
                else if(pixel<left-this.threshold)
                    this.plotPoint(x,y);
                else if(pixel>right+this.threshold)
                    this.plotPoint(x,y);
                else if(pixel<right-this.threshold)
                    this.plotPoint(x,y);
                else if(pixel>top+this.threshold)
                    this.plotPoint(x,y);
                else if(pixel<top-this.threshold)
                    this.plotPoint(x,y);
                else if(pixel>bottom+this.threshold)
                    this.plotPoint(x,y);
                else if(pixel<bottom-this.threshold)
                    this.plotPoint(x,y);
            }
        }
    };

    this.plotPoint = function(x,y){
        viewCtx.beginPath();
        viewCtx.arc(x, y, 0.5, 0, 2 * Math.PI, false);
        viewCtx.fillStyle = 'black';
        viewCtx.fill();
        viewCtx.beginPath();
    };
}

var edgeDetector = new edgeDetector();

function edge(){
    edgeDetector.findEdges();
}