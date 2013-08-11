/**
 * @fileoverview Sandbox Sandbox is responsible for:
 * <ul>
 *    <li> Providing access to common features to modules
 *    <li> Provide a pub/sub API to modules
 *    <li> Exposing some basic functions of core's base lib to sandbox
 * </ul>
 */
var sandbox = function (core, instanceId, options) {
  this.core = core;
  this.instanceId = instanceId;
  this.options = options != null ? options : {};
}
moduleb.Sandbox = sandbox;