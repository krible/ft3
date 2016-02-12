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
          $state.go('site');
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
            $state.go('site');
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
          $state.go('site');
        });
    };

  }])
  .controller('SiteCtrl', ['$scope', 'Auth', '$state', 'Account', function($scope, Auth, $state, Account) {

    $scope.$watch(Auth.isLoggedIn, function() {

      Account.sites($scope.currentUser, function(sites, res) {
        $scope.sites = sites;
      });

    }, true);


  }])
  .controller('ConfigCtrl', ['$scope', 'Auth', '$state', 'Account', '$mdSidenav', 'Site', 'Config',
    function($scope, Auth, $state, Account, $mdSidenav, Site, Config, mdColorPicker) {

      $scope.$watch(Auth.isLoggedIn, function() {

        $scope.toggleSidenav = function(menuId) {
          $mdSidenav(menuId).toggle();
        };

        $scope.config = {
          buttonText: 'Teleport',
          buttonColor: '#ff6666',
          textColor: '#ffffff',
          width: '200',
          position: 'left',
          about: '',
          siteId: $state.params.id
        };
        //Config.create($scope.config);
        $scope.saveConfig = function() {
          $scope.config.$save()
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


        $scope.openLeftMenu = function() {
          alert('openLeftMenu');
          $mdSidenav('left').toggle();
        };


        function getConfig(id) {
          Site.configs({
              id: id
            },
            function success(results) {
              $scope.config = results[0];
            },
            function error(error) {
              console.log('ERROR: ', error);

            }
          );
        }
        getConfig($state.params.id);


        Account.sites($scope.currentUser, function(sites, res) {
          $scope.sites = sites;
        });

      }, true);

    }
  ]);
