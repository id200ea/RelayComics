var Cartoon = require('../javascripts/CartoonModel');

/* MySQL Connect */
var mysql = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '111111',
  database : 'relay_cartoon'
});
conn.connect();

/* ======================================================= */
/* Make Tree SQL Query */

/* "Make Tree" makeTree(cutNode) */
exports.makeTree = function makeTree(cutNode){
  this.cutNode = cutNode;
  console.log(cutNode);

  var sql_descendants = 'SELECT c.* FROM Cut AS c JOIN Treepaths AS t ON c.cut_num = t.descendant WHERE t.ancestor = ' + cutNode.num.toString() + ' ORDER BY cut_like DESC';
  conn.query(sql_descendants, function(err, rows) {
    if(err){
      console.log(err);
    } else {
      for(var i=0; i<rows.length; i++){
        cutNode.addChild(rows[i].cut_num, rows[i].cut_src, rows[i].cut_like);
        makeTree(cutNode.child[i]);
      }
    }
  });
};

/* ======================================================= */
/* Cut SQL Query */

/* "Cut Add" addCut(null, cutAuthor, cutStory, cutSrc, parentNum)
   or "Cartoon First Cut Create" addCut(cartoonNum, cutAuthor, cutStory, cutSrc)*/
exports.addCut = function addCut(cartoonNum, cutAuthor, cutStory, cutSrc, parentNum){
  this.cartoonNum = cartoonNum;
  this.cutAuthor = cutAuthor;
  this.cutStory = cutStory;
  this.cutSrc = cutSrc;
  this.parentNum = parentNum || null;

  var sql_add_cut = 'INSERT INTO Cut (cut_author, cut_story, cut_date, cut_src) VALUES ("' + cutAuthor.toString() + '","' + cutStory.toString() + '", now(),"' + cutSrc.toString() + '")';
  conn.query(sql_add_cut, function(err, row) {
    if(err){
      console.log(err);
    } else if(parentNum != null){
      // Cut Add
      console.log('cut 테이블에 추가되었습니다.');
      addTreepaths(parentNum, row.insertId);
    } else {
      // Cartoon First Cut Create
      console.log('title cut이 생성되었습니다.');
      addFirstCut(cartoonNum, row.insertId)
    }
  });
};

/* "Child Exist Cut Delete" delCut(cutNum, childExist)
   or "Childless Cut Delete" delCut(cutNum) */
exports.delCut = function delCut(cutNum, childExist){
  this.cutNum = cutNum;
  this.childExist = childExist || null;

  if(childExist != null){
    // Child Exist Cut Delete
    delComment(cutNum, null);
    alterCut(cutNum, "anyone", "컷을 그려주세요.", "/img/empty.jpg");
    console.log(cutNum + '컷 모두 사용 가능한 컷이 생성되었습니다.');
  } else {
    // Childless Cut Delete
    delComment(cutNum);
    delTreepaths(cutNum);

    var sql_del_cut = 'DELETE FROM Cut WHERE cut_num = ' + cutNum.toString();
    conn.query(sql_del_cut, function(err, row) {
      if(err){
        console.log(err);
      } else {
        console.log('cut 테이블에서 삭제되었습니다.');
      }
    });
  };
};

/* "Cut Alter" alterCut(cutNum, cutAuthor, cutStory, cutSrc) */
exports.alterCut = function alterCut(cutNum, cutAuthor, cutStory, cutSrc){
  this.cutNum = cutNum;
  this.cutAuthor = cutAuthor;
  this.cutStory = cutStory;
  this.cutSrc = cutSrc;

  var sql_alter_cut = 'UPDATE Cut SET cut_author = "' + cutAuthor.toString() + '", cut_story = "' + cutStory.toString() + '", cut_date = now(), cut_like=0, cut_src = "' + cutSrc.toString() + '" WHERE cut_num = ' + cutNum.toString() + ';';
  conn.query(sql_alter_cut, function(err, row) {
    if(err){
      console.log(err);
    } else {
      console.log("cut 내용이 변경되었습니다.");
    }
  });
};

