'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('pooladmin', [
	'pool.globals',
	'ngRoute',
	'ngMaterial',
	'md.data.table',
	'ngStorage',
	'utils.xhr'
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

		$routeProvider.otherwise({redirectTo: '/login'});

	}]);

app.controller('AppCtrl', function($scope, $window, $route, $interval, dataService, $localStorage, GLOBALS){
	$scope.GLOBALS = GLOBALS;

	var loginCheck = function (){
		if(dataService.isLoggedIn){
			$location.href('#dashboard');
		}
	}

	var loginCheck();
});