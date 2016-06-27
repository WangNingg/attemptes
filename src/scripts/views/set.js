var tplSet = require('../templates/set.string');

SPA.defineView('set',{

  html: tplSet,

  plugins:['delegated'],

  bindActions:{
    'login': function (e, data) {
      SPA.open('login');
    }
  }
});
