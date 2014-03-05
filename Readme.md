sbDropdownSelect
================

[![Build Status](https://travis-ci.org/sambs/angular-sb-dropdown-select.png?branch=master)](https://travis-ci.org/sambs/angular-sb-dropdown-select)

An angular directive for searching for and selecting options displayed in a dropdown list. 

Example markup:

    <div sb-dropdown-select sb-source="fetchLocations" sb-display-property="display" ng-model="obj.location"></div>

Example js using Google Map's geocoding service:

    angular.module('app', ['sbDropdownSelect'])

      .controller('Controller', function ($scope, $q) {

        $scope.fetchLocations = function (query) {
          var deferred = $q.defer();
          var geocoder = new google.maps.Geocoder();
          geocoder.geocode({ address: query }, function (results, status) {
            deferred.resolve(results.map(formatResult));
          });
          return deferred.promise;
        };

        function formatResult (result) {
          var pt = result.geometry.location;
          return {
            display: result.formatted_address,
            value: [pt.lng().toFixed(3), pt.lat().toFixed(3)]
          };
        }
      });

### Install

    bower install angular-sb-dropdown-select

### Try it

    git clone git@github.com:sambs/angular-sb-dropdown-select.git
    cd angular-sb-dropdown-select
    bower install
    open example.html

### Test It

    node_modules/.bin/karma start test/conf.js --single-run

### Browser support

Tests pass in IE8 if es5-shim is used.

License
-------

Licensed under the MIT License
