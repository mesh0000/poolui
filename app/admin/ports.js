'use strict';

app.controller('AdminPortsCtrl', function($scope, $location, $route, dataService) {
	$scope.selected = [];

	dataService.getData("/admin/ports", function(data) {
		$scope.pool_ports = data;
	});
});