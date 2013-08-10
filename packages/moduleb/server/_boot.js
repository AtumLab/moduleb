var root = this;


Meteor.methods({
  toServer: function(module, method, arrayArgs){      
    return root[_APPNAME].find(module, function(m){
      if(m[method] && _.isFunction(m[method])){
        try {
          return m[method].apply(m, arrayArgs);
        }
        catch (e) {
          throw e;
        }          
      }
      else if(!m[method]){          
        throw new Meteor.Error(501, "the method isn't implemented");
      }
      else if(!_.isFunction(m[method])){
        throw new Meteor.Error(503, "the method isn't a function");
      }
    }, null, function(){
      throw new Meteor.Error(501, "not found "+module+" module");
    });
  }
});