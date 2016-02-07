import Router from 'express-promise-router';
import samsara from 'samsara-lib';

import view from './index';
import menu from '../index/indexMenu';
import layout from '../layout';

const router = Router();
export default router;

router.get('/', async function(req, res, next) {
  const users = await samsara().users();
  res.send(layout(view({
    users: users.map(user => ({username: user.username}))
  }), {
    title: 'Settings',
    menus: [menu({selected: 'settings'})]
  }));
});
