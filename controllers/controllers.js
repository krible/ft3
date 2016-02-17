'use strict';

angular
  .module('app')
  .controller('IndexCtrl', ['$scope', '$state', 'Site', function($scope, $state, Site) {

    $scope.hello = 'Hello, Valentine!';
    //console.log(Site.configs.findById({ id: '56b221c80d79a91b5311898f' }));
    //$scope.config = Site.configs.findById({ id: '56b221c80d79a91b5311898f' });

  }])
  .controller('AuthCtrl', ['$scope', '$state', 'Auth', 'util', function($scope, $state, Auth, util) {

    $scope.login = function () {
      util.Login(Auth, $scope.account, $state, function () {
        $state.go('dashboard');
      });
    };

  }])
  .controller('SignupCtrl', ['$scope', '$state', 'Account', 'Auth', 'Site', 'Config', 'util', '$mdToast', function($scope, $state, Account, Auth, Site, Config, util, $mdToast) {

    $scope.account = {
      'email': '',
      'password1': '',
      'password2': '',
      'termsUse': ''
    };

    $scope.signUp = function () {
      util.SignUp(Auth, Account, Site, Config, $scope.account, $state);
    };


  }])
  .controller('DashboardCtrl', ['$scope', 'Auth', '$state', 'Account', 'Site', 'Config', 'Log', function($scope, Auth, $state, Account, Site, Config, Log) {

    $scope.$watch(Auth.isLoggedIn, function(newData, prevData) {
      if (!newData) {
        return;
      }

      $scope.config = {};
      $scope.logs = null;

      $scope.ts = function(ts) {
        var d = new Date(ts);
        return d.toString('dd.MM.yyyy hh:mm:ss');
      };

      Account.sites($scope.currentUser, function(sites, res) {
        $scope.sites = sites;
        $scope.sites.config = {};
        for (var s in sites) {
          //console.log('sites[s].id', s);
          if (sites[s].id) {

            Site.configs({id: sites[s].id})
            .$promise
            .then(function(res) {
              console.log('s', res[0]);
              $scope.config[res[0].siteId] = res[0];
              console.log('$scope.sites[s].config',$scope.config);
            });
            Site.logs({id: sites[s].id})
            .$promise
            .then(function(res) {
              //console.log('LOGS', res);
              if (res[0]) {
                $scope.logs = res;
              }
            });
          }
        }

        if (KribleLoader && KribleLoader.reinitConfig) {
          KribleLoader.reinitConfig(sites[0].id);
        }

      });


      $scope.saveConfig = function(id) {
        $scope.config[id].$save()
          .then(function(res) {
            console.log("authenticated", res);
            if (KribleLoader && KribleLoader.reinitConfig) {
              KribleLoader.reinitConfig(res.siteId);
            }
          })
          .catch(function(req) {
            console.log("error saving obj", req.status)
          })
          .finally(function() {
            console.log("always called")
          });
      };


      $scope.logout = function () {
        Auth.logout();
      };


    }, true);


  }]);
