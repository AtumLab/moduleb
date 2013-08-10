
ModuleC.prototype.toServer = function(path, method){
  var arrayArgs = [];
  var len = arguments.length;
  var callBack = null;
  for(var i=2; i<len; i++){
    if(_.isFunction(arguments[i])){
      callBack = arguments[i];
      continue;
    }
    arrayArgs.push(arguments[i]);
  }
  return Meteor.call('toServer', path, method, arrayArgs, function (error, result){
    if(callBack){
      callBack(error, result);
      return null;
    }
    if(error) {
      return error;
    }
    else {
      return result;
    }
  });
}