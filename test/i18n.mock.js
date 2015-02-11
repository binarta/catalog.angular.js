angular.module('i18n', [])
    .factory('i18nLocation', function($location) {
        return {
            path: function (path) {
                $location.path('/lang' + path);
            }
        };
    });