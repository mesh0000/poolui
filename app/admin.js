'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('pooladmin', [
	'pool.globals',
	'ngRoute',
	'ngMaterial',
	'md.data.table',
	'ngStorage',
	'angularMoment',
	'utils.xhr',
	'utils.strings'
]).config(['$locationProvider', '$routeProvider', '$mdThemingProvider', function($locationProvider, $routeProvider, $mdThemingProvider) {
	$locationProvider.hashPrefix('');
	// $mdIconProvider.defaultIconSet("https://rawgit.com/angular/material-start/es5-tutorial/app/assets/svg/avatars.svg", 128)
	
	$mdThemingProvider.theme('default')
	.primaryPalette('grey')
	.accentPalette('light-blue');

	$routeProvider
		.when('/login', {
			templateUrl: 'admin/adminlogin.html',
			controller: 'AdminLoginCtrl'
		})
		.when('/dashboard', {
			templateUrl: 'admin/dashboard.html',
			controller: 'AdminDashCtrl'
		})
		.when('/workers', {
			templateUrl: 'admin/workers.html',
			controller: 'AdminWorkersCtrl'
		})
		.when('/ports', {
			templateUrl: 'admin/ports.html',
			controller: 'AdminPortsCtrl'
		})
		.when('/config', {
			templateUrl: 'admin/config.html',
			controller: 'AdminConfigCtrl'
		})

		$routeProvider.otherwise({redirectTo: '/login'});

	}]);

app.controller('AppCtrl', function($scope, $window, $route, $location, $interval, dataService, $localStorage, GLOBALS) {
	$scope.GLOBALS = GLOBALS;

	var loginCheck = function (){
		if(!dataService.isLoggedIn()){
			$location.path('#login');
		}
	}

	$scope.isLoggedIn = function () {
		return dataService.isLoggedIn();
	}

	$scope.logout = function () {
		dataService.logout();
		$location.path('#login');
	}
});