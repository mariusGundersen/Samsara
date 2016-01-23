import Router from 'express-promise-router';
import samsara from 'samsara-lib';
import {deploy} from '../private/deploy';
import validateDeploy from '../private/validateDeploy';
import request from 'request-promise';

const router = Router();
export default router;

router.post('/:name/:secret', async function (req, res, next) {

  try {
    console.log('deploy request', req.params.name, req.body.repository.repo_name, req.body.push_data.tag);
    await validateDeploy(
      req.params.name,
      req.params.secret,
      req.body.repository && req.body.repository.repo_name,
      req.body.push_data && req.body.push_data.tag,
      req.body.callback_url);

    console.log('config is valid');
    const config = await samsara().spirit(req.params.name).containerConfig;
    config.tag = req.body.push_data.tag;
    await config.save();

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
});

router.use(function (error, req, res, next) {
  res.status('500');
  res.write(JSON.stringify(error.message || error, null, ' '));
  res.end();
});

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
