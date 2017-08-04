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

    var main_image_base64, main_image_str;
    var come = req.query.image.replace(/\s/gi, '+');
    //a 바꾸어질 문자, b 는 바뀔 문자가 되겠다.  g: 전역 검색 i: 대/소문자 구분 안함

    var fs = require('fs');  //파일 입출력 모듈

    if(req.query.flag==1) {
        main_image_base64 = come.replace('data:image/jpeg;base64,','');  //Decoding 전처리
        main_image_str = new Buffer(main_image_base64, 'base64');  //Decoding 부분
        fs.writeFile('image_transmissions/main_image.jpeg', main_image_str);  //파일 출력
    }
    else {
        main_image_base64 = come.replace('data:image/png;base64,','');  //Decoding 전처리
        main_image_str = new Buffer(main_image_base64, 'base64');  //Decoding 부분
        fs.writeFile('image_transmissions/main_image.png', main_image_str);  //파일 출력
    }
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
