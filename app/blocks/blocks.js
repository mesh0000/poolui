'use strict';

app.controller('BlocksCtrl', function($scope, $route, dataService, timerService) {
	$scope.blocks = {};
	$scope.selected = [];

	var loadData = function () {
    	$scope.promise = dataService.getData("/pool/blocks", function(data){
	        $scope.blocks.global = data;

	        dataService.getData("/pool/blocks/pps", function(data){
				$scope.blocks.pps = data;
			});

			dataService.getData("/pool/blocks/pplns", function(data){
				$scope.blocks.pplns = data;
			});

			updateMaturity();
	    });

	    _.each($scope.poolList, function(pool_type) {
		    dataService.getData("/pool/stats/"+pool_type, function(data){
				$scope.poolStats[pool_type] = data;
			});

			dataService.getData("/pool/blocks/"+pool_type, function(data){
            	if (data.length > 0){
                    $scope.lastBlock[pool_type] = data[0];
				} else {
                    $scope.lastBlock[pool_type] = {
                    	ts: 0,
						hash: "",
						diff: 0,
						shares: 0,
						height: 0,
						valid: false,
						unlocked: false,
						pool_type: pool_type,
						value: 0
					}
                }
            });
		});
	};
    
	var updateMaturity = function () {
		_.each($scope.blocks.global, function(block, index){
			if($scope.poolStats.global != undefined && $scope.network != undefined) {
				$scope.blocks.global[index].maturity = $scope.config.maturity_depth - ($scope.network.height - block.height);
			}
		});
	}

	$scope.$watchGroup(["blocks.global", "poolStats.global"], updateMaturity);


	// Register call with timer 
	timerService.register(loadData, $route.current.controller);
	loadData();
	
	$scope.$on("$routeChangeStart", function () {
		timerService.remove($route.current.controller);
  	});
});