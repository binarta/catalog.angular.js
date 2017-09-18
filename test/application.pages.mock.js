angular.module('application.pages', [])
    .service('binSections', function () {
        this.isActive = jasmine.createSpy('isActive');
    });