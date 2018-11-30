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
    shiftCMEHasher: shiftCMEHasher,
    findCustomer: findCustomer
};

/*
*   ASSIGN TRANSACTIONS TO CMES
*
*   This method iterates over all transactions and assigns them to a CME
*/
function assignTxsToCMEs(allRawData) {
    //  DEFINE LOCAL VARIABLES
    var sqTxs           = allRawData[0];
    //var sqrItems    = allRawData[1];
    //var sqrMods     = allRawData[2];
    var wiwUsers        = sqIdsHasher(allRawData[3]);
    var wiwShifts       = shiftsHasher(allRawData[4]);
    var shiftIdsByCME   = shiftCMEHasher(allRawData[4], allRawData[3]);
    var wiwSites        = sitesHasher(allRawData[5], shiftIdsByCME);
    //var cmes        = initializeCMEs(wiwShifts);
    
    //console.log(wiwSites);
    //console.log(wiwShifts);

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

            //  IF THERE WAS NOT AN EMPLOYEE ID 
            if(sqEmpId == undefined) {
                
                //  TRANSACTION GETS SAVED TO UNKOWN SITE
                wiwSites['3834888'].txs[tx.id] = tx

            //  IF THERE WAS AN EMPLOYEE ID
            } else {

                //   IDENTIFY WIW EMPLOYEE ID
                var wiwEmpId = wiwUsers[sqEmpId];
                var withinTimeBlock = false;
                
                //console.log('wiwEmpId', wiwEmpId);
                
                //  ITERATE OVER EMPLOYEE SHIFTS
                Object.keys(wiwShifts[wiwEmpId]).forEach(function(timeslots) {
                    //console.log(timeslots);
                    var timeBlockArray = timeslots.split('/');
                    var startBlock = timeBlockArray[0];
                    var endBlock = timeBlockArray[1];

                    //   IF THE TRANSACTIONS TAKES PLACE WITHIN THE TIMEBLOCK
                    if(moment(tx.created_at).isBetween(startBlock, endBlock)) {

                        //  UPDATE THE FLAG
                        withinTimeBlock = true;

                        //  GET THE CME ID
                        var CMEiD = wiwShifts[wiwEmpId][timeslots];
                        
                        //  SAVE THE TRANSACTION
                        wiwSites[CMEiD].txs[tx.id] = tx

                    } 

                    //console.log(startBlock, endBlock);

                });

                //  IF THE FLAG WASN'T THROWN...
                if(withinTimeBlock == false) {

                    //  SAVE THE TRANSACTION TO UNKOWN SITE
                    wiwSites['3834888'].txs[tx.id] = tx;

                }
                
            }

        });

    });

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
function sitesHasher(allSites, shiftIdsByCME) {
    //  DEFINE NEW VARIABLES
    var sitesHash = {};

    //  ITERATE OVER ALL SITES
    allSites.forEach(function(site) {
        sitesHash[site.id] = {
            name: site.name,
            txs: {},
            shifts: {}
        };
    });

    //  ITERATE OVER ALL SHIFT CMES
    Object.keys(shiftIdsByCME).forEach(function(key) {

        //  ITERATE OVER ALL SHIFT IDS
        Object.keys(shiftIdsByCME[key]).forEach(function(shiftId) {

            //  ADD THE SHIFT BY KEY
            sitesHash[key].shifts[shiftId] = shiftIdsByCME[key][shiftId];
        });

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

        //  ADD THE SITE_ID UNDER UNDER THE APPROPRIATE TIME BLOCK
        shiftsHash[shift.user_id][startEndString] = shift.site_id

    });

    return shiftsHash;
};

/*
*   SHIFT CME HASHER
*
*
*/
function shiftCMEHasher(wiwShifts, wiwUsers) {
    // DEFINE LOCAL VARIABLES
    var cmeShiftHash = {};
    var employeeProfile = {};

    //  ITERATE OVER ALL SHIFTS
    wiwShifts.forEach(function(shift) {
        //  DEFINE LOCAL VARIABLES
        var startTime = moment(shift.start_time);
        var endTime = moment(shift.end_time);
        var startEndString = startTime.format() + "/" + endTime.format();

        //  CREATE THE SITE ID IF NEED BE
        if(cmeShiftHash[shift.site_id] == undefined)
            cmeShiftHash[shift.site_id] = {};

        //  LOAD THE USER PROFILE
        wiwUsers.forEach(function(empRcrd) {

            if(empRcrd.id == shift.user_id) employeeProfile = empRcrd;

        });

        //  CREATE THE SHIFT ID OBJECT
        cmeShiftHash[shift.site_id][shift.id] = {
            empId: shift.user_id,
            email: employeeProfile.email,
            empName: {
                first: employeeProfile.first_name,
                last: employeeProfile.last_name,
            },
            timeBlock: startEndString,
            base_hrly_rate: employeeProfile.hourly_rate * 100,
            duration_hrs: endTime.diff(startTime, 'minutes') / 60
        };

    });

    return cmeShiftHash;
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
