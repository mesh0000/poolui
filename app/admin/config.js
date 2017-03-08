'use strict';

app.controller('AdminConfigCtrl', function($scope, $location, $route, $mdDialog, dataService) {
	$scope.selected = [];

	var loadConfig = function () {
		dataService.getData("/admin/config", function(data) {
			$scope.pool_configs = data;
		});
	}

	$scope.editConfig = function (ev, config) {
		$mdDialog.show({
			locals: {
				config: config
			},
			clickOutsideToClose: true,
			controller: 'editConfigCtrl',
			controllerAs: 'ctrl',
			focusOnOpen: false,
			targetEvent: ev,
			templateUrl: 'admin/editconfig.html',
		}).then (function () {
			loadConfig();
		}, function(){
			// error
		})

	};

	loadConfig();
});