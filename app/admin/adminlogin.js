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
				$location.path('/cp');
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
});