var express = require('express');
var router = express.Router();
var makePageModel = require('../pageModels/root');
var users = require('../providers/authentication');

router.get('/', function(req, res, next) {
  users().then(function(users){
    return makePageModel('Settings', {
      users: users
    }, 'settings')
  }).then(function (pageModel) {
    res.render('settings', pageModel);
  }).catch(function(err){
    res.render('error', {content:{message: error.message, error: error}});
  });
});

module.exports = router;
