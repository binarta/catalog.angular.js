angular.module('checkpoint', [])
    .factory('activeUserHasPermission', function(activeUserHasPermissionHelper) {
        return function(response, permission){
            activeUserHasPermissionHelper.yes = response.yes;
            activeUserHasPermissionHelper.no = response.no;
            activeUserHasPermissionHelper.scope = response.scope;
            activeUserHasPermissionHelper.permission = permission;
        };
    })
    .factory('activeUserHasPermissionHelper', function() {
        return {};
    });