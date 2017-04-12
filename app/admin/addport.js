'use strict';


app.controller('addPortCtrl', function ($scope, $mdDialog, dataService) {
  'use strict';

  this.cancel = function (){
    //config.value=old_value;
    $mdDialog.cancel();
  }
  
  this.edit = function () {
    $scope.item.form.$setSubmitted();
    
    if($scope.item.form.$valid) {
      dataService.putData('/admin/ports', {id: config.id, value: config.value}, function(data) {
        $mdDialog.hide(data);
      }, function (e) {
        // error
        $scope.config = old_value;
        $mdDialog.hide('error');
      });
    }
  };
  
});