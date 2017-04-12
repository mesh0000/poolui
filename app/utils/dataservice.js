angular.module('utils.xhr', [])
.service('dataService', function($http, $localStorage, $sessionStorage, GLOBALS) {
  var apiURL = GLOBALS.api_url;
  var sessStorage = $sessionStorage;
  var storage = $localStorage;
  var sessionLock = false;
  
  this.getData = function(url, successFn, errorFn) {
    this.xhr('GET', url, {}, successFn, errorFn);
  }

  this.postData = function(url, params, successFn, errorFn) {
    this.xhr('POST', url, params, successFn, errorFn);
  }

  this.putData = function(url, params, successFn, errorFn) {
    this.xhr('PUT', url, params, successFn, errorFn);
  }

  this.deleteData = function(url, params, successFn, errorFn) {
    this.xhr('DELETE', url, params, successFn, errorFn);
  }

  this.xhr = function (type, url, params, successFn, errorFn) {
    $http({
      method: type,
      url: apiURL + url,
      data: params,
      headers: this.getRequestHeaders()
    }).then(function successCallback(response) {
      successFn(response.data);
    }, function errorCallback(response) {
      if (errorFn && response != undefined) errorFn(response); else console.log("Network Error", response);
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
          $http.defaults.headers.common['x-access-token'] = storage.authToken;
          sessStorage.token = storage.authToken;
        }
      } else if (sessionLock) {
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