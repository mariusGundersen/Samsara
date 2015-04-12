const request = require('request');
const http = require('http');

const server = http.createServer(function(req, res){
  console.log("request");
  res.end();
  server.close();
}).listen(9090);

request.post({
  url: 'http://localhost:8080/deploy/decojs.com/61f558d1f29de2debf35ddaef81f9486274a76b42a2ef7cbe9ce4c0111871fa0',
  headers: {'content-type' : 'application/json'},
  body: JSON.stringify({
    callback_url: 'http://localhost:9090/callback',
    repository: {
      repo_name: 'decojs/decojs.com'
    }
  })
}, function(err, resp, body){
  console.log('response', body);
  server.close();
});
