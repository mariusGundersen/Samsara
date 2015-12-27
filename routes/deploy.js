const router = require('express-promise-router')();
const co = require('co');
const samsara = require('samsara-lib')
const deploy = require('../private/deploy').deploy;
const validateDeploy = require('../private/validateDeploy');
const request = require('request-promise');

router.post('/:name/:secret', co.wrap(function* (req, res, next) {
  console.log('deploying', req.params.name, req.body);

  try {
    yield validateDeploy(
      req.params.name,
      req.params.secret,
      req.body.repository && req.body.repository.repo_name,
      req.body.push_data && req.body.push_data.tag,
      req.body.callback_url);

    console.log('config is valid');
    yield samsara().spirit(req.params.name).mutateConfig(config => config.tag = req.body.push_data.tag);

    deploy(req.params.name)
      .then(success => ({state: 'success', description: 'deployed'}))
      .catch(error => ({state: 'error', description: error}))
      .then(result => request.post({
        url: req.body.callback_url,
        body: JSON.stringify(result)
      }))
      .catch(error => console.error(error));

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