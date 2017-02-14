'use strict';

app.controller('GettingStartedCtrl', function($scope, dataService) {
	$scope.portsList = {};
	$scope.selected = [];

	$scope.promise = dataService.getData("/pool/ports", function(data){
		$scope.portsList = data;
	});
});