var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());

var mongo = require('mongodb');
var monk = require('monk');
var db = monk(process.env.MONGOLAB_URI || 'localhost:27017/node_messages');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.use(function(req,res,next){
    req.db = db;
    next();
});

app.post('/', function(request, response) {
	var db = request.db;
	var collection = db.get('node_messages');
	if(request.body.hasOwnProperty('length')) {
		request.body.forEach(function(node_message) {
			collection.insert(node_message);
		});
	}
	else {
		collection.insert(request.body);
	}
  	console.log('node messages added');
  	response.send('node messages added');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});