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
        controllerAs: 'vm'
    })
	.otherwise({
        redirectTo: '/'
    });
}

/*
*   REQUIRED FUNCTIONS
*
*/


