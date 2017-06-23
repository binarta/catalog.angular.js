angular.module('image.carousel', [])
    .service('binImageCarousel', function () {
        this.getHeroImage = jasmine.createSpy('hero');
    });