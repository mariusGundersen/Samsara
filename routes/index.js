var express = require('express');
var router = express.Router();
var makePageModel = require('../private/makePageModel');
var Promise = require('promise');

router.get('/', function(req, res, next) {
  Promise.resolve(
    makePageModel('Samsara', {}, null)
  ).then(function (pageModel) {
    res.render('index', pageModel);
  }).catch(function(err){
    res.render('error', {content:{message: error.message, error: error}});
  });
});

module.exports = router;
