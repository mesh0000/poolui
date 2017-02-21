'use strict';

app.controller('PaymentsCtrl', function($scope, dataService) {
	$scope.payments = {};
	$scope.selected = [];

	$scope.options = {
		page: 0,
		limit: 15
	}

	$scope.loadPayments = function () {
		dataService.getData("/pool/payments?"+$.param($scope.options), function(data){
			$scope.payments.global = data;
		});
	}

	$scope.loadPayments();

});