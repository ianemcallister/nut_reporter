/*
*	SQUARE 
*
*	This module serves as the connection between Ah-Nuts and SquareUp.com.
*/

//  DEFINE DEPENDENCIES
var SquareConnect 	= require('square-connect');
var defaultClient 	= SquareConnect.ApiClient.instance;

// Configure OAuth2 access token for authorization: oauth2
var _oauth2 		= defaultClient.authentications['oauth2'];
_oauth2.accessToken = process.env.SQUARE_APP_TOKEN;

//  DEFINE MODULE
let square = {
    locations: [
        'S4P16GQRK21CF',    //online
        'M53KQT35YKE5C',    //oregon
        '14E8S7P16JQDM'     //utah
    ],
    V1: {
        business: {},
        transactions: {
            payments_list: tx_payments_list,
            retreive_payment: retreive_tx_payment
        },
        items: {
            list: list_items
        },
        oAuth: {},
        webhooks: {},
        subscriptions: {}
    },
    V2: {
        applePay: {},
        catalog: {},
        checkout: {},
        customers: {},
        inventory: {},
        locations: {},
        orders: {},
        reporting: {},
        transactions: {}
    },
    multipleLocations: multipleLocations,
    test: test
};

/*
*   TRANSACTIONS PAYMENTS LIST
*
*   Provides summary information for all payments taken by a merchant or any of the merchant's mobile staff during a date range. Date ranges cannot exceed one year in length. See Date ranges for details of inclusive and exclusive dates.
*
*   HTTP REQUEST: GET /v1/{location_id}/payments
*
*   @param: location_id // The ID of the location to list payments for. If you specify me, this endpoint returns payments aggregated from all of the business' locations. Get a business' locations with the List Locations endpoint.
*   @param: begin_time (optional) // The beginning of the requested reporting period, in ISO 8601 format. If this value is before January 1, 2013 (2013-01-01T00:00:00Z), this endpoint returns an error. Default value: The current time minus one year.
*   @param: end_time (optional) // The end of the requested reporting period, in ISO 8601 format. If this value is more than one year greater than begin_time, this endpoint returns an error.
*   @param: order (optional) // The order in which payments are listed in the response.
*   @param: limit (optional) // The maximum number of payments to return in a single response. This value cannot exceed  200. This value is always an integer.
*   @param: include_partial (optional) // Indicates whether or not to include partial payments in the response. Partial payments will have the tenders collected so far, but the itemizations will be empty until the payment is completed.
*   
*   @return: EXAMPLE OBJECT - An array of zero or more Payment objects. This endpoint might paginate its results.
*   [
        {
            "id": "Jq74mCczmFXk1tC10GB",
            "merchant_id": "JGHJ0343",
            "created_at": "2014-07-07T18:45:00Z",
            "creator_id": "18YC4JBH91E1G",
            "device": {
            "name": "Front of store"
            },
            "payment_url": "https://squareup.com/dashboard/sales/transactions/Jq74mCczmFXk1tC10GB",
            "inclusive_tax_money": {
            "currency_code": "USD",
            "amount": 0
            },
            "additive_tax_money": {
            "currency_code": "USD",
            "amount": 24
            },
            "tax_money": {
            "currency_code": "USD",
            "amount": 24
            },
            "tip_money": {
            "currency_code": "USD",
            "amount": 0
            },
            "discount_money": {
            "currency_code": "USD",
            "amount": -45
            },
            "total_collected_money": {
            "currency_code": "USD",
            "amount": 429
            },
            "processing_fee_money": {
            "currency_code": "USD",
            "amount": -12
            },
            "net_total_money": {
            "currency_code": "USD",
            "amount": 417
            },
            "refunded_money": {
            "currency_code": "USD",
            "amount": 0
            },
            "inclusive_tax": [],
            "additive_tax": [
            {
                "name": "Sales tax",
                "rate": "0.060000",
                "inclusion_type": "ADDITIVE",
                "applied_money": {
                "currency_code": "USD",
                "amount": 24
                }
            }
            ],
            "tender": [
            {
                "type": "CREDIT_CARD",
                "name": "Credit Card",
                "total_money": {
                "currency_code": "USD",
                "amount": 429
                },
                "card_brand": "DISCOVER",
                "pan_suffix": "1117",
                "entry_method": "SWIPED"
            }
            ],
            "refunds": [],
            "itemizations": [
            {
                "name": "Milkshake",
                "quantity": "1.00000000",
                "notes": "Delicious!",
                "item_variation_name": "Small",
                "item_detail": {
                "category_name": "Beverages",
                "sku": "123",
                "item_id": "a1c50178-19ad-4783-aee4-4f2548ca8254",
                "item_variation_id": "8219dd37-666f-4855-be73-b5d28826580b"
                },
                "total_money": {
                "currency_code": "USD",
                "amount": 429
                },
                "single_quantity_money": {
                "currency_code": "USD",
                "amount": 400
                },
                "gross_sales_money": {
                "currency_code": "USD",
                "amount": 450
                },
                "discount_money": {
                "currency_code": "USD",
                "amount": -45
                },
                "net_sales_money": {
                "currency_code": "USD",
                "amount": 405
                },
                "taxes": [
                {
                    "name": "Sales tax",
                    "rate": "0.060000",
                    "inclusion_type": "ADDITIVE",
                    "applied_money": {
                    "currency_code": "USD",
                    "amount": 24
                    },
                    "fee_id": "19498df7-3fb0-4c96-8b47-860480718abk"
                }
                ],
                "discounts": [
                {
                    "name": "Early Bird",
                    "applied_money": {
                    "currency_code": "USD",
                    "amount": -45
                    },
                    "discount_id": "0f075287-094c-4de7-9e23-cff5d41c910b"
                }
                ],
                "modifiers": [
                {
                    "name": "Whipped Cream",
                    "applied_money": {
                    "currency_code": "USD",
                    "amount": 50
                    },
                    "modifier_option_id": "39059fd0-ae9d-4eb3-b6e8-dd3198f019b8"
                }
                ]
            }
            ]
        }
*   ]
*/
function tx_payments_list() {

};

