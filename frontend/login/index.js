'use strict';

var app = angular.module("app", []);
app.controller("ctrl", controller);
const host = "http://financeiro.ermonaites.com.br:3001";

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
		var endpoint = host + "/token/authenticate";
		$scope.isLoading = true;
		$http.post(endpoint, user)
			.then(
				function (response) {
					if (response.data.token) {
						localStorage.user = JSON.stringify(response.data);
						location.pathname = "/dashboard";
						$scope.isLoading = false;
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
		var endpoint = host + "/users";
		$scope.isLoading = true;
		$http.post(endpoint, user)
			.then(
				function (response) {
					if (response.data._id) {
						myAlert("Usuário criado com sucesso");
						$scope.goLogin();
						$scope.isLoading = false;
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
	}

	//INICIO
	$scope.isLoading = false;
	$scope.goLogin();
}
