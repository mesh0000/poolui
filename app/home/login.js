'use strict';

app.controller('LoginCtrl', function($scope, $route, $mdDialog, dataService, timerService) {
	$scope.user = {
		username: "",
		password: ""
	}

	$scope.login = function () {

		dataService.postData("/authenticate", $scope.user, function(data){	
			if (data.success){
				$mdDialog.hide(data.msg);
			} else {
				$mdDialog.hide(false);
			}
		});
	}

	$scope.cancel = function () {
		$mdDialog.cancel();
	}
});