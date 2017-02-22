'use strict';

app.controller('LimitsCtrl', function($scope, $route, $mdDialog, dataService, timerService) {

	$scope.paymentLimit = 0;

	var getConfig = function () {
		dataService.getData("/authed", function(data){	
			$scope.paymentThresh = data.msg;
		});
	}

	getConfig();

	// Dialog methods
	$scope.cancel = function () {
		$mdDialog.cancel();
	}
});