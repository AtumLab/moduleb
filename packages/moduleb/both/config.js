/**
 * config
 */
var _config = {};
moduleb.Core.prototype.setConfigs = function(obj){
  _.extend(_config, obj);  
};
moduleb.Core.prototype.getConfig = function(name){
  return _config[name]; 
};
moduleb.Core.prototype.setConfig = function(name, value){
  _config[name] = value;
  return this;
};