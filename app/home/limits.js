'use strict';

app.controller('LimitsCtrl', function($scope, $route, $mdDialog, dataService, timerService) {

	$scope.getConfig = function () {

		dataService.getData("/authed", function(data){	
			console.log(data);
		});
	}

	$scope.getConfig();

	$scope.cancel = function () {
		$mdDialog.cancel();
	}
});