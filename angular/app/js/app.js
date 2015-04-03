'use strict';

/* App Module */
var Tempberry = angular.module('Tempberry', [
  'ngRoute',
  'Controllers',
  'angular-flot',
  'flang'
]);


Tempberry.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/overview', {
        templateUrl: 'partials/overview.html',
        controller: 'OverviewCtrl'
      }).otherwise({
          redirectTo: '/overview'
      });
  }]);


