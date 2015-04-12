require.config({
  baseUrl: '/javascripts',
  urlArgs: 'cachebust=' + document.querySelector('meta[name=cachebust]').getAttribute('content'),
  
  paths: {
    'knockout': '/bower_components/knockout/dist/knockout'
  },

  packages: [
    {name: 'deco', location: '/bower_components/deco/Dist', main: 'deco'}
  ]
});

require(['deco'], function(deco){
  deco.config({
    qvc:{
      baseUrl: '/qvc'
    }
  }).start();
});