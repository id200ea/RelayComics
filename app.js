var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var detail = require('./routes/cartoon_detail');
var main = require('./routes/mian');
var canvas = require('./routes/canvas');
var pyshell = require('python-shell'); 

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', main);
app.use('/detail', detail);
app.use('/canvas', canvas);

//주영 코드
var arg = {
    img_path : './image_transmissions/input.png',
    mask_path : './image_transmissions/mask.png',
    out_path : './image_transmissions/output.png'
}
function set_img_path(_imgPath){
    arg.img_path = _img_path;
}
function set_mask_path(_maskPath){
    args.mask_path = _maskPath;
}
function set_out_path(_outPath){
    args.out_path = _outPath;
}

var options = {
    mode : 'text',
    pythonPath : '',
    pythonOptions : ['-u'],
    scriptPath : '',
    args : [arg.img_path, arg.mask_path, arg.out_path]
};
//주영 코드 끝

//지응 코드
app.get('/image_receiver', function (req, res) {

    var main_image_base64, main_image_str;
    var come = req.query.image.replace(/\s/gi, '+');
    //a 바꾸어질 문자, b 는 바뀔 문자가 되겠다.  g: 전역 검색 i: 대/소문자 구분 안함

    var fs = require('fs');  //파일 입출력 모듈
    main_image_base64 = come.replace('data:image/png;base64,','');  //Decoding 전처리
    main_image_str = new Buffer(main_image_base64, 'base64');  //Decoding 부분

    if(req.query.flag==1) {
        fs.writeFile('image_transmissions/input.png', main_image_str);  //파일 출력
    }
    else {
        fs.writeFile('image_transmissions/mask.png', main_image_str);  //파일 출력
	    colorpy = new pyshell('PythonClient.py',options);
    }
    colorpy.on('close',function(message){

    });
});
//지응 코드 끝

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in developmentz
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
