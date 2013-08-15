/**
 * @fileoverview Core Object
 * added
 */
var root = this;
var coreObjectFunction = function(obj){
  var CoreObject = function(){
    _.extend(this, obj);
    /** Environment */    
    this._env = null;        
    if(this._init)
      this._init.apply(this, arguments);
    if(Meteor.isClient){
      this._env = CLIENT;
      if(this._initClient)
        this._initClient();
    }
    else if (Meteor.isServer) {
      this._env = SERVER;
      if(this._initServer)
        this._initServer();
    }
    this._app = root[_APPNAME];
  };
  return CoreObject;
}

moduleb.CoreObject = coreObjectFunction;