//. cut들 변경 - user 탈퇴 시 사용됨
exports.alterCuts = function alterCuts(cutAuthor, cutStory, cutSrc){
  this.cutAuthor = cutAuthor;
  this.cutStory = cutStory;
  this.cutSrc = cutSrc;

  var sql_alter_cut = 'UPDATE Cut SET cut_author = "anyone", cut_story = "' + cutStory.toString() + '", cut_date = now(), cut_like=0, cut_src = "' + cutSrc.toString() + '" WHERE cutAuthor = ' + cutAuthor.toString() + ';';
  conn.query(sql_alter_cut, function(err, row) {
    if(err){
      console.log(err);
    } else {
      console.log("cut 내용이 모두 변경되었습니다.");
    }
  });
};

/* ======================================================= */
/* Treepaths SQL Query */

/* "Tree paths Add" addTreepaths(parentNum, cutNum) */
exports.addTreepaths = function addTreepaths(parentNum, cutNum){
  this.parentNum = parentNum;
  this.cutNum = cutNum;

  var sql_add_treepaths ='INSERT INTO Treepaths (ancestor, descendant) VALUES (' + parentNum.toString() + ',' + cutNum.toString() + ');';
  conn.query(sql_add_treepaths, function(err, row) {
    if(err){
      console.log(err);
    } else {
      console.log('treepaths 테이블에 추가되었습니다.');
    }
  });
};

/* "Tree paths Delete" delTreepaths(cutNum) */
exports.delTreepaths = function delTreepaths(cutNum){
  this.cutNum = cutNum;

  var sql_del_treepaths = 'DELETE FROM Treepaths WHERE descendant = ' + cutNum.toString();
  conn.query(sql_del_treepaths, function(err, row) {
    if(err){
      console.log(err);
    } else {
      console.log(cutNum + '컷 treepaths 테이블에서 삭제되었습니다.');
    }
  });
};

/* ======================================================= */
/* Comment SQL Query */

/* "Comment Add" addComment(cutNum, userId, comntCnt) */
exports.addComment = function addComment(cutNum, userId, comntCnt){
  this.cutNum = cutNum;
  this.userId = userId;
  this.comntCnt = comntCnt;

  var sql_add_comment = 'INSERT INTO Comment (cut_num, comnt_id, comnt_cnt, comnt_date) VALUES (' + cutNum.toString() + ', "' + userId.toString() + '", "' + comntCnt.toString() + '", now())';
  conn.query(sql_add_comment, function(err, row){
    if(err){
      console.log(err);
    } else {
      log('commnet 테이블에 추가되었습니다.');
    }
  });
};

/* "Comment Delete" delComment(cutNum, userId)
   or "User Withdrawal" delComment(null, userId)
   or "Cut Delete" delComment(cutNum, null) */
exports.delComment = function delComment(cutNum, userId){
  this.cutNum = cutNum || null;
  this.userId = userId || null;

  var sql_del_comment = 'DELETE FROM Comment WHERE ';

  if(userId*cutNum) {
    // Comment Delete
    sql_del_comment = sql_del_comment + 'comnt_id = ' + userId.toString() + ' AND cut_num = ' + cutNum.toString();
  } else if (userId) {
    // User Withdrawal
    sql_del_comment = sql_del_comment + 'comnt_id = ' + userId.toString();
  } else {
    // Cut Delete
    sql_del_comment = sql_del_comment + 'cut_num = ' + cutNum.toString();
  }

  conn.query(sql_del_comment, function(err, row){
    if(err){
      console.log(err);
    } else {
      console.log('댓글이 삭제되었습니다.');
    }
  });
};

/* "Comment List Output" listComment(cutNum) */
exports.listComment = function listComment(cutNum){
  this.cutNum = cutNum;

  var sql_list_comment = 'SELECT * FROM Comment WHERE cut_num = ' + cutNum.toString() + 'ORDER BY comnt_like DESC';

  conn.query(sql_comment_list, function(err, row){
    if(err){
      console.log(err);
    } else {
      console.log('cut의 comment list 출력');
    }
  });
};

