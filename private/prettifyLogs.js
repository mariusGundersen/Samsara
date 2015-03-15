var Promise = require('promise');
var ansi = new (require('ansi-to-html'))();

module.exports = function prettifyLogs(logs){
  return new Promise(function(resolve, reject){
    var buff = '';
    logs.on('data', function(chunk){
      buff += chunk.toString('utf8', chunk[0] == 01 ? 8 : 0);
    });
    logs.on('end', function(){
      resolve(ansi.toHtml(buff));
    });
    logs.on('error', function(error){
      reject(error);
    });
  });
};