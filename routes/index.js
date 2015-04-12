const express = require('express');
const router = express.Router();
const makePageModel = require('../pageModels/root');

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