/* ======================================================= */
/* Cartoon SQL Query */

/* "Cartoon Create" addCartoon(cartoonTitle, cartoonTag1, cartoonTag2, cartoonTag3) */
exports.addCartoon = function addCartoon(cartoonTitle, cartoonTag1, cartoonTag2, cartoonTag3){
  this.cartoonTitle = cartoonTitle;
  this.cartoonTag1 = cartoonTag1;
  this.cartoonTag2 = cartoonTag2;
  this.cartoonTag3 = cartoonTag3;

  var sql_add_cartoon = 'INSERT INTO Cartoon (cartoon_title, cartoon_tag1, cartoon_tag2, cartoon_tag3) VALUES ("' + cartoonTitle.toString() + '", "' + cartoonTag1.toString() + '", "' + cartoonTag3.toString() + '", "' + cartoonTag3.toString() + '")';
  conn.query(sql_add_cartoon, function(err, row) {
    if(err){
      console.log(err);
    } else {
      console.log('cartoon 테이블에 추가되었습니다.');
      addcut(row.insertId, "anyone", "타이틀입니다.", "/img/empty.jpg");
    }
  });
};

/* "Cartoon Delete" delCartoon(cartoonNum) */
exports.delCartoon = function delCartoon(cartoonNum){
  this.cartoonNum = cartoonNum;

  delFirstCut(cartoonNum);
  delLike(null, cartoonNum);

  var sql_del_cartoon = 'DELETE FROM Cartoon WHERE cartoon_num = ' + cartoonNum.toString();
  conn.query(sql_del_cartoon, function(err, row){
    if(err){
      console.log(err);
    } else {
      console.log('cartoon이 삭제되었습니다.');
    }
  });
};

/* "Cartoon List Output" listCartoon() */
exports.listCartoon = function listCartoon(){
  var list = [];
  var sql_list_cartoon = 'SELECT cartoon_num, cartoon_title, cartoon_like, first_cut, cut_src FROM Cartoon JOIN Cartoon_first_cut USING (cartoon_num) JOIN Cut WHERE first_cut = cut_num ORDER BY cartoon_like DESC';

  conn.query(sql_list_cartoon, function(err, rows){
    if(err){
      console.log(err);
    } else {
      for (var i = 0; i < rows.length; i++) {
        list[i] = new Cartoon(rows[i].cartoon_title, rows[i].cartoon_like, rows[i].first_cut, rows[i].cut_src);
        makeCartoon(list[i].root);
      }
    }
  });
};

/* "Make Cartoon" makeCartoon(cutNode) */
// 외부에서 부르는 함수가 아니기에 exports 안붙임
function makeCartoon(cutNode){
  this.cutNode = cutNode;

  var sql_descendants = 'SELECT c.* FROM Cut AS c JOIN Treepaths AS t ON c.cut_num = t.descendant WHERE t.ancestor = ' + cutNode.num.toString() + ' ORDER BY cut_like DESC';
  conn.query(sql_descendants, function(err, rows) {
    if(err){
      console.log(err);
    } else if(rows.length) {
      for(var i = 0; i < 1; i++){
        cutNode.addChild(rows[i].cut_num, rows[i].cut_src, rows[i].cut_like);
        makeCartoon(cutNode.child[i]);
      }
    }
  });
};

/* ======================================================= */
/* User SQL Query */

/* "User Join" addUser(userId, userName) */
exports.addUser = function addUser(userId, userName){
  this.userId = userId;
  this.userName = userName;

  var sql_join_user = 'INSERT INTO User (user_id, user_name) values ("' + userId.toString() + '", "'+ userName.toString() + '")';
  conn.query(sql_join_user, function(err, row){
    if(err){
      console.log(err);
    } else {
      console.log('회원가입이 완료되었습니다.');
    }
  })
};

