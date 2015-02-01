var express = require('express');
var router = express.Router();
var Promise = require('promise');
var deploy = require('../private/deploy');

router.post('/:name/:secret', function(req, res, next){
  
  console.log(req.headers['x-real-ip']);
  var ip = req.headers['x-real-ip'].split('.');
  if(!(ip[0] == 162
    && ip[1] == 242
    && ip[2] == 195
    && ip[3] >= 64
    && ip[3] <= 127)){
    console.log("not a trusted IP!");
    res.status('403');
    res.write("wrong ip");
    res.end();
    return;
  }
  
  if(req.body.callback_url == null){
    console.log("missing callback_url");
    res.status('403');
    res.write("missing callback_url");
    res.end();
    return;
  }
  
  if(req.params.secret != '61f558d1f29de2debf35ddaef81f9486274a76b42a2ef7cbe9ce4c0111871fa0'){
    console.log("wrong secret");
    res.status('403');
    res.write("wrong secret");
    res.end();
    return;
  }
  
  var imageName = req.body.repository.repo_name;
  var containerName = req.body.repository.name;
  var callbackUrl = req.body.callback_url;
  
  deploy(imageName, containerName, callbackUrl);

  res.write('success');
  res.end();
});

module.exports = router;