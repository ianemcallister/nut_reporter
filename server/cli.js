/*
*	CLI
*
*	This script faciliates the command line interface
*/

//declare dependencies

var anprop = require('./anprop/anprop');
var wiwapi = require('./wheniwork/wiwapp');

wiwapi.shifts.list({ start: '2018-11-03 00:00:00', end: "2018-11-03 23:59:59"})
.then(res => { console.log(res); })
.catch(err => { console.log(err); });

//anprop.downloadDailyShifts('2018-11-02T22:18:50.000000+00:00');