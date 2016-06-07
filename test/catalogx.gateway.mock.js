angular.module('catalogx.gateway', [])
    .factory('updateCatalogItemWriterSpy', [UpdateCatalogItemWriterSpyFactory])
    .factory('updateCatalogItemWriter', ['updateCatalogItemWriterSpy', UpdateCatalogItemWriterFactory]);

function UpdateCatalogItemWriterSpyFactory() {
    var spy = jasmine.createSpy('updateCatalogItemWriterSpy');
    return {
        spy:spy,
        invokedFor:function(args) {
            expect(spy.calls.first().args[0]).toEqual(args);
        },
        data:function() {
            return spy.calls.first().args[0].data;
        },
        success:function() {
            spy.calls.first().args[0].success();
        }
    };
}

function UpdateCatalogItemWriterFactory(updateCatalogItemWriterSpy) {
    return updateCatalogItemWriterSpy.spy;
}