/* "User Withdrawal" delUser(userId) */
exports.delUser = function delUser(userId){
  this.userId = userId;

  // User Withdrawal & Cartoon like Delete
  delLike(userId);
  // Comment Delete
  delComment(userId);
  // cut 삭제 or 변경 - 새로 만들어야 함
  alterCuts(userId, "컷을 그려주세요.", "/img/empty.jpg");

  // User Withdrawal
  var sql_leave_user = 'DELETE FROM User WHERE user_id = ' + userId.toString();
  conn.query(sql_leave_user, function(err, row){
    if(err){
      console.log(err);
    } else {
      console.log('회원 탈퇴가 완료되었습니다.');
    }
  });
};

/* "UserName Alter" alterUser(userId, userName) */
exports.alterUser = function alterUser(userId, userName){
  this.userId = userId;
  this.userName = userName;

  var sql_alter_user = 'UPDATE User SET user_name = "' + userName.toString() + '" WHERE user_id = ' + user_id.toString();
  conn.query(sql_alter_user, function(err, row) {
    if(err){
      console.log(err);
    } else {
      console.log("user의 닉네임이 변경되었습니다.");
    }
  });
};

/* ======================================================= */
/* Cartoon_like_log SQL Query */

/* "Like Register" addLike(userId, cartoonNum) */
exports.addLike = function addLike(userId, cartoonNum){
  this.userId = userId;
  this.cartoonNum = cartoonNum;

  var sql_add_like = 'INSERT INTO Cartoon_like_log (cartoon_num, user_id, cartoon_like_date) VALUES (' + cartoonNum.toString() + ', "' + userId.toString() + '", now())';
  conn.query(sql_add_like, function(err, row){
    if(err){
      console.log(err);
    } else {
      console.log('만화 좋아요.');
    }
  });
};

/* "Cartoon like Cancel" delLike(userId, cartoonNum)
   or "User Withdrawal" delLike(userId, null)
   or "Cartoon Delete" delLike(null, cartoonNum) */
exports.delLike = function delLike(userId, cartoonNum){
  this.userId = userId || null;
  this.cartoonNum = cartoonNum || null;

  var sql_del_like = 'DELETE FROM Cartoon_like_log WHERE '
  if(userId*cartoonNum){
    // Cartoon like Cancel
    sql_del_like = sql_del_like + 'user_id = "' + userId.toString() + '" AND cartoon_num = ' + cartoonNum.toString();
  } else if (userId) {
    // User Withdrawal
    sql_del_like = sql_del_like + 'user_id = "' + userId.toString();
  } else {
    // Cartoon Delete
    sql_del_like = sql_del_like + 'cartoon_num = ' + cartoonNum.toString();
  }
  conn.query(sql_del_like, function(err, row){
    if(err){
      console.log(err);
    } else {
      console.log('좋아요 기록이 삭제되었습니다.');
    }
  });
};

/* ======================================================= */
/* Cartoon_first_cut SQL Query */

/* "Cartoon Register" addFirstCut(cartoonNum, firstCutNum) */
exports.addFirstCut = function addFirstCut(cartoonNum, firstCut){
  this.cartoonNum = cartoonNum;
  this.firstCut = firstCut;

  var sql_add_firstcut = 'INSERT INTO Cartoon_first_cut VALUES (' + cartoonNum.toString() + ', ' + firstCut.toString() + ')';
  conn.query(sql_add_firstcut, function(err, row){
    if(err){
      console.log(err);
    } else {
      console.log('firstCut이 추가되었습니다.');
    }
  });
};

/* "Cartoon Delete" delFirstCut(cartoonNum) */
exports.delFirstCut = function delFirstCut(cartoonNum){
  this.cartoonNum = cartoonNum;

  returnFirstCut(cartoonNum);
  var sql_del_firstcut = 'DELETE FROM Cartoon_first_cut WHERE cartoon_num = ' + cartoonNum.toString();
  conn.query(sql_del_firstcut, function(err, row){
    if(err){
      console.log(err);
    } else {
      console.log('firstCut을 삭제하였습니다.');
    }
  });
};

