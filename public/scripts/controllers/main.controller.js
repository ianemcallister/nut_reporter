angular.module('nutReporter').controller('mainController', mainController);

mainController.$inject = ['$scope','$log', '$location', 'locationsList', 'employeeList', 'CMEList', 'dataService'];

/* @ngInject */
function mainController($scope, $log, $location, locationsList, employeeList, CMEList, dataService) {
    //notify progress
    console.log('in the main controller');
    
    //  DEFINE LOCAL VARIABLES
    var self = this;

    self.date = new Date();
    self.strTime = "00:00:00-07:00";
    self.endTime = "23:59:59-07:00";
    self.selectedEmployee = "";
    self.selectedLocation = "";
    self.txsSummary = {};

    //  LISTS
    self.locationsList = locationsList;
    self.employeeList = employeeList;
    self.CMEList = CMEList;

    //  VIEW MODEL FUNCTIONS
    self.submitQuery = function() {

        //  ACCESS DATA SERVICE
        dataService.queries.CME_Transactions({
            analysis: ['sales'],
            location: self.selectedLocation,
            begin_time: _buildDateString(self.date, self.strTime),
            end_time: _buildDateString(self.date, self.endTime),
            devices: [],
            employees: [self.selectedEmployee],
            adjustments: [],
            sales_hrs: 7,
            labor_hrs: 7.5,
            base_rate_hrly: 1200,
            emails: {
                employee: [],
                supervisors: [],
                other: []
            },
            CME_info: {
                name: ""
            }
        }).then(function(queryResponse) {
            self.txsSummary = queryResponse;
            console.log(queryResponse);
            $scope.$apply();
        });
    
    };

    //  LOCAL METHODS
    function _buildDateString(date, time) {
        //  DEFINE LOCAL VARIABLES
        //  RETURN STRING
        return  date.getFullYear() + "-0" +
                (date.getMonth() + 1) + "-0" +
                date.getDate() + "T" +
                time
    };
};