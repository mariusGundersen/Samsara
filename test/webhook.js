var request = require('request');
var http = require('http');

var server = http.createServer(function(req, res){
  console.log('callback');
  res.end();
  server.close();
}).listen(9090);

const json = {
  "push_data": {
    "pushed_at": 1451039481,
    "images": [],
    "tag": "latest",
    "pusher": "mariusgundersen"
  },
  "callback_url": "http://localhost:9090/callback",
  "repository": {
    "status": "Active",
    "description": "Scrabble + Twitter = Scratter",
    "is_trusted": true,
    "full_description": "# Scratter\nScrabble + Twitter\n\nThis is just a silly experiment. You can see it here: https://scratter.mariusgundersen.net\n",
    "repo_url": "https://registry.hub.docker.com/u/mariusgundersen/scratter/",
    "owner": "mariusgundersen",
    "is_official": false,
    "is_private": false,
    "name": "scratter",
    "namespace": "mariusgundersen",
    "star_count": 0,
    "comment_count": 0,
    "date_created": 1448919441,
    "dockerfile": "FROM node:4.2-onbuild\n\nEXPOSE 8080",
    "repo_name": "nginx"
  }
};

request.post({
  url: 'http://localhost:8080/deploy/test/secret',
  headers: {'content-type' : 'application/json'},
  body: JSON.stringify(json)
}, function(err, resp, body){
  console.log('response:', body);
});
