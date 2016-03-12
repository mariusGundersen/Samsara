import layout from './layout';
import errorView from './errorView';

export function notFound(req, res, next){
  res.status(404);
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
};

export function errorProd(err, req, res, next){
  res.status(err.status || 500);
  res.send(layout(errorView({
    message: err.message,
    error: {}
  }), {
    title: 'Error'
  }));
};

export function errorDev(err, req, res, next){
  res.status(err.status || 500);
  res.send(layout(errorView({
    message: err.message,
    error: err
  }), {
    title: 'Error'
  }));
};