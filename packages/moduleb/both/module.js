/**
 * @fileoverview Module
 */
var _module = _CoreObject ({
  _init : function(name, obj){

  }
});
/**
 *
 */
ModuleB.prototype.Module = function(name, obj, opt, cb) {
  try {
    this._app.register(name, obj, opt);
  } catch (e if e instanceof TypeError) {
     // statements to handle TypeError exceptions
  } catch (e if e instanceof RangeError) {
     // statements to handle RangeError exceptions
  } catch (e if e instanceof EvalError) {
     // statements to handle EvalError exceptions
  } catch (e) {
    cb (e, null);
  }
};