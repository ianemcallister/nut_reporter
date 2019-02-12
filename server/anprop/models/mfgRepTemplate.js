/*
*	MODELS: MANUFACTURING REPORT TEMPLATE
*
*	This script models the manufacturing reports 
*/

//  NOTIFY PROGRESS

//  DEFINE DEPENDENCIES
var MFG = function () {
    this.reportDay = "";
    this.cooking = {};
    this.retailProducts = {};
};

//  DEFINE MODULE

//  EXPORT MODULE
module.exports = MFG;