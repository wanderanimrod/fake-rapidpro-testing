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
	var nodeMessagesCollection = db.get('node_messages');
	request.body.forEach(function(node_message) {
		nodeMessagesCollection.insert(node_message);
	});
	var lastUpdatedCollection = db.get('last_updated');
	lastUpdatedCollection.remove();
	lastUpdatedCollection.insert({lastUpdated: Date()});
  	console.log('node messages added');
  	response.status(201).send('node messages added');
});

app.get('/', function(request, response) {
	request.db.get('last_updated').findOne({}, function(error, success) {
		response.status(200).send('Last received data at: ' + success.lastUpdated);
	});

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});