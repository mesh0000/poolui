'use strict';

app.controller('AdminPortsCtrl', function($scope, $location, $route, $mdDialog, dataService) {
	$scope.selected = [];

	var loadPorts = function() {
		dataService.getData("/admin/ports", function(data) {
			$scope.pool_ports = data;
		});
	}

	$scope.editPort = function (ev, port) {
		$mdDialog.show({
			locals: {
				port: port
			},
			clickOutsideToClose: true,
			controller: 'editPortCtrl',
			controllerAs: 'ctrl',
			focusOnOpen: true,
			targetEvent: ev,
			templateUrl: 'admin/editport.html',
		}).then (function () {
			loadPorts();
		}, function(msg){
			port=msg;
		})
	};

	$scope.addPort = function(ev){
		$mdDialog.show({
			clickOutsideToClose: true,
			controller: 'addPortCtrl',
			controllerAs: 'ctrl',
			focusOnOpen: true,
			targetEvent: ev,
			templateUrl: 'admin/editport.html',
		}).then (function () {
			loadPorts();
		}, function(){
			// error
		})
	}

	$scope.deletePort = function (ev, port) {
		console.log(port);
		var confirm = $mdDialog.confirm()
		.title('Delete Port ' + port.port +' ?')
		.textContent('Are you sure you want to get delete port ' + port.port + '?')
		.ariaLabel('Delete Port')
		.targetEvent(ev)
		.ok("Delete")
		.cancel("Cancel");
		
		$mdDialog.show(confirm).then(function() {
			// ;p
			dataService.deleteData("/admin/ports", {port: port.port}, function(data){
				// successfully deleted
				loadPorts();
			});
		}, function() {
			// cancel do nothing
		});
	};

	loadPorts();
});