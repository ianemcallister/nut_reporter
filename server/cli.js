/*
*	CLI
*
*	This script faciliates the command line interface
*/

//  DECLARE DEPENDENCIES 
var fs 		= require('fs');
var path 	= require('path');
var anprop  = require('./anprop/anprop');
var square  = require('./square/square');
var wiwapi  = require('./wheniwork/wiwapp');

/*anprop.dailyShiftReporter('2018-11-03T15:00:00-07:00', false)
.then(res => { console.log(res); })
.catch(err => { console.log(err); });*/

Promise.all(square.multipleLocations('V1/transactions/payments_list', { beginTime: "2018-11-03T00:00:00-07:00", endTime: "2018-11-04T00:00:00-07:00" }))
.then(res => { 
    
    //console.log(res);

    var writepath = path.join(__dirname, '.', 'JSON', 'transactions.json');

	fs.writeFile(writepath, JSON.stringify(res, null, '\t'), 'utf8', function (err) {
		if (err) {
		    return console.log(err);
		}

		console.log("The file was saved!");	
	});
})
.catch(err => { console.log(err); });

/*wiwapi.shifts.list({ start: '2018-11-03 00:00:00', end: "2018-11-03 23:59:59"})
.then(res => { console.log(res); })
.catch(err => { console.log(err); });
*/

/*wiwapi.sites.list()
.then(res => { console.log(res); })
.catch(err => { console.log(err); });*/

//anprop.downloadDailyShifts('2018-11-02T22:18:50.000000+00:00');