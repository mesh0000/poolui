angular.module('utils.xhr', [])
.service('dataService', function($http, $localStorage, $sessionStorage, GLOBALS) {
  var apiURL = GLOBALS.api_url;
  var sessStorage = $sessionStorage;
  var storage = $localStorage;
  var sessionLock = false;
  
    // delete $http.defaults.headers.common['X-Requested-With'];
    this.getData = function(url, callbackFunc, errCallback) {
      $http({
        method: 'GET',
        url: apiURL + url,
        headers: this.getRequestHeaders()
      }).then(function successCallback(response) {
        callbackFunc(response.data);
      }, function errorCallback(response) {
        if (errCallback && response != undefined) errCallback(response); else console.log("Network Error", response);
      }).$promise;
    }

    this.postData = function(url, params, callbackFunc, errCallback) {
      $http({
        method: 'POST',
        url: apiURL + url,
        data: params,
        headers: this.getRequestHeaders()
      }).then(function successCallback(response) {
        callbackFunc(response.data);
      }, function errorCallback(response) {
        if (errCallback && response != undefined) errCallback(response); else console.log("Network Error", response);
      }).$promise;
    }

    this.putData = function(url, params, callbackFunc, errCallback) {
      $http({
        method: 'PUT',
        url: apiURL + url,
        data: params,
        headers: this.getRequestHeaders()
      }).then(function successCallback(response) {
        callbackFunc(response.data);
      }, function errorCallback(response) {
        if (errCallback && response != undefined) errCallback(response); else console.log("Network Error", response);
      }).$promise;
    }

    this.setAuthToken = function(token) {
      sessStorage.token = token.msg;
      storage.authToken = (token.remember) ? token.msg : false; // remember me
      this.validateSession();
    }

    this.getRequestHeaders = function() {
      this.validateSession();
      return { 'x-access-token': (sessStorage.token) ? sessStorage.token : "" };
    }

    this.isLoggedIn = function() {
      return sessStorage.token || storage.authToken;
    }

    this.validateSession = function () {
      if (storage.authToken !== undefined){
        sessionLock = true;
        if (storage.authToken) {
          console.log("Dope");
          $http.defaults.headers.common['x-access-token'] = storage.authToken;
          sessStorage.token = storage.authToken;
        }
      } else if (sessionLock) {
          console.log("SessionLock");
          // logout if, logout detected on another browser session
          this.logout();
          sessionLock=false;
        }
      }

      this.logout = function() {
      // invalidate existing token
      $http.get(apiURL+"/authed/tokenRefresh")
      .then(function (data) { 
        /* Do nothing */ 
      }, function (err) {
        console.log("debug", err);
      });
      delete storage.authToken;
      delete sessStorage.authToken;
      delete sessStorage.token;
      // invalidate token on server todo
    }
  })