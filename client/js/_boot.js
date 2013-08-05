/**
 * @constructor
 * @implements {modulec.Router}
 
APP.Router.implement({
  /**
   * Use # in url
   * @type {boolean}
   
  isHash: true,
  /**
   * Save last active, example {module: post, args: {view:i5eMMv8Zyr85QqsLR}}
   * @type {object}
   
  active: {
    module: null,
    args: null
  },
  routes: {
    "": "index",
    ":module": "default",
    ":module?:args": "todo"
  },
  index: function(){},
  default: function(module){
   
  },
  todo: function(module, queryString){    
    
  },
  makeURL: function (url, arg) {
    
  }
}).addFilters({
  'checkLoggedIn': function() {
    if(!Meteor.user()){
      APP.Router.to('landingpage');
      return false;
    }
    APP.Router.to('parking');
    return true;
  }
}).setFilter('checkLoggedIn', {only: 'index'});

APP.Router._start();
*/
window.history.pushState({}, document.title, "#url");