/*
 angular.js-server-ng-cache v0.2.2
 https://github.com/a-lucas/angular.js-server-ng-cache#readme
*/

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["angular.js-server-ng-cache"] = factory();
	else
		root["angular.js-server-ng-cache"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ngCacheFactory = __webpack_require__(1);
	
	angular.module('server-cache', []).provider('$cacheFactory', _ngCacheFactory.$CacheFactoryProvider).provider('$templateCache', _ngCacheFactory.$TemplateCacheProvider).constant('serverCacheConfig', { defaultCache: true }).config(function ($windowProvider, $httpProvider, $cacheFactoryProvider, serverCacheConfig) {
	
	    $httpProvider.defaults.cache = true;
	
	    var $window = $windowProvider.$get();
	
	    if ($window.onServer && $window.onServer === true) {
	        $window.$cacheFactoryProvider = $cacheFactoryProvider;
	    }
	
	    if (typeof $window.onServer === 'undefined' && typeof $window.$angularServerCache !== 'undefined') {
	
	        $cacheFactoryProvider.importAll($window.$angularServerCache);
	
	        $window.addEventListener('StackQueueEmpty', function () {
	            $cacheFactoryProvider.remove('$http');
	            $httpProvider.defaults.cache = serverCacheConfig.defaultCache;
	        });
	    }
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.$CacheFactoryProvider = $CacheFactoryProvider;
	exports.$TemplateCacheProvider = $TemplateCacheProvider;
	function $CacheFactoryProvider() {
	
	    var caches = {};
	
	    this.getCaches = function () {
	        return caches;
	    };
	
	    this.export = function (cacheId) {
	        if (typeof cache[cacheId] === 'undefined') {
	            throw new Error('$cacheFactory - iid - CacheId ' + cacheId + ' is not defined!');
	        }
	        return caches[cacheId].export();
	    };
	
	    this.exportAll = function () {
	        var _caches = {};
	        for (var i in caches) {
	            _caches[i] = caches[i].export();
	        }
	        return _caches;
	    };
	
	    this.remove = function (cacheId) {
	        if (typeof caches[cacheId] !== 'undefined') {
	            delete caches[cacheId];
	        }
	    };
	
	    this.removeAll = function () {
	        caches = {};
	    };
	
	    this.importAll = function (cacheData) {
	
	        var cacheFactory = this.$get();
	        for (var i in cacheData) {
	            if (typeof caches[i] === 'undefined') {
	                caches[i] = cacheFactory(i);
	            }
	            caches[i].import(cacheData[i]);
	        }
	    };
	
	    this.import = function (cacheId, cacheData) {
	
	        var cacheFactory = this.$get();
	        if (typeof caches[cacheId] === 'undefined') {
	            caches[cacheId] = cacheFactory(i);
	        }
	
	        caches[cacheId].import(cacheData);
	    };
	
	    this.info = function (cacheId) {
	        if (typeof caches[cacheId] === 'undefined') {
	            throw new Error('$cacheFactory - iid - CacheId ' + cacheId + ' is not defined!');
	        }
	        return caches[cacheId].info();
	    };
	
	    this.infoAll = function () {
	        var info = {};
	        for (var cacheId in caches) {
	            info[cacheId] = caches[cacheId].info();
	        }
	        return info;
	    };
	
	    this.$get = function () {
	
	        function cacheFactory(cacheId, options) {
	            if (cacheId in caches) {
	                return caches[cacheId];
	                throw new Error('$cacheFactory - iid - CacheId ' + cacheId + ' is already taken!');
	            }
	
	            var size = 0,
	                stats = Object.assign({}, options, { id: cacheId }),
	                data = Object.create(null),
	                capacity = options && options.capacity || Number.MAX_VALUE,
	                lruHash = Object.create(null),
	                freshEnd = null,
	                staleEnd = null;
	
	            return caches[cacheId] = {
	
	                put: function put(key, value) {
	                    if (typeof value === 'undefined') return;
	                    if (capacity < Number.MAX_VALUE) {
	                        var lruEntry = lruHash[key] || (lruHash[key] = { key: key });
	                        refresh(lruEntry);
	                    }
	
	                    if (!(key in data)) size++;
	                    data[key] = value;
	
	                    if (size > capacity) {
	                        this.remove(staleEnd.key);
	                    }
	
	                    return value;
	                },
	
	                export: function _export() {
	                    return data;
	                },
	
	                import: function _import(data) {
	                    size = 0;
	                    lruHash = Object.create(null);
	                    freshEnd = null;
	                    staleEnd = null;
	                    for (var i in data) {
	                        this.put(i, data[i]);
	                    }
	                },
	
	                get: function get(key) {
	                    if (capacity < Number.MAX_VALUE) {
	                        var lruEntry = lruHash[key];
	
	                        if (!lruEntry) return;
	
	                        refresh(lruEntry);
	                    }
	
	                    return data[key];
	                },
	
	                remove: function remove(key) {
	                    if (capacity < Number.MAX_VALUE) {
	                        var lruEntry = lruHash[key];
	
	                        if (!lruEntry) return;
	
	                        if (lruEntry === freshEnd) freshEnd = lruEntry.p;
	                        if (lruEntry === staleEnd) staleEnd = lruEntry.n;
	                        link(lruEntry.n, lruEntry.p);
	
	                        delete lruHash[key];
	                    }
	
	                    if (!(key in data)) return;
	
	                    delete data[key];
	                    size--;
	                },
	
	                removeAll: function removeAll() {
	                    data = Object.create(null);
	                    size = 0;
	                    lruHash = Object.create(null);
	                    freshEnd = staleEnd = null;
	                },
	
	                destroy: function destroy() {
	                    data = null;
	                    stats = null;
	                    lruHash = null;
	                    delete caches[cacheId];
	                },
	
	                info: function info() {
	                    return Object.assign({}, stats, { size: size });
	                },
	
	                keys: function keys() {
	                    return Object.getOwnPropertyNames(data);
	                }
	            };
	
	            /**
	             * makes the `entry` the freshEnd of the LRU linked list
	             */
	            function refresh(entry) {
	                if (entry !== freshEnd) {
	                    if (!staleEnd) {
	                        staleEnd = entry;
	                    } else if (staleEnd === entry) {
	                        staleEnd = entry.n;
	                    }
	
	                    link(entry.n, entry.p);
	                    link(entry, freshEnd);
	                    freshEnd = entry;
	                    freshEnd.n = null;
	                }
	            }
	
	            /**
	             * bidirectionally links two entries of the LRU linked list
	             */
	            function link(nextEntry, prevEntry) {
	                if (nextEntry !== prevEntry) {
	                    if (nextEntry) nextEntry.p = prevEntry; //p stands for previous, 'prev' didn't minify
	                    if (prevEntry) prevEntry.n = nextEntry; //n stands for next, 'next' didn't minify
	                }
	            }
	        }
	
	        cacheFactory.info = function () {
	            var info = {};
	            for (var cacheId in caches) {
	                info[cacheId] = caches[cacheId].info();
	            }
	            return info;
	        };
	
	        return cacheFactory;
	    };
	}
	
	function $TemplateCacheProvider() {
	    this.$get = ['$cacheFactory', function ($cacheFactory) {
	        return $cacheFactory('templates');
	    }];
	}

/***/ }
/******/ ])
});
;
//# sourceMappingURL=angular.js-server-ng-cache.js.map