/*
*   RETREIVE TRANSACTION PAYMENT
*
*   This is a simple test to make sure everything is running properly
*/
function retreive_tx_payment() {};

/*
*   LIST ITEMS
*
*   Provides summary information for all of a location's items.
*
*   HTTP REQUEST: GET /v1/{location_id}/items
*
*   @param: location_id // The ID of the location to list payments for. If you specify me, this endpoint returns payments aggregated from all of the business' locations. Get a business' locations with the List Locations endpoint.

*   @return: EXAMPLE OBJECT - An array of zero or more Payment objects. This endpoint might paginate its results.
*   [
        {
            "id": "442d1344-6d2b-4238-83d0-0284dfd335d8",
            "name": "Milkshake",
            "description": "It's better than yours",
            "visibility": "PRIVATE",
            "type": "NORMAL",
            "available_online": false,
            "category": {
            "id": "36ac7016-3a4e-4934-81f1-9057ac613f2y",
            "name": "Beverages"
            },
            "variations": [
            {
                "id": "cb890728-cfdc-4690-9e03-349f964f756r",
                "name": "Small",
                "pricing_type": "FIXED_PRICING",
                "price_money": {
                "currency_code": "USD",
                "amount": 400
                },
                "ordinal": 0,
                "item_id": "442d1344-6d2b-4238-83d0-0284dfd335d8"
            },
            ...
            ]
        },
        ...
*   ]
*/
function list_items() {
    //  DEFINE LOCAL VARIABLES
    var self = this;
    var apiInstance = new SquareConnect.V1ItemsApi();

    //  RETURN ASYNC WORK
    return new Promise(function(resolve,reject) {

        resolve('This is a list item');

    });

};

/*
*   TEST
*
*   This is a simple test to make sure everything is running properly
*/
function multipleLocations(fnPath, options) {
    //  DEFINE LOCAL VARIABLES
    var self = this;
    var resultsArray = [];
    var fnPathSteps = fnPath.split("/");
    var exFn = self;

    //console.log(fnPathSteps);

    //  ITERATE OVER FUNCTION PATH STEPS
    fnPathSteps.forEach(function(step) {
        exFn = exFn[step];
    });

    //console.log(exFn);

    //  ITERATE THROUGH ALL LOCATIONS
    self.locations.forEach(function(location) {
        resultsArray.push(exFn(options))
    });

    return resultsArray;
};

/*
*   TEST
*
*   This is a simple test to make sure everything is running properly
*/
function test() { console.log('square test good'); };

//  EXPORT THE MODULE
module.exports = square;