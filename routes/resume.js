// 重定向至简历页面

var router = require('express').Router();
// var AV = require('leanengine');

router.get('/', function(req, res, next) {
  res.render('resume');
});


module.exports = router;
