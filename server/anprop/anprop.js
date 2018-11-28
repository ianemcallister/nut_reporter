/*
*	AH-NUTS PROPRIATARY METHODS
*
*	This script handles all of the propriatery functions for ah-nuts.
*/

//NOTIFY PROGRESS
//console.log('in the anpop.js file');

//DEFINE DEPENDENCIES
var moment      = require('moment-timezone');
var square      = require('../square/square');
var wiw         = require('../wheniwork/wiwapp');
var collections = require('./models/collections');

//DEFINE THE MODULE
var ahnuts = {
    _timeBookender: _timeBookender,
    downloadDailyShifts: downloadDailyShifts,
    updateANDBSalesData: updateANDBSalesData,
    processManagerSalesReport: processManagerSalesReport,
    processEmployeeEarningsReport: processEmployeeEarningsReport,
    test: test,
    dailyShiftReporter: dailyShiftReporter
};

/*
*   TIME BOOKENDER (private function)
*
*   This function accepts a time and formats it properly for downloading transactions
*/
function _timeBookender(salesDate, previousDay) {
    //  DEFINE LOCAL VARIABLES
    var theTz = "America/Los_Angeles";
    var gmt = moment(salesDate);
    var bookends = {
        start: gmt.clone().tz(theTz),
        end: gmt.clone().tz(theTz),
    };

    //  set the times
    bookends.start.hour(0).minute(0).second(0);
    bookends.end.hour(23).minute(59).second(59);

    //   if we're looking at the previous day, subtact the day
    if(previousDay) {
        bookends.start.subtract(1, "day");
        bookends.end.subtract(1, "day");
    }

    //  RETURN OBJECT
    return {
        start: bookends.start.format(),
        end: bookends.end.format()
    };
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

/*
*   DAILY SHIFT REPORTER
*
*   This function....
*   1. Download square data
*       i. all transactions for the given day
*   2. Download all when i work data
*       i. all users
*       ii. all shifts for the given day
*       iii. all sites
*   3. Build Sales Day list of CME Summaries
*   4. Build Employee Earnings Report from Sales Day List
*   5. Email Earnings Reports to Employees
*   6. Create QBO Customer Invoices from CME Summaries
*   7. Create QBO Employee Invoices from Earnings Reports
*   8. Create QBO Payments Received from CME Summaries
*   9. Email MFG report to Manager
*
*   @param: 
*   
*   @return: SUCCESS OBJECT
*   @return: ERROR OBJECT
*   
*/
function dailyShiftReporter(salesDate, previousDay) {
    //  DEFINE LOCAL VARIABLES
    var time = _timeBookender(salesDate, previousDay);
    var sqTxs = square.multipleLocations('V1/transactions/list_payments', { beginTime: time.start, endTime: time.end }); //a promise for all the square transactions
    var sqrItems = ''; //a promise for all square items
    var sqrMods = ''; //a promise for all square modifers
    var wiwUsers = wiw.users.list(); //a promise for all the wiw users
    var wiwShifts = wiw.shifts.list({ start: time.start, end: time.end }); //a promise for all the wiw shifts for the given day
    var wiwSites = wiw.sites.list(); //a promise for all the wiw sites

    var rawPromises = [sqTxs, sqrItems, sqrMods, wiwUsers, wiwShifts, wiwSites];

    //  RETURN ASYNC WORK
    return new Promise(function(resolve, reject) {

        //  WAIT UNTIL ALL PROMISES HAVE RESOLVED
        //  1 & 2 DOWNLOADING ALL THE REQUIRED DATA
        Promise.all(rawPromises)
        .then(function success(allRawData) {

            //  3.  BUILD SALES DAYS LIST
            var salesDaysList = collections.assignTxsToCMEs(allRawData);

            console.log('got these salesDays');
            console.log(salesDaysList);
            //  4.  BUILD EMPLOYEE EARNINGS REPORT

            //  5.  EMAIL EARNINGS REPORTS

            //  6.  CREATE QBO CUSTOMER INVOICES
            //  7.  CREATE QBO EMPLOYEE INVOICES
            //  8.  CREATE QBO PAYMENTS RECEIVED
            //  9.  EMAIL MFG REPORT

            resolve(allRawData);

        }).catch(function error(e) {
            reject(e);
        });

    });

}

//  EXPORT THE MODULE
module.exports = ahnuts;