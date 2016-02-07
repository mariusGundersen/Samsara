import Router from 'express-promise-router';
import {login, redirectAfterLogin} from '../../private/authentication';

const router = Router();
export default router;

router.get('/', async function(req, res, next) {
  return res.render('login/index', {
    title:'Login',
    menus: [],
    content:{message:req.flash('error')}
  });
});

router.post('/', login(), redirectAfterLogin('/'));
