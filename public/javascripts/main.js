require.config({
  baseUrl: '/javascript',
  
  paths: {
    'knockout': '/bower_components/knockout/dist/knockout'
  },

  packages: [
    {name: 'deco', location: '/bower_components/deco/Dist', main: 'deco'}
  ]

});

require(['deco'], function(deco){
  deco.config().start();
});