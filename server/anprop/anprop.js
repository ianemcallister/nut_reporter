/*
*	AH-NUTS PROPRIATARY METHODS
*
*	This script handles all of the propriatery functions for ah-nuts.
*/

//NOTIFY PROGRESS
//console.log('in the anpop.js file');

//DEFINE DEPENDENCIES
var moment          = require('moment-timezone');
var square          = require('../square/square');
var wiw             = require('../wheniwork/wiwapp');
var collections     = require('./models/collections');
var earningsReports = require('./earningsReports');

//DEFINE THE MODULE
var ahnuts = {
    _timeBookender: _timeBookender,
    process_txs: process_txs,
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

            //console.log('got these salesDays');
            //console.log(salesDaysList);

            //  4.  BUILD EMPLOYEE EARNINGS REPORT

            //  5.  EMAIL EARNINGS REPORTS
            earningsReports.sendReports(salesDaysList);

            //  6.  CREATE QBO CUSTOMER INVOICES
            //  7.  CREATE QBO EMPLOYEE INVOICES
            //  8.  CREATE QBO PAYMENTS RECEIVED
            //  9.  EMAIL MFG REPORT

            resolve(salesDaysList);

        }).catch(function error(e) {
            reject(e);
        });

    });

}

/*
*   PROCESS TRANSACTIONS
*
*   This method receives a request object and returns an analysis object
*/
function process_txs(txs_col_req) {
    // DEFINE LOCAL VARIABLES
    var opts = {
        beginTime: txs_col_req.begin_time,
        endTime: txs_col_req.end_time
    };


    //  RETURN ASYNC WORK
    return new Promise(function(resolve, reject) {

        //  COLLECT TRANSACTIONS
        square.V1.transactions.list_payments(txs_col_req.location, opts).then(function(allTxs) {

            //  
            var returnObject = _analyzeTransactions(allTxs, txs_col_req);
            
            //  UPON SUCCESS PASS THE OBJECT BACK
            resolve(returnObject);


        });
        
    });

};

/*
*   ANALYZE TRANSACTIONS
*
*/
function _analyzeTransactions(txs, params) {

    //  DEFINE LOCAL VARIABLES
    var filters = {
        employees: params.employees,
        devices: params.devices
    };
    var filteredTxs = _filterTransactionByDeviceEmp(txs, filters);
    var returnObject = {
        sales: {
            gross_sales: _calculateGrossSales(filteredTxs),
            refunds: _sumRefunds(filteredTxs),
            net_sales: _calculateNetSales(filteredTxs),
            no_of_sales: _sumNoSales(filteredTxs),
            average_sale: _calculateAverageSale(filteredTxs),
            sales_per_hour: _calculateSalesPerHour(filteredTxs, params.sales_hrs),
            hours: {
                labor: params.labor_hrs,
                sales: params.sales_hrs
            },
            pay: {
                base_rate: params.base_rate_hrly,
                comm_multiplier: _calculateCommMultiplier(filteredTxs, params.sales_hrs),
                comm_rate: _calculateCommRate(filteredTxs, params.sales_hrs),
                base: _calculateBasePay(params.labor_hrs, params.base_rate_hrly),
                ot: _calculateOTPay(params.labor_hrs, params.base_rate_hrly),
                commissions: _calculateCommPay(filteredTxs, params.sales_hrs),
                tips: _sumTips(filteredTxs),
                total: _calculateTotalPay(filteredTxs, params.labor_hrs, params.sales_hrs, params.base_rate_hrly)
            }
        },
        mfg: {

        }
    };

    //  RETURN VALUE
    return returnObject;

};

function _calculateTotalPay(txs, laborHrs, salesHrs, baseRate) {
    return  _calculateBasePay(laborHrs, baseRate) +
            _calculateOTPay(laborHrs, baseRate) +
            _calculateCommPay(txs, salesHrs) +
            _sumTips(txs);
};

function _calculateCommPay(txs, salesHrs) {
    return (((_sumGrossSales(txs) - _sumTips(txs) - _sumRefunds(txs)) / salesHrs) * (((_sumGrossSales(txs) - _sumTips(txs) - _sumRefunds(txs)) / salesHrs) / 2752 / 100)) * salesHrs;
};

