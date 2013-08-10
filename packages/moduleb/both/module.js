/**
 * @fileoverview Module
 */
var Module = CoreObject ({
  _init : function(name, obj){
    this.running = true;
  }
});
/**
 *
 */
ModuleB.prototype.Module = function(name, obj, opt, cb) {
  try {
    this._app.register(name, obj, opt);
    
  } catch (e) {
    if (e instanceof TypeError) {

    }
    cb (e, null);
  }
};