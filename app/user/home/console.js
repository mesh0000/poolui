'use strict';

app.controller('ConsoleCtrl', function($scope, $route, $filter, $timeout, $mdDialog, min_wallet_payout, dataService, timerService) {
	$scope.paymentThresh;
	$scope.min_wallet_payout = min_wallet_payout;
	$scope.currentTab = 'Threshold'; // default tab
	$scope.status = "";
	$scope.statusClass = "valid";
	$scope.password = {
		pwd: "",
		cnf: ""
	}

	var email_enabled;
	
	var getConfig = function () {
		dataService.getData("/authed", function(data){
			$scope.paymentThresh = $filter('toXMR')(data.msg.payout_threshold);
			email_enabled = data.msg.email_enabled;
			$scope.email_toggle = data.msg.email_enabled;
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

	var updateEmail = function () {
		if($scope.email_toggle!=email_enabled){
			dataService.postData("/authed/toggleEmail", {}, function(data) {
				$scope.status = data.msg;
				email_enabled=$scope.email_toggle;
				messageFlash();
			});
		} else {
			$scope.statusClass = "invalid";
			$scope.status = "No Change...";
			messageFlash();
		}
	}

	var messageFlash = function(){
		$timeout(function() {
			$scope.status = "";
			$scope.statusClass = "valid";
		},2000);
	}

	$scope.save = function () {
		$scope.statusClass = "valid";
		$scope.status = "Saving...";// + $scope.currentTab;
		switch ($scope.currentTab){
			case 'Threshold':
			updateThreshold();
			break;
			
			case 'Password':
			updatePassword();

			case 'Email':
			updateEmail();
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