/*
*	CLI
*
*	This script faciliates the command line interface
*/

//  DECLARE DEPENDENCIES 
//var fs 		= require('fs');
var path 	= require('path');
var anprop  = require('./anprop/anprop');
//var square  = require('./square/square');
//var wiwapi  = require('./wheniwork/wiwapp');
//var earningsReports = require('./anprop/earningsReports');

//	DEFINE LOCAL VARIABLES
var txs_col_req = {
	analysis: ['sales'],
	location: 'M53KQT35YKE5C',
	begin_time: '2019-02-10T00:00:00-07:00',
	end_time: "2019-02-10T23:59:59-07:00",
	devices: [],
	employees: ['rUxLgAqsVklCN_14dfbE'],
	adjustments: [],
	sales_hrs: 7,
	labor_hrs: 7.5,
	base_rate_hrly: 1200,
	emails: {
		employee: [],
		supervisors: [],
		other: []
	},
	CME_info: {
		name: ""
	}
};

//	RUN THE FUNCTION
anprop.process_txs(txs_col_req).then(function(data) {
	console.log(data);
});
