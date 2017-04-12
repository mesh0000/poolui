'use strict';

app.controller('PortsModalCtrl', function($scope, $mdDialog, dataService) {
	$scope.selected = [];

	$scope.promise = dataService.getData("/pool/ports", function(data){
		$scope.portsList = data;
	});

	$scope.answer = function (answer) {
		$mdDialog.hide('close')
	}
});