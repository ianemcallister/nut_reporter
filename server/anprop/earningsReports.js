/*
*	AH-NUTS PROPRIATARY METHODS: EARNINGS REPORTS
*
*	This script handles 
*/

//NOTIFY PROGRESS
//console.log('in the earningsReports.js file');

//DEFINE DEPENDENCIES
var moment                  = require('moment-timezone');
var _earningsReportTemplate = require('./models/empEarnRepTemp.js');
var _mfgReportTemplate      = require('./models/mfgRepTemplate.js')

//DEFINE THE MODULE
var er = {
    compile: {
        finRep: compFinRep,
        empEarnReps: compEmpEarnReps
    },
    format: {
        empEarnReps: frmtEmpEarnReps
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
*   @RETURN - empEarnReports | JSON object
*/
function compEmpEarnReps(salesDaysList) {
    //  DEFINE LOCAL VARIABLS
    var empEarnReports = {};
    var earningsReport = _earningsReportTemplate;

    //  ITERATE OVER ALL SALESDAYS
    Object.keys(salesDaysList).forEach(function(key) {

        //  DEFINE LOCAL VARIABLES
        var shiftsArray = Object.keys(salesDaysList[key].shifts);

        //  CHECK FOR LOGGED SHIFTS
        if(shiftsArray.length > 0) {

            //  DEFINE LOCAL VARIABLES
            var empId = "";
            
            //  IF SHIFTS WERE FOUND ITERATE THROUGH THEM
            shiftsArray.forEach(function(sftId) {

                //  DEFINE LOCAL VARIABLES
                empId = salesDaysList[key].shifts[sftId].empId;

                //  CHECK IF THE EMPLOYEE ALREADY HAS A REPORT
                if(empEarnReports[empId] == undefined) {
                    //  CREATE THE OBJECT
                    empEarnReports[empId] = new earningsReport;
                    
                    //console.log(empEarnReports[empId]);

                    empEarnReports.test();

                    //  START ASSIGNING VALUES
                    empEarnReports[empId].employee.first_name = salesDaysList[key].shifts[sftId].empName.first;
                    empEarnReports[empId].employee.last_name = salesDaysList[key].shifts[sftId].empName.last;
                    empEarnReports[empId].employee.email = salesDaysList[key].shifts[sftId].email;
                    empEarnReports[empId].labor.base_rate = salesDaysList[key].shifts[sftId].base_hrly_rate;
                    empEarnReports[empId].labor.overtime_rate = salesDaysList[key].shifts[sftId].base_hrly_rate * 1.5;

                    //console.log(empEarnReports[empId]);

                    //  SAVE THE SHIFT DAY
                    var shiftBlock = salesDaysList[key].shifts[sftId].timeBlock;
                    var sbArray = shiftBlock.split("/");
                    //  TODO: COME BACK TO THIS LASTER AND ADD THE DATE
                    empEarnReports[empId].reportDay = sbArray[0]; //moment(sbArray[0]).format("medium");
                }

                //  ADD THE SHIFT TO THE REPORT
                empEarnReports[empId].shifts.push(salesDaysList[key].shifts[sftId]);
                
                //  ADD THE TOTAL HOURS 
                empEarnReports[empId].labor.total_hrs += salesDaysList[key].shifts[sftId].duration_hrs;
                
                //  ADD BASE HOURS AND OVERTIME HOURS
                var currentBaseHours = empEarnReports[empId].labor.base_hrs;
                var newHours = salesDaysList[key].shifts[sftId].duration_hrs;
                if(currentBaseHours + newHours > 8) {
                    empEarnReports[empId].labor.base_hrs = 8
                    empEarnReports[empId].labor.overtime_hrs = (currentBaseHours + newHours) - 8
                } else {
                    empEarnReports[empId].labor.base_hrs = currentBaseHours + newHours;
                };

                //  CALCULATE BASE PAY
                empEarnReports[empId].labor.base_pay = empEarnReports[empId].labor.base_hrs * empEarnReports[empId].labor.base_rate;

                //  CALCULATE OVERTIME PAY
                empEarnReports[empId].labor.overtime_pay = empEarnReports[empId].labor.overtime_hrs * empEarnReports[empId].labor.overtime_rate;
            
                //  CALCULATE TOTAL LABOR PAY
                empEarnReports[empId].labor.total_labor_pay = empEarnReports[empId].labor.overtime_pay + empEarnReports[empId].labor.base_pay
            
            });

            //  ITERATE OVER ALL TRANSACTIONS TO CALCULATE SALES
            Object.keys(salesDaysList[key].txs).forEach(function(txKey) {

                //  ADD UP ALL TIP AMOUNTS
                empEarnReports[empId].tips += salesDaysList[key].txs[txKey].tip_money.amount;

                //  ADD UP ALL GROSS SALES AMOUNTS
                empEarnReports[empId].sales.gross_sales += salesDaysList[key].txs[txKey].gross_sales_money.amount;

                //  ADD SALES TRANSACTIONS
                if(salesDaysList[key].txs[txKey].gross_sales_money.amount >= 0) empEarnReports[empId].sales.sales_txs++;

                //  ADD UP ALL REFUND AMOUNTS
                empEarnReports[empId].sales.refunds += salesDaysList[key].txs[txKey].refunded_money.amount;

                //  ADD UP DISCOUNTS AND COMPS
                empEarnReports[empId].sales.discounts_comps += salesDaysList[key].txs[txKey].discount_money.amount;
                
                //  CALCULATE NET SALES AMOUNT
                empEarnReports[empId].sales.net_gross_sales = empEarnReports[empId].sales.gross_sales + empEarnReports[empId].sales.refunds;

                //  CALCUATE COMMISION
                var commissions = (empEarnReports[empId].sales.net_gross_sales / 5.75) - empEarnReports[empId].labor.total_labor_pay;
                if(commissions > 0) empEarnReports[empId].commissions.earned = commissions
                else empEarnReports[empId].commissions.earned = 0;

                //  CALCULATE COMMISSION RATE
                empEarnReports[empId].commissions.rate = empEarnReports[empId].commissions.earned / empEarnReports[empId].sales.net_gross_sales
            
                //  CALCULATE TOTAL LTC PAY FOR THIS SHIFT
                empEarnReports[empId].total_LTC_Pay = empEarnReports[empId].labor.total_labor_pay + empEarnReports[empId].commissions.earned + empEarnReports[empId].tips;
            
                //  CALCULATE HOURLY LTC EARNINGS RATE
                empEarnReports[empId].hourly_earning_rate = empEarnReports[empId].total_LTC_Pay / empEarnReports[empId].labor.total_hrs;
            });

        }    

    });

    //  RETURN 
    return empEarnReports;
};

/*
*   FORMAT EMPLOYEES EARNIGNS REPORTS
*
*   This method takes a report object and applies the data to a template, retrning an html formatted report.
*/
function frmtEmpEarnReps(frmtEmpEarnRepsDataCollection) {
    //  DEFINE LOCAL VARIABLES
    var allReports = [];
    var frmtedReport = function() {
        this.htmlRpt = "";
        this.textRpt = "";
    };

    //  ITERATE OVER EMPLOYEES
    Object.keys(frmtEmpEarnRepsDataCollection).forEach(function(empId) {

        //  CREATE A NEW REPORT
        var employeesReport = new frmtedReport;

        //  WHEN FINISHED PUSH THE REPORT ONTO THE ARRAY
        allReports.push(employeesReport);
    });

    //  RETURN REPORT OBJECT
    return allReports;
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