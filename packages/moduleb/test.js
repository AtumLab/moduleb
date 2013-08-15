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
Tinytest.add('moduleb - moduleb', function(test){
  test.equal(moduleb.VERSION, 0.2, "moduleb.VERSION doesnt exit");
  test.equal(_.isFunction(moduleb.Mediator), true, "[app].Mediator check Mediator expected a function");
  test.equal(_.isFunction(moduleb.Sandbox), true, "[app].Sandbox check Sandbox expected a function");
  test.equal(_.isFunction(moduleb.Core), true, "[app].Core check Core expected a function");
  test.equal(_.isFunction(moduleb.CoreObject), true, "[app].CoreObject check CoreObject expected a function");
});

Tinytest.add('core - core', function(test){
  var count = 0;
  var app = new moduleb.Core("coretest", {
    _init: function(){
      count++;
    },
    _initClient: function(){
      count++;
    },
    _initServer: function(){
      count++;
    }
  });
  test.equal(_APPNAME, "coretest", "[app].core expected coretest");
  test.equal(count, 2, "[app.]_init _initClient _initServer expected 2");  
});

testAsyncMulti("module - module", [
  function (test, expect) {
    var moduletest = new moduleb.Core("moduletest", {});
    // register module 
    moduletest.Module( "Log", function( sandbox ){            
      return {      
        _init : function (option) {},
        _initClient : function (option) {},
        _initServer : function (option) {},
        _destroy : function () {}
      };
    }, {}, expect(function(e){      
      test.equal(e, null, "[app].Module expected null");      
    }));
  },
  function (test, expect) {
    moduletest.Module( "Log", function( sandbox ){
      return {      
        _init : function (option) {},
        _initClient : function (option) {},
        _initServer : function (option) {},
        _destroy : function () {}
      };
    }, {}, expect(function(e){
      test.equal(e.message, "module Log was already registered", "[app].Module expected error object {registered}");
    }));
  },
  function (test, expect) {
    moduletest.Module( 1, function( sandbox ){
      return {
        _init : function (option) {},
        _initClient : function (option) {},
        _initServer : function (option) {},
        _destroy : function () {}
      };
    }, {}, expect(function(e){
      test.equal(e.message, "could not register module "+1, "[app].Module expected error object {not register}");
    }));
  },
  function (test, expect) {
    try{
      moduletest.implement( "notFoundModule", {});      
    } catch (e) {    
      test.equal(e.message, "not found the module with : notFoundModule", "[app].Module expected error object {not found}");
    }
    try{
      moduletest.implement( "Log", "not Object");      
    } catch (e) {    
      test.equal(e.message, "could not implement module Log", "[app].Module expected error object {not found}");
    }
  },
  function (test, expect) {
    moduletest.Module( "namespace.OtherModule", function( sandbox ){      
      var r = {      
        _init : function (option) {
          test.equal(option.start, true, "[module]._init expected option from [app].start is true");
        },
        _initClient : function (option) {},
        _initServer : function (option) {},
        _destroy : function () {}
      };
      _.extend(r, this);
      return r;
    }, {module: true}, function(e){
      if(!e){      
        moduletest.implement( "namespace.OtherModule", {
          hello: function(){
            return 'hello word';
          }
        });
        moduletest.start("namespace.OtherModule", 
          {instanceId: "otherModule", options: {start: true}}, 
          expect(function(err, ins){
            test.equal(err, null, "[app].start expected err is null");
            test.equal(ins.hello(), 'hello word', "test implement expected hello() = hello word");
        }));
      }
    });
  },
  function (test, expect) {
    moduletest.start("namespace.OtherModule", {instanceId: "otherModule"}, expect(function(err, ins){
      test.equal(err.message, "module was already started", "[app].Module expected error object {already started}");            
    }));
  }
  ]
);
testAsyncMulti("mediator - mediator", [
  function (test, expect) {
    var m = new moduleb.Mediator(), result,
    callBack = function(data){
      result = data;
    };
    m.on("test", callBack);
    m.emit("test", "message");
    test.equal(result, "message", "[app].Mediator check emit(), on() expected message text");
    m.off("test", callBack);
    m.emit("test", "message2");
    test.equal(result, "message", "[app].Mediator check off() expected message text");
  }
]);
testAsyncMulti("module-sandbox", [
  function (test, expect) {
    var count = 0;
    moduletest.Module( "moduleA", function( sandbox ){      
      var r = {
        _init : function (option) {
          console.log('moduleA start');
          sandbox.on("moduleB-action", this.timeLine);
        },
        _initClient : function (option) {},
        _initServer : function (option) {},
        timeLine: function(time){
          count++;           
          test.equal(time, "messageB", "[module] sandbox text expected messageB");
        },
        _destroy : function () {}
      };
      _.extend(r, this);
      return r;
    }, {module: true}, function(e){
      if(!e){}
    });
    moduletest.Module( "moduleB", function( sandbox ){      
      var r = {
        _init : function (option) {
          console.log('moduleB start');
          this.sendMessage();
        },
        _initClient : function (option) {},
        _initServer : function (option) {},
        sendMessage : function () {
          sandbox.emit("moduleB-action", "messageB");
        },
        _destroy : function () {}
      };
      _.extend(r, this);
      return r;
    }, {module: true}, function(e){
      if(!e){}
    });
    moduletest.start("moduleA", 
      {instanceId: "smoduleA", options: {start: true}}, 
      function(err, ins){});
    moduletest.start("moduleB", 
      {instanceId: "smoduleB", options: {start: true}}, 
      function(err, ins){});
    moduletest.stop("smoduleA");
    var m = new moduleb.Mediator();
    m.emit("moduleB-action", "messageB");
    test.equal(count, 1, "expected count = 1");
  }
]);
testAsyncMulti("config - config", [
  function (test, expect) {
    moduletest.setConfigs({
      module1: 'a',
      module2: 'b',
      module3: 2
    });
    test.equal(moduletest.getConfig('module2'), 'b', 'test config - expected b');
    moduletest.setConfig('module3', 10);
    test.equal(moduletest.getConfig('module3'), 10, 'test config - expected 10');
    moduletest.deleteConfig('module1');
    test.equal(moduletest.getConfig('module1'), null, 'test config - expected null');
  }
]);