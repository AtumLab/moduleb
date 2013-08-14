/**
 * @fileoverview Meteor ModuleB
 * inspired by the talk of Nicholas C. Zakas - "Scalable JavaScript Application Architecture"
 * 
 * @author particle4dev@gmail.com (Steve Hoang)
 * @version		0.2
 */
var root = this;
/**
 * App name
 * @private 
 */
_APPNAME = '';
/**
var _findModule = function (ns_string, callback, content) {
    var parts = ns_string.split('.'),
      parent = root[_APPNAME]['module'],
      i, len = parts.length;
    // strip redundant leading global
    if (parts[0] === _APPNAME) {
      parts = parts.slice(1);
      len -= 1;
    }
    for (i = 0; i < len; i += 1) {
      if (typeof parent[parts[i]] === "undefined") {
        if(_.isFunction(callback)){
          var err = new Error("not found the module with : " + ns_string);
          if(content)
            return callback.call(content, null, err));
          else
            return callback(null, err);
        }          
        return null;
      }     
      parent = parent[parts[i]];
    }
    if(_.isFunction(callback)){
      if(content)
        return callback.call(content, parent, null);
      else
        return callback(parent, null);
    }
    return parent;
};
_findsModule = function () {
    var i = 0, len = arguments.length, callback, moduleLoaded =[], module, content;
    for(; i< len ;i++){
      if(_.isFunction(arguments[i])){
        callback = arguments[i];
      }       
      else if(_.isString(arguments[i])){
        module = root[_APPNAME].find(arguments[i]);
        if(module != null)
          moduleLoaded.push(module);
        else
          throw new Error("not found the module with : " + arguments[i]);
      }
      else if(_.isObject(arguments[i])){
        content = arguments[i];
      }     
    }
    if(!content){
      content = root[_APPNAME];
    }
    return callback.apply(content, moduleLoaded);
};
*/
/**
 * Module B
 */
var core = function(name, obj){
  _APPNAME = name;
  root[_APPNAME] = this;
  _.extend(this, obj);
  // add propertype
  this._env = null;
  this._isStart = false;
  this._mediator = new moduleb.Mediator();
  
  if (Meteor.isClient) {
    this._env = CLIENT;

    this.deps = new Deps.Dependency;
    var app = this;
    this.getStart = function () {
      app.deps.depend();
      return app._isStart;
    };
    this.setStart = function (value) {
      app._isStart = value;
      app.deps.changed();
    };
    /**
     * can use for template
     */
    this.checkStart = function () {
      return app.getStart();
    };
    Deps.autorun(this.checkStart);
  }
  else if (Meteor.isServer) {
    this._env = SERVER;      
  }
  if(this._init)
    this._init();
  if(Meteor.isClient && this._initClient){
    this._initClient();
  }
  else if (Meteor.isServer && this._initServer) {
    this._initServer();
  }  
};
/**
 * 
 * @private
 
ModuleB.prototype._startAll = function(mods, cb) {
  var done, m, startAction,
    _this = this;
  if (mods == null) {
    mods = [];
    for (m in _modules) {
      mods.push(m);
    }      
  }
  for (m in mods) {
    _this.start(m, _modules[m].options, function (err) {

    });
  }
  return this;
};
*/

moduleb.Core = core;