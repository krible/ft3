app
.factory('util', function util() {

  return {

    Login: function (Auth, user, $state, cb) {

      Auth.login(user.email, user.password)
      .then(function() {
        cb(true);
      });

    },

    SignUp: function (Auth, Account, Site, Config, account, $state, $mdToast) {

      if (account.password.length > 5) {
        user = {
          email: account.email,
          password: account.password,
          partnerId: '56c347380ac79503000b34b0',
          realm: 'test'
        };

        var util = this;

        Account
        .create(user)
        .$promise
        .then(
          function(res) {
          console.log('Create account: ', res);
          util.Login(Auth, user, $state, function () {
            util.CreateSite(Site, Config, res.id, function () {
              $state.go('dashboard');
            });
          });
        },
        function(error){
          console.log('FAIL',error);
          if (error.data.error.status == 422) {
            console.log('FAIL',error.data.error.message);
            $mdToast.show($mdToast.simple().position('bottom right').hideDelay(5000).textContent(error.data.error.message));
          }
        });

      }

    },

    CreateSite: function (Site, Config, accountId, cb) {

      var data = {
        "domain": "New website",
        "status": true,
        "accountId": accountId
      }

      var util = this;

      if (accountId) {
        Site
        .create(data)
        .$promise
        .then(function(res) {
          console.log('Create site: ',res);
          util.CreateConf(Config, res.id, cb);
        });
      }

    },

    DeleteSite: function (Site, Config, accountId, site, cb) {
      var util = this;

      if (accountId) {
        Site.configs
        .destroyById(site)
        .$promise
        .then(function(res) {
          console.log('Site config deleted: ',res);
        });

        Site
        .destroyById(site)
        .$promise
        .then(function(res) {
          console.log('Site deleted: ',res);
          cb(true);
        });
      }

    },

    CreateConf: function (Config, siteId, cb) {

      var data = {
        "buttonText": "Teleportator",
        "buttonColor": "#0D47A1",
        "linkColor": "#666666",
        "aboutText": "",
        "width": "250",
        "position": "left",
        "version": "1.0",
        "clientModeDesc": "",
        "siteId": siteId
      }

      if (siteId) {
        Config
        .create(data)
        .$promise
        .then(function(res) {
          console.log('Create config: ', res);
          cb(true);
        });
      }

    }
  }

});
