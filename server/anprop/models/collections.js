/*
*	COLLECTIONS MODEL
*
*	This module agregates records.
*
*/

//  NOTIFY PROGRESS


//  DEFINE DEPENDENCIES
var cme     = require('./cme');

//  DEFINE THE MODULE
var collections = {
    assignTxsToCMEs: assignTxsToCMEs,
    initializeCMEs: initializeCMEs,
    sqIdsHasher: sqIdsHasher,
    findCustomer: findCustomer
};

/*
*   ASSIGN TRANSACTIONS TO CMES
*
*   This method iterates over all transactions and assigns them to a CME
*/
function assignTxsToCMEs(allRawData) {
    //  DEFINE LOCAL VARIABLES
    var sqTxs       = allRawData[0];
    var sqrItems    = allRawData[1];
    var sqrMods     = allRawData[2];
    var wiwUsers    = sqIdsHasher(allRawData[3]);
    var wiwShifts   = allRawData[4];
    var wiwSites    = sitesHasher(allRawData[5]);
    var cmes        = initializeCMEs(wiwShifts);

    //  ITERATE OVER LOCATIONS
    sqTxs.forEach(function(location) {

        //  ITERATE OVER TRANSACTIONS
        location.forEach(function(tx) {

            //  DEFINE LOCAL VARIABLES
            var sqEmpId = '';

           //   ITERATE OVER TENDERS TO FIND EMPLOYEE ID
           tx.tender.forEach(function(aTender) {
            sqEmpId = aTender.employee_id
           });


           var wiwEmpId = wiwUsers[sqEmpId];     //   IDENTIFY WIW EMPLOYEE ID
           
           //   CHECK FOR WIW EMPLOYEE ID
           if(wiwEmpId != undefined) {
               //   IF THERE IS A VALID WIW EMPLOYEE ID
                var foundCME = false

               var customer = findCustomer(tx.created_at, wiwEmpId, wiwShifts, wiwSites);
               console.log('found a good employee id:', customer);

               //iterate over cmes
               cmes.forEach(function(aCME) {
                    if(aCME.customer_id == customer.id) {
                        aCME.transactions.push(tx);
                        aCME.financials.gross_sales+= tx.gross_sales_money.amount;
                        aCME.financials.net_sales+=tx.net_total_money.amount;
                        aCME.financials.total_tips+=tx.tip_money.amount;
                        aCME.financials.total_discounts+=tx.discount_money.amount;
                        aCME.financials.total_refunds+=tx.refunded_money.amount;
                        foundCME = true;
                    }
               });

               if(!foundCME) { 
                   var newCME = Object.create(cme);
                   newCME.customer_id = customer.id;
                   newCME.customer_name = customer.name;
                   newCME.transactions = [];
                   newCME.transactions.push(tx);
                   newCME.financials = {
                    gross_sales: 0,
                    net_sales: 0,
                    total_tips: 0,
                    total_discounts: 0,
                    total_refunds: 0,
                    sales_hrs: {},
                    average_hourly_sales: 0 
                   };
                   newCME.financials.gross_sales+= tx.gross_sales_money.amount;
                   newCME.financials.net_sales+=tx.net_total_money.amount;
                   newCME.financials.total_tips+=tx.tip_money.amount;
                   newCME.financials.total_discounts+=tx.discount_money.amount;
                   newCME.financials.total_refunds+=tx.refunded_money.amount;
                   cmes.push(newCME); 
               };

           } else {
               //   IF NO VALID WIW EMPLOYEE ID WAS FOUND, ADD TX TO AN UNKONOWN CME
               
               //   FIRST CHECK FOR AN UNKOWN CME
               console.log('CME is undefined');

           };

        });

    });

    
    console.log(cmes);

    //  RETURN ALL CMES LIST
    return cmes;
};

/*
*   INITIALIZE CMES
*
*   This function takes a list of shifts and creates the required CMES
*/
function initializeCMEs(shifts) {
    //  DEFINE LOCAL VARIABLES
    var returnObject = [];


    //  NOTIFY PROGRESS
    console.log('initializing cmes');

    //  RETURN OBJECT
    return returnObject;
};

/*
*   SQUARE IDS HASHER
*
*   This method creates key value pairs of square and wiw emplpoyee ids
*/
function sqIdsHasher(wiwEmpIds) {
    //  DEFINE LOCAL VARIABLES
    var returnObject = {};

    //  ITERATE OVER EMPLOYEES
    wiwEmpIds.forEach(function(employee) {

        //  CHECK FOR THE KEY
        if(employee.employee_code != undefined) {
            
            //  NOTIFY PROGRESS
            console.log(employee.employee_code, employee.id);
            
            //  ADD THE PAIR TO THE HASH
            returnObject[employee.employee_code] = employee.id;

        }
        
    });

    //  RETURN THE VALUE
    return returnObject;
};

/*
*   SITES HASHER
*/
function sitesHasher(allSites) {
    //  DEFINE NEW VARIABLES
    var sitesHash = {};

    //  ITERATE OVER ALL SITES
    allSites.forEach(function(site) {
        sitesHash[site.id] = site.name;
    });

    //  RETURN VARIABLES
    return sitesHash;
};

/*
*   FIND CUSTOMER NAME
*
*   This function looks at a transaction, an employee id, a list of shifts, and a list of sites 
*   if a match is found the customer name will be returned, if not undefined is returned
*/
function findCustomer(txTime, wiwEmpId, wiwShifts, wiwSites) {
    //  DEFINE LOCAL VARIABLES
    var customer = {
        name: undefined,
        id: 0
    };

    //  ITERATE OVER ALL OF THE SHIFTS FOR THE DAY
    wiwShifts.forEach(function(shift) {

        //  IF THE EMPLOYEE ID MATCHES, CHECK THE TIMES
        if(wiwEmpId == shift.user_id) {
            customer.name = wiwSites[shift.site_id];
            customer.id = shift.site_id;
        }

    });

    //  RETURN
    return customer;
}

//  EXPORT THE MODULE
module.exports = collections;
