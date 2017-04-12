'use strict';

app.controller('AdminDashCtrl', function($scope, $location, $route, dataService) {
	$scope.selected = [];

	dataService.getData("/admin/stats", function(data) {
		$scope.pool_stats = data;
	});

	dataService.getData("/admin/wallet", function(data) {
		$scope.pool_wallet = data;
	});

	$scope.promise = dataService.getData("/admin/wallet/history", function(data) {
		$scope.pool_wallet_history = data;
	});
});