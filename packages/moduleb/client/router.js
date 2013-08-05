/**
 * @fileoverview Meteor ModuleB Router
 * 
 */
var root = this;
var optionalParam = /\((.*?)\)/g;
var namedParam = /(\(\?)?:\w+/g;
var splatParam = /\*\w+/g;
var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
/** Cached regex for stripping a leading hash/slash and trailing space. */
var routeStripper = /^[#\/]|\s+$/g;

  /**
   Workflow
   implement => _init => _bindRoutes => route
   _start => _processRequest 
   to => _processRequest
  */
  
  

var Route = function(route, callback, name, routerModule){
  this.route = route;
  this.callback = callback;
  this.name = name;
  this.routerModule = routerModule;
  /**
   * Run route
   */
  this.loadURL = function(fragment){
    var arg = this._extractParameters(this.route, fragment);
    var result = !!(this.routerModule._applyFilters(name));
    if(result)
      callback.apply(this.routerModule, arg);
  },
  /**
   * Extract parameters from url
   * @private
   */
  this._extractParameters = function(route, fragment){
    var params = route.exec(fragment).slice(1);
    return _.map(params, function (param) {
      /**
       * decodeURIComponent
       * test.asp%3Fname%3Dst%C3%A5le%26car%3Dsaab => test.asp?name=ståle&car=saab
       */
      return param ? decodeURIComponent(param) : null;
    });
  }
};
_.extend(Route.prototype, {  
  _init: function(){}
});
  
_Router = {};
_.extend(_Router, {
  /** @constructor */
  _init : function(){
    this.host = window.location.origin;
    /** Check if module started, default false */
    this.started = false;

    this.isHash = true;
    
    this.handlers = [];
    /** current url */
    this.fragment = null;
    // filters
    this.filters = {};
    // 
    this._activeFilters = [];      
    /** Ensure that _Router can be used outside of the browser. */
    if(typeof window !== 'undefined'){
      this.location = window.location;
      this.history = window.history;
    }

    this._bindRoutes();      
  },
  /**
   * Start router
   * @private
   */
  _start: function(){
    if(!this.started){
      this.started = true;
      this._processRequest();
      /**
       * Run checkUrl function when url change
       */
      window.onhashchange = this.checkUrl;
    }
  },
  /**
   * Process request
   * @private
   */
  _processRequest: function(){
    var fragment = this.getFragment();
    _.any(this.handlers, function(handler){
      if(handler.route.test(fragment)){
        handler.loadURL(fragment);
        return true;
      }
    });
  },
  /**
   * Run if url change
   */    
  checkUrl: function(e){
    var routerModule = _Router;
    var current = routerModule.getFragment();
    if (current !== routerModule.fragment)
      routerModule._processRequest();
  },
  /**
   * Chuyen doi dang route don gian sang RegExp
   * @private
   */
  _routeToRegExp: function(route){
    route = route.replace(escapeRegExp, '\\$&')
      .replace(optionalParam, '(?:$1)?')
      .replace(namedParam, function (match, optional) {
        return optional ? match : '([^\/]+)';
      }).replace(splatParam, '(.*?)');
      return new RegExp('^' + route + '$');
  },
  /** 
   * Chuyen tat ca cac router
   * @private
   **/
  _bindRoutes : function(){
    if (!this.routes) return;
    for (var i in this.routes) {
      var route = this.routes[i];
      this.route(i, route);
    }
  },
    /**
      Dang ky 1 route
     */
    route: function(route, name){
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      // dat len dau
      var callback = (_.isString(name)) ? this[name]: name;
      this.handlers.unshift(new Route(route, callback, name, this));
      return this;
    },
    /**
     Chuyen url
    */
    to : function(url){
      if(url != this.fragment){
        if(this.isHash)
          url = '#'+url;
        this.history.pushState({}, document.title, url);
        this.fragment = url;
      }      
      this._processRequest();
      return this;
    },
    back : function(){
      this.history.back();
      return this;
    },
    forward : function(){
      this.history.forward();
      return this;
    },
    getFragment : function () {
      var fragment;
      if(!this.isHash){
        fragment = this.location.pathname;
        if (!fragment.indexOf('/')) fragment = fragment.substr('/'.length);
      }
      else
        fragment = this.getHash();
      /** remove # or / at the begin of url*/
      fragment.replace(routeStripper, '');
      return fragment;
    },
    // lay cac link url dang localhost:3000/#product/attribute/value
    getHash : function (window) {
        var match = (window || this).location.href.match(/#(.*)$/);
        return match ? match[1] : '';
    },
    /**
    trien khai
    */
    implement : function(obj){
      _.extend(this, obj);
      this._init();
      return this;
    },
    /**
     Filters
     */
    addFilters : function(obj){
      _.extend(this.filters, obj);
      return this;
    },
    setFilter : function(name, options){
      options = options || {};
        options.name = name;
        if (options.only && ! _.isArray(options.only))
          options.only = [options.only];
        if (options.except && ! _.isArray(options.except))
           options.except = [options.except];
      
        this._activeFilters.push(options);
        return this;
    },
    // run all filters over page
    _applyFilters : function(page) {
      var self = this;
      return _.reduce(self._activeFilters, function(page, filter) {
        return self._applyFilter(page, filter)
      }, page);
    },
    // run a single filter (first check only and except apply)
    _applyFilter : function(page, filter) {
      var apply = true;
      if (filter.only) {
        apply = _.include(filter.only, page);
      } else if (filter.except) {
        apply = ! _.include(filter.except, page);
      }
            
      if (apply) {
        return this.filters[filter.name](page);
      } else {
        return page;
      }
    }    
  });
ModuleB.prototype.Router = _Router;