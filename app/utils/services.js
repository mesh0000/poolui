'use strict';

angular.module('utils.services', [])

.service('dataService', function($http) {
    var apiURL = "https://api.xmrpool.net";
    var authToken = false;

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

    this.setAuthToken = function(token) {
      $http.defaults.headers.common['x-access-token'] = token;
      authToken = token;
    }

    this.getRequestHeaders = function() {
      return { 'x-access-token': (authToken) ? authToken : "" };
    }
})

.service('timerService', function($interval) {
    var timer;
    var listeners = {};

    this.startTimer = function(ms) {
        timer = $interval(function() {
            _.each(listeners, function(listener) {
                listener();
            });
        }, ms);
    }

    this.stopTimer = function(){
        $interval.cancel(timer);
    }

    this.register = function(callback, key){
        // console.log("Registering requests for", key);
        return listeners[key] = callback;
    }

    this.remove = function(key){
        // console.log("Destroying requests for", key);
        delete listeners[key];
    }
})

.service('addressService', function(dataService, timerService, $localStorage, ngAudio) {
  var addrStats = {};
  var callback;
  var storage = $localStorage;
  
  this.trackAddress = function (addr) {
    addrStats[addr] = {};
    track();
  }

  this.deleteAddress = function (key) {
    delete addrStats[key];
  };

  this.getData = function (){
    return addrStats;
  }

  this.setAlarm = function(addr, bool){
    addrStats[addr].alarm = bool;
    storage.addrStats[addr].alarm = bool;
  }

  var track = function(){
    _.each(addrStats, function(addr, key) {
      // Get Miner stats
      dataService.getData("/miner/"+key+"/stats", function(data){
        addrStats[key] = Object.assign(addr, data);

        // check and inject alarm var
        if (addr.alarm == undefined) {
          addr.alarm = false;
        }

        // Set default miner name address
        if (addr.name === undefined) {
          addr.name = key;
        }
        
        // update
        storage.addrStats = addrStats;
        callback(addrStats);
      });

      // Get miner worker ids
      dataService.getData("/miner/"+key+"/identifiers", function(minerIDs){
        addrStats[key].ids = minerIDs;
      });

      dataService.getData("/miner/"+key+"/stats/allWorkers", function(workerStats){
        addrStats[key].workerStats = workerStats;
      });

    });

  }

  this.start = function (cb){
    timerService.register(track, 'minerStats');
    addrStats = storage.addrStats || {} ;
    callback = cb;
    track(); // also run immediately
  }
})

.service('minerService', function($filter, dataService) {
  var minerStats = {};
  var callback;
  var status = true; // check pause

  this.runService = function (bool) {
    status = bool;
  }

  this.updateStats = function (addrs, callback) {
    
    // initalise addrs
    if(!status) return 0; 

    _.each(addrs, function (data, addr) {
      
      if (minerStats[addr] === undefined) minerStats[addr] = {
        dataset : {},
        options : {
          series: [],
          allSeries: [],
          axes: {
            x: {
              key: "ts",
              type: "date"
            }
          }
        },
        selected: [],
        toptions: {
          rowSelection: true,
          multiSelect: true,
          autoSelect: true
        }
      };
      
      dataService.getData("/miner/"+addr+"/chart/hashrate/allWorkers", function(allWorkersData){
          // Convert all dates to object

          _.each(allWorkersData, function (workerData, mid) {
            for(var i = 0 ; i < workerData.length; i++){
              allWorkersData[mid][i].ts = new Date(allWorkersData[mid][i].ts);
            }

            minerStats[addr].dataset[mid] = workerData;

            minerStats[addr].options.allSeries = _.unionBy(minerStats[addr].options.allSeries, [{
                axis: "y",
                id: mid,
                dataset: mid,
                label: mid,
                key: "hs",
                color: (minerStats[addr].options.series[mid]===undefined) ? randomColor() : minerStats[addr].options.series[mid].color,
                type: ['line', 'area'],
                interpolation: { mode: "basis-closed"},
                defined: function (value){
                  //console.log(value);
                  return (value !== undefined || value.x !== undefined || value.y !== undefined) ;
                }
              }], 'id');
          });

          // only display selected miners
          var selected = minerStats[addr].selected;
          if(minerStats[addr].selected.length < 1) {
            selected = _.union(minerStats[addr].selected, ['global']);
          }
          
          minerStats[addr].options.series = _.intersectionWith(minerStats[addr].options.allSeries, selected, function(ser, sel) { return ( ser.id == sel ) });
      });

    // report back
    callback(minerStats);
    });      
  };
});