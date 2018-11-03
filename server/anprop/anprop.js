/*
*	AH-NUTS PROPRIATARY METHODS
*
*	This script handles all of the propriatery functions for ah-nuts.
*/

//NOTIFY PROGRESS
//console.log('in the anpop.js file');

//DEFINE DEPENDENCIES


//DEFINE THE MODULE
var ahnuts = {
    downloadDailyShifts: downloadDailyShifts,
    updateANDBSalesData: updateANDBSalesData,
    processManagerSalesReport: processManagerSalesReport,
    processEmployeeEarningsReport: processEmployeeEarningsReport,
    test: test
};

/*
*   DOWNLOAD DAILY SHIFTS
*
*   This function works asyncronosly to collect all the shifts for a day from When I Work.
*/
function downloadDailyShifts(timestamp) {
    //define local variables

};


/*
*   UPDATE AH-NUTS DATABASE SALES DATA
*
*   This function works asyncronosly to update values in the ah-nuts! database
*/
function updateANDBSalesData() {

};



/*
*   PROCESS MANAGERS SALES REPORT
*
*   This function works asyncronosly to generate and send a sales report to designated managers
*/
function processManagerSalesReport() {

};

/*
*   PROCESS EMPLOYEE EARNINGS REPORT
*
*   This function works asyncronosly to generate and send an earnings report
*/
function processEmployeeEarningsReport() {

};

/*
*   TEST
*
*   This function helps to test the module
*/
function test() {
    console.log('this is a test');
};

//  EXPORT THE MODULE
module.exports = ahnuts;