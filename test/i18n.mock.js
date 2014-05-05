angular.module('i18n', [])
    .factory('localeResolver', function() {
        return function() {
            return 'lang';
        }
    });