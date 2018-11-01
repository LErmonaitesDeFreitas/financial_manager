var app = angular.module("app", []);
app.controller("ctrl", function ($scope, $http) {
    var data = JSON.parse(localStorage.user);
    $scope.user = data.user;
    console.log(data);
});




