const express = require('express');
const router = express.Router();
const makePageModel = require('../pageModels/root');
const getUsers = require('../providers/authentication');
const co = require('co');

router.get('/', function(req, res, next) {
  co(function*(){
    const users = yield getUsers();
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
