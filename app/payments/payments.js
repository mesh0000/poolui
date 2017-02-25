'use strict';

app.controller('PaymentsCtrl', function($scope, dataService) {
	$scope.payments = {};
	$scope.selected = [];

	$scope.options = {
		page: 1,
		limit: 15
	}

	$scope.loadPayments = function () {
		var params = angular.copy($scope.options);
		params.page -= 1;
		var urlParams = $.param(params)
		
		dataService.getData("/pool/payments?"+urlParams, function(data){
			$scope.payments.global = data;
		});
	}

	$scope.loadPayments();

});