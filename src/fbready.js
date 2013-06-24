(function(global, undefined){

	/**
	 * FBReady
	 * @constructor
	 * @param String appId
	 */
	var FBReady = function(appId){
		var self = this;
		this.appId = appId;
		this.status = {};
		this.callbacks = {};
		this._each(this.events, function(name){
			self.status[name] = false;
			self.callbacks[name] = [];
		});
		this._prepare();
	};

	(function(){
		var my = FBReady.prototype;

		/**
		 * Attributes:
		 * - events:Array => Event names
		 * - EVENT_READY:String => Event name string for ready
		 * - EVENT_LOGIN:String => Event name string for login
		 * - sdkUrl:String => URL string for Facebook JavaScript SDK
		 * - appId:String => Application ID string of your Facebook application
		 * - status:Object => Statuses for events
		 * - callbacks:Object => Callback functions for events
		 */
		my.events = ["ready", "login"];
		my.EVENT_READY = "ready";
		my.EVENT_LOGIN = "login";
		my.sdkUrl = "//connect.facebook.net/ja_JP/all.js";
		my.appId = null;
		my.status = null;
		my.callbacks = null;

		/**
		 * Prepare elements for Facebook SDK
		 * (<div id="fb-root" /> and script element)
		 * Then call `_initApp` to initialize application
		 */
		my._prepare = function(){
			var sdk;
			if(this._has(global, "FB")){
				this._initApp();
			} else {
				if(! this._get("fb-root")){
					this._append(this._create("div", {id:"fb-root"}));
				}
				sdk = this._create("script", {src: location.protocol + this.sdkUrl });
				this._onScriptReady(sdk, this._initApp, this);
				this._append(sdk);
			}
		};

		/**
		 * Initialize Facebook application with appId
		 * Fire "ready", "login" event on each status
		 */
		my._initApp = function(){
			var self = this;
			FB.Event.subscribe("auth.statusChange", function(r){
				if(r.status === "connected"){
					self.fire(self.EVENT_LOGIN);
				}
			});
			FB.init({appId: this.appId});
			this.fire(this.EVENT_READY);
		};

		/**
		 * Add event listener
		 * @param String name
		 * @param Function callback
		 */
		my.on = function(name, callback){
			if(! this._has(this.callbacks, name)){ return; }
			this.callbacks[name].push(callback);
			if(this._getStatus(name)){
				callback();
			}
			return this;
		};

		/**
		 * Fire named event
		 * @param String name
		 */
		my.fire = function(name){
			var self = this;
			if(! this._has(this.callbacks, name)){ return; }
			this._each(this.callbacks[name], function(cb){
				cb({ target : self, type : name });
			});
			this._setStatus(name, true);
			return this;
		};

		/**
		 * Set named status as value
		 * @param String key
		 * @param Boolean value
		 */
		my._setStatus = function(key, value){
			this.status[key] = !! value;
		};

		/**
		 * Get value of named status as boolean
		 * @param String key
		 * @return Boolean
		 */
		my._getStatus = function(key){
			return !! this.status[key];
		};

		/**
		 * Render XFBML widgets when sdk get ready
		 */
		my.render = function(){
			this.on("ready", function(){
				FB.XFBML.parse();
			});
		};

		/**
		 * Get if object has named property
		 * @param Object obj
		 * @param String name
		 */
		my._has = function(obj, name){
			return obj.hasOwnProperty(name);
		};

		/**
		 * Get element by id
		 * @param String id
		 */
		my._get = function(id){
			return document.getElementById(id);
		};

		/**
		 * Run callback for each properties in object or array
		 * @param Object|Array obj
		 * @param Function callback
		 */
		my._each = function(obj, callback){
			var key;
			for(key in obj){
				if(! this._has(obj, key)){ continue; }
				if(false === callback(obj[key], key, obj)){ break; }
			}
		};

		/**
		 * Create HTML element with attributes
		 * @param String name
		 * @param Object attr
		 */
		my._create = function(name, attr){
			var node = document.createElement(name);
			this._each(attr, function(value, key){
				node.setAttribute(key, value);
			});
			return node;
		};

		/**
		 * Append nodes in argument to body element
		 */
		my._append = function(/* node1, node2, node3 ...*/){
			this._each(arguments, function(node){
				document.getElementsByTagName("body")[0].appendChild(node);
			});
		};

		/**
		 * Run callback when script is loaded
		 * @param HTMLScriptElement node
		 * @param Function callback
		 * @param Object scope
		 */
		my._onScriptReady = function(node, callback, scope){
			var done, onLoad;
			done = false;
			scope = scope || null;
			onLoad = function(){
				if(done){ return; }
				callback.call(scope);
				done = true;
			};
			node.onload = onLoad;
			node.onreadystatechange = function(){
				if(this.readyState === "loaded" || this.readyState === "complete"){
					onLoad();
				}
			};
		};

	}());

	global.FBReady = FBReady;

}(this));