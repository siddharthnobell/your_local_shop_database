/// <reference path="libs/angular.js" />
/// <reference path="libs/angular-resource.js" />
/// <reference path="libs/angular-route.js" />
'use strict';

var app = angular.module('VaxBenchmark_clinician', ['ui.router']);



app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/clinician');

    // $locationProvider.html5Mode(true);

    $stateProvider
         .state('clinician', {
             url: '/clinician',
             templateUrl: '/vax/clinician',
             controller: "ClinicianController",
         })
        .state('clinician.clinicianactivity', {
            views: {
                'clinician_view': {
                    url: '/clinicianactivity',
                    templateUrl: '/vax/clinicianactivity',
                    controller: "ClinicianActivityController",
                }
            }
        })
        .state('clinician.clinicianactivity.performance_analytics', {
            views: {
                'clinician_activity_view': {
                    url: '/performance_analytics',
                    templateUrl: '/vax/performanceanalytics',
                    controller: "PerfromanceAnalyticsController"
                }
            }

        })
         .state('clinician.clinicianactivity.cmeactivity', {
             views: {
                 'clinician_activity_view': {
                     url: '/cmeactivity',
                     templateUrl: '/vax/cmeactivity',
                     controller: "CMEActivityController"
                 }
             }
         })
        .state('clinician.video', {
            views: {
                'clinician_view': {
                    url: '/video',
                    templateUrl: '/vax/video',
                    controller: "VideoController"
                }
            }
        })
        .state('clinician.posttest', {
            views: {
                'clinician_view': {
                    url: '/posttest',
                    templateUrl: '/vax/posttest',
                    controller: "PostTestController"
                }
            }
        })
        .state('clinician.evaluation', {
            views: {
                'clinician_view': {
                    url: '/evaluation',
                    templateUrl: '/vax/evaluation',
                    controller: "EvaluationController"
                }
            }
        })
         .state('stakeholder', {
             url: '/stakeholder',
             templateUrl: '/vax/stakeholder',
             controller: "StakeholderController"
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
            url: '/collaborators',
            templateUrl: '/internal/collaborators',
        })
        .state('contact', {
            url: '/contact',
            templateUrl: '/internal/contact',
            controller: "contactController"
        })
        .state('opt', {
            url: '/opt',
            templateUrl: '/internal/opt',
            controller: "contactController"
        })
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

app.factory('httpRequestInterceptor', ['$window', function ($window) {
    return {
        request: function ($config) {
            console.log('Interceptor Call', $config);
            return $config;
        },
        response: function (response) {
            console.log("Within interceptor", response);
            console.log("Within interceptor1", typeof response.data);
            try {

                if (typeof response.data !== 'object' && response.data.includes("SessionTimeout"))
                    response.data = JSON.parse(response.data);

                if (response.data['status'] == 'SessionTimeout') {
                    alert("Session Time Out")
                    window.location.href = '/';
                } else {
                    return response;
                }
            } catch (e) {
                console.log('Error Occured', e);
            }

            console.log(response.status);
            return response;
        },
        responseError: function (response) {
            console.log("Within interceptor error", response)
            return response;
        }

    };
}]);


app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('httpRequestInterceptor');
}]);

app.run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.defaultState = "pa";
    $rootScope.activityMasterId = 18;
    $rootScope.currentGlobalActivity = [];
}])

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