/* ======================================================= */
// KEEP

// 하위 노드가 있는지 검사하는 함수
exports.returnFirstCut = function returnFirstCut(cartoonNum){
  this.cartoonNum = cartoonNum;

  var sql_return_firstcut = "SELECT * FROM Cartoon_first_cut WHERE cartoon_num = " + cartoonNum.toString();
  conn.query(sql_return_firstcut, function(err, row) {
    if(err){
      console.log(err);
    } else {
      for (var i = 0; i < row.length; i++) {
        checkAncs(row[i].first_cut);
      }
    }
  });
};

exports.checkAncs = function checkAncs(cutNum){
  this.cutNum = cutNum;

  var sql_check_ancestor = 'SELECT EXISTS (SELECT * FROM Treepaths WHERE ancestor = ' + cutNum.toString() + ') AS Exist';
  conn.query(sql_check_ancestor, function(err, rows) {
    if(err){
      console.log(err);
    } else {
      for (var i = 0; i < rows.length; i++){
        if(rows[i].Exist == 0){
          delComment(cutNum);
          delCut(cutNum);
        }
      }
    }
  });
};

exports.upCutLike = function upCutLike(cutNum){
  this.cutNum = cutNum;

  var sql_up_cut_like = 'UPDATE Cut SET cut_like = cut_like + 1 WHERE cut_num = ' + cutNum.toString();
  conn.query(sql_up_cut_like, function(err, rows) {
    if(err){
      console.log(err);
    } else {
      console.log('바뀜');
    }
  });
};

exports.downCutLike = function downCutLike(cutNum){
  this.cutNum = cutNum;

  var sql_down_cut_like = 'UPDATE Cut SET cut_like = cut_like - 1 WHERE cut_num = ' + cutNum.toString();
  conn.query(sql_down_cut_like, function(err, rows) {
    if(err){
      console.log(err);
    } else {
      console.log('바뀜');
    }
  });
};

exports.upCartoonLike = function upCartoonLike(cartoonNum){
  this.cartoonNum = cartoonNum;

  var sql_up_cartoon_like = 'UPDATE Cartoon SET cartoon_like = cartoon_like + 1 WHERE cartoon_num = ' + cartoonNum.toString();
  conn.query(sql_up_cartoon_like, function(err, rows) {
    if(err){
      console.log(err);
    } else {
      console.log('바뀜');
    }
  });
};

exports.downCartoonLike = function downCartoonLike(cartoonNum){
  this.cartoonNum = cartoonNum;

  var sql_down_cartoon_like = 'UPDATE Cartoon SET cartoon_like = cartoon_like - 1 WHERE cartoon_num = ' + cartoonNum.toString();
  conn.query(sql_down_cartoon_like, function(err, rows) {
    if(err){
      console.log(err);
    } else {
      console.log('바뀜');
    }
  });
};

exports.upCommentLike = function upCommentLike(commentNum){
  this.commentNum = commentNum;

  var sql_up_comment_like = 'UPDATE Comment SET comnt_like = comnt_like + 1 WHERE comnt_num = ' + commentNum.toString();
  conn.query(sql_up_comment_like, function(err, rows) {
    if(err){
      console.log(err);
    } else {
      console.log('바뀜');
    }
  });
};

exports.downCommentLike = function downCommentLike(commentNum){
  this.commentNum = commentNum;

  var sql_down_comment_like = 'UPDATE Comment SET comnt_like = comnt_like + 1 WHERE comnt_num = ' + commentNum.toString();
  conn.query(sql_down_comment_like, function(err, rows) {
    if(err){
      console.log(err);
    } else {
      console.log('바뀜');
    }
  });
};



// exports.output = function output(num){
//   this.num = num;
//
//   console.log(num);
// };

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
