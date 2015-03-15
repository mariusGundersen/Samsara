var docker = require('./docker');
var Promise = require('promise');
var makePageModel = require('./makePageModel');
var container = require('../providers/container');

module.exports = function(title, content, currentContainerId){
  return container.list().then(function(list){
    list.filter(function(container){
      return container.id == currentContainerId;
    }).forEach(function(container){
      container.selected = true;
    });
    
    return list;
  })
  .then(function(containers){
    return makePageModel(title, {
      menu: {
        containers: containers
      },
      content: content || {}
    }, 'container');
  });
}