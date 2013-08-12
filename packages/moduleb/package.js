// description
Package.describe({
  summary: "Module B"
});
var both = ["client", "server"];
Package.on_use(function (api) {
  // define variable
  
  // 1-depend packages
  api.use(["underscore"], both);
  api.use(["templating", "jquery", "session"], "client");
  // 2-load file boot
  api.add_files([
    "both/_helper.js",
    "both/_boot.js",
    "both/coreobject.js", 
    "both/core.js",
    "both/mediator.js",
    "both/sandbox.js",
    "both/config.js", 
    "both/module.js"
    ], both);  
  
  // 3-load libraries
  
  // 4-load module
  api.add_files([], both);  

  api.add_files([], both);
  api.add_files([], "server");
  api.add_files([], 'client');  

  // 5-both
  api.add_files([], both);

  // 6-server
  api.add_files([], "server");

  // 7-client
  api.add_files([
    //"client/router.js"
    ], "client");

});

Package.on_test(function (api) {
  api.use(['moduleb', 'tinytest', 'test-helpers'], both);
  api.add_files('test.js', both);
});