app
.factory('util', function util() {

  return {

    Login: function (Auth, user, $state) {

      Auth.login(user.email, user.password)
      .then(function() {
        $state.go('dashboard');
      });

    },

    SignUp: function (Auth, Account, Site, Config, account, $state) {

      if (account.password1.length > 5 && account.password1 === account.password2) {
        user = {
          email: account.email,
          password: account.password1,
          partnerId: '56b214eb363778034fc3d59a',
          realm: 'test'
        };

        var util = this;

        Account
        .create(user)
        .$promise
        .then(function(res) {
          console.log('Create account: ', res);
          util.CreateSite(Site, Config, res.id, function () {
            util.Login(Auth, user, $state);
          });

        });

      }

    },

    CreateSite: function (Site, Config, accountId, cb) {

      var data = {
        "domain": "www.mysite.com",
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
