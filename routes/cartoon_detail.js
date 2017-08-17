var express = require('express');
var router = express.Router();
var Cartoon = require('../public/javascripts/CartoonModel');
var sql = require('../public/javascripts/CartoonSQL');

router.get('/', function(req, res, next) {

  // // makeTree 테스트
  // var test = new Cartoon("testTitle", 1, "img");
  // makeTree(test.root);
  // console.log(test);

  // // addNode 테스트
  // addNode(8, 11, 1, "kke", "1번째 만화 11번째 컷", "/img/11.jpg");

  // // delNode 테스트
  // delNode(8, 11, 1, 0); // 말단 노드
  // delNode(4, 8, 1, 1);  // 하위노드를 가진 노드

  res.render('detail');
});

module.exports = router;
