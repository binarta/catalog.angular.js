angular.module('i18n', [])
    .factory('localeResolver', function () {
        return function () {
            return 'l';
        };
    })
    .factory('i18nLocation', function($location) {
        return {
            path: function (path) {
                return $location.path('/lang' + path);
            }
        };
    });