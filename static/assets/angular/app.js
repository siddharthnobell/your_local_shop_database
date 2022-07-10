/// <reference path="libs/angular.js" />
/// <reference path="libs/angular-resource.js" />
/// <reference path="libs/angular-route.js" />
'use strict';

var app = angular.module('GullyApp', ['ui.router']);



app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    //$urlRouterProvider.otherwise('/vaxhome');

    // $locationProvider.html5Mode(true);

/*    $stateProvider
        .state('login', {
            url: '/vaxlogin',
            templateUrl: '/internal/vaxlogin',
            controller: "accountController"
        })
        .state('home', {
            url: '/vaxhome',
            templateUrl: '/internal/vaxhome',
        })
        .state('about', {
            url: '/about',
            templateUrl: '/internal/about',
        })
        .state('tec', {
            url: '/tec',
            templateUrl: '/internal/tec',
        })
        .state('pncv', {
            url: '/pncv',
            templateUrl: '/internal/pncv',
            controller: "progPncvController"
        })
        .state('acip', {
            url: '/acip',
            templateUrl: '/internal/acip',
        })
        .state('collaborators', {
            url: '/collab',
            templateUrl: '/internal/collaborators',
        })
        .state('contact', {
            url: '/contact',
            templateUrl: '/internal/contact',
            controller: "contactController"
    }) */
});


app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

app.directive('scrollBottom', function () {
    return {
        scope: {
            scrollBottom: "="
        },
        link: function (scope, element) {
            scope.$watchCollection('scrollBottom', function (newValue) {
                if (newValue) {
                    $(element).scrollTop($(element)[0].scrollHeight);
                }
            });
        }
    }
});

app.directive('scrollIf', function () {
    return function (scope, element, attrs) {
        scope.$watch(attrs.scrollIf, function (value) {
            if (value) {
                //element[0].scrollIntoView({block: "end", behavior: "auto"});
                element[0].scrollIntoViewIfNeeded(true);
            }
        });
    }
});


function getAPIServiceUrl() {
    var _location = window.location;
    var api_url = _location.protocol + '//' + _location.host + '/api';
    return api_url;
}

function getServiceUrl() {
    var _location = window.location;
    var api_url = _location.protocol + '//' + _location.host;
    return api_url;
}