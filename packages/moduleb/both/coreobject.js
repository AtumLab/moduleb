/**
 * @fileoverview Core Object
 * 
 */
var root = this;
var co = function(obj){
  var p = function(){
    _.extend(this, obj);
    this._app = root[_APPNAME];    
    if(this._init)
      this._init.apply(this, arguments);
    if(Meteor.isClient && this._initClient){
      /** Environment */
      this._env = CLIENT;
      this._initClient();
    }
    else if (Meteor.isServer && this._initServer) {
      /** Environment */
      this._env = SERVER;
      this._initServer();
    }
  };
  return p;
}

moduleb.CoreObject = co;