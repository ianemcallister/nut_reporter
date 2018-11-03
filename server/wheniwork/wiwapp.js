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
    init: init,
    shifts: {
        list: list_shifts
    },
    schedule: {},
    accounts: {},
    login: {},
    users: {},
    positions: {},
    locations: {},
    sites: {},
    blocks: {},
    requests: {},
    swaps: {},
    availabilities: {},
    payrolls: {},
    times: {},
    batch: {},
    messsages: {},
    send: {},
    templates: {},
    plans: {},
    annotations: {},
    devices: {},
    industries: {},
    timezones: {},
    errors: {}
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

/*
*   LIST SHIFTS
*
*   This method allows you to search for shifts. See the parameters below for all the options.
*   NOTE: The maximum range between start and end is 90 days. Any range greater than this will be set to the start time plus 90 days.
*   NOTE: OpenShifts will be included in the results as long as either include_allopen or include_onlyopen is true.
*
*   HTTP REQUEST: GET https://api.wheniwork.com/2/shifts
*
*   @param: start (datetime // Start time for the search window. The default is the current date and time.)
*   @param: end (datetime // End time for the search window. The default is exactly three days from the start time.)
*   @param: user_id (integer, string array // The ID of the user to get shifts for. For multiple users, enter a list of user IDs separated by commas (e.g. 1,5,3).)
*   @param: location_id (integer, string array // The ID of the location to get shifts for. For multiple locations, enter a list of location IDs separated by commas.)
*   @param: include_open (boolean // Whether to include OpenShifts in the results.)
*   @param: include_allopen (boolean // Whether to include OpenShifts in the results, including shifts that might be conflicts.)
*   @param: include_onlyopen (boolean // Whether only OpenShifts should be included in the results.)
*   @param: unpublished (boolean // Whether unpublished shifts should be included in the results.)
*   @param: deleted (boolean // Whether to include a list of deleted shift IDs in the results.)
*   @return: EXAMPLE OBJECT
*   {
        "start": "Wed, 05 Mar 2014 00:00:00 -0600",
        "end": "Sat, 08 Mar 2014 23:59:59 -0600",
        "shifts": [
        {
            "id": 10000,
            "account_id": 10000,
            "user_id": 101,
            "location_id": 1045,
            "position_id": 19483,
            "site_id": 4351,
            "start_time": "Fri, 07 Mar 2014 08:30:00 -0600",
            "end_time": "Fri, 07 Mar 2014 14:30:00 -0600",
            "break_time": 0.5,
            "color": "cc0000",
            "notes": "We need more cowbell.",
            "instances": 1,
            "published": true,
            "published_date": "Thu, 06 Mar 2014 22:17:14 -0600",
            "notified_at": null,
            "created_at": "Thu, 06 Mar 2014 21:12:14 -0600",
            "updated_at": "Thu, 06 Mar 2014 22:17:14 -0600",
            "acknowledged": 0,
            "acknowledged_at": "",
            "creator_id": 101,
            "is_open": null
        },
        {
            "id": 27384,
            "account_id": 10000,
            "user_id": 101,
            "location_id": 1045,
            "position_id": 19483,
            "site_id": 4351,
            "start_time": "Sat, 08 Mar 2014 09:00:00 -0600",
            "end_time": "Sat, 08 Mar 2014 17:00:00 -0600",
            "break_time": 0.5,
            "color": "cc0000",
            "notes": "We need more cowbell.",
            "instances": 1,
            "published": true,
            "published_date": "Thu, 06 Mar 2014 22:17:14 -0600",
            "notified_at": null,
            "created_at": "Thu, 06 Mar 2014 21:12:14 -0600",
            "updated_at": "Thu, 06 Mar 2014 22:17:14 -0600",
            "acknowledged": 0,
            "acknowledged_at": "",
            "creator_id": 101,
            "is_open": null
        }
        ]
*   }
*   
*/
function list_shifts(options) {
    //  DEFINE LOCAL VARIABLES
    
    //  EXECUTE ASYNC WORK
    return new Promise(function(resolve, reject) {

        wiw.get('shifts', options)
        .then(res => { resolve(res.shifts); })
        .catch(err => { reject(err); })
    }); 

};

//  EXPORT THE MODULE
module.exports = wheniworkapi;
