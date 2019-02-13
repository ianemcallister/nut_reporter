/*
*	ROUTES-CONFIG
*
*	This module sets up all the required angular routes for this web app.
*/
angular
    .module('nutReporter')
    .config(config);

/* @ngInject */
function config($routeProvider, $locationProvider) {
	$locationProvider.hashPrefix('');
    $routeProvider
	//PUBLIC ROUTES
    .when('/', {
        templateUrl: 'views/dailyScorecardGen.htm',      //'views/dailyScorecardGen.htm'
        controller: 'mainController',                   //'mainController'
        controllerAs: 'vm',
        resolve: { /* @ngInject */
            locationsList: locationsList,
            employeeList: employeeList,
            CMEList: CMEList
        }
    })
	.otherwise({
        redirectTo: '/'
    });
}

/*
*   REQUIRED FUNCTIONS
*
*/

//  LOCATIONS LIST
function locationsList() {
    return new Promise(function(resolve, reject) {
        resolve([{value: "Oregon", id: "M53KQT35YKE5C"},{value:"Online",id:"S4P16GQRK21CF"}, {value:"Utah",id:"14E8S7P16JQDM"}]);
    });
};

//  EMPLOYEE LIST
function employeeList(dataService) {
    //return the promise
    //return 'good test';
    return new Promise(function(resolve, reject) {
        //hit the server for the 
        dataService.sqr_employees.list().then(function(response) {
            resolve(response);
        });
        
    });
};

//  CME LIST
function CMEList() {
    //return the promise
    return new Promise(function(resolve, reject) {
        //hit the server for the 
        resolve('good test');
    });
};
