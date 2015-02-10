angular.module('i18n', [])
    .factory('i18nLocation', function() {
        return {
            path: function (path) {
                return 'lang' + path;
            }
        };
    });