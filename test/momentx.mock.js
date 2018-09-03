angular.module('momentx', [])
    .factory('moment', function () {
        var frozenMoment = undefined;

        moment.freeze = function() {
            frozenMoment = moment();
        };
        moment.unfreeze = function() {
            frozenMoment = undefined;
        };
        return function() {
            if (frozenMoment !== undefined)
                return frozenMoment;
            else
                return moment.apply(moment, arguments);
        };
    });