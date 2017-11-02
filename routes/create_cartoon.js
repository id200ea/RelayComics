/**
 * Created by bgh29 on 2017-09-29.
 */

var express = require('express');
var router = express.Router();
/* GET users listing. */

router.get('/', function(req, res, next) {
    res.render('createCartoon');
});

module.exports = router;