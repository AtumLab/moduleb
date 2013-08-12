/**
 * @fileoverview Module
 */
 /**
 * Module
 * @private
 */
var _modules = {};
var _instances = {};
var _sandboxes = {};
/** 
 * Namespace
 * 
 * @param ns_string 
 * @param obj 
 * @return null
 * @private
 */ 
var namespace = function (ns_string, obj, parent) {
  var parts = ns_string.split('.'),
    i, len = parts.length-1;
  // strip redundant leading global
  if (parts[0] === _APPNAME) {
    parts = parts.slice(1);
    len -= 1;
  }
  for (i = 0; i < len; i += 1) {
    // create a property if it doesn't exist
    if (typeof parent[parts[i]] === "undefined") {
      parent[parts[i]] = {};
    }     
    parent = parent[parts[i]];
  }
  if(parent[parts[i]])
    throw new Error("module " + ns_string + " was already registered");         
  parent[parts[i]] = obj;
};
var namespaceForModule = function(ns_string, obj){
  namespace(ns_string, obj, _modules);
}

/** 
 * Find a module
 * 
 * @param ns_string 
 * @param obj 
 * @return  module
 * @private
 */ 
var find = function (ns_string, callback, content) {
  var parts = ns_string.split('.'),
    parent = _modules,
    i, len = parts.length;
  // strip redundant leading global
  if (parts[0] === _APPNAME) {
    parts = parts.slice(1);
    len -= 1;
  }
  for (i = 0; i < len; i += 1) {
    if (typeof parent[parts[i]] === "undefined") {
      var err = new Error("not found the module with : " + ns_string);
      if(_.isFunction(callback)){        
        if(content)
          return callback.call(content, null, err);
        else
          return callback(null, err);
      }          
      throw err;
    }     
    parent = parent[parts[i]];
  }
  if(_.isFunction(callback)){
    if(content)
      return callback.call(content, parent);
    else
      return callback(parent);
  }
  return parent;
};
moduleb.Core.prototype.Module = function(moduleId, creator, opt, cb){
  try {
    if(opt == null){
      opt = {};
    }    
    if(!_.isString(moduleId) || !_.isFunction(creator) || !_.isObject(opt)){
      throw new Error("could not register module " + moduleId);
    }
    namespaceForModule(moduleId, {
      creator: creator,
      options: opt,
      id: moduleId
    });
    cb (null);
    return this;    
  } catch (e) {
    cb (e);
  }
};
moduleb.Core.prototype.implement = function(moduleId, obj){
  try {    
    if(obj == null){
      return this;
    }    
    if(!_.isString(moduleId) || !_.isObject(obj)){
      throw new Error("could not implement module " + moduleId);
    }
    var module = find(moduleId);
    _.extend(module.creator.prototype, obj);
    return this;    
  } catch (e) {
    console.error(e.message);
    throw e;
  }         
};
moduleb.Core.prototype.start = function(moduleId, opt, cb) {
  var self = this, _ref;
  if (opt == null) {
    opt = {};
  }
  if (cb == null) {
    cb = function() {};
  }
  if (typeof opt === "function") {
    cb = opt;
    opt = {};
  }
  id = opt.instanceId || moduleId;
  if (((_ref = _instances[id]) != null ? _ref.running : void 0) === true) {
    cb(new Error("module was already started"), null);
  }
  try {
    var instance = self._createInstance(moduleId, opt.instanceId, opt.options);
    /** Environment */    
    instance._env = null;
    if(instance._init)
      instance._init.apply(instance, [instance.options]);
    if(Meteor.isClient){
      instance._env = CLIENT;
      if(instance._initClient)
        instance._initClient();
    }
    else if (Meteor.isServer) {
      instance._env = SERVER;
      if(instance._initServer)
        instance._initServer();
    }
    instance._app = self;
    cb (null, instance)
  } catch (e) {
    cb (e, null);
  }
  
};

moduleb.Core.prototype._createInstance = function(moduleId, instanceId, opt) {
  if (instanceId == null) {
    instanceId = moduleId;
  }
  var module = find(moduleId);
  if (_instances[instanceId] != null) {
    return _instances[instanceId];
  }
  var iOpts = _.extend(module.options, opt)
  sb = new moduleb.Sandbox(this, instanceId, iOpts);
  sb.moduleId = moduleId;
  var instance;
  instance = new module.creator(sb);
  if (typeof instance._init !== "function") {
    throw new Error("module has no '_init' method");
  }
  instance.options = iOpts;
  instance.id = instanceId;
  _instances[instanceId] = instance;
  _sandboxes[instanceId] = sb;
  return instance;      
}
/**
 *
var Module = CoreObject ({
  _init : function(name, obj){
    this.running = true;
  }
});

ModuleB.prototype.Module = function(name, obj, opt, cb) {
  try {
    this._app.register(name, obj, opt);
    
  } catch (e) {
    if (e instanceof TypeError) {

    }
    cb (e, null);
  }
};
 */