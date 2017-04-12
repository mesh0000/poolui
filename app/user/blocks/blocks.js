'use strict';

app.controller('BlocksCtrl', function($scope, $route, dataService, timerService) {
	$scope.blocks = {};
	$scope.chart = {
		dataset : {},
		options : {
			margin: {top: 5},
			series: [
			{
				axis: "y",
				dataset: "global",
				key: "height",
				label: "A line series",
				type: ["line"],
				id: "blocksperday"
			}
			],
			axes: {x: {key: "ts", type: "date"}}
		}
	};
	$scope.selected = [];

	$scope.options = {
		page: 1,
		limit: 15
	}

	$scope.loadBlocks = function () {
		var params = angular.copy($scope.options);
		params.page -= 1;
		var urlParams = $.param(params)
		$scope.promise = dataService.getData("/pool/blocks?"+urlParams, function(data){
			$scope.blocks.global = data;
			updateMaturity();
			updateChart();
		});
	};

	var updateChart = function () {
		console.log($scope.blocks);
		$scope.chart.dataset = $scope.blocks;
	}

	var updateMaturity = function () {
		var luck;
		if($scope.poolStats.global !== undefined){
			_.each($scope.blocks.global, function(block, index){
				if($scope.network !== undefined) {
					$scope.blocks.global[index].maturity = $scope.config.maturity_depth - ($scope.network.height - block.height);
				}

				// calculate luck
				luck = block.shares/block.diff*100;
				$scope.blocks.global[index].luck = (luck <= 100) ? (100-luck) : (-luck+100) ;
				$scope.blocks.global[index].icon = (block.valid) ? 'done' : 'clear';
			});
		}
	}

	$scope.$watchGroup(["blocks.global", "poolStats.global"], updateMaturity);

	// Register call with timer 
	timerService.register($scope.loadBlocks, $route.current.controller);
	$scope.loadBlocks();
	
	$scope.$on("$routeChangeStart", function () {
		timerService.remove($route.current.controller);
	});
});