/**
 * @fileoverview 
 * <ul>
 *    <li>
 *    <li> 
 * </ul>
 */
'use strict';
var noop = function() {};
// bind tao 1 function tuong duong console.log
// call goi voi this = console;
//console._log = Function.prototype.call.bind(console.log, console);
_log = function(){
    if (arguments.length)
    {
    	var args = [];
    	args.push('[' + new Date().toUTCString() + '] ');
    	//now add all the other arguments that were passed in:
    	for (var _i = 0, _len = arguments.length; _i < _len; _i++) {
      		arg = arguments[_i];
      		args.push(arg);
    	}
    	//pass it all into the "real" log function
    	console.log.apply(console, args);
    }
};