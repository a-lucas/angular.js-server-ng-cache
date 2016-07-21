#Angular.js-server

This package is for use with angular.js-server.

It allows you to re-play REST calls (API & templates) as soon as the client loads the cached HTML.

This considerably speed up the AngularJS initial website page load time.

#Usage: 

`bower install angular.js-server-ng-cache`

or

`npm install angular.js-server-ng-cache`

Then include the file: 

`dist/angular.js-server-ng-cache.min.js` into your HTML, and include the module `angular.js-server-ng-cache`

```

angular.module('yourApp', [ your dependencies..., `angular.js-server-ng-cache']);

```