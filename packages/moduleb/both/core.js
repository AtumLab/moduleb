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
 * Module
 * @private
 */
var _modules = {};
var _instances = {};
/**
 * Module B
 */
ModuleB = _CoreObject({
  _init: function(name, obj){
    _APPNAME = name;
    root[_APPNAME] = this;
    _.extend(this, obj);
    this.implement();
  }
});
/**
 * 
 * @private
 */
ModuleB.prototype._register = function(moduleId, creator, opt){
  if(opt == null){
    opt = {};
  }
  if(!_.isString(moduleId) || !_.isFunction(creator) || !_.isObject(opt)){
  	throw new Error("could not register module " + moduleId);
	}
  if(_modules[moduleId] != null){
    throw new Error("module " + moduleId + " was already registered");
  }
  _modules[moduleId] = {
    creator: creator,
    options: opt,
    id: moduleId
  };
  return this;
};
ModuleB.prototype.find = function(moduleId){

};

ModuleB.prototype._start = function(moduleId, opt, cb) {
  var self = this;
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
  
      e = checkType("string", moduleId, "module ID") || checkType("object", opt, "second parameter") || (this._modules[moduleId] == null ? "module doesn't exist" : void 0);
      if (e) {
        return fail(e);
      }
      id = opt.instanceId || moduleId;
      if (((_ref = this._instances[id]) != null ? _ref.running : void 0) === true) {
        return fail(new Error("module was already started"));
      }
      initInst = function(err, instance) {
        if (err) {
          _this.log.error(err);
          return cb(err);
        }
        try {
          if (util.hasArgument(instance.init, 2)) {
            return instance.init(instance.options, function(err) {
              if (!err) {
                instance.running = true;
              }
              return cb(err);
            });
          } else {
            instance.init(instance.options);
            instance.running = true;
            return cb(null);
          }
        } catch (_error) {
          e = _error;
          if (e) {
            return fail(e);
          }
        }
      };
      return this.boot(function() {
        return _this._createInstance(moduleId, opt.instanceId, opt.options, initInst);
      });
    };

ModuleB.prototype._createInstance = function(moduleId, instanceId, opt, cb) {
  if (instanceId == null) {
    instanceId = moduleId;
  }
  module = this._modules[moduleId];
  if (_instances[instanceId] != null) {
    return cb(_instances[instanceId]);
  }
      iOpts = {};
      _ref = [module.options, opt];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        o = _ref[_i];
        if (o) {
          for (key in o) {
            val = o[key];
            if (iOpts[key] == null) {
              iOpts[key] = val;
            }
          }
        }
      }
      sb = new this.Sandbox(this, instanceId, iOpts);
      sb.moduleId = moduleId;
      return this._runSandboxPlugins('init', sb, function(err) {
        var instance;
        instance = new module.creator(sb);
        if (typeof instance.init !== "function") {
          return cb(new Error("module has no 'init' method"));
        }
        instance.options = iOpts;
        instance.id = instanceId;
        _this._instances[instanceId] = instance;
        _this._sandboxes[instanceId] = sb;
        return cb(null, instance);
      });
    };

Core.prototype._startAll = function(mods, cb) {
      var done, m, startAction,
        _this = this;
      if (mods == null) {
        mods = (function() {
          var _results;
          _results = [];
          for (m in this._modules) {
            _results.push(m);
          }
          return _results;
        }).call(this);
      }
      startAction = function(m, next) {
        return _this.start(m, _this._modules[m].options, next);
      };
      done = function(err) {
        var e, i, mdls, x;
        if ((err != null ? err.length : void 0) > 0) {
          mdls = (function() {
            var _i, _len, _results;
            _results = [];
            for (i = _i = 0, _len = err.length; _i < _len; i = ++_i) {
              x = err[i];
              if (x != null) {
                _results.push("'" + mods[i] + "'");
              }
            }
            return _results;
          })();
          e = new Error("errors occoured in the following modules: " + mdls);
        }
        return typeof cb === "function" ? cb(e) : void 0;
      };
      util.doForAll(mods, startAction, done, true);
      return this;
    };


ModuleB.VERSION = 0.2;