var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bkfd2Password = require("pbkdf2-password");
var passport = require('passport');
var hasher = bkfd2Password();
var mysql = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '111111',
  database : 'relay_comics'
});
conn.connect();

var FacebookStrategy = require('passport-facebook').Strategy;
var NaverStrategy = require('passport-naver').Strategy;

var createCartoon = require('./routes/create_cartoon')
var detail = require('./routes/cartoon_detail');
var main = require('./routes/mian');
var canvas = require('./routes/canvas');
var sql = require('./public/javascripts/CartoonSQL');
var pyshell = require('python-shell');
var path = require('path');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '10mb'}));//Post 제한을 푼다
//app.use(bodyParser.urlencoded({limit:'10mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: '2a3#FSdfl#$@DFaER',
  resave: false,
  saveUninitialized: true,
  store:new MySQLStore({
    host:'localhost',
    port:3306,
    user:'root',
    password:'111111',
    database:'relay_comics'
  })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', main);
app.use('/detail', detail);
app.use('/canvas', canvas);
app.use('/create_cartoon', createCartoon);

//주영 코드
var arg = {
    img_path : './image_transmissions/line/input.png',
    mask_path : './image_transmissions/ref/input.png',
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
app.post('/image_receiver', function (req, res) {

    var main_image_base64, main_image_str;
    var come = req.body.image.replace(/\s/gi, '+');
    //a 바꾸어질 문자, b 는 바뀔 문자가 되겠다.  g: 전역 검색 i: 대/소문자 구분 안함

    var fs = require('fs');  //파일 입출력 모듈
    main_image_base64 = come.replace('data:image/png;base64,','');  //Decoding 전처리
    main_image_str = new Buffer(main_image_base64, 'base64');  //Decoding 부분

    if(req.body.flag==3){
        var date = new Date();
        var timeStr = date.getFullYear() +"_"+ date.getMonth()+"_"+ date.getDate()+"_"+date.getHours()+"_"+date.getMinutes()+"_"+date.getSeconds()+"_"+date.getMilliseconds();
        var fileName = "new_" + timeStr +".png";
        fs.writeFile("public/images/"+fileName, main_image_str);  //파일 출력
        parentNum = parseInt(req.body.parent);
        console.log(parentNum+"이다");
        // sql.addCut(null, cutAuthor, cutStory, cutSrc, parentNum)
        sql.addCut(null, User.authId, req.body.text, "../images/"+fileName, parentNum);
    }
    else if(req.body.flag==1) {
        fs.writeFile('image_transmissions/line/input.png', main_image_str);  //파일 출력
    }
    else if(req.body.flag==2){
        fs.writeFile('image_transmissions/ref/input.png', main_image_str);  //파일 출력
        colorpy = new pyshell('PythonClient.py', options);
    }
    colorpy.on('close',function(message){
        //아래 파일 respon 코드
        var bitmap = fs.readFileSync("image_transmissions/output.png");
        var buff = new Buffer(bitmap).toString('base64');
        res.end(buff);
    });
});



function swapPose(pose1, pose2){
    var temp;
    for(var i=0 ; i<3 ; i++) {
        temp = pose1[i];
        pose1[i] = pose2[i];
        pose2[i] = temp;
    }
}

function copyPose(from, to){
    for(var i=0 ; i<3 ; i++){
        to[i] = from[i];
    }
}
function copyMidPose(from1, from2, to){
    for(var i=0 ; i<3 ; i++){
        to[i] = (from1[i]+from2[i])/2;
    }
}

function changePoseToKinect(poseString, callback){
    var poseNum = 15;
    var kinectPoseNum = 25;
    var pose = poseString.split(",");
    var posePoint = [];
    var kinectPosePoint = [];
    var kinectPose = "";
    for(var i = 0 ; i<kinectPoseNum ; i++) {
        kinectPosePoint[i] = [];
    }

    for(var i=0 ; i<poseNum ; i++){
        posePoint[i] = [];
        posePoint[i].push(parseFloat(pose[i*3]));
        posePoint[i].push(parseFloat(pose[i*3+1]));
        posePoint[i].push(parseFloat(pose[i*3+2]));
    }

    swapPose(posePoint[0], posePoint[6]);
    swapPose(posePoint[1], posePoint[2]);
    swapPose(posePoint[3], posePoint[6]);
    swapPose(posePoint[4], posePoint[6]);
    swapPose(posePoint[5], posePoint[6]);
    swapPose(posePoint[9], posePoint[12]);
    swapPose(posePoint[10], posePoint[13]);
    swapPose(posePoint[11], posePoint[14]);
    swapPose(posePoint[12], posePoint[14]);

    var zeroPoint = [ 0, 0, 0];
    copyPose(posePoint[0], kinectPosePoint[0]);
    copyMidPose(posePoint[0], posePoint[7], kinectPosePoint[1]);
    copyMidPose(posePoint[7], posePoint[8], kinectPosePoint[2]);
    copyPose(posePoint[8], kinectPosePoint[3]);
    copyPose(posePoint[9], kinectPosePoint[4]);
    copyPose(posePoint[10], kinectPosePoint[5]);
    copyPose(posePoint[11], kinectPosePoint[6]);
    copyPose(zeroPoint, kinectPosePoint[7]);
    copyPose(posePoint[12], kinectPosePoint[8]);
    copyPose(posePoint[13], kinectPosePoint[9]);
    copyPose(posePoint[14], kinectPosePoint[10]);
    copyPose(zeroPoint, kinectPosePoint[11]);
    copyPose(posePoint[4], kinectPosePoint[12]);
    copyPose(posePoint[5], kinectPosePoint[13]);
    copyPose(posePoint[6], kinectPosePoint[14]);
    copyPose(zeroPoint, kinectPosePoint[15]);
    copyPose(posePoint[1], kinectPosePoint[16]);
    copyPose(posePoint[2], kinectPosePoint[17]);
    copyPose(posePoint[3], kinectPosePoint[18]);
    copyPose(zeroPoint, kinectPosePoint[19]);
    copyPose(posePoint[7], kinectPosePoint[20]);
    copyPose(zeroPoint, kinectPosePoint[21]);
    copyPose(zeroPoint, kinectPosePoint[22]);
    copyPose(zeroPoint, kinectPosePoint[23]);
    copyPose(zeroPoint, kinectPosePoint[24]);

    for(var i=0 ; i<kinectPoseNum ;i++){
        if(i==kinectPoseNum-1)
            kinectPose += kinectPosePoint[i][0]+","+kinectPosePoint[i][1]+","+kinectPosePoint[i][2];
        else
            kinectPose += kinectPosePoint[i][0]+","+kinectPosePoint[i][1]+","+kinectPosePoint[i][2]+",";
    }
    callback(kinectPose);
}

//지응 코드
app.post('/pose_image_receiver', function (req, res) {

    var main_image_base64, main_image_str;
    var come = req.body.image.replace(/\s/gi, '+');
    //a 바꾸어질 문자, b 는 바뀔 문자가 되겠다.  g: 전역 검색 i: 대/소문자 구분 안함

    main_image_base64 = come.replace('data:image/png;base64,','');  //Decoding 전처리
    main_image_base64 = main_image_base64.replace('data:image/jpeg;base64,','');  //Decoding 전처리
    main_image_base64 = main_image_base64.replace('data:image/jpg;base64,','');  //Decoding 전처리
    main_image_base64 = main_image_base64.replace('data:image/bmp;base64,','');  //Decoding 전처리
    main_image_str = new Buffer(main_image_base64, 'base64');  //Decoding 부분

    var fs = require('fs');  //파일 입출력 모듈
    fs.writeFile('image_transmissions/ref/pose_input.png', main_image_str);  //파일 출력
	posepy = new pyshell('poseClient.py');
    posepy.on('close',function(message){
        //아래 파일 respon 코드
        var txt = fs.readFileSync("./image_transmissions/ref/3d_pose.txt");
        changePoseToKinect(txt, function(pose) {res.end(pose);})

    });
});

//지응 코드 끝

// DB 저장
// Add Cartoon
app.post('/add_cartoon', function (req, res) {
  cartoonTitle = req.body.cartoon_name;
  var tag = [];
    if(req.body.episode)
        tag.push('episode');
    if(req.body.omnibus)
        tag.push('omnibus');
    if(req.body.story)
        tag.push('story');
    if(req.body.daily)
        tag.push('daily');
    if(req.body.gag)
        tag.push('gag');
    if(req.body.fantasy)
        tag.push('fantasy');
    if(req.body.action)
        tag.push('action');
    if(req.body.drama)
        tag.push('drama');
    if(req.body.pure)
        tag.push('pure');
    if(req.body.emotion)
        tag.push('emotion');
    if(req.body.thriller)
        tag.push('thriller');
    if(req.body.historical)
        tag.push('historical');
    if(req.body.sport)
        tag.push('sport');
    console.log(cartoonTitle);
    console.log(tag[0]+", "+tag[1]+", "+tag[2])
    // sql.addCartoon(cartoonTitle, '#드라마', '#학원', '#일상');
   sql.addCartoon(cartoonTitle, tag[0], tag[1], tag[2], function(rootCutNum){
       return res.redirect('/detail?title='+cartoonTitle+'&rootCutNum='+rootCutNum);
   });
});

// Add Cut
app.get('/add_cut', function (req, res) {
  // 컷 내용 story
  // cutStory = req.query.story;
  cutSrc = req.query.src;
  parentNum = parseInt(req.query.pnum);
  // sql.addCut(null, cutAuthor, cutStory, cutSrc, parentNum)
  sql.addCut(null, User.authId, "asd", cutSrc, parentNum);
});

// Delete Cut
app.get('/del_cut', function (req, res) {
  cutNum = parseInt(req.query.num);
  // Exist : 1
  childExist = parseInt(req.query.child);
  console.log("app.js "+cutNum+", "+childExist);
  sql.delCut(cutNum, childExist);
});

// Cut Like
app.get('/modi_like', function (req, res) {
  cutNum = parseInt(req.query.num);
  console.log(req.query.num.toString()+", "+ req.query.flag);
  if(req.query.flag=='add'){
    // sql.upCutLike(cutNum, userId)
    sql.upCutLike(cutNum, User.authId);
  }else {
    // sql.downCutLike(cutNum, userId)
    sql.downCutLike(cutNum, User.authId);
  }
});
// DB 저장 끝

global.User = {
  id : '',
  authId : '',
  displayName : '',
  email : ''
};
console.log('User.displayName.length: ' + User.displayName.length);

passport.serializeUser(function(user, done) {
  console.log('serializeUser', user);
  done(null, user.authId);
});
passport.deserializeUser(function(id, done) {
  console.log('deserializeUser', id);
  var sql = 'SELECT * FROM users WHERE authId=?';
  conn.query(sql, [id], function(err, results){
    if(err){
      console.log(err);
      done('There is no user.');
    } else {
      done(null, results[0]);
      User.id = results[0].id;
      User.authId = results[0].authId;
      User.displayName = results[0].displayName;
      User.email = results[0].email;
      console.log('deserializeUser : ');
      console.log(User);
    }
  });
});

// LocalStrategy가 없으므로 필요 없음
// app.post(
//   '/auth/login',
//   passport.authenticate(
//     'local',
//     {
//       successRedirect: '/',
//       failureRedirect: '/auth/login',
//       failureFlash: false
//     }
//   )
// );

app.get('/auth/login', function(req, res){
  res.sendFile(path.join(__dirname+'/public/html/login.html'));
});
app.get('/auth/logout', function(req, res){
  req.logout();
  User.id = '';
  User.authId = '';
  User.displayName = '';
  User.email = '';
  console.log('logout :');
  console.log(User);
  // req.session.save(function(){
    res.redirect('/');
  // });
});

app.get('/auth/facebook',
  passport.authenticate('facebook', {scope:'email'})
);
app.get('/auth/facebook/callback',
  passport.authenticate('facebook',
    {
      successRedirect: '/',
      failureRedirect: '/auth/login'
    }
  )
);

app.get('/auth/naver',
	passport.authenticate('naver', null), function(req, res) {
  	console.log('/auth/naver failed, stopped');
  }
);
app.get('/auth/naver/callback',
	passport.authenticate('naver',
    {
      successRedirect: '/',
      failureRedirect: '/auth/login'
    }
  )
);

passport.use(new FacebookStrategy({
  clientID: '118611395451455',
  clientSecret: 'b1520057b275ee2b1a8f183e83b294ca',
  callbackURL: "/auth/facebook/callback",
  profileFields:['id', 'email', 'displayName']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    var authId = 'facebook:'+profile.id;
    var sql = 'SELECT * FROM Users WHERE authId=?';
    conn.query(sql, [authId], function(err, results){
     if(results.length>0){
       done(null, results[0]);
     } else {
       var newuser = {
         'authId':authId,
         'displayName':profile.displayName,
         'email':profile.emails[0].value
       };
       var sql = 'INSERT INTO Users SET ?'
       conn.query(sql, newuser, function(err, results){
         if(err){
           console.log(err);
           done('Error');
         } else {
           done(null, newuser);
         }
       })
     }
   });
 }));

passport.use(new NaverStrategy({
        clientID: 'kLpOYbvtcMTxjvB6_qRV',
        clientSecret: '67xBbvLGgF',
        callbackURL: "/auth/naver/callback",
        profileFields:['id', 'email', 'displayName']
	},
  function(accessToken, refreshToken, profile, done) {
      console.log(profile);
      var authId = 'naver:'+profile.id;
      var sql = 'SELECT * FROM Users WHERE authId=?';
      conn.query(sql, [authId], function(err, results){
        if(results.length>0){
          done(null, results[0]);
        } else {
          var newuser = {
            'authId':authId,
            'displayName':profile.displayName,
            'email':profile.emails[0].value
          };
          var sql = 'INSERT INTO Users SET ?'
          conn.query(sql, newuser, function(err, results){
            if(err){
              console.log(err);
              done('Error');
            } else {
              done(null, newuser);
            }
          })
        }
      });
    }
));

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
