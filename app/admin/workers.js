'use strict';

app.controller('AdminWorkersCtrl', function($scope, $location, $route, dataService) {
	$scope.selected = [];

	$scope.promise = dataService.getData("/admin/userList", function(data) {
		$scope.pool_workers = data;
	});
});