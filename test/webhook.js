var request = require('request');
var http = require('http');

var server = http.createServer(function(req, res){
  console.log("request");
  res.end();
  server.close();
}).listen(9090);

request.post({
  url: 'http://localhost:8080/deploy/test/secret',
  headers: {'content-type' : 'application/json'},
  body: JSON.stringify({
    callback_url: 'http://localhost:9090/callback',
    repository: {
      repo_name: 'nginx'
    }
  })
}, function(err, resp, body){
  console.log('response', body);
  server.close();
});
