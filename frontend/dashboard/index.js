var app = angular.module("app", []);
app.controller("ctrl", function($scope, $http){
     $scope.user = JSON.parse(localStorage.user).user;
});




  