import React from 'react';
import Router from 'express-promise-router';

import View from './index';
import Menu from './menu';
import layout from '../layout';

const router = Router();
export default router;

router.get('/', async function(req, res, next) {
  res.send(layout(null,
    <Menu />,
    <View />
  ));
});
