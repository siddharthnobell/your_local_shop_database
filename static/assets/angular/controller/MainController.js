
/*
 
 Author: Nipurba Konar
 Date: 19/12/2017
 
*/

/// <reference path="libs/angular.js" />
/// <reference path="libs/angular-resource.js" />
/// <reference path="libs/angular-route.js" />
/// <reference path="../app.js" />
/// <reference path="../vaxApp.js" />
/// <reference path="../service/AuthService.js" />





'use strict';

app.controller('mainController', ['$rootScope', '$scope', '$timeout', '$window', 'authService', function ($rootScope, $scope, $timeout, $window, authService) {

    $scope.showStakeholder = false;
    $scope.showClinician = false;

    getUserLastLogin();



    function getUserLastLogin() {
        authService.getuserProfileLastLogin()
           .then(
          function (result) {
              if (result != null) {
                  for (var i = 0; i < result.associatedGroups.length; i++) {
                      if (result.associatedGroups[i].groupCode == 'CLD' || result.associatedGroups[i].groupCode == 'CLND') {
                          $scope.showClinician = true;
                      }
                      if (result.associatedGroups[i].groupCode == 'STK') {
                          $scope.showStakeholder = true;
                      }
                  }
              }
          },
          function (errResponse) {
              console.log(errResponse);
          }
      );
    }

    $scope.logout = function () {
        console.log('Logout Called');
        authService.logout()
            .then(
           function (result) {
               window.location.href = '/';
           },
           function (errResponse) {
               console.log(errResponse);
           }
       );
    };



}]);