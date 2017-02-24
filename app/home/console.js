'use strict';

app.controller('ConsoleCtrl', function($scope, $route, $filter, $mdDialog, min_wallet_payout, dataService, timerService) {
	$scope.paymentThresh = 0;
	$scope.min_wallet_payout = min_wallet_payout;
	
	var getConfig = function () {
		dataService.getData("/authed", function(data){	
			$scope.paymentThresh = $filter('toXMR')(data.msg);;
		});
	}

	var updateThreshold = function () {
		dataService.postData("/authed/changePayoutThreshold", {threshold: $scope.paymentThresh},function(data){
			$mdDialog.hide('updated'); 
		});
	}

	$scope.save = function () {
		updateThreshold();
	}

	$scope.logout = function () {
		$mdDialog.hide('logout');
	}

	getConfig();

	// Dialog methods
	$scope.cancel = function () {
		$mdDialog.cancel();
	}
});