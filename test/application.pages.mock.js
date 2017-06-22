angular.module('application.pages', [])
    .service('binPages', function () {
        this.isActive = jasmine.createSpy('isActive');
    });