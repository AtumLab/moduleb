/**
 * @fileoverview Mediator
 * added
 */

/**
 * @private
 */
var _channels = {};

var mediator = (function(){
  var Mediator = moduleb.CoreObject({
    _init: function(){
      /** save channel for own sandbox */
      this._listener = {};
    }
  });
  Mediator.prototype.on = function(channel, fn, context){
    var self = this;
    if(context == null) {
      context = this;
    }
    if(_channels[channel] == null) {
      _channels[channel] = [];
    }
    if(!this._listener[channel])
      this._listener[channel] = [];

    if (typeof fn !== "function") {
      return false;
    }
    if (typeof channel !== "string") {
      return false;
    }
    subscription = {
      context: context,
      callback: fn
    };    
    var listen = {
      attach: function() {
        _channels[channel].push(subscription);
        return this;
      },
      detach: function() {
        Mediator._rm(self, channel, subscription.callback);
        return this;
      }
    };
    this._listener[channel].push(listen);
    return listen.attach();
  };
  Mediator.prototype.emit = function(channel, data, cb) {
    var chnls, sub, subscribers, tasks;
      if (cb == null) {
        cb = function() {};
      }
      if (typeof data === "function") {
        cb = data;
        data = void 0;
      }
      if (typeof channel !== "string") {
        return false;
      }
      subscribers = _channels[channel] || [];
      var _i, _len;

      for (_i = 0, _len = subscribers.length; _i < _len; _i++) {
        sub = subscribers[_i];
        sub.callback.apply(sub.context, [data, channel]);        
      }
      
      return this;
  };
  Mediator.prototype.off = function(ch, cb) {
    var id;
    switch (typeof ch) {
      case "string":
        if (typeof cb === "function") {
          Mediator._rm(this, ch, cb);
        }
        if (typeof cb === "undefined") {
          Mediator._rm(this, ch);
        }
        break;
      case "function":
        for (id in _channels) {
          Mediator._rm(this, id, ch);
        }
        break;
      case "undefined":
        for (id in _channels) {
          Mediator._rm(this, id);
        }
        break;
      case "object":
        for (id in _channels) {
           Mediator._rm(this, id, null, ch);
        }
        break;
    }
    return this;
  };
  Mediator.prototype.offAll = function(){
    _.each(this._listener, function(v1, i1){
      _.each(v1, function(v2, i2){
        // remove
        v2.detach();
      });
    });
    return this;
  }
  /**
   * Remove 
   * @param {object} o Mediator object 
   * @param {string} ch Channel
   * @param {function} cb Callback function
   * @param {object} ctxt Content
   * @return {null}
   * @private, static
   */
  Mediator._rm = function(o, ch, cb, ctxt) {
    var s;
    if(_channels[ch] == null){
      return;
    }
    return _channels[ch] = (function() {
      var _i, _len, _ref, _results;
      _ref = _channels[ch];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        if ((cb != null ? s.callback !== cb : ctxt != null ? s.context !== ctxt : s.context !== o)) {
          _results.push(s);
        }
      }
      return _results;
    })();
  };

  return Mediator;
})();
moduleb.Mediator = mediator;