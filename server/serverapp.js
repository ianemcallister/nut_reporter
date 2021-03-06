/*
*	SERVER APP
*
*	This module runns the express server
*/

//notify progress
console.log('runnign the server');

//declare all dependencies
var express		= require('express');
var bodyParser 	= require('body-parser');
var anprop  	= require('./anprop/anprop');

//return the express object
var serverApp = express();

//environment variables
var port = process.env.PORT || 3000;

//get the URL encoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();


/*
*	USE Declarations
*
*/
//define our body parsers
serverApp.use(jsonParser); // for parsing application/json
serverApp.use(urlencodedParser); // for parsing application/x-www-form-urlencoded

//serve up a static asset
serverApp.use(express.static('dist'));

//define our body parsers
serverApp.use(jsonParser); // for parsing application/json
serverApp.use(urlencodedParser); // for parsing application/x-www-form-urlencoded

//track URL requests
serverApp.use('/', function(req, res, next) {
	//log the url to the console
	console.log('Request Url: ' + req.url);

	next();
});

/*
*	GET Declarations
*/
serverApp.get('/', function(req, res) {

});

/*
*	POST Declarations
*/
serverApp.post('/', function(req, res) {

});

serverApp.post('/queryEmployeeTransactions', function(req, res) {
	//advise of the post
	console.log(req.body);
	
	//	PRCOESS TRANSACTIONS
	anprop.process_txs(req.body).then(function(data) {
		
		//	return affirmative
		res.setHeader('Content-Type', 'application/json');
		res.status(200);
		res.send(JSON.stringify(data));

	});


});

serverApp.post('/squarepos/employees', function(req, res) {
	//	advise of the post
	console.log(req.body);


	anprop.employeeList().then(function(employeeList) {

		//	PROCESS TRANACTIONS
		res.status(200);
		res.send(JSON.stringify(employeeList));
		//res.send(JSON.stringify([{value: "Ian McAllister", id: "rUxLgAqsVklCN_14dfbE"},{value:"Steve Young",id:"something"}]));

	});

});

/*
*	Opening Up the server
*/
//open the port for local development
serverApp.listen(port,function() {
	//display the port
	console.log('Express server is up and running on port ' + port);
	//identify the environment
	if(process.env.IS_PROUDCTION == 'true') console.log('is production')
		else console.log('is development')
});
