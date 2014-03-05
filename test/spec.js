
describe('sbDropdownSelect directive', function () {
  var $q, $timeout, init, scope, dscope, elem, form, input, clear, dropdown;

  beforeEach(module('sbDropdownSelect'));

    
  beforeEach(inject(function (_$q_, _$timeout_) {
    $q = _$q_;
    $timeout = _$timeout_;
  }));

  beforeEach(inject(function($rootScope, $compile) {
    init = function (options) {
      form = angular.element('<form name="form">'+options.template+'</form>');
      scope = $rootScope;
      for (var key in options.scope) { scope[key] = options.scope[key]; }
      $compile(form)(scope);
      scope.$digest();
      elem = form.find('div').first();
      input = elem.find('input');
      clear = elem.find('.dropdown-select-clear');
      dropdown = elem.find('.dropdown');
      dscope = input.scope();
    };
  }));

  function stringSource (query) {
    switch (query) {
      case 'a':
        return ['animals', 'automobiles', 'activities'];
      case 'b':
        return ['bikes', 'beverages'];
      default:
        return [];
    }
  }

  function objectSource (query) {
    switch (query) {
      case 'a':
        return [
          { id: 1, display: 'animals' },
          { id: 2, display: 'automobiles' },
          { id: 3, display: 'activities' }
        ];
      case 'b':
        return [
          { id: 4, display: 'bikes' },
          { id: 5, display: 'beverages' }
        ];
      default:
        return [];
    }
  }

  describe('basic operation', function () {

    beforeEach(function () {
      init({
        template: '<div sb-dropdown-select sb-source="source" name="x" ng-model="obj.x"></div>',
        scope: { obj: {}, source: stringSource }
      });
    });

    it('should initiate', function() {
      expect(input.length).toBe(1);
      expect(dropdown.length).toBe(1);
      expect(dropdown).toHaveClass('ng-hide');
      expect(clear).toHaveClass('ng-hide');
      expect(scope.form.x.$pristine).toBe(true);
      expect(scope.form.x.$error).toEqual({ incomplete: false });
    });

    it('should show choices', function() {
      input.val('a').trigger('change');
      scope.$digest();
      $timeout.flush();
      expect(dropdown).not.toHaveClass('ng-hide');
      expect(clear).not.toHaveClass('ng-hide');
      expect(dropdown.find('li').length).toBe(3);
      expect(dropdown.find('li').eq(0).text()).toBe('animals');
      expect(dropdown.find('.dropdown-select-no-results')).toHaveClass('ng-hide');
      expect(scope.form.x.$pristine).toBe(true);
      expect(scope.form.x.$error).toEqual({ incomplete: true });
    });

    it('should allow selection of choice', function() {
      input.val('a').trigger('change');
      scope.$digest();
      $timeout.flush();
      dropdown.find('a').first().click();
      scope.$digest();
      expect(elem).toHaveClass('dropdown-select-complete');
      expect(input.val()).toBe('animals');
      expect(clear).not.toHaveClass('ng-hide');
      expect(scope.obj.x).toEqual('animals');
      expect(scope.form.x.$pristine).toBe(false);
      expect(scope.form.x.$error).toEqual({ incomplete: false });
    });
  });

  describe('with inital value', function () {

    beforeEach(function () {
      init({
        template: '<div sb-dropdown-select sb-source="source" name="x" ng-model="obj.x"></div>',
        scope: { 
          obj: { x: 'automobiles' }, 
          source: stringSource 
        }
      });
    });

    it('should initiate', function() {
      expect(input.val()).toBe('automobiles');
      expect(clear).not.toHaveClass('ng-hide');
      expect(dropdown).toHaveClass('ng-hide');
      expect(scope.form.x.$pristine).toBe(true);
      expect(scope.form.x.$error).toEqual({ incomplete: false });
    });

    it('clear button should work', function() {
      clear.click();
      scope.$digest();
      expect(input.val()).toBe('');
      expect(clear).toHaveClass('ng-hide');
      expect(dropdown).toHaveClass('ng-hide');
      expect(scope.obj.x).toBeNull();
      expect(scope.form.x.$pristine).toBe(false);
      expect(scope.form.x.$error).toEqual({ incomplete: false });
    });

    it('clear should work via scope', function() {
      delete scope.obj.x;
      scope.$digest();
      expect(input.val()).toBe('');
      expect(clear).toHaveClass('ng-hide');
      expect(dropdown).toHaveClass('ng-hide');
      expect(scope.obj.x).toBeNull();
      expect(scope.form.x.$pristine).toBe(false);
      expect(scope.form.x.$error).toEqual({ incomplete: false });
    });
  });

  describe('with objects', function () {

    beforeEach(function () {
      init({
        template: '<div sb-dropdown-select sb-source="source" sb-display-property="display" name="x" ng-model="obj.x"></div>',
        scope: { 
          obj: { x: { id: 2, display: 'automobiles' }}, 
          source: objectSource 
        }
      });
    });

    it('should initiate', function() {
      expect(input.val()).toBe('automobiles');
      expect(clear).not.toHaveClass('ng-hide');
      expect(dropdown).toHaveClass('ng-hide');
      expect(scope.form.x.$pristine).toBe(true);
      expect(scope.form.x.$error).toEqual({ incomplete: false });
    });
  });

  describe('on an input element', function () {

    beforeEach(function () {
      init({
        template: '<input sb-dropdown-select sb-source="source" sb-display-property="display" type="text" name="x" ng-model="obj.x">',
        scope: { 
          obj: { x: { id: 2, display: 'automobiles' }}, 
          source: objectSource 
        }
      });
    });

    it('should initiate', function() {
      expect(input.val()).toBe('automobiles');
      expect(clear).not.toHaveClass('ng-hide');
      expect(dropdown).toHaveClass('ng-hide');
      expect(scope.form.x.$pristine).toBe(true);
      expect(scope.form.x.$error).toEqual({ incomplete: false });
    });
  });
});
