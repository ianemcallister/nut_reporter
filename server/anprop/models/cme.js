/*
*	CUSTOMER-MARKET-EVENT MODEL
*
*	This script handles the data and methods for all ah-nuts cmes
*
*/

//  NOTIFY PROGRESS

//  DEFINE DEPENDENCIES

//  DEFINE THE MODULE
var cmes = {
    customer_name: "",
    shifts: [],
    tranactions: [],
    financials: {
        gross_sales: 0,
        net_sales: 0,
        total_tips: 0,
        total_discounts: 0,
        total_refunds: 0,
        sales_hrs: {},
        average_hourly_sales: 0
    },
    mfg: {}
};

//  EXPORT THE MODULE
module.exports = cmes;
