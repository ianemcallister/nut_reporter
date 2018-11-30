/*
*	AH-NUTS PROPRIATARY METHODS: EARNINGS REPORTS
*
*	This script handles 
*/

//NOTIFY PROGRESS
console.log('in the earningsReports.js file');

//DEFINE DEPENDENCIES

//DEFINE THE MODULE
var er = {
    compile: {
        finRep: compFinRep,
        empEarnReps: compEmpEarnReps
    },
    sendReports: sendReports
};

/*
*   COMPILE FINANCIAL REPORT
*
*   This method 
*   @PARAMS - salesDaysList | JSON object
*   @RETURN - financialReports | JSON object
*/
function compFinRep(salesDaysList) {
    //  DEFINE LOCAL VARIABLES
    var financialReports = [];

    //  ITERATE OVER ALL SALESDAYS
    Object.keys(salesDaysList).forEach(function(key) {

        //  DEFINE LOCAL VARIABLES
        var txArray = Object.keys(salesDaysList[key].txs);

        //  PROCESS CMES with TXs
        if(txArray.length > 0) {

            console.log(salesDaysList[key].name)

        }

    });

    //  RETURN FINANCIAL REPORT
    return financialReports;
};

/*
*   COMPILE EMPLOYEE EARNINGS REPORT
*
*   This method 
*   @PARAMS - salesDaysList | JSON object
*   @RETURN - empEarnRepsArray | JSON array
*/
function compEmpEarnReps(salesDaysList) {
    //  DEFINE LOCAL VARIABLS
    var empEarnRepsArray = [];
    var earningsReport = {
        labor: {
            base_rate: 0,
            overtime_rate: 0,
            base_hrs: 0.00,
            overtime_hrs: 0.00,
            total_hrs: 0.00,
            base_pay: 0,
            overtime_pay: 0,
            total_labor_pay: 0
        },
        sales: {
            gross_sales: 0,
            refunds: 0,
            net_gross_sales: 0
        },
        tips: 0,
        commissions: {
            rate: 0.00,
            earned: 0
        },
        total_LTC_Pay: 0,
        hourly_earning_rate: 0,
        shifts: []
    };


    //  RETURN 
    return empEarnRepsArray;
};

/*
*   SEND REPORTS
*   
*
*/
function sendReports(salesDaysList) {
    //  DEFINE LOCAL VARIABLES

    //  NOTIFY PROGRESS
    //console.log('sending report');

    
};

//  EXPORT THE MODULE
module.exports = er;