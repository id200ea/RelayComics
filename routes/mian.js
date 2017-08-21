var express = require('express');
var router = express.Router();
var sql = require('../public/javascripts/CartoonSQL');

/* GET users listing. */
router.get('/', function(req, res, next) {

  // listCartoon 테스트
  var test = [];
  sql.listCartoon(test);
  setTimeout(function(){
    // for (var i = 0; i < test.length; i++) {
    //   console.log('22222222222');
    //   console.log(test[i]);
    // }
    console.log('22222222222');
    console.log(test);
    res.render('detail', {cartoon:JSON.stringify(test)});
  }, 2000);

  res.render('main');
});

module.exports = router;
