/*
*	MODELS: EARNIGNS REPORT TEMPLATE
*
*	This script models the earnigns report 
*/

//  NOTIFY PROGRESS

//  DEFINE DEPENDENCIES

//  DEFINE MODULE
const ERT = function () {
    
    //  DATA MODEL
    this.reportDay = "";
    this.employee = {
        first_name: "",
        last_name: "",
        email: ""
    };
    this.labor = {
        base_rate: 0,
        overtime_rate: 0,
        base_hrs: 0.00,
        overtime_hrs: 0.00,
        total_hrs: 0.00,
        base_pay: 0,
        overtime_pay: 0,
        total_labor_pay: 0
    };
    this.mfg = {
        cooking: {
            batches: {
                full: 0,
                half: 0,
                total: 0
            },
            lbs_produced: 0
        },
        sellable: {
            products: {
                no_of: 0,
                lbs_of: 0.00,

            },
            cones: {
                "4oz": 0,
                "8oz": 0,
                "16oz": 0
            },
            platters: {
                "20oz": 0
            },
            other: {
                'variable': 0
            }
        }
    };
    this.sales = {
        gross_sales: 0,
        refunds: 0,
        net_gross_sales: 0,
        discounts_comps: 0,
        sales_txs: 0
    };
    this.tips = 0;
    this.commissions = {
        rate: 0.00,
        earned: 0
    };
    this.total_LTC_Pay = 0,
    this.hourly_earning_rate = 0,
    this.shifts = [];

    
};

//  EXPORT MODULE
module.exports = ERT;