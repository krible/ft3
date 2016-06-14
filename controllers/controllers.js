'use strict';

angular
  .module('app')
  .controller('IndexCtrl', ['$scope', '$state', 'Site', function($scope, $state, Site) {

    $scope.hello = 'Hello, Valentine!';
    //console.log(Site.configs.findById({ id: '56b221c80d79a91b5311898f' }));
    //$scope.config = Site.configs.findById({ id: '56b221c80d79a91b5311898f' });

  }])
  .controller('AuthCtrl', ['$scope', '$state', 'Auth', 'util', function($scope, $state, Auth, util) {
    console.log("AUTH!!!!!");

    $scope.login = function () {
      util.Login(Auth, $scope.account, $state, function () {
        $state.go('dashboard');
      });
    };

  }])
  .controller('SignupCtrl', ['$scope', '$state', 'Account', 'Auth', 'Site', 'Config', 'util', '$mdToast', function($scope, $state, Account, Auth, Site, Config, util, $mdToast) {

    $scope.account = {
      'email': '',
      'password': '',
      //'password2': '',
      'termsUse': ''
    };

    $scope.signUp = function () {
      util.SignUp(Auth, Account, Site, Config, $scope.account, $state, $mdToast);
    };


  }])
  .controller('DashboardCtrl', ['$scope', 'Auth', '$state', '$http', 'Account', 'Site', 'Config', 'Log', '$location', '$mdToast', '$mdDialog', 'util', function($scope, Auth, $state, $http,  Account, Site, Config, Log, $location, $mdToast, $mdDialog, util) {

    $scope.$watch(Auth.isLoggedIn, function(newData, prevData) {
      if (!newData) {
        return;
      }

    //  console.log($location.hash());

      var tabHash = ['edit', 'logs', 'billing'];

      $scope.tab = {
        selectedIndex: 0
      };


      var mapHash = function () {
        tabHash.map(function (tab, index) {
          if ($location.hash() == tab) $scope.tab.selectedIndex = index;
        });
      };
      $scope.$on('$locationChangeSuccess', function(event) {
        mapHash();
      });
      mapHash();

      $scope.goto = function (hash) {
        $location.hash(hash);
      };


      $scope.showToast = function(text) {
        $mdToast.show($mdToast.simple().position('top right').hideDelay(5000).textContent(text));
      };

      $scope.config = {};
      $scope.logs = null;
      $scope.code = [];

      $scope.ts = function(ts) {
        var d = new Date(ts);
        return d.toString('dd.MM.yyyy hh:mm:ss');
      };

      Account.sites($scope.currentUser, function(sites, res) {
        $scope.sites = sites;
        $scope.sites.config = {};
        for (var s in sites) {
          //console.log('sites[s].id', s);
          var siteId = sites[s].id;
          if (siteId) {

            Site.configs({id: siteId})
            .$promise
            .then(function(res) {
              console.log('s', res[0]);
              $scope.config[res[0].siteId] = res[0];
              console.log('$scope.sites[s].config',$scope.config);
            });


            $http({
              method: 'GET',
              dataType: "text/plain",
              siteid: siteId,
              url: '//ft3.herokuapp.com/codeForSite?code=' + siteId
            }).then(function successCallback(response) {
                $scope.code[response.config.siteid] = response.data;
                console.log("$scope.code", $scope.code);
              }, function errorCallback(response) {
                $scope.code[siteId] = 'Sorry! Something wrong...';
              });

            Site.logs({id: siteId})
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


      $scope.addSite = function () {
        util.CreateSite(Site, Config, $scope.currentUser.id, function (res) {
          $state.reload();
        });
      };

      $scope.deleteSite = function (site, ev) {
        var confirm = $mdDialog.confirm()
              .title('Would you like to delete '+ site.domain +'?')
              .textContent('All settings for   be destroyed.')
              .targetEvent(ev)
              .ok('Yes')
              .cancel('Oh, no!');
        $mdDialog.show(confirm).then(function() {
          util.DeleteSite(Site, Config, $scope.currentUser.id, site, function (res) {
            $state.reload();
          });
        });

      };

      $scope.createPayment = function() {
          var amount = 1;
          if (isNaN(amount) || amount < 1) {
            $scope.error = 'Minimal payment is 1$';
            setTimeout(function() {
              $scope.error = null;
            }, 5000);
            return;
          }
          console.log(Auth.currentUser);
          var widget = new cp.CloudPayments({language: "en-US"});
          widget.charge({ // options
              publicId: 'pk_445006d7564e395c81ff228c52e61',  //id из личного кабинета
              description: 'FT3 payment', //назначение
              amount: amount, //сумма
              currency: 'USD', //валюта
              accountId: Auth.currentUser.id, //идентификатор плательщика (необязательно)\
              data: {
                clientEmail: Auth.currentUser.email
              }
            },
            function (options) { // success
              //действие при успешной оплате
              console.log('Payment complete!!', options);
              savePaymentLog({
                amount: options.amount,
                success: true,
                additionalInfo: options
              });
            },
            function (reason, options) { // fail
              //действие при неуспешной оплате
              console.log('Something wrong((', reason, options);
              if (reason != 'User has cancelled') {
                savePaymentLog({
                  amount: options.amount,
                  success: false,
                  additionalInfo: {reason: reason, options: options}
                });
              }
            });
        };



      $scope.logout = function () {
        Auth.logout();
      };


    }, true);


  }])
  .controller('BillingCtrl', ['$scope', 'Auth', '$state', '$http', 'Account', 'Site', 'Config', 'Log', function($scope, Auth, $state, $http,  Account, Site, Config, Log) {


    $scope.hello = 'Hello, Valentine!';
    //console.log(Site.configs.findById({ id: '56b221c80d79a91b5311898f' }));
    //$scope.config = Site.configs.findById({ id: '56b221c80d79a91b5311898f' });

  }]);
