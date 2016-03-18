//MODULE
var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);

weatherApp.config(function ($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'pages/home.html',
		controller: 'homeController'
	})
	.when('/forecast', {
		templateUrl: 'pages/forecast.html',
		controller: 'forecastController'
	})
	.when('/forecast/:days', {
		templateUrl: 'pages/forecast.html',
		controller: 'forecastController'
	})
});

// SERVICES
weatherApp.service('cityService', function() {
	this.city = 'New York, NY';
})

// CONTROLLERS
weatherApp.controller('homeController', ['$scope', '$location', 'cityService', function($scope, $location, cityService) {

	$scope.city = cityService.city;
	$scope.$watch('city', function() {
		cityService.city = $scope.city;
	});
	$scope.submit = function() {
		$location.path("/forecast");
	};

}]);

weatherApp.controller('forecastController', ['$scope', '$resource', '$routeParams', 'cityService', function($scope, $resource, $routeParams, cityService) {

	$scope.city = cityService.city;
	$scope.days = $routeParams.days || '3';
	$scope.rain = $routeParams.rain;

	$scope.weatherAPI = $resource('http://api.openweathermap.org/data/2.5/forecast/daily?id=524901&APPID=731db630b53c4e494bd732c192b11004', {
		callback: "JSON_CALLBACK" }, { get: { method: "JSONP" }}); // prevents hacks

	$scope.weatherResult = $scope.weatherAPI.get({ 
		q: $scope.city, 
		cnt: $scope.days,
		rain: $scope.rain 
	});

	$scope.convertToFahrenheit = function(degk) {
		return Math.round((1.8 * (degk - 273)) + 32);
	}

	$scope.convertToDate = function(dt) {
		return new Date(dt * 1000);
	}

	$scope.convertToRain = function(rain) {
		return Math.floor((rain) * 100);
	}

}]);

// DIRECTIVES
weatherApp.directive("weatherReport", function() {
	return {
		restrict: 'E',
		templateUrl: 'directives/weatherReport.html',
		replace: true,
		scope: {
			weatherDay: "=",
			convertToStandard: "&",
			convertToDate: "&",
			dateFormat: "@",
			rainFormat: "="
		}
	}
})



