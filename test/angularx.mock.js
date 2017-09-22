angular.module('angularx', [])
    .service('binLink', function () {
        this.open = jasmine.createSpy('binLink');
    })
    .factory('binScrollTo', function () {
        return jasmine.createSpy('binScrollTo');
    });