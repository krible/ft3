'use strict';

var app = angular
  .module('app', [
    'lbServices',
    'ngMaterial',
    'md.data.table',
    'ngCookies',
    'mdColorPicker',
    'ui.router'
  ])
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'LoopBackResourceProvider', function($stateProvider,
    $urlRouterProvider, $locationProvider, LoopBackResourceProvider) {

    // Use a custom auth header instead of the default 'Authorization'
    LoopBackResourceProvider.setAuthHeader('X-Access-Token');
    // Change the URL where to access the LoopBack REST API server
    LoopBackResourceProvider.setUrlBase('http://ft3.herokuapp.com/api');

    $stateProvider
      .state('index', {
        url: '/',
        views: {
          "commonView": {
            templateUrl: "tilda/index.html"
          },

        }
      })
      .state('features', {
        url: '/features',
        views: {
          "commonView": {
            templateUrl: "tilda/features.html"
          }
        }
      })
      .state('plans', {
        url: '/plans',
        views: {
          "commonView": {
            templateUrl: "tilda/plans.html"
          }
        }
      })
      .state('privacy', {
        url: '/privacy',
        views: {
          "commonView": {
            templateUrl: "tilda/privacy.html"
          }
        }
      })
      .state('terms', {
        url: '/terms',
        views: {
          "commonView": {
            templateUrl: "tilda/terms.html"
          }
        }
      })
      .state('sign', {
        url: '/sign',
        views: {
          "authView": {
            templateUrl: "views/sign.html",
            controller: 'SignupCtrl'
          }
        }
      })
      .state('auth', {
        url: '/auth',
        views: {
          "authView": {
            templateUrl: "views/auth.html",
            controller: 'AuthCtrl'
          }
        }
      })
      .state('signup', {
        url: '/signup',
        views: {
          "commonView": {
            templateUrl: "tilda/signup.html"
          }
        }
      })
      .state('login', {
        url: '/login',
        views: {
          "commonView": {
            templateUrl: "tilda/login.html"
          }
        }
      })
      .state('dashboard', {
        url: '/dashboard',
        views: {
          "authView": {
            templateUrl: "views/dashboard.html",
            controller: 'DashboardCtrl'
          }
        },
        authenticate: true
      })
      .state('config', {
        url: '/site/:id/config',
        views: {
          "authView": {
            templateUrl: "views/dashboard.html",
            controller: 'ConfigCtrl'
          }
        },
        authenticate: true
      })
      .state('forbidden', {
        url: '/forbidden',
        views: {
          "commonView": {
            templateUrl: "views/404.html"
          }
        }
      })
      .state('404', {
        url: '/404',
        views: {
          "commonView": {
            templateUrl: "views/404.html"
          }
        }
      });
    $urlRouterProvider.otherwise('/');
  //  $locationProvider.html5Mode({ enabled: true, requireBase: false });
  }])
  .factory('Auth', ['Account', '$q', '$state', '$rootScope', 'LoopBackAuth', function(User, $q, $state,
    $rootScope, LoopBackAuth) {

    var Auth = LoopBackAuth;
    Auth.currentUser = null;


    Auth.login = function(email, password) {
      return User
        .login({
          email: email,
          password: password
        })
        .$promise
        .then(function(response) {
          Auth.currentUser = {
            id: response.user.id,
            tokenId: response.id,
            email: email
          };
        });
    };


    Auth.getCurrentUser = function(cb) {
      Auth.currentUser = User.getCurrent(function(userData) {
          console.log("Current User Fetch Success:", userData);
          cb(true);
        },
        function(err) {
          console.log("Current User Fetch Failed:", err);
          cb(false);
          $state.go('auth');
        });
      return Auth.currentUser;
    };

    Auth.isLoggedIn = function(){
        if ($rootScope.currentUser) {
          return true;
        } else {
          return false;
        }
    };

    Auth.logout = function() {
      // Delete the token from the API.

      User.logout().$promise.then(function() {
        // Delete the user data cached locally.
        Auth.currentUser = null;
        $rootScope.currentUser = null;
        Auth.clearUser();
        Auth.save();
        $state.go('index');
      });



    };


    return Auth;


  }])
  .run(['$rootScope', '$state', 'Auth', function($rootScope, $state, Auth) {
    $rootScope.$on('$stateChangeStart', function(event, toState) {

      // redirect to login page if not logged in
      if (toState.authenticate) {
        Auth.getCurrentUser(function (res){
          if (!res) {
            $state.transitionTo("auth");
            event.preventDefault();
          } else {
            $rootScope.currentUser = Auth.currentUser;
            console.log('$rootScope.currentUser', $rootScope.currentUser);
          }
        });
      }

    });
  }]);
