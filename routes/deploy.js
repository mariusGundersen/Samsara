const router = require('express-promise-router')();
const co = require('co');
const samsara = require('samsara-lib')
const deploy = require('../private/deploy').deploy;
const validateDeploy = require('../private/validateDeploy');
const request = require('request-promise');

router.post('/:name/:secret', co.wrap(function* (req, res, next) {

  try {
    console.log('deploy request', req.params.name, req.body.repository.repo_name, req.body.push_data.tag);
    yield validateDeploy(
      req.params.name,
      req.params.secret,
      req.body.repository && req.body.repository.repo_name,
      req.body.push_data && req.body.push_data.tag,
      req.body.callback_url);

    console.log('config is valid');
    const config = yield samsara().spirit(req.params.name).containerConfig;
    config.tag = req.body.push_data.tag;
    yield config.save();

    deploy(req.params.name)
      .on('stop', data => respondTo(data, req.body.callback_url));

    console.log('deploying');
    res.write('success');
  } catch (error) {
    console.log('validation failed for', req.params.name, error);
    res.status('403');
    res.write(JSON.stringify(error, null, ' '));
  } finally {
    res.end();
  }
}));

router.use(function (error, req, res, next) {
  res.status('500');
  res.write(JSON.stringify(error.message || error, null, ' '));
  res.end();
});

module.exports = router;

function respondTo(data, url){
  request.post({
    url: url,
    body: JSON.stringify(
      data.error
      ? {state: 'error', description: data.error}
      : {state: 'success', description: 'deployed'}
    )
  });
}