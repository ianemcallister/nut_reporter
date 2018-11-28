/*
*	COLLECTIONS MODEL
*
*	This module agregates records.
*
*/

//  NOTIFY PROGRESS


//  DEFINE DEPENDENCIES
var cme     = require('./cme');
var moment  = require('moment');

//  DEFINE THE MODULE
var collections = {
    assignTxsToCMEs: assignTxsToCMEs,
    initializeCMEs: initializeCMEs,
    sqIdsHasher: sqIdsHasher,
    shiftsHasher:shiftsHasher,
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
    var wiwShifts   = shiftsHasher(allRawData[4]);
    var wiwSites    = sitesHasher(allRawData[5]);
    //var cmes        = initializeCMEs(wiwShifts);
    
    console.log(wiwSites);
    console.log(wiwShifts);

    //  RETURN ALL CMES LIST
    return wiwSites;
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
        sitesHash[site.id] = {
            name: site.name,
            txs: {}
        };
    });

    //  RETURN VARIABLES
    return sitesHash;
};

/*
*   SHIFTS HASHER
*
*/
function shiftsHasher(wiwShifts) {
    //define local variables
    var shiftsHash = {};

    console.log('hashing shifts', wiwShifts.length);

    //  ITERATE OVER SHIFTS
    wiwShifts.forEach(function(shift) {
        //  DEFINE LOCAL VARIABLES
        var startTime = moment(shift.start_time).format();
        var endTime = moment(shift.end_time).format();
        var startEndString = startTime + "/" + endTime;
       
        //  IF THIS EMPLOYEE HASN'T BEEN ADDED YET, DO SO
        if(shiftsHash[shift.user_id] == undefined) { 
            shiftsHash[shift.user_id] = {};
        };
        
        shiftsHash[shift.user_id][startEndString] = shift.site_id

    });

    return shiftsHash;
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
