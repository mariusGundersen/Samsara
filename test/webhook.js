var request = require('request');
var http = require('http');

var server = http.createServer(function(req, res){
  console.log('callback');
  res.end();
  server.close();
}).listen(9090);

request.post({
  url: 'http://localhost:8080/deploy/test/secret',
  headers: {'content-type' : 'application/json'},
  body: JSON.stringify({
    callback_url: 'http://172.17.42.1:9090/callback',
    repository: {
      repo_name: 'mariusgundersen/samsara'
    }
  })
}, function(err, resp, body){
  console.log('response:', body);
});
