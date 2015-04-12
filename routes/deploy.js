const router = require('express-promise-router')();
const co = require('co');
const deploy = require('../private/deploy');
const validateDeploy = require('../private/validateDeploy');
const request = require('request-promise');

router.post('/:name/:secret', function(req, res, next){
  co(function*(){
    console.log('deploying', req.params.name, req.body);

    const config = yield validateDeploy(
      req.params.name, 
      req.params.secret, 
      req.body.repository && req.body.repository.repo_name, 
      req.headers['x-real-ip'] || req.connection.remoteAddress, 
      req.body.callback_url);

    console.log('validated', config);

    try{
      yield deploy(config);

      yield request.post({
        url: req.body.callback_url,
        body: JSON.stringify({
          state: 'success',
          context: config.description,
          descrption: 'deployed',
          target_url: config.url
        })
      });
    }catch(error){
      console.error(error);
      yield request.post({
        url: req.body.callback_url,
        body: JSON.stringify({
          state: 'error',
          context: config.description,
          descrption: error,
          target_url: config.url
        })
      });
    }

    res.write('success');
    res.end();
  }).catch(function(error){
    console.log('validation failed for', req.params.name, error);
    res.status('403');
    res.write(JSON.stringify(error, null, ' '));
    res.end();
  });
});

module.exports = router;