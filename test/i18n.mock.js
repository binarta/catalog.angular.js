angular.module('i18n', [])
    .factory('localeResolver', function () {
        return function () {
            return 'l';
        };
    })
    .factory('i18nLocation', function($location) {
        return {
            path: function (path) {
                $location.path('/lang' + path);
            }
        };
    });