import Router from 'express-promise-router';
import samsara from 'samsara-lib';
import nth from 'nth';
import rootMenu from '../private/menu/root';
import spiritsMenu from '../private/menu/spirits';
import spiritMenu from '../private/menu/spirit';
import livesMenu from '../private/menu/lives';

const router = Router();
export default router;

router.get('/:name/lives', async function(req, res, next) {
  const name = req.params.name;
  const spirits = await samsara().spirits();
  const spirit = spirits.filter(s => s.name == name)[0];
  const lives = spirit.lives;
  const list = lives.map(x => x).reverse();
  res.render('spirit/lives', {
    title: 'Lives of ' + name + ' - Spirit',
    menus: [rootMenu('spirits'), spiritsMenu(spirits, name), spiritMenu(name, 'lives'), livesMenu(name, lives, null)],
    content: {
      name: name,
      lives: list
    }
  });
});

router.get('/:name/life/latest', async function(req, res, next){
  const latestLife = await samsara().spirit(req.params.name).latestLife;

  if(!latestLife) throw new Error('404');

  res.redirect(latestLife.life);
});

router.get('/:name/life/:life', async function(req, res, next){
  const name = req.params.name;
  const life = req.params.life;
  const spirits = await samsara().spirits();
  const spirit = spirits.filter(s => s.name == name)[0];
  const lives = spirit.lives;
  const currentLife = samsara().spirit(name).life(life);

  const state = lives.filter(l => l.life == life)[0].state;
  const container = await currentLife.container;

  res.render('life/index', {
    title: nth.appendSuffix(life)+' life of ' + name,
    menus: [rootMenu('spirits'), spiritsMenu(spirits, name), spiritMenu(name, 'lives'), livesMenu(name, lives, life)],
    content: {
      name: name,
      life: life,
      logs: {
        lifeLog: {
          name: name,
          life: life,
        },
        name: name,
        life: life,
        json: currentLife.inspect.then(json => json ? JSON.stringify(json, null, '  ') : ''),
        config: currentLife.containerConfig.catch(e => ''),
        log: currentLife.containerLog(true, {stdout:true, stderr:true, tail: 50}),
        deploy: currentLife.deployLog.catch(e => ''),
      },
      revive: {
        name: name,
        life: life,
        revivable: state == 'exited'
      },
      deploy: {
        name: name,
        life: life,
        isDeploying: spirit.state === 'deploying'
      }
    }
  });
});

router.get('/:name/life/:life/logs/download', async function(req, res, next){
  const name = req.params.name;
  const life = req.params.life;
  const logs = await samsara()
    .spirit(name)
    .life(life)
    .containerLog(false, {stdout: true, stderr: true});

  res.setHeader('Content-disposition', `attachment;filename=${name}_v${life}.log`);
  logs.pipe(res);
});