function _calculateCommRate(txs, salesHrs) {
    return ((_sumGrossSales(txs) - _sumTips(txs) - _sumRefunds(txs)) / salesHrs) * (((_sumGrossSales(txs) - _sumTips(txs) - _sumRefunds(txs)) / salesHrs) / 2752 / 100)
};

function _calculateCommMultiplier(txs, salesHrs) {
    return ((_sumGrossSales(txs) - _sumTips(txs) - _sumRefunds(txs)) / salesHrs) / 2752 / 100
};

function _calculateSalesPerHour(txs, salesHrs) {
    return (_sumGrossSales(txs) - _sumTips(txs) - _sumRefunds(txs)) / salesHrs;
};

function _calculateAverageSale(txs) {
    return (_sumGrossSales(txs) - _sumTips(txs) - _sumRefunds(txs)) / _sumNoSales(txs)
};

function _calculateNetSales(txs) {
    return _sumGrossSales(txs) - _sumTips(txs) - _sumRefunds(txs)
};

function _calculateGrossSales(txs) {
    return _sumGrossSales(txs) - _sumTips(txs);
}

function _calculateBasePay(hrs, rate) {
    //  DEFINE LOCAL VARIABLES
    var returnValue = 0;

    //  CONFIRM THE NUMBER OF HOURS
    if(hrs > 8) {
        returnValue = 8 * rate;
    } else {
        returnValue = hrs * rate;
    };

    //  RETURN VALUE
    return returnValue;
};

function _calculateOTPay(hrs, rate) {
    //  DEFINE LOCAL VARIABLES
    var returnValue = 0;

    //  CONFIRM THE NUMBER OF HOURS
    if(hrs > 8) {
        returnValue = (hrs - 8) * rate * 1.5;
    };

    //  RETURN VALUE
    return returnValue;   
};

function _sumNoSales(filteredTxs) {
    //  DEFINE LOCAL VARIABLES
    var returnValue = 0;

    //  ITERATE OVER ALL TXS
    filteredTxs.forEach(function(tx) {

        //  IF THE TRANSACTION HAD A DOLLAR VALUE ABOVE ZERO THEN INCRIMENT THE COUNTER
        if(tx.total_collected_money.amount > 0) returnValue++;

    });

    //  RETURN VALUE
    return returnValue;   
};

function _sumRefunds(filteredTxs){
    //  DEFINE LOCAL VARIABLES
    var returnValue = 0;

    //  ITERATE OVER ALL TXS
    filteredTxs.forEach(function(tx) {

        //add tips when found
        returnValue += tx.refunded_money.amount;

    });

    //  RETURN VALUE
    return returnValue;
};

function _sumGrossSales(filteredTxs) {
    //  DEFINE LOCAL VARIABLES
    var returnValue = 0;

    //  ITERATE OVER ALL TXS
    filteredTxs.forEach(function(tx) {

        //add tips when found
        returnValue += tx.total_collected_money.amount;

    });

    //  RETURN VALUE
    return returnValue;
};

function _sumTips(filteredTxs) {

    //  DEFINE LOCAL VARIABLES
    var returnValue = 0;

    //  ITERATE OVER ALL TXS
    filteredTxs.forEach(function(tx) {

        //add tips when found
        returnValue += tx.tip_money.amount;

    });

    //  RETURN VALUE
    return returnValue;
};

/*
*   FILTER TRANSACTIONS
*
*   Returns only the requried transactions
*/
function _filterTransactionByDeviceEmp(txs, filters) {

    //  DEFINE LOCAL VARIABLES
    var filteredTransactions = [];

    //  ITERATE OVER ALL TRANSACTIONS
    txs.forEach(function(tx) {

        //console.log(tx.tender);

        //  define local variables
        var flagToPull = false;

        //  first filter by device if necessary
        if(filters.devices.length > 0) {

        };

        //  then filter by employee if necessary
        if(filters.employees.length > 0) {

            //  pull out transactions that match the required employee id
            filters.employees.forEach(function(empId) {
                
                if(tx.tender[0].employee_id == empId) flagToPull = true;
            });

        };

        //  if this transaction was flagged at any point add it to the return batch
        if(flagToPull) filteredTransactions.push(tx);

    });

    //  noitify progress
    console.log('returning ', filteredTransactions.length, " records");
    
    //  RETURN FILTERED TRANSACTIONS
    return filteredTransactions;
};

//  EXPORT THE MODULE
module.exports = ahnuts;