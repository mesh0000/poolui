'use strict';

angular.module('pool.globals', [])

.factory('GLOBALS', function() {
	return {
		pool_name: "supportXMR.com",
		api_url : 'https://supportxmr.com/api',
		api_refresh_interval: 6000,
		app_update_interval: 10*60000
	};
});