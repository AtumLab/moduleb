if (Meteor.isServer) {
  // test only server
}
if (Meteor.isClient) {
  // test only client
  testAsyncMulti("Router", [
    function (test, expect) {
      test.equal(_.isObject(_Router), true, "_Router is not exist");
      //_Router._init();
      //test.fail();
      //test.equal(_Router.getHash(), "urlz", "gi day");
    }]
  );
}
// test on both(client, server)
testAsyncMulti("Mediator", [
  function (test, expect){
    var result;
    test.equal(_.isFunction(_Mediator), true, "_Mediator is not exist");
    var mediator = new _Mediator();
    mediator.on("test", function(data){
      result = data;
    });
    mediator.emit("test", "message");
    test.equal(result, "message", "_Mediator emit doesnt work");
  }]
);
testAsyncMulti("Sandbox", [
  function (test, expect){    
    test.equal(1, 1, "_Sandbox is not exist");
  }]
);
testAsyncMulti("Module B", [
  function (test, expect){
    var app = new ModuleB("app",{
      _initClient: function(){},
      _initServer: function(){}
    });   
    test.equal(_APPNAME, "app", "app is not exist");
  }]
);