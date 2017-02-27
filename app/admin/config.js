'use strict';

app.controller('AdminConfigCtrl', function($scope, $location, $route, dataService) {
	$scope.selected = [];

	$scope.promise = dataService.getData("/admin/config", function(data) {
		$scope.pool_configs = data;
	});
});