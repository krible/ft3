'use strict';

angular
  .module('app')
  .controller('IndexCtrl', ['$scope', '$state', 'Site', function($scope, $state, Site) {

    $scope.hello = 'Hello, Valentine!';
    //console.log(Site.configs.findById({ id: '56b221c80d79a91b5311898f' }));
    //$scope.config = Site.configs.findById({ id: '56b221c80d79a91b5311898f' });

  }])
  .controller('AuthCtrl', ['$scope', '$state', 'Auth', function($scope, $state, Auth) {

    $scope.user = {
      email: 'teplov@gmail.com',
      password: 'windows'
    };


    $scope.login = function() {
      //alert('AUTH');
      Auth.login($scope.user.email, $scope.user.password)
        .then(function() {
          console.log('USER', Auth.currentUser);
          $state.go('dashboard');
        });
    };

  }])
  .controller('SignupCtrl', ['$scope', '$state', 'Account', 'Auth', '$mdToast', function($scope, $state, Account, Auth, $mdToast) {

    $scope.account = {
      'email': '',
      'password1': '',
      'password2': '',
      'termsUse': ''
    };

    $scope.signUp = function () {

      if ($scope.account.password1.length > 5 && $scope.account.password1 === $scope.account.password2) {
        $scope.user = {
          email: $scope.account.email,
          password: $scope.account.password1,
          partnerId: '56b214eb363778034fc3d59a',
          realm: 'test'
        };
        console.log('$scope.user',$scope.user);
        Account.create($scope.user, function (res) {
          Auth.login($scope.user.email, $scope.user.password)
          .then(function() {
            console.log('USER', Auth.currentUser);
            $state.go('dashboard');
          });

        });


      } else {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Passwords not compared!')
            //.position({top: true, right: true})
            .hideDelay(3000)
        );
      }

    }



    $scope.login = function() {
      //alert('AUTH');
      Auth.login($scope.user.email, $scope.user.password)
        .then(function() {
          console.log('USER', Auth.currentUser);
          $state.go('dashboard');
        });
    };

  }])
  .controller('DashboardCtrl', ['$scope', 'Auth', '$state', 'Account', 'Site', 'Config', function($scope, Auth, $state, Account, Site, Config) {

    $scope.$watch(Auth.isLoggedIn, function() {

      $scope.config = [];

      Account.sites($scope.currentUser, function(sites, res) {
        $scope.sites = sites;
        for (var s in sites) {
          //console.log('sites[s].id', s);
          if (sites[s].id) {
            Site.configs({id: sites[s].id},
            function success(results) {
              //console.log('cfg', results);
              $scope.config.push(results[0]);
              //console.log('CONF', $scope.config);
            });
          }
        }
      });


      $scope.saveConfig = function(id) {
        $scope.config[id].$save()
          .then(function(res) {
            console.log("authenticated", res)
          })
          .catch(function(req) {
            console.log("error saving obj", req.status)
          })
          .finally(function() {
            console.log("always called")
          });
      };

    }, true);


  }]);
