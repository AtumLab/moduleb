/**
 * Note:
 * Only test public method
 * meteor test-packages ./
 */
if (Meteor.isServer) {
  // test only server
}
if (Meteor.isClient) {
  // test only client

}
testAsyncMulti("Module B", [
  function (test, expect){
    var app = new ModuleB("App",{
      _initClient: function(){},
      _initServer: function(){}
    });
    test.equal(_APPNAME, "App", "app is not exist");
  }]
);