/**
 * @fileoverview Core Object
 * 
 */
var root = this;
_CoreObject = function(obj){
  var p = function(){
    _.extend(this, obj);
    this._app = root[_APPNAME];      
    this.implement = function(ob){
      if(ob)
        _.extend(this, ob);      
      if(Meteor.isClient && this._initClient){
        this._initClient();
      }
      else if (Meteor.isServer && this._initServer) {
        this._initServer();
      }
    };
    if(this._init)
      this._init.apply(this, arguments);
  };
  return p;
}