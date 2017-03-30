'use strict';


app.controller('editPortCtrl', function ($scope, $mdDialog, dataService, port) {
  'use strict';
  var old_value = angular.copy(port);

  port.hidden = (port.hidden) ? 1 : 0;
  port.ssl = (port.ssl) ? 1 : 0;
  
  $scope.port = port;
  
  this.cancel = function (){
    angular.copy(old_value, port);
    $mdDialog.cancel();
  }
  
  this.edit = function () {
    $scope.item.form.$setSubmitted();
    
    if($scope.item.form.$valid) {
      dataService.putData('/admin/ports', $scope.port, function(data) {
        $mdDialog.hide(data);
      }, function (e) {
        // error
        $scope.port = old_value;
        $mdDialog.hide('error');
      });
    }
  };
  
});