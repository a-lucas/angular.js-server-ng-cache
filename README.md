#Angular.js-server

This package is a plugin for angular.js-server (https://github.com/a-lucas/angular.js-server).

It allows you to re-play REST calls (API & templates) as soon as the client loads the cached HTML.

This considerably speeds up the AngularJS initial website page load time.


#Workflow

1- The browser vist the url `http://domain:port/url`
2- Your node sever with `angular.js-server`  receives the request , and pre-render the HTML.
3- If the server detects the presence of `angular.js-server-cache`, it will store all the template and ajax calls made during prerender inside the HTML
4- The Browser receives the generated HTML response
5- `server-cache` module will check if any caching data is available, and will load & use them to render the web app in the client.
6- Once the Angular app is fully loaded, the caching strategy will be set to `serverCacheConfig.defaultCache` value (Default - false)

#Usage: 

`bower install angular.js-server-cache`

or

`npm install angular.js-server-ng-cache`

Then include the file: 

`dist/angular.js-server-ng-cache.min.js` into your HTML, and include the module `server-cache`

```

angular.module('yourApp', [ your dependencies..., 'server-cache']);

```

#defaultcache option

By default, `$http caching` is disabled once the application has been rendered in the client.

You can enable it : 

```
angular.module('yourApp', [ your dependencies..., 'server-cache']);
angular.module('server-cache').constant('serverCacheConfig', {defaultConfig: true});

```