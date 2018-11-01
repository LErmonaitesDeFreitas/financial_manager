'use strict';

var app = angular.module("app", []);
app.controller("ctrl", controller);
const hostLogin = localStorage.host;

function controller($scope, $http) {

	$scope.goLogin = () => {
		$scope.showRegister = false;
		$scope.showLogin = true;
	}

	$scope.goRegister = () => {
		$scope.showRegister = true;
		$scope.showLogin = false;
	}

	$scope.logar = (user) => {
		var endpoint = hostLogin + "/token/authenticate";
		$scope.isLoading = true;
		$http.post(endpoint, user)
			.then(
				function (response) {
					if (response.data.token) {
						localStorage.user = JSON.stringify(response.data);
						location.pathname = "/dashboard";
						return;
					}
					if (response.data.error) {
						myAlert(response.data.message);
						$scope.isLoading = false;
						return;
					}
				}
			)
			.catch(
				function () {
					myAlert("Ocorreu um erro interno, tente novamente mais tarde");
					$scope.isLoading = false;
				}
			);
	};

	$scope.createUser = (user) => {
		var endpoint = hostLogin + "/users";
		$scope.isLoading = true;
		$http.post(endpoint, user)
			.then(
				function (response) {
					if (response.data.user._id) {
						localStorage.user = JSON.stringify(response.data);
						$scope.isLoading = false;
						location.pathname = "/dashboard";
					}
					if (response.data.error) {
						myAlert(response.data.message);
						$scope.isLoading = false;
						return;
					}
				}
			)
			.catch(
				function () {
					myAlert("Ocorreu um erro interno, tente novamente mais tarde");
					$scope.isLoading = false;
				}
			);
	}

	//INICIO
	$scope.isLoading = false;
	$scope.goLogin();
}
