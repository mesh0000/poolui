'use strict';

app.controller('LoginCtrl', function($scope, $route, $mdDialog, dataService, timerService) {
	$scope.authToken = "";

	$scope.user = {
		username: "48s97vfViXi27Yd8gC9dgDbyToXzyFw2UM9BTFGsjKtH5mf8EHMnoe8gLyceFwNqnUMLnZEkpeTx8NE7tyxhy7ecL3JEjiB",
		password: "hackfanatic@gmail.com"
	}

	$scope.login = function () {

		dataService.postData("/authenticate", $scope.user, function(data){
			if (data.success){
				$scope.authToken = data.msg;
			} else {

			}
		});
	}

	$scope.cancel = function () {
		$mdDialog.cancel();
	}
});