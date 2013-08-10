/**
 * @fileoverview
 */
var root = this;
/**
 * Application Environment You can load different configurations depending on 
 * your current environment. Default usage is:
 * <ul>
 *    <li> development
 *    <li> testing
 *    <li> production
 * </ul>
 */
DEVELOPMENT = 0;
TESTING = 1;
PRODUCTION = 2;
/**
 * Application Environment Default usage is:
 * <ul>
 *    <li> client
 *    <li> server
 * </ul>
 */
CLIENT = 0;
SERVER = 1;
/**
 *'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
 */
root._rfc4122v4 = function(pattern){
  return pattern.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}