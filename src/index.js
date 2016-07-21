import { $CacheFactoryProvider, $TemplateCacheProvider } from './provider/ngCacheFactory';


angular.module('server-cache', [])
    .provider('$cacheFactory', $CacheFactoryProvider)
    .provider('$templateCache', $TemplateCacheProvider)
    .constant('serverCacheConfig', {defaultCache: true})
    .config(function($windowProvider, $httpProvider, $cacheFactoryProvider, serverCacheConfig) {

        $httpProvider.defaults.cache = true;

        var $window = $windowProvider.$get();

        if ($window.onServer && $window.onServer === true) {
            $window.$cacheFactoryProvider = $cacheFactoryProvider;
        }

        if (typeof $window.onServer === 'undefined' &&  typeof $window.$angularServerCache !== 'undefined') {

            $cacheFactoryProvider.importAll($window.$angularServerCache);

            $window.addEventListener('StackQueueEmpty', function() {
                $cacheFactoryProvider.remove('$http');
                $httpProvider.defaults.cache = serverCacheConfig.defaultCache;
            });
        }
    });