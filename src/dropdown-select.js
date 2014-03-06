/* jshint browser: true, es3: true */

angular.module('sbDropdownSelect', ['sbHighlightGroup', 'sbDebounce', 'sbPopover'])
  
  .directive('sbDropdownSelect', ['$q', '$timeout', 'sbDebounce', function ($q, $timeout, debounce) {
    var template = [
      '<div class="dropdown-select input-container" ng-class="{\'dropdown-select-waiting\': waiting, \'dropdown-select-complete\': complete}">',
        '<input class="dropdown-select-input" type="text" ng-model="query" placeholder="{{placeholder}}" ',
          'ng-focus="onFocus()" ng-click="onClick()" ng-keydown="onKeydown($event)">',
        '<a class="dropdown-select-clear" ng-show="query" ng-click="clear($event)">&times;</a>',
        '<div class="dropdown-select-dropdown dropdown" sb-popover-show="show">',
          '<div class="dropdown-select-no-results dropdown-select-item dropdown-item" ng-hide="results">No results</div>',
          '<ul sb-highlight-group sb-highlight-class="dropdown-highlighted" sb-disabled="!show" sb-auto-highlight>',
            '<li ng-repeat="result in results">',
              '<a class="dropdown-select-item dropdown-item" ng-bind="formatDisplay(result)" ',
                   'sb-highlight-index="{{$index}}" sb-highlight-select="select(result)"></a>',
            '</li>',
          '</ul>',
        '</div>',
      '</div>'
    ].join('');

    var cache = {};

    return {
      restrict: 'EA',
      template: template,
      replace: true,
      require: 'ngModel',
      scope: {
        source: '&sbSource',
        placeholder: '@placeholder',
        formatDisplay: '&sbFormatDisplay',
        displayProperty: '@sbDisplayProperty'
      },
      priority: 1, // avoid conflicts when used on input element

      link: function (scope, elem, attrs, ctrl) {

        scope.formatDisplay = scope.formatDisplay();
        scope.source = scope.source();
        scope.complete = false;
        scope.waiting = false;
        scope.show = false;
        scope.query = '';
        scope.results = [];

        if (!scope.formatDisplay) {
          if (scope.displayProperty) {
            scope.formatDisplay = function (item) {
              return item[scope.displayProperty];
            };
          } else {
            scope.formatDisplay = function (item) {
              return item;
            };
          }
        }
        // Open on focus
        scope.onFocus = function () {
          if (scope.results && scope.results.length) scope.show = true;
        };

        // Open on click - needed if already focussed
        scope.onClick = function () {
          if (!scope.show && scope.results && scope.results.length) scope.show = true;
        };

        // Open on down key press
        scope.onKeydown = function (e) {
          if (!scope.show && e.which == 40 && scope.results && scope.results.length) {
            scope.show = true;
            e.preventDefault();
            e.stopPropagation();
          }
        };

        scope.$watch('query', function (val, prev) {
          if (val == prev) return;

          if (!val) {
            scope.show = false;
            scope.waiting = false;
            scope.complete = false;
            ctrl.$setValidity('incomplete', true);
            ctrl.$setViewValue(null);
            return;
          }

          if (ctrl.$viewValue && val == scope.formatDisplay(ctrl.$viewValue)) {
            scope.complete = true;
            ctrl.$setValidity('incomplete', true);
            return;
          }

          scope.complete = false;
          ctrl.$setValidity('incomplete', false);

          if (val in cache) {
            scope.results = cache[val];
            scope.waiting = false;
          } else { 
            scope.search(val);
            scope.waiting = true;
          }
        });
          
        scope.search = debounce(function (query) {
          $q.when(scope.source(query)).then(function (results) {
            cache[query] = results;
            if (scope.query != query) return;
            scope.results = results;
            scope.waiting = false;
            scope.show = true;
          }, function (err) {
            console.log(err);
          });
        }, 500);

        scope.select = function (val) {
          val = scope.cleanValue(val);
          scope.show = false;
          scope.query = scope.formatDisplay(val);
          ctrl.$setValidity('incomplete', true);
          ctrl.$setViewValue(val);
        };

        scope.clear = function (event) {
          if (event) event.preventDefault();
          scope.show = false;
          scope.query = '';
          delete scope.results;
          ctrl.$setValidity('incomplete', true);
          ctrl.$setViewValue(null);
          $timeout(function () {
            // Timeout to avoid digest in progress errors
            elem.find('input').trigger('focus');
          });
        };

        ctrl.$render = function () {
          if (ctrl.$viewValue) {
            scope.query = scope.formatDisplay(ctrl.$viewValue);
            scope.complete = true;
          } else {
            scope.complete = false;
            scope.query = '';
          }
          ctrl.$setValidity('incomplete', true);
        };

        // Remove any angular properties from objects
        scope.cleanValue = function (val) {
          if (typeof val == 'string') return val;
          var obj = {};
          for (var key in val) { 
            if (key.charAt(0) != '$') obj[key] = val[key];
          }
          return obj;
        };
      }
    };
  }]);
