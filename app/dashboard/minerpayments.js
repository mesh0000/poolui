'use strict';

app.controller('MinerPaymentsCtrl', function($scope, $mdDialog, dataService, miner, addr) {
	$scope.miner = miner;
	$scope.addr = addr;
	$scope.selected = [];

	dataService.getData("/miner/"+addr+"/payments", function(data){
		$scope.payments = data;
	});

	$scope.answer = function (answer) {
		$mdDialog.hide('close')
	}
});