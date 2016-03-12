import React from 'react';
import Router from 'express-promise-router';
import samsara from 'samsara-lib';

import SpiritsView from './index';
import NewView from './new';
import IndexMenu from '../index/menu';
import SpiritsMenu from './menu';
import layout from '../layout';

const router = Router();
export default router;

router.get('/', async function(req, res, next) {
  const spirits = await samsara().spirits();
  res.send(layout('Spirits',
    <IndexMenu selected="spirits" />,
    <SpiritsMenu spirits={spirits} newSelected={false} />,
    <SpiritsView spirits={spirits} />
  ));
});

router.get('/new', async function(req, res, next) {
  const spirits = await samsara().spirits();
  res.send(layout('New Spirit',
    <IndexMenu selected="spirits" />,
    <SpiritsMenu spirits={spirits} newSelected={true} />,
    <NewView />
  ));
});
