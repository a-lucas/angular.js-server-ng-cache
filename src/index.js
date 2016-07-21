import { $CacheFactoryProvider, $TemplateCacheProvider } from './provider/ngCacheFactory';


angular.module('angular.js-server-ngCache', [])
    .provider('$cacheFactory', $CacheFactoryProvider)
    .provider('$templateCache', $TemplateCacheProvider)
    .config(function($windowProvider, $httpProvider, $cacheFactoryProvider) {

        $httpProvider.defaults.cache = true;

        var $window = $windowProvider.$get();

        if ($window.onServer && $window.onServer === true) {
            $window.$cacheFactoryProvider = $cacheFactoryProvider;
        }

        if (typeof $window.onServer === 'undefined' &&  typeof $window.$angularServerCache !== 'undefined') {

            $cacheFactoryProvider.importAll($window.$angularServerCache);

            $window.addEventListener('StackQueueEmpty', function() {
                $cacheFactoryProvider.remove('$http');
                $httpProvider.defaults.cache = config.defaultCache;
            });
        }
    });