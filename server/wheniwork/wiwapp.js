/*
*	WHEN I WORK API
*
*	This module incorporates all of the API functionality of When I work
*/

//DEFINE DEPENDENCIES
let WIW = require('wheniwork').WIW;
let wiw = init(); 

//DEFINE 

//DEFINE THE MODULE
var wheniworkapi = {
    init: init
};

/*
*   INIT
*
*   This function initialzies the when I work API
*/
function init() {
    //define local variabls
    let apiKey = process.env.WIW_API_KEY;
    let username = process.env.WIW_USERNAME; 
    let password = process.env.WIW_PASSWORD;

    return new WIW(apiKey, username, password);
};

//  EXPORT THE MODULE
module.exports = wheniworkapi;