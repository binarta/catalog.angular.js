module.exports = function(config) {
    config.set({
        basePath:'../',
        frameworks:['jasmine'],
        plugins: [
            require('karma-jasmine'),
            require('karma-phantomjs-launcher'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-spec-reporter')
        ],
        client:{
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        files:[
            {pattern:'bower_components/moment/moment.js'},
            {pattern:'bower_components/angular/angular.js'},
            {pattern:'bower_components/angular-route/angular-route.js'},
            {pattern:'bower_components/angular-mocks/angular-mocks.js'},
            {pattern:'bower_components/binartajs/src/binarta.js'},
            {pattern:'bower_components/binartajs/src/application.js'},
            {pattern:'bower_components/binartajs/src/checkpoint.js'},
            {pattern:'bower_components/binartajs/src/gateways.inmem.js'},
            {pattern:'bower_components/binartajs-angular1/src/binarta-angular.js'},
            {pattern:'bower_components/binartajs-angular1/src/binarta-application-angular.js'},
            {pattern:'bower_components/binartajs-angular1/src/binarta-application-inmem-angular.js'},
            {pattern:'bower_components/binartajs-angular1/src/binarta-checkpoint-angular.js'},
            {pattern:'bower_components/binartajs-angular1/src/binarta-checkpoint-inmem-angular.js'},
            {pattern:'bower_components/binarta.usecase.adapter.angular/src/angular.usecase.adapter.js'},
            {pattern:'bower_components/thk-rest-client-mock/src/rest.client.mock.js'},
            {pattern:'bower_components/thk-config-mock/src/config.mock.js'},
            {pattern:'bower_components/thk-notifications-mock/src/notifications.mock.js'},
            {pattern:'bower_components/thk-web-storage-mock/src/web.storage.mock.js'},
            {pattern:'bower_components/binartajs-angular1/src/binarta-all-tpls-bootstrap3-angular1.js'},
            {pattern:'src/**/*.js'},
            {pattern:'test/**/*.js'}
        ],
        reporters: ['kjhtml', 'spec'],
        specReporter: {
            suppressPassed: true,      // do not print information about passed tests
            suppressSkipped: true      // do not print information about skipped tests
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers:['ChromeHeadless'],
        singleRun: false
    });
};