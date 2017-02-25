'use strict';

app.controller('ConsoleCtrl', function($scope, $route, $filter, $timeout, $mdDialog, min_wallet_payout, dataService, timerService) {
	$scope.paymentThresh;
	$scope.min_wallet_payout = min_wallet_payout;
	$scope.currentTab = 'threshold'; // default tab
	$scope.status = "";
	$scope.statusClass = "valid";
	$scope.password = {
		pwd: "",
		cnf: ""
	}
	
	var getConfig = function () {
		dataService.getData("/authed", function(data){	
			$scope.paymentThresh = $filter('toXMR')(data.msg);;
		});
	}

	var updateThreshold = function () {
		dataService.postData("/authed/changePayoutThreshold", {threshold: $scope.paymentThresh},function(data){
			//$mdDialog.hide('updated');
			$scope.statusClass = "valid";
			$scope.status = "Threshold Saved";
			messageFlash();
		});
	}

	var updatePassword = function () {
		if($scope.password.pwd == $scope.password.cnf && $scope.password.pwd !== "") {
			dataService.postData("/authed/changePassword", {password: $scope.password.pwd},function(data){
				//$mdDialog.hide('updated');
				$scope.statusClass = "valid";
				$scope.status = "Password Saved";
				messageFlash();
			});
		} else {
			$scope.statusClass = "invalid";
			$scope.status = "Check passwords";
			messageFlash();
		}
	}

	var messageFlash = function(){
		$timeout(function() {
			$scope.status = "";
			$scope.statusClass = "valid";
		},2500);
	}

	$scope.save = function () {
		$scope.status = "Saving...";// + $scope.currentTab;
		switch ($scope.currentTab){
			case 'Threshold':
			updateThreshold();
			break;
			
			case 'Password':
			updatePassword();
		}
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