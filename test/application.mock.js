angular.module('application', [])
    .service('applicationDataService', function () {
        this.then = jasmine.createSpy('applicationDataService');
        this.flush = jasmine.createSpy('flush');
    });