'use strict';

app.controller('GettingStartedCtrl', function($scope, $mdDialog, dataService) {
	$scope.portsList = {};
	$scope.selected = [];

	$scope.promise = dataService.getData("/pool/ports", function(data){
		$scope.portsList = data;
	});

	$scope.viewPorts = function(ev){
		$mdDialog.show({
			controller: "PortsModalCtrl",
			templateUrl: 'user/help/portsmodal.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:true,
			fullscreen: $scope.menuOpen // Only for -xs, -sm breakpoints.
		})
		.then(function(answer) {
			$scope.status = 'You said the information was "' + answer + '".';
		}, function() {
			$scope.status = 'You cancelled the dialog.';
		});
	}

	$scope.samples=[
	{
		type: 'Username',
		sample: '43To46Y9AxNFkY5rsMQaLwbRNaxLZVvc4LJZt7Cx9Dt23frL6aut2uC3PsMiwGY5C5fKLSn6sWyoxRQTK1dhdBpKAX8bsUW',
		desc: 'Standard address for withdraws to a wallet (CLI/GUI/MyMonero)',
		valid: true
	},
	{
		type: 'Username',
		sample: '4DAU4uMdnDtFkY5rsMQaLwbRNaxLZVvc4LJZt7Cx9Dt23frL6aut2uC3PsMiwGY5C5fKLSn6sWyoxRQTK1dhdBpKF82nvn2H6jg9SUywAX',
		desc: 'Integrated address withdraw for exchange (TuxExchange)',
		valid: true
	},
	{
		type: 'Username',
		sample: '43To46Y9AxNFkY5rsMQaLwbRNaxLZVvc4LJZt7Cx9Dt23frL6aut2uC3PsMiwGY5C5fKLSn6sWyoxRQTK1dhdBpKAX8bsUW.6FEBAC2C05EDABB16E451D824894CC48AE8B645A48BD4C4F21A1CC8624EB0E6F',
		desc: 'Standard exchange withdrawl (Poloniex/etc.)',
		valid: true
	},
	{
		type: 'Username',
		sample: '1KEJ7EJvfD2bpL6vA9nJpTEgoS9P5jdyce',
		desc: 'BTC Withdrawal (Will process through xmr.to or shapeshift.io automatically)',
		valid: true
	},
	{
		type: 'Username',
		sample: '4DAU4uMdnDtFkY5rsMQaLwbRNaxLZVvc4LJZt7Cx9Dt23frL6aut2uC3PsMiwGY5C5fKLSn6sWyoxRQTK1dhdBpKF82nvn2H6jg9SUywAX.6FEBAC2C05EDABB16E451D824894CC48AE8B645A48BD4C4F21A1CC8624EB0E6F',
		desc: 'Integrated address withdraw for exchange w/ paymentID',
		valid: false
	},
	{
		type: 'Username',
		sample: '1KEJ7EJvfD2bpL6vA9nJpTEgoS9P5jdyce+100000',
		desc: 'BTC Withdrawal w/ fixed diff (Good for NiceHash)',
		valid: true
	},
	{
		type: 'Username',
		sample: '43To46Y9AxNFkY5rsMQaLwbRNaxLZVvc4LJZt7Cx9Dt23frL6aut2uC3PsMiwGY5C5fKLSn6sWyoxRQTK1dhdBpKAX8bsUW+3500',
		desc: 'Standard address for withdraws to a wallet w/ fixed diff (Good for NiceHash)',
		valid: true
	},
	{
		type: 'Username',
		sample: '43To46Y9AxNFkY5rsMQaLwbRNaxLZVvc4LJZt7Cx9Dt23frL6aut2uC3PsMiwGY5C5fKLSn6sWyoxRQTK1dhdBpKAX8bsUW.6FEBAC2C05EDABB16E451D824894CC48AE8B645A48BD4C4F21A1CC8624EB0E6F+23472',
		desc: 'Standard exchange withdrawl w/ fixed diff (Good for NiceHash)',
		valid: true
	},
	{
		type: 'Password',
		sample: 'Steve',
		desc: 'Miner identifier of Steve',
		valid: true
	},
	{
		type: 'Password',
		sample: 'x:test@e-mail.com',
		desc: 'Miner identifier of x, registers address + paymentID if there is one, to the e-mail address for notification',
		valid: true
	},
	{
		type: 'Password',
		sample: 'test@e-mail.com',
		desc: 'Will register the e-mail address as the worker ID',
		valid: true
	}
	]

});