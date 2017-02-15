'use strict';

app.controller('PaymentsCtrl', function($scope, dataService) {
	$scope.payments = {};
	$scope.selected = [];

	// dataService.getData("/pool/payments/pplns", function(data){
	// 	$scope.payments.pplns = data;
	// });

	// dataService.getData("/pool/payments/pps", function(data){
	// 	$scope.payments.pps = data;
	// });

    $scope.promise = dataService.getData("/pool/payments", function(data){
        $scope.payments.global = data;
    });
});