var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
fs = require('fs');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.use(function(req,res,next){
    next();
});

// Fixtures
var fakeUser = JSON.parse(fs.readFileSync('fixtures/fake-user.json', 'utf8'));

app.post('/', function(request, response) {
	console.log(request.body);
	response.status(201).send(fakeUser);
});

app.get('/', function(request, response) {
	response.status(200).send('I have got your request');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});