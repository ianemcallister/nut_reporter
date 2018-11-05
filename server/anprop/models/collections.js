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
    cmes: [],
    assignTxsToCMEs: assignTxsToCMEs
};

/*
*   ASSIGN TRANSACTIONS TO CMES
*
*   This method iterates over all transactions and assigns them to a CME
*/
function assignTxsToCMEs(allRawData) {
    //  DEFINE LOCAL VARIABLES
    var self        = this;
    var sqTxs       = allRawData[0];
    var sqrItems    = allRawData[1];
    var sqrMods     = allRawData[2];
    var wiwUsers    = allRawData[3];
    var wiwShifts   = allRawData[4];
    var wiwSites    = allRawData[5];

    //  ITERATE OVER LOCATIONS
    sqTxs.forEach(function(location) {

        //  ITERATE OVER TRANSACTIONS
        //location.transactions.forEach(function(tx) {

        //    console.log(tx.created_at);

        //});

    });

    //  RETURN ALL CMES LIST
    return self.cmes;
};

//  EXPORT THE MODULE
module.exports = collections;
