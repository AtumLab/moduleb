// create new app with name is “webapp”
var app = new moduleb.Core ('webapp',{
  _init : function(){
    console.log('app init');
  },
  _initClient : function(){
    console.log('app init client');
  },
  _initServer : function(){
    console.log('app init server');
  }
});

// register module 
webapp.Module( "Log", function( sandbox ){
  // private
  var property = "";
  var privateMethod = function () { /*...*/ };
  return {      
    _init :    function (option) { /*...*/ },
    _initClient : function () { /*...*/ },
    _initServer : function () { /*...*/ },
    _destroy : function () { /*...*/ }
  };
});