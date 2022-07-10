/*--------------------------------------------------------------*/
// @author: VaxBenchmark
// @company: Ideation Technology Solutions Pvt. Ltd.
// @date: 26/03/2018
/*_______________________________________________________________*/


/// <reference path="libs/angular.js" />
/// <reference path="libs/angular-resource.js" />
/// <reference path="libs/angular-route.js" />
/// <reference path="../app.js" />
/// <reference path="../vaxApp.js" />

app.factory('authService', ['$http', '$q', function ($http, $q) {
    var factory = {
        login:login,
        logout: logout,
        getuserprofile: getuserprofile,
        getuserProfileLastLogin: getuserProfileLastLogin,
        contactus: contactus,
        forgotPassword: forgotPassword,
        getMatchingCampaign: getMatchingCampaign,
        lookupNPI: lookupNPI,
        checkNPIAvailablaForRegistration: checkNPIAvailablaForRegistration,
        checkEmailAvailableForRegistration: checkEmailAvailableForRegistration,
        acceptSelfRegistration: acceptSelfRegistration,
        declineSelfRegistration: declineSelfRegistration
    };
    return factory;

    function login(payLoad) {
        var deferred = $q.defer();
        $http.post(getServiceUrl() + '/login',payLoad)
            .then(
            function (response) {
                deferred.resolve(response);
            },
            function (errResponse) {
                console.error('Error while logging out');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

    function logout() {
        var deferred = $q.defer();
        $http.post(getServiceUrl() + '/logout')
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function (errResponse) {
                console.error('Error while logging out');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

    function getuserprofile() {
        var deferred = $q.defer();
        $http.post(getAPIServiceUrl() + '/getuserprofile')
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function (errResponse) {
                console.error('Error while user profile');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

    function getuserProfileLastLogin() {
        var deferred = $q.defer();
        $http.get(getAPIServiceUrl() + '/getuserProfileLastLogin')
            .then(
            function (response) {
                console.log(response.data);
                deferred.resolve(response.data);
            },
            function (errResponse) {
                console.error('Error user last login');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

    function contactus(payLoad) {
        var deferred = $q.defer();
        $http.post(getServiceUrl() + '/internal/global/contactus', payLoad)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function (errResponse) {
                console.error('Error while completing Contact Us');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

    function forgotPassword(payLoad) {
        var deferred = $q.defer();
        $http.post(getServiceUrl() + '/internal/global/forgotpassword', payLoad)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function (errResponse) {
                console.error('Error while completing Forgot Password');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

    function getMatchingCampaign(campaignID) {
        var deferred = $q.defer();
        $http.get(getServiceUrl() + '/internal/global/getMatchingCampaign?campaignId=' + campaignID)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function (errResponse) {
                console.error('Error while fetching campaign validity');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

    function lookupNPI(NPI) {
        var deferred = $q.defer();
        $http.get(getServiceUrl() + '/internal/global/lookupNPI?providerNPI=' + NPI)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function (errResponse) {
                console.error('Error while fetching NPI data');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

    function checkNPIAvailablaForRegistration(NPI) {
        var deferred = $q.defer();
        $http.get(getServiceUrl() + '/internal/global/checkNPIAvailablaForRegistration?providerNPI=' + NPI)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function (errResponse) {
                console.error('Error while fetching NPI Registration Availability data');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

    function checkEmailAvailableForRegistration(providerEmail) {
        var deferred = $q.defer();
        $http.get(getServiceUrl() + '/internal/global/checkEmailAvailableForRegistration?providerEmail=' + providerEmail)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function (errResponse) {
                console.error('Error while fetching Email Registration Availability data');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

    function acceptSelfRegistration(payLoad) {
        var deferred = $q.defer();
        $http.post(getServiceUrl() + '/internal/global/acceptSelfRegistration', payLoad)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function (errResponse) {
                console.error('Error while Accepting Registration');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

    function declineSelfRegistration(payLoad) {
        var deferred = $q.defer();
        $http.post(getServiceUrl() + '/internal/global/declineSelfRegistration', payLoad)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function (errResponse) {
                console.error('Error while Declining Registration');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

}]);