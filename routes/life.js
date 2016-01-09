const router = require('express-promise-router')();
const samsara = require('samsara-lib');
const makePageModel = require('../pageModels/life');
const co = require('co');

router.get('/:name/life/latest', co.wrap(function*(req, res, next){
  const latestLife = yield samsara().spirit(req.params.name).latestLife;

  if(!latestLife) throw new Error('404');

  res.redirect(latestLife.life);
}));

router.get('/:name/life/:life', co.wrap(function*(req, res, next){
  const spirit = samsara().spirit(req.params.name);
  const life = spirit.life(req.params.life);

  const status = yield life.status;
  const container = yield life.container;

  const pageModel = yield makePageModel(req.params.name + ' - ' + req.params.life, {
    name: req.params.name,
    life: req.params.life,
    logs: {
      lifeLog: {
        name: req.params.name,
        life: req.params.life,
      },
      name: req.params.name,
      life: req.params.life,
      json: life.inspect.then(json => json ? JSON.stringify(json, null, '  ') : ''),
      config: life.containerConfig.catch(e => ''),
      log: life.containerLog(true, {stdout:true, stderr:true, tail: 50}),
      deploy: life.deployLog.catch(e => ''),
    },
    revive: {
      name: req.params.name,
      life: req.params.life,
      revivable: status == 'stopped' && !!container
    },
    deploy: {
      name: req.params.name,
      life: req.params.life,
      isDeploying: yield spirit.isDeploying
    }
  }, req.params.name, req.params.life);
  res.render('spirits/spirit/life/index', pageModel);
}));

router.get('/:name/life/:life/logs/download', co.wrap(function*(req, res, next){
  const name = req.params.name;
  const life = req.params.life;
  const logs = yield samsara()
    .spirit(name)
    .life(life)
    .containerLog(false, {stdout: true, stderr: true});

  res.setHeader('Content-disposition', `attachment;filename=${name}_v${life}.log`);
  logs.pipe(res);
}));

module.exports = router;