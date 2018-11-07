/*
*	CUSTOMER-MARKET-EVENT MODEL
*
*	This script handles the data and methods for all ah-nuts cmes
*
*/

//  NOTIFY PROGRESS

//  DEFINE DEPENDENCIES

//  DEFINE THE MODULE
var cme = function(customer_name) {
    this.isUnknown = false;
    this.customer_id = 0;
    this.customer_name = customer_name;
    this.shifts = [];
    this.transactions = [];
    this.financials = {
        gross_sales: 0,
        net_sales: 0,
        total_tips: 0,
        total_discounts: 0,
        total_refunds: 0,
        sales_hrs: {},
        average_hourly_sales: 0       
    },
    this.mfg = {}
    this.test = function() { console.log("cme test"); }
};

//  ADD SHIFTS FUNCTION
cme.prototype.addShift = function(shiftObject) { this.shifts.push(shiftObject); }

//  ADD TRANSACTIONS
cme.prototype.addTransaction = function(txObject) { this.transactions.push(txObject); }

//  EXPORT THE MODULE
module.exports = new cme;
