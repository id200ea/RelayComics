var express = require('express');
var router = express.Router();
var Cartoon = require('../public/javascripts/CartoonModel');

/* GET home page. */
var mysql = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '111111',
  database : 'relay_cartoon'
});
//conn.connect();

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

// 처음 트리 생성하는 함수
function makeTree(cutNode){
  this.cutNode = cutNode;
  var sql_descendants = 'SELECT c.* FROM cut AS c JOIN treepaths AS t ON c.cut_num = t.descendant WHERE t.ancestor = ' + cutNode.num.toString();
  conn.query(sql_descendants, function(err, rows) {
    if(err){
      console.log(err);
    } else {
      for(var i=0; i<rows.length; i++){
        // console.log(i);
        cutNode.addChild(rows[i].cut_num, rows[i].cut_src);
        console.log(rows[i]);
        makeTree(cutNode.child[i]);
      }
      // console.log(cutNode);
    }
  });
};

// 노드 추가하는 함수
// DB에서 cutNum 자동 증가 값이로 변경하기
function addNode(parentNum, cutNum, cartoonNum, cutAuthor, cutStory, cutSrc){
  this.parentNum = parentNum;
  this.cutNum = cutNum;
  this.cartoonNum = cartoonNum;
  this.cutAuthor = cutAuthor; //글쓴이
  this.cutStory = cutStory;
  this.cutSrc = cutSrc;

  // cut에 추가
  var sql_cut_insert = 'INSERT INTO cut (cut_num, cartoon_num, cut_author, cut_story, cut_date, cut_src) VALUES (' + cutNum.toString() + ',' + cartoonNum.toString() + ', "' + cutAuthor.toString() + '","' + cutStory.toString() + '", now(),"' + cutSrc.toString() + '")';
  conn.query(sql_cut_insert, function(err, row) {
    if(err){
      console.log(err);
    } else {
      console.log('cut 테이블에 추가되었습니다.');
      addTreepaths(parentNum, cutNum);
    }
  });
};

function addTreepaths(parentNum, cutNum){
  this.parentNum = parentNum;
  this.cutNum = cutNum;
  var sql_treepaths_insert ='INSERT INTO treepaths (ancestor, descendant) VALUES (' + parentNum.toString() + ',' + cutNum.toString() + ');';
  conn.query(sql_treepaths_insert, function(err, row) {
    if(err){
      console.log(err);
    } else {
      console.log('treepaths 테이블에 추가되었습니다.');
    }
  });
};

// 노드 삭제하는 함수
function delNode(parentNum, cutNum, cartoonNum, childExist){
  this.parentNum = parentNum;
  this.cutNum = cutNum;
  this.cartoonNum = cartoonNum;
  this.childExist = childExist || NULL;

  if(childExist){
    // child 존재 할 경우 : 해당 cut 내용 변경
    var cutAuthor = "anyone"; //글쓴이
    var cutStory = "컷을 그려주세요.";
    var cutSrc = "/img/empty.jpg";

    alterNode(cutNum, cutAuthor, cutStory, cutSrc);
    console.log('모두 사용 가능한 컷이 생성되었습니다.');
  } else {
    // child 존재 안함 : treepaths & cut 테이블에서 삭제
    delTreepaths(cutNum);

    var sql_cut_delete = 'DELETE FROM cut WHERE cut_num = ' + cutNum.toString();
    conn.query(sql_cut_delete, function(err, row) {
      if(err){
        console.log(err);
      } else {
        console.log('cut 테이블에서 삭제되었습니다.');
      }
    });
  };
};

function delTreepaths(cutNum){
  this.cutNum = cutNum;

  var sql_treepaths_delete = 'DELETE FROM treepaths WHERE descendant = ' + cutNum.toString();
  conn.query(sql_treepaths_delete, function(err, row) {
    if(err){
      console.log(err);
    } else {
      console.log('treepaths 테이블에서 삭제되었습니다.');
    }
  });
};

// cut 변경
function alterNode(cutNum, cutAuthor, cutStory, cutSrc){
  this.cutNum = cutNum;
  this.cutAuthor = cutAuthor;
  this.cutStory = cutStory;
  this.cutSrc = cutSrc;

  var sql_cut_alter = 'UPDATE cut SET cut_author = "' + cutAuthor.toString() + '", cut_story = "' + cutStory.toString() + '", cut_date = now(), cut_like=0, cut_src = "' + cutSrc.toString() + '" WHERE cut_num = ' + cutNum.toString() + ';';
  conn.query(sql_cut_alter, function(err, row) {
    if(err){
      console.log(err);
    } else {
      console.log("cut 내용이 변경되었습니다.");
    }
  });
};

// KEEP

// // treepaths 변경
// function alterTreepaths(){
//
//   var sql_treepaths_alter = '';
//   conn.query(sql_treepaths_alter, function(err, row) {
//     if(err){
//       console.log(err);
//     } else {
//
//     }
//   });
// };
//
// // 노드 이동하는 함수
// function moveNode(parentNodeNum, cutNode){
//   this.parentNodeNum = parentNodeNum;
//   this.cutNode = cutNode;
//   var sql_move_subtree_move = 'INSERT INTO TreePaths (ancestor, descendant) VALUES (' + parentNodeNum.toString() + ',' + cutNode.num.toString() + ')';
//   conn.query(sql_move_subtree_move, function(err, row) {
//     if(err){
//       console.log(err);
//     } else {
//       // 부모 Cut에 child 변경해주고 child의 parent 변경
//       console.log('treepaths 테이블에서 삭제되었습니다.');
//     }
//   });
// };

module.exports = router;
