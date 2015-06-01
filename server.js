var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var request = require('request');
var parser = require('parse-rss');
var path = require('path');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));

app.get('/rss', function (req, res) {
  parser(req.query.link, function (error, rss) {
    var meta = rss[0].meta;
    for (var i = 0; i < rss.length; i++) {
      delete rss[i].meta;
    }
    var feed = {};
    feed['meta'] = meta;
    feed['feed'] = rss;
    res.send(feed);
  });
});

var base_link = 'https://itunes.apple.com/search?entity=podcast&term=';
app.get('/search', function (req, res) {
  request(base_link + req.query.term, function (err, response, body) {

  });
});

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/views/index.html'));
});

app.listen(8080);
console.log('Magic happens at port 8080.');
