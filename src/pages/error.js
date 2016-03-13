import React from 'react';
import layout from './layout';
import ErrorView from './errorView';

export function notFound(req, res, next){
  res.status(404);
  res.send(layout("Not Found",
    <ErrorView message="404 - Page not found" error={{}} />
  ));
};

export function errorProd(err, req, res, next){
  res.status(err.status || 500);
  res.send(layout("Error",
    <ErrorView message="An error occured" error={{}} />
  ));
};

export function errorDev(err, req, res, next){
  res.status(err.status || 500);
  res.send(layout("Error",
    <ErrorView message={err.message} error={err} />
  ));
};