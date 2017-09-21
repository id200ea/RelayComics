/**
 * Created by bgh29 on 2017-09-11.
 */
(function() {
    var OtsuJS;

    OtsuJS = {};

    OtsuJS.threshold = function (imgData) {
        var histogram = new Array(256);
        console.log(histogram.length);
        var totalNum = imgData.data.length *imgData.data[0].length;
        var totalSum;

        for(var i=0 ; i<histogram.length ; i++)
            histogram[i]=0;

        for(var i=0 ; i<imgData.data.length ; i++){
            for(var j=0 ; j<imgData.data[0].length ; j++){
                histogram[imgData.data[i][j]]++;
            }
        }
        console.log("histogram", histogram);
        totalSum = 0;
        for(var i=0; i<histogram.length ; i++){
            totalSum+=histogram[i]*i;
        }

        var backgroundSum=0, weightB=0, weightF=0;
        var maxVar=0;
        var threshold=0;

        for(var t=0 ; t<histogram.length ; t++){
            weightB+= histogram[t];
            if(weightB==0) continue;

            weightF = totalNum - weightB;
            if(weightF==0) break;

            backgroundSum += t*histogram[t];

            var meanB = backgroundSum / weightB;
            var meanF = (totalSum - backgroundSum) / weightF;

            var varBetween = weightB*weightF*Math.pow((meanB-meanF), 2);

            if(varBetween>maxVar){
                maxVar = varBetween;
                threshold = t;
            }
        }

        viewCtx.clearRect(0,0,500,500);
        for(var x=0 ; x<501 ; x+=2) {
            for (var y = 0; y < histogram[x/2]/8; y++) {
                viewCtx.beginPath();
                viewCtx.arc(x, 500-y, 0.5, 0, 2 * Math.PI, false);
                viewCtx.fillStyle = 'black';
                viewCtx.fill();
                viewCtx.beginPath();

                viewCtx.beginPath();
                viewCtx.arc(x + 1, 500-y, 0.5, 0, 2 * Math.PI, false);
                viewCtx.fillStyle = 'black';
                viewCtx.fill();
                viewCtx.beginPath();
            }

        }
        console.log("threshold", threshold);

        for(var y=0 ; y<501 ; y++){
            viewCtx.beginPath();
            viewCtx.arc(threshold*2, y, 0.5, 0, 2 * Math.PI, false);
            viewCtx.fillStyle = 'red';
            viewCtx.fill();
            viewCtx.beginPath();

            viewCtx.beginPath();
            viewCtx.arc(threshold*2+1, y, 0.5, 0, 2 * Math.PI, false);
            viewCtx.fillStyle = 'red';
            viewCtx.fill();
            viewCtx.beginPath();
        }
        return threshold;
    };

    window.OtsuJS = OtsuJS;

}).call(this);