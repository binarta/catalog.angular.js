angular.module('toggle.edit.mode', [])
    .service('editMode', function () {
        this.bindEvent = jasmine.createSpy('bindEvent');
    })
    .service('editModeRenderer', function () {
        this.open = jasmine.createSpy('open');
        this.close = jasmine.createSpy('close');
    });