'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('poolui', [
	'pool.globals',
	'ngRoute',
	'ngMaterial',
	'md.data.table',
	'angularMoment',
	'ngStorage',
	'ngAudio',
	'utils.strings',
	'utils.services',
	'utils.xhr',
	'n3-line-chart',
	'angular-page-visibility'
	]).config(['$locationProvider', '$routeProvider', '$mdThemingProvider', function($locationProvider, $routeProvider, $mdThemingProvider) {
		$locationProvider.hashPrefix('')
		;	
		$mdThemingProvider.theme('default')
		.primaryPalette('grey')
		.accentPalette('light-blue');

		$routeProvider
		.when('/home', {
			templateUrl: 'user/home/home.html',
			controller: 'HomeCtrl',
			activetab: 'home'
		})
		.when('/dashboard', {
			templateUrl: 'user/dashboard/dashboard.html',
			controller: 'DashboardCtrl',
			activetab: 'dashboard'
		})
		.when('/blocks', {
			templateUrl: 'user/blocks/blocks.html',
			controller: 'BlocksCtrl',
			activetab: 'blocks'
		})
		.when('/payments', {
			templateUrl: 'user/payments/payments.html',
			controller: 'PaymentsCtrl',
			activetab: 'payments'
		})
		.when('/network', {
			templateUrl: 'user/network/network.html',
			controller: 'NetworkCtrl',
			activetab: 'network'
		})
		.when('/ports', {
			templateUrl: 'user/ports/ports.html',
			controller: 'PortsCtrl',
			activetab: 'ports'
		})
		.when('/help/chat', {
			templateUrl: 'user/help/chat.html',
			controller: 'ChatCtrl',
			activetab: 'support'
		})
		.when('/help/getting_started', {
			templateUrl: 'user/help/getting_started.html',
			controller: 'GettingStartedCtrl',
			activetab: 'help'
		})
		.when('/help/faq', {
			templateUrl: 'user/help/faq.html',
			controller: 'FAQCtrl',
			activetab: 'help'
		});

		$routeProvider.otherwise({redirectTo: '/home'});

	}]);

	app.controller('AppCtrl', function($scope, $rootScope, $location, $route, $routeParams, $anchorScroll, $window, $interval, $mdDialog, dataService, timerService, addressService, $mdSidenav, $mdMedia, $localStorage, ngAudio, GLOBALS){
		$scope.GLOBALS = GLOBALS;
		var appCache = window.applicationCache;
		$scope.$storage = $localStorage;

		$scope.poolList = ["pplns", "pps", "solo"];
		$scope.poolStats = {}; // All Pool stats
		$scope.addrStats = {}; // All tracked addresses
		$scope.lastBlock = {};
		
		// for miner tracking
		$scope.yourTotalHashRate = 0;

		// Hashrate Alarm
		$scope.globalSiren = false;
		$scope.sirenAudio = ngAudio.load("assets/ding.wav");
		
		// Update global hashrate and set off alarm if any of the tracked addresses fall below the threshold
		var updateHashRate = function (addrStats){
			var totalHashRate = 0;
			var siren = false;
			
			_.each(addrStats, function(addr,index) {
				totalHashRate += addr.hash;
				if (addr.alarm && addr.hash < addr.alarmLimit) {
					siren=true;
				}
			});

			$scope.globalSiren=siren;
			$scope.yourTotalHashRate = totalHashRate;
		}

		var playSiren = function (){
			($scope.globalSiren) ? $scope.sirenAudio.play() : $scope.sirenAudio.stop();
		}

		// ------- UI HELPERS

		$scope.menuOpen = $mdMedia('gt-md');
		$scope.$watch(function() { return $mdMedia('gt-md'); }, function(big) {
			$scope.menuOpen = $mdMedia('gt-md');
		});

		$scope.toggleSidenav = function (){
			if (!$mdMedia('gt-md')) {
				$mdSidenav('left').toggle();
			} else {
				// toggle boolean
				$scope.menuOpen = !$scope.menuOpen;
			}
		}

		// ------- Miner Login and auth
		$scope.minerLogin = function (ev) {
			$mdDialog.show({
				controller: "LoginCtrl",
				templateUrl: 'user/home/login.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:true,
			  fullscreen: !$scope.menuOpen // Only for -xs, -sm breakpoints.
			})
			.then(function(answer) {
			  // success callback
			}, function(error) {
			  // error callback
			});
		}

		$scope.minerConsole = function (ev) {
			$mdDialog.show({
				locals: $scope.config,
				controller: "ConsoleCtrl",
				templateUrl: 'user/home/console.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:true,
			  fullscreen: !$scope.menuOpen // Only for -xs, -sm breakpoints.
			})
			.then(function(answer){
				if(answer=='logout'){
					dataService.logout();
				}
			}, function(reason){
				// console.log(reason);
			});
		}

		$scope.isLoggedIn = function() {
			return dataService.isLoggedIn();
		}

		// ------- App Update
		var update = function() {
			if (appCache.status == window.applicationCache.UPDATEREADY) {
				appCache.swapCache(); 
				$window.location.reload();
			}
		}

		appCache.addEventListener("updateready", function(event) {
			update();
		}, false);

		var updateCache = function () {
			appCache.update();
		}

		// API Requests
		var loadData = function () {
			dataService.getData("/pool/stats", function(data){
				$scope.poolList = data.pool_list;
				$scope.poolStats.global = data.pool_statistics;
			});

			dataService.getData("/network/stats", function(data){
				$scope.network = data;
			});	
		}

		var loadOnce = function () {
			dataService.getData("/config", function(data){
				$scope.config = data;
			});
		}

		// For FAQ
		$rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
			$location.hash($routeParams.scrollTo);
			$anchorScroll();  
		});

		// Start doing things
		loadOnce();
		loadData();
		update();
		
		// Start the timer and register global requests
		timerService.startTimer(GLOBALS.api_refresh_interval);
		timerService.register(loadData, 'global');
		$interval(updateCache, GLOBALS.app_update_interval); // check for app updates every 5 mins

		// Start address tracking servuce after starting timer, only one callback supported at a time
		addressService.start(function(addrStats) {
			$scope.addrStats = addrStats;
			updateHashRate(addrStats);
			playSiren();
		}
		);


		// Sponsor
		$scope.sponsor_open = false

	});