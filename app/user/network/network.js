'use strict';

app.controller('NetworkCtrl', function($scope, $route, dataService, timerService) {
	
	// var loadData = function () {
	// 	console.log("Getting HomeCtrl Data");

	// 	dataService.getData("https://api.xmrpool.net/config", function(data){
	// 		$scope.config = data;
	// 	});

	// 	dataService.getData("https://api.xmrpool.net/miner/48s97vfViXi27Yd8gC9dgDbyToXzyFw2UM9BTFGsjKtH5mf8EHMnoe8gLyceFwNqnUMLnZEkpeTx8NE7tyxhy7ecL3JEjiB/stats", function(data){
	// 		$scope.miner = data;
	// 	});
	// };
	
	// loadData();
	// timerService.register(loadData, $route.current.controller);

	// $scope.$on("$routeChangeStart", function () {
 //       timerService.remove($route.current.controller);
 //    });
});