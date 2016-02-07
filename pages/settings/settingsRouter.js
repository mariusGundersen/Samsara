import Router from 'express-promise-router';
import root from '../../private/menu/root';
import samsara from 'samsara-lib';

const router = Router();
export default router;

router.get('/', async function(req, res, next) {
  const users = await samsara().users();
  res.render('settings/index', {
    title: 'Settings',
    menus: [root('settings')],
    content: {
      users: users.map(user => ({username: user.username}))
    }
  });
});
