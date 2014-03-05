sbDropdownSelect
================

An angular directive for searching for and selecting options displayed in a dropdown list. 

An example using the Google Maps geocoding service:

    <div sb-dropdown-select sb-source="fetchLocations" sb-display-property="display" ng-model="obj.location"></div>

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


Browser support
---------------

Tests pass in IE8 if es5-shim is used.

License
-------

Licensed under the MIT License
