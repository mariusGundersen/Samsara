import Router from 'express-promise-router';
import samsara from 'samsara-lib';

import view from './index';
import newView from './new';
import rootMenu from '../index/indexMenu';
import menu from './menu';
import layout from '../layout';

const router = Router();
export default router;

router.get('/', async function(req, res, next) {
  const spirits = await samsara().spirits();
  res.send(layout(view({
    spirits: spirits
  }), {
    title: 'Spirits',
    menus: [rootMenu({selected: 'spirits'}), menu({spirits: spirits, newSelected: false})]
  }));
});

router.get('/new', async function(req, res, next) {
  const spirits = await samsara().spirits();
  res.send(layout(newView({
  }), {
    title: 'New Spirit',
    menus: [rootMenu({selected: 'spirits'}), menu({spirits: spirits, newSelected: true})]
  }));
});
