'use strict';

/* Controllers */

var Controllers = angular.module('Controllers', []);

Controllers.controller('OverviewCtrl', function($scope, $http, $interval) {
    // initially set targetTemp temperature
    $scope.test = {targettemp: 0};

    // function starts or stops the controller
    $scope.startStop = function () {
        $http.post('overview', {msg: "startstop"}).success(function (data) {
            if (data.running) console.log("running!");
        });
    };

    $scope.tempUp = function () {
        $scope.test.targettemp++;
    };

    $scope.tempDown = function () {
        $scope.test.targettemp--;
    };

    var communicator;

    $scope.$on('$destroy', function () {
        if (angular.isDefined(communicator)) {
            $interval.cancel(communicator);
            communicator = undefined;
        }
    });

    // array that holds all measured temperatures
    $scope.plotData = [
        {label: "Temperature", data: [], lines: {show: true}, points: {show: true}, color: 2, yaxis: 1},
        {label: "Power in W", data: [], lines: {show: true, steps: true}, color: "Teal", yaxis: 2}
    ];

    // variable that holds starting time
    $scope.timeStarted = 0;

    $scope.init = function(){
        // setup stuff
        $http.post('overview', {msg: $scope.test.targettemp}).success(function (data) {
            var time = new Date(data.time);
            $scope.timeStarted = time.getTime() / 1000;
        });

        $scope.plotOptions = {
            xaxes: [ {  } ],
            yaxes: [ { }, { position: "right" } ]
        };

        // communicate with webserver
        communicator = $interval(function () {
            $http.post('overview', {msg: $scope.test.targettemp}).success(function (data) {
                var time = new Date(data.time);
                var seconds = time.getTime() / 1000 - $scope.timeStarted;

                // put the data into the scope.tempData
                $scope.plotData[0].data.push([seconds, data.temp]);
                $scope.plotData[1].data.push([seconds, data.power]);

            });
        }, 2000); // update every 2s
    };

    $scope.$on('$viewContentLoaded', function() {
        $scope.init();
    });
});
