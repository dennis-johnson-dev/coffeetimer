var app = angular.module('timers', ['ui.bootstrap']);

app.service('timeService', function () {

  var uid = 2;

  var times = [{
    id: 0,
    time: 90,
    desc: "Begin brewing!"
  }, {
    id: 1,
    time: 240,
    desc: "Stir and continue brewing"
  }]; 

  this.addTime = function (time) {
    if (time.id == null) {
      time.id = uid++; 
      times.push(time);
    } else {
      for (t in times) {
        if (times[t].id == time.id) {
          times[t] = time; 
        }
      }
    }
  }

  this.removeTime = function (time) {
    for (t in times) {
      if (times[t].id == time.id) {
        times.splice(t, 1); 
      }
    }
  }

  this.getCurrentTime = function () {
    if (times.length > 0) {
      return times[0];
      /*
      var acc = 0;
      for (t in times) {
        acc += times[t].time; 
      }
      return acc; 
      */
    }
  }

  this.list = function () {
    return times;
  }

  this.isReady = function () {
    return (times.length == 0);
  }

});

app.controller("first", function($scope, $http, $window, timeService) {
  $scope.times = timeService.list();
  $scope.interval;
  $scope.currentTime = timeService.getCurrentTime();
  $scope.ready = timeService.isReady();

  $scope.addTime = function (time) {
    if (typeof time != "undefined") {
      if (time.time > 0) {
        timeService.addTime(time);
        $scope.input_time = {};
      }
      $scope.currentTime = timeService.getCurrentTime();
      $scope.ready = timeService.isReady();
    }
  };

  $scope.start = function () {
    // Check if it is currently running
    if ($scope.interval == undefined) {
      $scope.interval = $window.setInterval(function() {
        if (typeof $scope.currentTime == "undefined") {
          clearInterval($scope.interval);
          $scope.interval = null;
        } else {  
          if ($scope.currentTime.time > 0) {
            $scope.currentTime.time -= 1;  
          } else {
            // Pop off the current timer if it has a value of zero seconds
            $scope.removeTime($scope.currentTime);
            // Set timer to be the next timer value
            $scope.currentTime = timeService.getCurrentTime();
            $scope.ready = timeService.isReady();
          }
          $scope.$apply();
        }
      }, 1000); 
    } 
  };

  $scope.pause = function() {
    clearInterval($scope.interval);
    $scope.interval = null;
  };

  $scope.removeTime = function(time) {
    timeService.removeTime(time);
    if (time.id == $scope.currentTime.id) {
      $scope.currentTime = timeService.getCurrentTime(); 
    }
    $scope.ready = timeService.isReady();
  };
});
