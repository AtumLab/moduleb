/**
 * @fileoverview Config
 * added
 */
//this.ENVIRONMENT = DEVELOPMENT;
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
moduleb.Core.prototype.deleteConfig = function(name){
  _config[name] = null;
  return this;
};