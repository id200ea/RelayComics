var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var detail = require('./routes/cartoon_detail');
var main = require('./routes/mian');
var canvas = require('./routes/canvas');

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

//지응 코드
app.get('/image_receiver', function (req, res) {
    var image_Base64 = req.query.title.replace('data:image/png;base64,','');  //Decoding 전처리
    var B_Image_Str = new Buffer(image_Base64, 'base64');  //Decoding 부분
    var fs = require('fs');  //파일 입출력 모듈
    fs.writeFile('image_transmission/image.png', B_Image_Str);  //파일 출력
    res.send("전송완료");  //여기에 그림 파일 보내주면 될듯.
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
