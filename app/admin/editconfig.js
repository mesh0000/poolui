'use strict';


app.controller('editConfigCtrl', function ($scope, $mdDialog, dataService, config) {
  'use strict';
  
  $scope.config = config;
  var old_value = config.value;

  this.cancel = function (){
    config.value=old_value;
    $mdDialog.cancel();
  }
  
  this.edit = function () {
    $scope.item.form.$setSubmitted();
    
    if($scope.item.form.$valid) {
      dataService.putData('/admin/config', {id: config.id, value: config.value}, function(data) {
        $mdDialog.hide(data);
      }, function (e) {
        // error
        $scope.config = old_value;
        $mdDialog.hide('error');
      });
    }
  };
  
});