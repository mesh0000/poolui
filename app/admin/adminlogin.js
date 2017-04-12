'use strict';

app.controller('AdminLoginCtrl', function($scope, $location, $route, dataService) {
	$scope.admin = {
		username:"",
		password:""
	}

	$scope.login = function () {
		dataService.postData("/authenticate", $scope.admin, function(data){	
			if (data.success){
				data.remember  = $scope.remember;
				dataService.setAuthToken(data);
				$location.path('#/dashboard');
			} else {
				// $mdDialog.hide(false);
			}
		}, function(error){
			$scope.status = "Please check your login details";
		});
	}

	var isLoggedIn = function () {
		if(dataService.isLoggedIn == false) ;
	}

	if(dataService.isLoggedIn()) {
		$location.path('/dashboard');
	};
});