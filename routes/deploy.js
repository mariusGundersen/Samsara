const router = require('express-promise-router')();
const co = require('co');
const samsara = require('samsara-lib')
const deploy = require('../private/deploy').deploy;
const validateDeploy = require('../private/validateDeploy');
const request = require('request-promise');

router.post('/:name/:secret', co.wrap(function*(req, res, next){
  console.log('deploying', req.params.name, req.body);

  try{
	yield validateDeploy(
	  req.params.name,
	  req.params.secret,
	  req.body.repository && req.body.repository.repo_name,
	  req.body.push_data && req.body.push_data.tag,
	  req.body.callback_url);

	console.log('config is valid');
	yield samsara().spirit(req.params.name).mutateConfig(config => config.tag = req.body.push_data.tag);

	deployInBackground(name, req.body.callback_url)
	.catch(function(error){
	  console.error(error);
	});

	res.write('success');
  }catch(error){
	console.log('validation failed for', req.params.name, error);
	res.status('403');
	res.write(JSON.stringify(error, null, ' '));
  }finally{
	res.end();
  }
}));

router.use(function(error, req, res, next){
  res.status('500');
  res.write(JSON.stringify(error.message || error, null, ' '));
  res.end();
});

const deployInBackground = co.wrap(function*(name, callback_url){
  const result = yield tryDeploy(name);

  console.log('responding', result);

  yield request.post({
	url: callback_url,
	body: JSON.stringify(result)
  });
});

function *tryDeploy(name){
  try{
	console.log('deploying');

	yield deploy(name);

	return {
	  state: 'success',
	  description: 'deployed'
	};
  }catch(error){
	return {
	  state: 'error',
	  description: error
	};
  }
}

module.exports = router;