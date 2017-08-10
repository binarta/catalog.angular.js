describe('catalog', function () {
    var usecase, ctrl, scope, params, $httpBackend, dispatcher, location, i18nLocation, payload, notifications;
    var onSuccess, receivedPayload, rest, i18n, $q, binarta, $rootScope;

    beforeEach(module('catalog'));
    beforeEach(module('config'));
    beforeEach(module('notifications'));
    beforeEach(module('rest.client'));
    beforeEach(module('web.storage'));
    beforeEach(module('i18n'));
    beforeEach(module('test.app'));
    beforeEach(module('binarta.search'));

    beforeEach(inject(function ($injector, $location, _i18nLocation_, config, _$q_, _binarta_, _$rootScope_) {
        $q = _$q_;
        binarta = _binarta_;
        $rootScope = _$rootScope_;
        config.namespace = 'namespace';
        scope = {
            $watch: function (expression, callback) {
                scope.watches[expression] = callback;
            },
            watches: {},
            $on: function (event, callback) {
                scope.on[event] = callback;
            },
            on: {}
        };
        payload = [];
        params = {};
        location = $location;
        location.path('');
        i18nLocation = _i18nLocation_;
        rest = {
            service: function (it) {
                rest.ctx = it;
            }
        };
        i18n = {
            resolver: function (ctx, presenter) {
                i18n.ctx = ctx;
                i18n.presenter = presenter;
            }
        };
        $httpBackend = $injector.get('$httpBackend');
        dispatcher = {
            fire: function (topic, msg) {
                dispatcher[topic] = msg;
            }
        };
        notifications = {
            subscribe: function (topic, callback) {
                this[topic] = callback;
            }
        };
    }));
    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('findCatalogPartitions', function () {
        beforeEach(inject(function (findCatalogPartitions) {
            payload = undefined;
            onSuccess = function (partitions) {
                receivedPayload = partitions;
            };
            usecase = findCatalogPartitions;
        }));

        [undefined, ''].forEach(function (el) {
            it('when no owner selected an empty set of partitions is returned', function () {
                usecase({query: 'query-name', filters: {owner: el}, success: onSuccess});
                expect(receivedPayload).toEqual([]);
            });
        });

        it('on execute perform rest call', inject(function (config) {
            config.namespace = 'namespace';
            $httpBackend.expect('POST', 'api/query/catalog-partition/query-name', {
                args: {
                    namespace: config.namespace,
                    owner: 'owner-id'
                }
            }).respond(200);
            usecase({query: 'query-name', filters: {owner: 'owner-id'}, success: onSuccess});
            $httpBackend.flush();
        }));

        it('with sortings', inject(function (config) {
            config.namespace = 'namespace';
            $httpBackend.expect('POST', 'api/query/catalog-partition/query-name', {
                args: {
                    namespace: config.namespace,
                    owner: 'owner-id',
                    sortings: 'sortings'
                }
            }).respond(200);
            usecase({query: 'query-name', filters: {owner: 'owner-id'}, sortings: 'sortings', success: onSuccess});
            $httpBackend.flush();
        }));

        it('with sub set', inject(function (config) {
            config.namespace = 'namespace';
            $httpBackend.expect('POST', 'api/query/catalog-partition/query-name', {
                args: {
                    namespace: config.namespace,
                    owner: 'owner-id',
                    subset: 'subset'
                }
            }).respond(200);
            usecase({query: 'query-name', filters: {owner: 'owner-id'}, subset: 'subset', success: onSuccess});
            $httpBackend.flush();
        }));

        it('on execute with baseUri perform rest call', inject(function (config) {
            config.baseUri = 'http://host/context';
            $httpBackend.expect('POST', config.baseUri + 'api/query/catalog-partition/query-name').respond(200);
            usecase({query: 'query-name', filters: {owner: 'owner-id'}, success: onSuccess});
            $httpBackend.flush();
        }));

        it('unexpected responses resolve to an empty set', function () {
            $httpBackend.expect('POST', /.*/).respond(0);
            usecase({query: 'query-name', filters: {owner: 'owner-id'}, success: onSuccess});
            $httpBackend.flush();
            expect(receivedPayload).toEqual([]);
        });

        it('response payload is passed to success callback', function () {
            $httpBackend.expect('POST', /.*/).respond(200, payload);
            usecase({query: 'query-name', filters: {owner: 'owner-id'}, success: onSuccess});
            $httpBackend.flush();
            expect(receivedPayload).toEqual(payload);
        })
    });

    describe('findCatalogItemById', function () {
        var fixture, restDeferred;

        beforeEach(inject(function ($q, config, findCatalogItemById, restServiceHandler) {
            config.namespace = 'namespace';
            fixture = {
                config: config,
                rest: restServiceHandler,
                usecase: findCatalogItemById
            };
            restDeferred = $q.defer();
            fixture.rest.and.returnValue(restDeferred.promise);
            payload = undefined;
            onSuccess = function (item) {
                receivedPayload = item;
            };
        }));

        it('on execute without supported languages includes default locale in rest call', function () {
            binarta.application.gateway.updateApplicationProfile({supportedLanguages: []});
            binarta.application.refresh();
            binarta.application.setLocaleForPresentation(undefined);

            fixture.usecase('item-id', onSuccess);

            expect(fixture.rest.calls.first().args[0].params.url).toEqual('api/entity/catalog-item?id=item-id&locale=default');
        });

        describe('with locale for presentation included in rest call', function () {
            beforeEach(function () {
                binarta.application.gateway.updateApplicationProfile({supportedLanguages: ['en', 'nl']});
                binarta.application.refresh();
                binarta.application.setLocaleForPresentation('en');
            });

            it('on execute perform rest call', function () {
                fixture.usecase('item-id', onSuccess);
                expect(fixture.rest.calls.first().args[0].params.url).toEqual('api/entity/catalog-item?id=item-id&locale=en');
                expect(fixture.rest.calls.first().args[0].params.withCredentials).toEqual(true);
                expect(fixture.rest.calls.first().args[0].params.method).toEqual('GET');
                expect(fixture.rest.calls.first().args[0].params.params).toEqual({treatInputAsId: true});
            });

            it('set carousel header when requesting item', function () {
                fixture.usecase('item-id', onSuccess);
                expect(fixture.rest.calls.first().args[0].params.headers).toEqual({'X-Binarta-Carousel': true});
            });

            it('on execute with baseUri', function () {
                fixture.config.baseUri = 'http://host/context/';
                fixture.usecase('item/id', onSuccess);
                expect(fixture.rest.calls.first().args[0].params.url).toEqual(fixture.config.baseUri + 'api/entity/catalog-item?id=' + encodeURIComponent('item/id') + '&locale=en');
            });

            it('unexpected responses resolve to an empty set', function () {
                fixture.usecase('item-id', onSuccess);
                fixture.rest.calls.first().args[0].error();
                expect(receivedPayload).toEqual([]);
            });

            it('response payload is passed to success callback', function () {
                fixture.usecase('type', onSuccess);
                fixture.rest.calls.first().args[0].success(payload);
                expect(receivedPayload).toEqual(payload);
            });

            it('propagates promise from rest service', function () {
                var expected;
                fixture.usecase('item-id').then(function () {
                    expected = true;
                });
                restDeferred.resolve();
                $rootScope.$digest();
                expect(expected).toBeTruthy();
            });
        });
    });

    describe('findCatalogItemsByPartition', function () {
        var fixture;

        beforeEach(inject(function (config, findCatalogItemsByPartition, restServiceHandler) {
            config.namespace = 'namespace';
            fixture = {
                config: config,
                rest: restServiceHandler,
                usecase: findCatalogItemsByPartition
            };
            payload = undefined;
            onSuccess = function (items) {
                receivedPayload = items;
            };
        }));

        it('on execute perform rest call', inject(function (config) {
            fixture.usecase({partition: 'partition-id'}, onSuccess);
            expect(fixture.rest.calls.first().args[0].params.withCredentials).toEqual(true);
            expect(fixture.rest.calls.first().args[0].params.method).toEqual('POST');
            expect(fixture.rest.calls.first().args[0].params.url).toEqual('api/query/catalog-item/findByPartition');
            expect(fixture.rest.calls.first().args[0].params.data).toEqual({
                args: {
                    namespace: config.namespace,
                    partition: 'partition-id'
                }
            });
        }));

        it('on execute with sorting info', inject(function (config) {
            fixture.usecase({partition: 'partition-id', sortBy: 'creationTime', sortOrder: 'desc'}, onSuccess);
            expect(fixture.rest.calls.first().args[0].params.url).toEqual('api/query/catalog-item/findByPartition');
            expect(fixture.rest.calls.first().args[0].params.data).toEqual({
                args: {
                    namespace: config.namespace,
                    partition: 'partition-id',
                    sortBy: 'creationTime',
                    sortOrder: 'desc'
                }
            });
        }));

        it('on execute with baseUri', inject(function (config) {
            fixture.config.baseUri = 'http://host/context/';
            fixture.usecase('partition-id', onSuccess);
            expect(fixture.rest.calls.first().args[0].params.url).toEqual(fixture.config.baseUri + 'api/query/catalog-item/findByPartition');
        }));

        it('unexpected responses resolve to an empty set', function () {
            fixture.usecase({partition: 'partition-id', success: onSuccess});
            fixture.rest.calls.first().args[0].error();
            expect(receivedPayload).toEqual([]);
        });

        it('response payload is passed to success callback', function () {
            fixture.usecase({partition: 'type', success: onSuccess});
            fixture.rest.calls.first().args[0].success(payload);
            expect(receivedPayload).toEqual(payload);
        });
    });

    describe('QueryCatalogController', function () {
        var fixture;

        beforeEach(inject(function ($controller, topicRegistryMock, $rootScope) {
            notifications = topicRegistryMock;
            fixture = {
                query: jasmine.createSpy('query'),
                entity: jasmine.createSpy('entity')
            };
            scope = $rootScope.$new();
            ctrl = $controller(QueryCatalogController, {
                $scope: scope,
                findCatalogItemsByPartition: fixture.query,
                findCatalogItemById: fixture.entity,
                topicMessageDispatcher: dispatcher
            });
        }));

        describe('exposes decorator', function () {
            it('items get added to items array', function () {
                scope.decorator({id: 'I'});
                expect(scope.items).toEqual([{id: 'I'}]);
            })
        });

        describe('exposes filters customizer', function () {
            var promise;
            var filters = {};
            var subset = {offset: 10, count: 5};
            var promiseWasResolved = false;

            beforeEach(function () {
                promise = scope.filtersCustomizer({filters: filters, subset: subset})
            });

            it('subset is copied onto filters', function () {
                promise.then(function () {
                    promiseWasResolved = true;
                });
                scope.$root.$digest();
                expect(filters.offset).toEqual(subset.offset);
                expect(filters.count).toEqual(subset.count);
                expect(promiseWasResolved).toBeTruthy();
            })
        });

        it('does not subscribe to app.start notifications at construction time', function () {
            expect(notifications['app.start']).toBeUndefined();
        });

        describe('given parent partition', function () {
            var config;

            beforeEach(function () {
                config = {};
                scope.forPartition('partition', config);
            });

            it('expose the parent partition on local scope', function () {
                expect(scope.partition).toEqual('partition');
            });

            describe('catalog.item.added notification received', function () {
                var id;

                beforeEach(function () {
                    id = 'new-item';
                    scope.items = ['first'];
                    payload = {
                        id: id
                    };
                    notifications['catalog.item.added'](id);
                });

                it('request catalog item for that id', function () {
                    expect(fixture.entity.calls.first().args[0]).toEqual(id);
                });

                describe('when catalog item received', function () {
                    beforeEach(function () {
                        fixture.entity.calls.first().args[1](payload);
                    });

                    it('update item on local scope', function () {
                        expect(scope.items[1]).toEqual(payload);
                    });
                });

                describe('when marked to prepend items on addition', function () {
                    beforeEach(function () {
                        config.onAddition = 'prepend';
                    });

                    describe('when catalog item received', function () {
                        beforeEach(function () {
                            fixture.entity.calls.first().args[1](payload);
                        });

                        it('prepend item on local scope', function () {
                            expect(scope.items[0]).toEqual(payload);
                        });
                    });
                });
            });

            describe('catalog.item.updated notification received', function () {
                beforeEach(function () {
                    scope.items = [
                        {id: 'item-1', foo: 'foo'},
                        {id: 'item-2', foo: 'foo'}
                    ];
                    payload = {
                        id: 'item-2',
                        foo: 'bar'
                    };
                    notifications['catalog.item.updated']({id: 'item-2'});
                });

                it('request catalog item for that id', function () {
                    expect(fixture.entity.calls.first().args[0]).toEqual('item-2');
                });

                describe('when catalog item received', function () {
                    beforeEach(function () {
                        fixture.entity.calls.first().args[1](payload);
                    });

                    it('update item on local scope', function () {
                        expect(scope.items[1]).toEqual(payload);
                    });
                });
            });

            it('catalog.item.removed notifications remove the item from the backed list', function () {
                scope.items = [
                    {id: 'item-1'},
                    {id: 'item-2'}
                ];

                notifications['catalog.item.removed']('item-1');

                expect(scope.items).toEqual([
                    {id: 'item-2'}
                ]);
            });
        });

        describe('given partition without config', function () {
            beforeEach(function () {
                scope.forPartition('partition');
            });

            describe('catalog.item.added notification received', function () {
                var id;

                beforeEach(function () {
                    id = 'new-item';
                    scope.items = ['first'];
                    payload = {
                        id: id
                    };
                    notifications['catalog.item.added'](id);
                });

                describe('when catalog item received', function () {
                    beforeEach(function () {
                        fixture.entity.calls.first().args[1](payload);
                    });

                    it('append item on local scope', function () {
                        expect(scope.items[1]).toEqual(payload);
                    });
                });
            });

            describe('catalog.item.paste notification received', function () {
                beforeEach(function () {
                    scope.items = [
                        {id: 'I1', priority: 1},
                        {id: 'I2', priority: 2},
                        {id: 'I3', priority: 3}
                    ];
                });

                it('first to middle', function () {
                    notifications['catalog.item.paste']({id: 'I1', priority: 2});
                    expect(scope.items[0]).toEqual({id: 'I2', priority: 1});
                    expect(scope.items[1]).toEqual({id: 'I1', priority: 2});
                    expect(scope.items[2]).toEqual({id: 'I3', priority: 3});
                });

                it('first to last', function () {
                    notifications['catalog.item.paste']({id: 'I1', priority: 3});
                    expect(scope.items[0]).toEqual({id: 'I2', priority: 1});
                    expect(scope.items[1]).toEqual({id: 'I3', priority: 2});
                    expect(scope.items[2]).toEqual({id: 'I1', priority: 3});
                });

                it('last to first', function () {
                    notifications['catalog.item.paste']({id: 'I3', priority: 1});
                    expect(scope.items[0]).toEqual({id: 'I3', priority: 1});
                    expect(scope.items[1]).toEqual({id: 'I1', priority: 2});
                    expect(scope.items[2]).toEqual({id: 'I2', priority: 3});
                });

                it('to self', function () {
                    notifications['catalog.item.paste']({id: 'I2', priority: 2});
                    expect(scope.items[0]).toEqual({id: 'I1', priority: 1});
                    expect(scope.items[1]).toEqual({id: 'I2', priority: 2});
                    expect(scope.items[2]).toEqual({id: 'I3', priority: 3});
                });
            });
        });
    });

    describe('ListPartitionsController', function () {
        var fixture, subscribers;

        beforeEach(inject(function ($controller, $rootScope, topicRegistryMock) {
            fixture = {
                query: jasmine.createSpy('query')
            };
            scope = $rootScope.$new();
            subscribers = topicRegistryMock;
            ctrl = $controller(ListCatalogPartitionsController, {
                $scope: scope,
                findCatalogPartitions: fixture.query
            });
        }));

        function request() {
            return fixture.query.calls.first().args[0];
        }

        [
            'scope',
            'controller'
        ].forEach(function (c) {
            describe('with ' + c, function () {
                var ctx;

                beforeEach(function () {
                    ctx = (c == 'scope') ? scope : ctrl;
                });

                it('simple search', function () {
                    ctx.init({query: 'ownedBy', owner: '/parent/'});
                    subscribers['app.start']();
                    expect(request().query).toEqual('ownedBy');
                    expect(request().filters.owner).toEqual('/parent/');
                });

                it('with sortings', function () {
                    ctx.init({query: 'ownedBy', owner: '/parent/', sortings: [{on: 'name', orientation: 'asc'}]});
                    subscribers['app.start']();
                    expect(request().sortings).toEqual([{on: 'name', orientation: 'asc'}]);
                });

                it('with sub set', function () {
                    ctx.init({query: 'ownedBy', owner: '/parent/', subset: {offset: 0, count: 2}});
                    subscribers['app.start']();
                    expect(request().subset).toEqual({offset: 0, count: 2});
                });

                describe('on search results', function () {
                    beforeEach(function () {
                        ctx.init({query: 'ownedBy', owner: '/parent/', subset: {offset: 0, count: 2}});
                        subscribers['app.start']();
                        request().success([{id: 1}]);
                    });

                    it('expose results on scope', function () {
                        expect(ctx.partitions.length).toEqual(1);
                        expect(ctx.partitions[0].id).toEqual(1);
                    });

                    it('increment offset with count', function () {
                        expect(request().subset).toEqual({offset: 1, count: 2});
                    });

                    describe('when searching for more', function () {
                        beforeEach(function () {
                            fixture.query.calls.reset();
                            ctx.searchForMore();
                            request().success([{id: 2}]);
                        });

                        it('increment offset with count', function () {
                            expect(request().subset).toEqual({offset: 2, count: 2});
                        });

                        it('extends the results', function () {
                            expect(ctx.partitions.length).toEqual(2);
                            expect(ctx.partitions[0].id).toEqual(1);
                            expect(ctx.partitions[1].id).toEqual(2);
                        });
                    });
                });

                describe('with deprecated initializer', function () {
                    beforeEach(function () {
                        ctx.init('ownedBy', '/parent/');
                    });

                    it('wait for app.start notification', function () {
                        expect(fixture.query).not.toHaveBeenCalled();
                    });

                    it('expose partition and parent on scope', function () {
                        expect(ctx.partition).toEqual('/parent/');
                        expect(ctx.parent).toEqual('/');
                    });

                    describe('when app.start notification received', function () {
                        beforeEach(function () {
                            subscribers['app.start']();
                        });

                        it('request partitions', function () {
                            expect(fixture.query.calls.first().args[0].query).toEqual('ownedBy');
                            expect(fixture.query.calls.first().args[0].filters.owner).toEqual('/parent/');
                        });

                        describe('and partitions received', function () {
                            beforeEach(function () {
                                payload = [
                                    {id: '/parent/path/'},
                                    {id: '/parent/another/'}
                                ];
                                fixture.query.calls.first().args[0].success(payload);
                            });

                            it('mark the current partition with css class active', function () {
                                expect(ctx.partitions).toEqual(payload);
                            });

                            describe('on catalog.partition.added notification', function () {
                                var partition;

                                function raiseForPath(path) {
                                    return function () {
                                        partition = {
                                            owner: path,
                                            name: 'name'
                                        };
                                        subscribers['catalog.partition.added'](partition);
                                    }
                                }

                                beforeEach(function () {
                                    ctx.partitions = [];
                                });

                                describe('and partition exists in listed path', function () {
                                    beforeEach(raiseForPath('/parent/'));

                                    it('payload is added to the partition list', function () {
                                        expect(ctx.partitions).toEqual([partition]);
                                    });
                                });

                                describe('and partition does not exist in listed path', function () {
                                    beforeEach(raiseForPath('/another/'));

                                    it('payload is not added to the partition list', function () {
                                        expect(ctx.partitions).toEqual([]);
                                    });
                                });
                            });

                            it('catalog.partition.removed notification removes the partition', function () {
                                ctx.partitions = [
                                    {id: 'partition-1'},
                                    {id: 'partition-2'}
                                ];

                                subscribers['catalog.partition.removed']('partition-1');

                                expect(ctx.partitions).toEqual([
                                    {id: 'partition-2'}
                                ]);
                            });
                        });

                    });
                });

                [
                    {path: '/', parent: undefined},
                    {path: '/sub/', parent: '/'},
                    {path: '/parent/sub/', parent: '/parent/'}
                ].forEach(function (el) {
                    describe('on init with path=' + el.path, function () {
                        beforeEach(function () {
                            ctx.init('query-name', el.path);
                        });

                        it('exposes parent field', function () {
                            expect(ctx.parent).toEqual(el.parent);
                        });
                    });
                });
            });
        });
    });

    describe('RemoveCatalogPartitionController', function () {
        beforeEach(inject(function ($controller, config) {
            config.namespace = 'namespace';
            ctrl = $controller(RemoveCatalogPartitionController, {
                $scope: scope,
                scopedRestServiceHandler: rest.service,
                topicMessageDispatcher: dispatcher
            })
        }));

        describe('on init', function () {
            beforeEach(function () {
                scope.init('/partition');
            });

            describe('on submit', function () {
                beforeEach(function () {
                    scope.submit();
                });

                it('call rest service', function () {
                    expect(rest.ctx.scope).toEqual(scope);
                    expect(rest.ctx.params.method).toEqual('DELETE');
                    expect(rest.ctx.params.url).toEqual('api/entity/catalog-partition?id=' + encodeURIComponent('/partition'));
                    expect(rest.ctx.params.withCredentials).toEqual(true);
                });

                it('on submit success send removed notification', function () {
                    rest.ctx.success();
                    expect(dispatcher['catalog.partition.removed']).toEqual('/partition');
                });

                it('on submit success send system success notification', function () {
                    rest.ctx.success();

                    expect(dispatcher['system.success']).toEqual({
                        code: 'catalog.partition.remove.success',
                        default: 'Partition removed!'
                    });
                });

                it('on submit success without redirect path stays on current path', function () {
                    rest.ctx.success();
                    expect(location.path()).toEqual('/');
                });
            });

            describe('on submit with baseUri', function () {
                it('call rest service', inject(function (config) {
                    config.baseUri = 'http://host/context/';
                    scope.submit();
                    expect(rest.ctx.params.url).toEqual(config.baseUri + 'api/entity/catalog-partition?id=' + encodeURIComponent('/partition'));
                }));
            });

            it('on submit success redirect to custom path', function () {
                scope.submit('/custom-path');
                rest.ctx.success();
                expect(location.path()).toEqual('/custom-path');
            });
        });
    });

    describe('findAllCatalogItemTypes', function () {
        beforeEach(inject(function (findAllCatalogItemTypes) {
            onSuccess = function (payload) {
                receivedPayload = payload;
            };
            usecase = findAllCatalogItemTypes;
        }));

        it('execute', function () {
            $httpBackend.expect('POST', 'api/query/catalog-item-type').respond(200, payload);
            usecase(onSuccess);
            $httpBackend.flush();
            expect(receivedPayload).toEqual(payload);
        });

        it('execute with baseUri', inject(function (config) {
            config.baseUri = 'http://host/context/';
            $httpBackend.expect('POST', config.baseUri + 'api/query/catalog-item-type').respond(200, payload);
            usecase(onSuccess);
            $httpBackend.flush();
        }));
    });

    describe('AddToCatalogController', function () {
        var itemTypesLoaded, subscriptions, rest, config, topics, editMode;
        var findAllCatalogItemTypes = function (onSuccess) {
            itemTypesLoaded = onSuccess;
        };

        beforeEach(inject(function ($controller, _config_, topicRegistryMock, restServiceHandler, topicMessageDispatcherMock, _editMode_) {
            config = _config_;
            config.baseUri = '';
            rest = restServiceHandler;
            topics = topicMessageDispatcherMock;
            editMode = _editMode_;
            subscriptions = topicRegistryMock;
            config.namespace = 'namespace';
            itemTypesLoaded = undefined;
            ctrl = $controller(AddToCatalogController, {
                $scope: scope,
                $routeParams: params,
                findAllCatalogItemTypes: findAllCatalogItemTypes
            });
        }));

        describe('init with no params', function () {
            beforeEach(inject(function () {
                subscriptions['app.start']();
            }));

            function assertTemplateUrlGeneratedFor(type) {
                if (scope.item) scope.item.type = type;
                expect(scope.templateUri()).toEqual('partials/catalog/add/' + (type || 'default') + '.html');
            }

            it('default template url before item type selected', function () {
                assertTemplateUrlGeneratedFor();
            });

            it('init for noredirect without partition', function () {
                scope.noredirect();
                expect(scope.partition).toBeUndefined();
            });

            describe('init for noredirect with partition', function () {
                beforeEach(function () {
                    scope.noredirect('partition');
                });

                describe('with item types loaded', function () {
                    beforeEach(function () {
                        itemTypesLoaded(payload);
                    });

                    it('expose partition ons scope', function () {
                        expect(scope.partition).toEqual('partition');
                    });
                });

                it('without type', function () {
                    expect(scope.item).toEqual(undefined);
                });

                describe('and type', function () {
                    beforeEach(function () {
                        scope.noredirect('partition', 'type');
                    });

                    describe('and item types loaded', function () {
                        beforeEach(function () {
                            itemTypesLoaded(payload);
                        });

                        it('should prefill the item type', function () {
                            expect(scope.item.type).toEqual('type');
                        });
                    });
                });

                describe('on submit', function () {
                    function assertSubmit() {
                        beforeEach(function () {
                            scope.submit();
                        });

                        it('perform rest call', function () {
                            var ctx = {
                                params: {
                                    method: 'PUT',
                                    url: config.baseUri + 'api/entity/catalog-item',
                                    data: {
                                        namespace: 'namespace',
                                        partition: 'partition',
                                        locale: 'l'
                                    },
                                    withCredentials: true
                                },
                                success: jasmine.any(Function),
                                rejected: jasmine.any(Function)

                            };
                            if (scope.item.type) ctx.params.data.type = scope.item.type;
                            if (scope.item.name) ctx.params.data.name = scope.item.name;

                            expect(rest).toHaveBeenCalledWith(ctx);
                        });
                    }

                    describe('with violation on form', function () {
                        beforeEach(function () {
                            scope.catalogItemAddForm = {
                                defaultName: {
                                    $invalid: true
                                }
                            };
                            scope.item = {
                                type: 'type',
                                name: 'name'
                            };
                            scope.submit();
                        });

                        it('set violations on scope', function () {
                            expect(scope.violations).toEqual({
                                defaultName: ['required']
                            });
                        });

                        it('do not perform rest request', function () {
                            expect(rest).not.toHaveBeenCalled();
                        });
                    });

                    describe('without violation', function () {
                        beforeEach(function () {
                            scope.item = {
                                type: 'type',
                                name: 'name'
                            };
                        });

                        assertSubmit();
                    });

                    describe('with previous violation', function () {
                        beforeEach(function () {
                            scope.violations = {};
                            scope.item = {
                                type: 'type',
                                name: 'name'
                            };
                        });

                        assertSubmit();
                    });

                    describe('on submit with baseUri', function () {
                        beforeEach(function () {
                            config.baseUri = 'http://host/context/';
                            scope.item = {};
                        });

                        assertSubmit();
                    });
                });
            });

            describe('init for noredirect with partition, custom locale and success handler', function () {
                var executed = false;
                var passedItem;

                beforeEach(function () {
                    scope.init({
                        partition: 'partition', type: 'type', locale: 'locale', success: function (item) {
                            executed = true;
                            passedItem = item;
                        }
                    });
                });

                describe('on submit', function () {
                    beforeEach(function () {
                        scope.item = {
                            type: 'type',
                            name: 'name'
                        };
                        scope.submit();
                    });

                    it('perform rest call', function () {
                        expect(rest.calls.first().args[0].params.data).toEqual({
                            type: 'type',
                            name: 'name',
                            namespace: 'namespace',
                            partition: 'partition',
                            locale: 'locale'
                        });
                    });

                    describe('on success', function () {
                        var item = {
                            id: 'itemId'
                        };

                        beforeEach(function () {
                            rest.calls.first().args[0].success(item);
                        });

                        it('success handler is executed', function () {
                            expect(executed).toEqual(true);
                        });

                        it('item is passed to success handler', function () {
                            expect(passedItem).toEqual(item);
                        });
                    });

                });
            });

            describe('with item types loaded', function () {
                beforeEach(function () {
                    itemTypesLoaded(payload);
                });

                function withItemData() {
                    scope.item.type = 'type';
                    scope.item.name = 'name';
                }

                function assertPutRequestReceived() {
                    expect(rest).toHaveBeenCalledWith({
                        params: {
                            method: 'PUT',
                            url: 'api/entity/catalog-item',
                            data: {
                                type: 'type',
                                name: 'name',
                                namespace: 'namespace',
                                partition: '',
                                locale: 'l'
                            },
                            withCredentials: true
                        },
                        success: jasmine.any(Function),
                        rejected: jasmine.any(Function)

                    });
                }

                function assertItemDataReset() {
                    expect(scope.item.type).toEqual('');
                    expect(scope.item.name).toEqual('');
                }

                it("init", function () {
                    expect(scope.types).toEqual(payload);
                    expect(scope.partition).toEqual('');
                    expect(scope.item.type).toEqual('');
                    expect(scope.item.name).toEqual('');
                    expect(scope.typeSelected).toBeFalsy();
                });

                it('on submit performs put request', function () {
                    withItemData();
                    scope.submit();
                    assertPutRequestReceived();
                });

                it('on submit success reset form', function () {
                    withItemData();
                    scope.submit();
                    rest.calls.first().args[0].success({});
                    assertItemDataReset();
                });

                it('generates a template url based on type', function () {
                    assertTemplateUrlGeneratedFor('');
                    assertTemplateUrlGeneratedFor('type');
                });
            });
        });

        describe('init with type param', function () {
            beforeEach(inject(function () {
                params.type = 'type';
                subscriptions['app.start']();
            }));

            describe('with item types loaded', function () {
                beforeEach(function () {
                    itemTypesLoaded(payload);
                });

                it("init with type params", function () {
                    expect(scope.item.type).toEqual('type');
                    expect(scope.typeSelected).toBeTruthy();
                });

                describe('init with type and partition param', function () {
                    beforeEach(inject(function () {
                        params.type = 'type';
                        params.partition = 'partition-id';
                        subscriptions['app.start']();
                        itemTypesLoaded(payload);
                    }));

                    it('exposed vars', function () {
                        expect(scope.partition).toEqual(params.partition);
                    });

                    it('on submit success without redirect', function () {
                        scope.noredirect();
                        scope.submit();
                        rest.calls.first().args[0].success({id: 'item-id'});
                        expect(location.path()).toEqual('/');
                    });

                    it('on submit success raise item added notification', function () {
                        scope.item.name = 'name';
                        scope.item.custom = 'custom-field';

                        scope.submit();
                        rest.calls.first().args[0].success({id: 'item-id'});

                        expect(topics['catalog.item.added']).toEqual('item-id');
                    });

                    it('on submit clear form dirty state', function () {
                        var pristine = false;
                        scope.form = {
                            $setPristine: function () {
                                pristine = true;
                            }
                        };
                        scope.submit();
                        rest.calls.first().args[0].success({id: 'item-id'});

                        expect(pristine).toEqual(true);
                    });
                });
            });
        });

        describe('init with redirectTo param', function () {
            beforeEach(inject(function () {
                params.redirectTo = '/path';
                subscriptions['app.start']();
                itemTypesLoaded(payload);
            }));

            it('on submit success redirect to path', function () {
                scope.init(params);
                scope.submit();
                rest.calls.first().args[0].success({id: 'item-id'});
                expect(location.path()).toEqual('/path');
            });
        });

        it('init with redirect to view', function () {
            params.redirectToView = true;
            params.partition = '/partition/';
            subscriptions['app.start']();
            itemTypesLoaded();
            scope.init(params);
            scope.submit();
            rest.calls.first().args[0].success({id: '/item-id'});
            expect(location.path()).toEqual('/lang/view/item-id');
        });

        it('on success then registered success handler gets executed', function () {
            var successWasCalled = undefined;
            var item = {};
            subscriptions['app.start']();
            itemTypesLoaded();
            scope.success = function (item) {
                successWasCalled = item;
            };
            scope.submit();
            rest.calls.first().args[0].success(item);
            expect(successWasCalled).toEqual(item);
        });

        it('init with edit mode enabled', function () {
            params.editMode = true;
            params.partition = '/partition/';
            subscriptions['app.start']();
            itemTypesLoaded();
            scope.init(params);
            scope.submit();
            rest.calls.first().args[0].success({id: '/item-id'});
            expect(editMode.enable).toHaveBeenCalled();
        });

        it('on rejected', function () {
            subscriptions['app.start']();
            itemTypesLoaded();
            scope.init(params);
            scope.submit();
            rest.calls.first().args[0].rejected({"partition": ["upperbound"]});
            expect(scope.violations).toEqual({"partition": ["upperbound"]});
        });
    });

    describe("ViewCatalogItemController", function () {
        var fixture;

        beforeEach(inject(function ($controller, config, topicRegistryMock) {
            config.namespace = 'namespace';
            params = {};
            notifications = topicRegistryMock;
            fixture = {
                query: jasmine.createSpy('query'),
                entity: jasmine.createSpy('entity')
            };
            ctrl = $controller(ViewCatalogItemController, {
                $scope: scope,
                $routeParams: params,
                findCatalogItemById: fixture.entity
            });

            binarta.application.gateway.updateApplicationProfile({supportedLanguages: []});
            binarta.application.refresh();
            binarta.application.setLocaleForPresentation(undefined);
        }));

        [
            {params: {id: 'id'}, queryString: 'id=/id'}
        ].forEach(function (el) {
            describe('on init with params=' + JSON.stringify(el), function () {
                it('on init fetch item details', inject(function (topicRegistryMock) {
                    Object.keys(el.params).forEach(function (key) {
                        params[key] = el.params[key];
                    });

                    scope.init();
                    $httpBackend.verifyNoOutstandingExpectation();
                    $httpBackend.verifyNoOutstandingRequest();
                    expect(fixture.entity.calls.first().args[0]).toEqual(el.params.id);

                    fixture.entity.calls.first().args[1]({
                        id: 'id',
                        type: 'type',
                        name: 'name',
                        locale: 'en'
                    });
                    expect(scope.id).toEqual('id');
                    expect(scope.type).toEqual('type');
                    expect(scope.name).toEqual('name');
                    expect(scope.locale).toBeUndefined();
                    expect(scope.item.id).toEqual('id');
                    expect(scope.item.type).toEqual('type');
                    expect(scope.item.name).toEqual('name');
                }));
            });
        });

        it('generates a default template url', function () {
            expect(scope.templateUri()).toEqual('partials/catalog/item/default.html');
            expect(ctrl.templateUri()).toEqual('partials/catalog/item/default.html');
        });

        describe('with item', function () {
            beforeEach(inject(function (topicRegistryMock) {
                params.id = 'id';

                scope.init();
                expect(fixture.entity.calls.first().args[0]).toEqual('id');
                fixture.entity.calls.first().args[1]({
                    id: 'id',
                    type: 'type',
                    name: 'name',
                    locale: 'en'
                });
            }));

            it('expose details on scope', function () {
                expect(scope.id).toEqual('id');
                expect(scope.type).toEqual('type');
                expect(scope.name).toEqual('name');
            });

            it('do not expose locale on scope', function () {
                expect(scope.locale).toBeUndefined();
            });

            it('expose item on scope', function () {
                expect(scope.item.id).toEqual('id');
                expect(scope.item.type).toEqual('type');
                expect(scope.item.name).toEqual('name');
            });

            it('expose item on controller', function () {
                expect(ctrl.item.id).toEqual('id');
                expect(ctrl.item.type).toEqual('type');
                expect(ctrl.item.name).toEqual('name');
            });

            it('generates a template url based on type', function () {
                expect(scope.templateUri()).toEqual('partials/catalog/item/type.html');
                expect(ctrl.templateUri()).toEqual('partials/catalog/item/type.html');
            });

            describe('on item refresh', function () {
                var actual, expected;

                beforeEach(function () {
                    expected = 'promise';
                    fixture.entity.and.returnValue('promise');

                    actual = ctrl.refresh();
                });

                it('request catalog item', function () {
                    expect(fixture.entity.calls.first().args[0]).toEqual('id');
                });

                describe('when catalog item received', function () {
                    payload = {
                        id: 'newId'
                    };

                    beforeEach(function () {
                        fixture.entity.calls.first().args[1](payload);
                    });

                    it('update item on local scope', function () {
                        expect(scope.item).toEqual(payload);
                    });

                    it('update item on controller', function () {
                        expect(ctrl.item).toEqual(payload);
                    });
                });

                it('promise is propagated', function () {
                    expect(actual).toEqual(expected);
                });
            });
        });

        [
            {id: '/products/id', onRouteParams: true, expectRedirect: true},
            {id: '/products/id', onInitializer: true, expectRedirect: true},
            {id: '/products/localized-id', onRouteParams: true, expectRedirect: false},
            {id: '/products/localized-id', onInitializer: true, expectRedirect: false}
        ].forEach(function (ctx) {
            it('given item with localized id then redirect to localized path', inject(function (topicRegistryMock) {
                location.path('/');
                if (ctx.onRouteParams)
                    params.id = ctx.id;
                scope.init(ctx.onInitializer ? ctx.id : undefined);
                fixture.entity.calls.first().args[1]({
                    id: 'id',
                    localizedId: '/products/localized-id',
                    type: 'type',
                    name: 'name',
                    locale: 'en'
                });

                expect(location.path()).toEqual(ctx.expectRedirect ? '/view/products/localized-id' : '/');
            }));
        });

        describe('catalog.item.updated notification received', function () {
            beforeEach(function () {
                scope.item = {
                    id: 'item-1',
                    foo: 'foo'
                };
                payload = {
                    id: 'item-2',
                    foo: 'bar'
                };
                notifications['catalog.item.updated']({id: 'item-2'});
            });

            it('request catalog item for that id', function () {
                expect(fixture.entity.calls.first().args[0]).toEqual('item-2');
            });

            describe('when catalog item received', function () {
                beforeEach(function () {
                    fixture.entity.calls.first().args[1](payload);
                });

                it('update item on local scope', function () {
                    expect(scope.item).toEqual(payload);
                });

                it('update item on controller', function () {
                    expect(ctrl.item).toEqual(payload);
                });
            });
        });

        it('and scope listens to destroy event', function () {
            expect(scope.on['$destroy']).toBeDefined();
        });

        describe('and scope is destroyed', function () {
            beforeEach(function () {
                scope.on['$destroy']();
            });

            it('should unsubscribe catalog.item.updated', function () {
                expect(notifications['catalog.item.updated']).toBeUndefined();
            });
        });
    });

    describe('AddPartitionToCatalogController', function () {
        var ctx;
        var handler = function (it) {
            ctx = it;
        };

        beforeEach(inject(function ($controller, config) {
            config.namespace = 'namespace';
            ctx = {};
            ctrl = $controller(AddPartitionToCatalogController, {
                $scope: scope,
                $routeParams: params,
                restServiceHandler: handler
            });
        }));

        describe('with query params', function () {
            beforeEach(inject(function ($controller) {
                params = {owner: 'owner'};
                location.search(params);
                ctrl = $controller(AddPartitionToCatalogController, {
                    $scope: scope,
                    $routeParams: params,
                    restServiceHandler: handler
                });
            }));

            it('expose owner', function () {
                scope.owner = 'owner'
            });

            it('flag redirect on submit', function () {
                expect(ctrl.noredirect).toEqual(false);
            });
        });

        describe('with init function called', function () {
            beforeEach(inject(function ($controller) {
                scope.name = 'name';
                scope.init('owner');
            }));

            it('resets name', function () {
                expect(scope.name).toEqual('');
            });

            it('expose owner', function () {
                expect(scope.owner).toEqual('owner');
            });

            it('flag noredirect on submit', function () {
                expect(ctrl.noredirect).toEqual(true);
            });
        });

        describe('on submit', function () {
            beforeEach(function () {
                scope.owner = 'owner';
                scope.name = 'name';
                scope.submit();
            });

            it('performs put request', function () {
                expect(ctx.scope).toEqual(scope);
                expect(ctx.params.method).toEqual('PUT');
                expect(ctx.params.url).toEqual('api/entity/catalog-partition');
                expect(ctx.params.data).toEqual({namespace: 'namespace', owner: scope.owner, name: scope.name});
                expect(ctx.params.withCredentials).toEqual(true);
            });

            describe('success', function () {
                beforeEach(function () {
                    ctx.success();
                });

                it('redirect to default', function () {
                    expect(location.path()).toEqual('/catalog/' + params.owner);
                });
            });
        });

        describe('on submit with baseUri', function () {
            beforeEach(inject(function (config) {
                config.baseUri = 'http://host/context/';
                scope.submit();
            }));

            it('uses baseUri in PUT request', inject(function (config) {
                expect(ctx.params.url).toEqual(config.baseUri + 'api/entity/catalog-partition');
            }));
        });

        describe('on submit success with a custom redirect path', function () {
            beforeEach(function () {
                scope.submit('/custom/path');
                ctx.success();
            });

            it('success', function () {
                expect(location.path()).toEqual('/custom/path');
            });
        });

        describe('on submit success with noredirect', function () {
            var owner, name, messages, response;

            beforeEach(inject(function (topicMessageDispatcherMock) {
                messages = topicMessageDispatcherMock;
                ctrl.noredirect = true;
                owner = 'owner';
                name = 'name';
                scope.owner = owner;
                scope.name = name;
                scope.submit();
                response = {id: 'id'};
                ctx.success(response);
            }));

            it('success', function () {
                expect(location.path()).toEqual('/');
            });

            it('clear form', function () {
                expect(scope.name).toEqual('');
            });

            it('raise partition added notification', function () {
                expect(messages['catalog.partition.added']).toEqual({
                    id: response.id,
                    owner: owner,
                    name: name
                });
                expect(messages['catalog.partition.added'].name).not.toEqual('');
            });
        });
    });

    describe('RemoveCatalogItem factory', function () {
        var sut, restClient, config;

        beforeEach(inject(function (removeCatalogItem, restServiceHandler, _config_) {
            sut = removeCatalogItem;
            restClient = restServiceHandler;
            config = _config_;
            config.baseUri = 'baseUri/';
            restClient.and.returnValue('promise');
        }));

        describe('on delete', function () {
            var id, result;

            beforeEach(function () {
                id = 'some id';
                result = sut({id: id});
            });

            it('rest client is called', function () {
                expect(restClient).toHaveBeenCalledWith({
                    params: {
                        method: 'DELETE',
                        url: 'baseUri/api/entity/catalog-item?id=some%20id',
                        withCredentials: true
                    }
                });
            });

            it('returns result of rest service', function () {
                expect(result).toEqual('promise');
            });
        });
    });

    describe('AddCatalogPartition factory', function () {
        var sut, restClient, config;

        beforeEach(inject(function (addCatalogPartition, restServiceHandler, _config_) {
            sut = addCatalogPartition;
            restClient = restServiceHandler;
            config = _config_;
            config.baseUri = 'baseUri/';
            config.namespace = 'namespace';
            restClient.and.returnValue('promise');
        }));

        describe('on add', function () {
            var partition, name, result, successSpy, rejectedSpy;

            beforeEach(function () {
                partition = 'partition';
                name = 'name';
                successSpy = jasmine.createSpy('success');
                rejectedSpy = jasmine.createSpy('rejected');
                result = sut({
                    partition: partition,
                    name: name,
                    success: successSpy,
                    rejected: rejectedSpy
                });
            });

            it('rest client is called', function () {
                expect(restClient).toHaveBeenCalledWith({
                    params: {
                        method: 'PUT',
                        url: 'baseUri/api/entity/catalog-partition',
                        data: {
                            namespace: 'namespace',
                            owner: partition,
                            name: name
                        },
                        withCredentials: true
                    },
                    success: jasmine.any(Function),
                    rejected: jasmine.any(Function)
                });
            });

            it('on success', function () {
                restClient.calls.mostRecent().args[0].success('p');
                expect(successSpy).toHaveBeenCalledWith('p');
            });

            it('on rejected', function () {
                restClient.calls.mostRecent().args[0].rejected('r');
                expect(rejectedSpy).toHaveBeenCalledWith('r');
            });

            it('returns result of rest service', function () {
                expect(result).toEqual('promise');
            });
        });
    });

    describe('RemoveCatalogPartition factory', function () {
        var sut, restClient, config;

        beforeEach(inject(function (removeCatalogPartition, restServiceHandler, _config_) {
            sut = removeCatalogPartition;
            restClient = restServiceHandler;
            config = _config_;
            config.baseUri = 'baseUri/';
            restClient.and.returnValue('promise');
        }));

        describe('on delete', function () {
            var id, result;

            beforeEach(function () {
                id = 'some id';
                result = sut({id: id});
            });

            it('rest client is called', function () {
                expect(restClient).toHaveBeenCalledWith({
                    params: {
                        method: 'DELETE',
                        url: 'baseUri/api/entity/catalog-partition?id=some%20id',
                        withCredentials: true
                    }
                });
            });

            it('returns result of rest service', function () {
                expect(result).toEqual('promise');
            });
        });
    });

    describe('RemoveItemFromCatalogController', function () {
        beforeEach(inject(function ($controller) {
            ctrl = $controller(RemoveItemFromCatalogController, {
                $scope: scope,
                $location: location,
                topicMessageDispatcher: dispatcher,
                scopedRestServiceHandler: rest.service
            });
        }));

        describe('on submit', function () {
            beforeEach(function () {
                scope.submit('/parent/id');
            });

            it('perform rest call', function () {
                expect(rest.ctx.scope).toEqual(scope);
                expect(rest.ctx.params.method).toEqual('DELETE');
                expect(rest.ctx.params.url).toEqual('api/entity/catalog-item?id=' + encodeURIComponent('/parent/id'));
                expect(rest.ctx.params.withCredentials).toEqual(true);
            });

            function triggerSuccess() {
                location.search({dirty: true});
                rest.ctx.success();
            }

            function expectRedirectTo(path) {
                expect(location.path()).toEqual(path);
                expect(location.search()).toEqual({});
            }

            describe('success', function () {
                beforeEach(triggerSuccess);

                it('raise success notification', function () {
                    expect(dispatcher['system.success']).toEqual({
                        code: 'catalog.item.removed',
                        default: 'Item removed!'
                    });
                });

                it('raise item removed notification', function () {
                    scope.submit('item-id');
                    rest.ctx.success();
                    expect(dispatcher['catalog.item.removed']).toEqual('item-id');
                });

                it('raise edit.mode.unlock notification', function () {
                    scope.submit('item-id');
                    rest.ctx.success();
                    expect(dispatcher['edit.mode.unlock']).toEqual('item-id');
                });

                it('switch to browse the parent partition', function () {
                    expectRedirectTo('/lang/browse/parent/');
                });
            });

            it('success with no redirect', function () {
                scope.init({noredirect: true});
                triggerSuccess();
                expect(location.path()).toEqual('/');
            });

            it('success with redirect to custom path', function () {
                scope.init({redirect: '/path/'});
                triggerSuccess();
                expect(location.path()).toEqual('/lang/path/');
            });

            it('success with no notification', function () {
                scope.init({successNotification: false});
                triggerSuccess();
                expect(dispatcher['system.success']).toBeUndefined();
            });

            it('when initialised with on success handler execute it after item removal', function () {
                var executed = false;
                scope.init({
                    success: function () {
                        executed = true;
                    }
                });
                scope.submit('item-id');
                rest.ctx.success();
                expect(executed).toEqual(true);
            });

            describe('with locale', function () {
                beforeEach(inject(function ($routeParams) {
                    $routeParams.locale = 'lang';
                }));

                describe('success', function () {
                    beforeEach(triggerSuccess);

                    it('switch to browse the localized parent partition', function () {
                        expectRedirectTo('/lang/browse/parent/');
                    });
                });
            });
        });

        describe('on submit with baseUri', function () {
            beforeEach(inject(function (config) {
                config.baseUri = 'http://host/context/';
                scope.submit('/parent/id');
            }));

            it('uses baseUri in DELETE request', inject(function (config) {
                expect(rest.ctx.params.url).toEqual(config.baseUri + 'api/entity/catalog-item?id=' + encodeURIComponent('/parent/id'));
            }));
        });
    });

    [
        {
            parts: [],
            parent: '',
            head: undefined,
            name: undefined
        },
        {
            parts: ['dir-0'],
            parent: '/',
            head: 'dir-0',
            name: 'dir-0'
        },
        {
            parts: ['dir-0', 'dir-1'],
            parent: '/dir-0/',
            head: 'dir-0',
            name: 'dir-1'
        },
        {
            parts: ['dir-0', 'dir-1', 'dir-2', 'dir-3', 'dir-4', 'dir-5'],
            parent: '/dir-0/dir-1/dir-2/dir-3/dir-4/',
            head: 'dir-0',
            name: 'dir-5'
        },
        {
            parts: ['dir-0', 'dir-1', 'dir-2', 'dir-3', 'dir-4', 'dir-5', 'dir-6', 'dir-7', 'dir-8', 'dir-9', 'dir-10'],
            parent: '/dir-0/dir-1/dir-2/dir-3/dir-4/dir-5/dir-6/dir-7/dir-8/dir-9/',
            head: 'dir-0',
            name: 'dir-10'
        }
    ].forEach(function (el) {
        var parts = el.parts;
        var path = '/' + parts.join('/') + (parts.length > 0 ? '/' : '');

        describe('with catalog path', function () {
            beforeEach(inject(function ($rootScope) {
                scope = $rootScope.$new();
                params = {};
                parts.reduce(function (p, c, i) {
                    p['d' + i] = c;
                    return p;
                }, params);

                binarta.application.gateway.updateApplicationProfile({supportedLanguages: []});
                binarta.application.refresh();
                binarta.application.setLocaleForPresentation(undefined);
            }));

            function assertPathDetailsExposedOnScope(path) {
                it('exposes path on scope', function () {
                    expect(scope.path).toEqual(path);
                });

                it('exposes head on scope', function () {
                    expect(scope.head).toEqual(el.head);
                });

                it('exposes name on scope', function () {
                    expect(scope.name).toEqual(el.name);
                });

                it('exposes parent on scope', function () {
                    expect(scope.parent).toEqual(el.parent);
                });

                it('exposes breadcrumbs on scope', function () {
                    expect(scope.breadcrumbs).toEqual(parts.map(function (it, idx) {
                        var active = idx + 1 == scope.breadcrumbs.length;
                        return {
                            path: '/' + parts.slice(0, idx + 1).join('/') + (path.slice(-1) != '/' && active ? '' : '/'),
                            name: it,
                            active: active
                        };
                    }));
                });
            }

            function assertPathDetailsExposedOnController(path) {
                it('exposes path on ctrl', function () {
                    expect(ctrl.path).toEqual(path);
                });

                it('exposes head on ctrl', function () {
                    expect(ctrl.head).toEqual(el.head);
                });

                it('exposes name on ctrl', function () {
                    expect(ctrl.name).toEqual(el.name);
                });

                it('exposes parent on ctrl', function () {
                    expect(ctrl.parent).toEqual(el.parent);
                });

                it('exposes breadcrumbs on ctrl', function () {
                    expect(ctrl.breadcrumbs).toEqual(parts.map(function (it, idx) {
                        var active = idx + 1 == scope.breadcrumbs.length;
                        return {
                            path: '/' + parts.slice(0, idx + 1).join('/') + (path.slice(-1) != '/' && active ? '' : '/'),
                            name: it,
                            active: active
                        };
                    }));
                });
            }

            describe('view catalog item controller', function () {
                describe('constructor', function () {
                    var findItemById = jasmine.createSpy('findItemById');
                    var filePath;

                    beforeEach(inject(function ($controller) {
                        filePath = path.slice(0, path.length - 1);
                        ctrl = $controller(ViewCatalogItemController, {
                            $scope: scope,
                            $routeParams: params,
                            findCatalogItemById: findItemById
                        });
                    }));

                    assertPathDetailsExposedOnScope(path.slice(0, path.length - 1));
                    assertPathDetailsExposedOnController(path.slice(0, path.length - 1));

                    describe('on init using scope', function () {
                        beforeEach(function () {
                            scope.init(filePath)
                        });

                        it('and app.start notification received', inject(function (config, topicRegistryMock) {
                            if (filePath) {
                                expect(findItemById.calls.first().args[0]).toEqual(filePath);
                            }
                        }));
                    });

                    describe('on init using controller', function () {
                        beforeEach(function () {
                            ctrl.init(filePath)
                        });

                        it('and app.start notification received', inject(function (config, topicRegistryMock) {
                            if (filePath) {
                                expect(findItemById.calls.first().args[0]).toEqual(filePath);
                            }
                        }));
                    });

                });
            });

            describe('browse catalog controller', function () {
                describe('constructor', function () {
                    beforeEach(inject(function ($controller) {
                        ctrl = $controller(BrowseCatalogController, {
                            $scope: scope,
                            $routeParams: params
                        });
                    }));

                    assertPathDetailsExposedOnScope(path);
                    assertPathDetailsExposedOnController(path);
                });
            });
        });
    });

    describe('UpdateCatalogItemController', function () {
        var topics, fixture, unbindWatchCalled, writer;

        beforeEach(inject(function ($controller, config, scopedRestServiceHandlerMock, topicMessageDispatcherMock, $rootScope, updateCatalogItemWriterSpy) {
            writer = updateCatalogItemWriterSpy;
            config.namespace = 'namespace';
            rest = scopedRestServiceHandlerMock;
            topics = topicMessageDispatcherMock;
            fixture = {
                entity: jasmine.createSpy('entity')
            };
            scope = $rootScope.$new();
            scope.$watch = function (expression, callback) {
                scope.watches[expression] = callback;
                return function () {
                    unbindWatchCalled = true;
                }
            };
            scope.watches = [];
            ctrl = $controller(UpdateCatalogItemController, {
                $scope: scope,
                findCatalogItemById: fixture.entity
            });
        }));

        describe('initialized with catalog item', function () {
            var item, pristine;

            beforeEach(function () {
                item = {
                    id: 'item-id',
                    customField: 'custom-value'
                };
                scope.form = {
                    $setPristine: function () {
                        pristine = true;
                    }
                };
                scope.init(item);
            });

            it('exposes item on scope', function () {
                expect(scope.item.id).toEqual(item.id);
                expect(scope.item.customField).toEqual(item.customField);
            });

            it('unchanged state is true', function () {
                expect(scope.unchanged).toEqual(true);
            });

            it('set form to pristine state', function () {
                expect(pristine).toEqual(true);
            });

            describe('and item change watch has triggered', function () {
                describe('and item did not change', function () {
                    beforeEach(function () {
                        scope.watches['item']();
                    });

                    it('changed state should be false', function () {
                        expect(scope.unchanged).toEqual(true);
                    });
                });

                describe('and item changed', function () {
                    beforeEach(function () {
                        scope.watches['item'](item, {});
                    });

                    it('changed state should be true', function () {
                        expect(scope.unchanged).toEqual(false);
                    });

                    it('and fires edit.mode.lock event', function () {
                        expect(topics['edit.mode.lock']).toEqual(scope.item.id);
                    });
                });
            });

            describe('and lockEditModeOnDirty is on config', function () {
                beforeEach(function () {
                    scope.watches = [];
                    scope.init(item, {lockEditModeOnDirty: false});
                });

                it('do not watch for changes', function () {
                    expect(scope.watches).toEqual([]);
                });
            });

            describe('on update', function () {
                beforeEach(function () {
                    scope.update();
                });

                it('perform write call', function () {
                    expect(writer.data().context).toEqual('update');
                    expect(writer.data().namespace).toEqual('namespace');
                    expect(writer.data().id).toEqual(item.id);
                    expect(writer.data().customField).toEqual(item.customField);
                });

                describe('success', function () {
                    beforeEach(function () {
                        pristine = false;
                        writer.success();
                    });

                    it('raise edit.mode.unlock notification', function () {
                        expect(topics['edit.mode.unlock']).toEqual(scope.item.id);
                    });

                    it('changed state should be false', function () {
                        expect(scope.unchanged).toEqual(true);
                    });

                    it('set form to pristine state', function () {
                        expect(pristine).toEqual(true);
                    });

                    describe('with registered success handler', function () {
                        var updatedItem;

                        beforeEach(function () {
                            scope.init(item, {
                                success: function (args) {
                                    updatedItem = args
                                }
                            });
                            writer.success();
                        });

                        describe('look up item by id', function () {
                            it('with id from scoped item', inject(function () {
                                expect(fixture.entity.calls.first().args[0]).toEqual(scope.item.id);
                            }));

                            describe('on find by id callback', function () {
                                var refreshedItem = {name: 'item-id-1'};

                                beforeEach(function () {
                                    fixture.entity.calls.first().args[1](refreshedItem);
                                });

                                it('test', inject(function () {
                                    expect(updatedItem).toEqual(refreshedItem);
                                }));
                            });
                        });
                    });
                });
            });

            describe('on update with params', function () {
                var params, beforeUpdate, success;

                beforeEach(function () {
                    params = {
                        beforeUpdate: function (items) {
                            beforeUpdate = items;
                        },
                        success: function (items) {
                            success = items;
                        }
                    };
                    scope.update(params);
                });

                it('beforeUpdate is called', function () {
                    expect(beforeUpdate.customField).toEqual(item.customField);
                });

                describe('success', function () {
                    beforeEach(function () {
                        writer.success();
                    });

                    it('success is called', function () {
                        expect(success.customField).toEqual(item.customField);
                    });
                });
            });

            describe('on cancel', function () {
                beforeEach(function () {
                    scope.items = [
                        {
                            id: 'item-id',
                            customField: 'custom-value'
                        }
                    ];
                    payload = {
                        id: 'item-id',
                        customField: 'custom-value'
                    };
                    scope.cancel();
                });

                it('request catalog item for that id', function () {
                    expect(fixture.entity.calls.first().args[0]).toEqual(scope.item.id);
                });

                describe('when catalog item received', function () {
                    beforeEach(function () {
                        scope.item.customField = 'modified';

                        fixture.entity.calls.first().args[1](payload);
                    });

                    it('refresh item on scope', function () {
                        expect(scope.item.id).toEqual(payload.id);
                        expect(scope.item.customField).toEqual(payload.customField);
                    });

                    it('item should be unchanged', function () {
                        expect(scope.unchanged).toEqual(true);
                    });

                    it('item watch should be reset', function () {
                        expect(unbindWatchCalled).toEqual(true);
                    });

                    it('raise edit.mode.unlock notification', function () {
                        expect(topics['edit.mode.unlock']).toEqual(scope.item.id);
                    });
                });

            });

            describe('on route change start notification and state is dirty', function () {
                beforeEach(function () {
                    scope.unchanged = false;
                    scope.$broadcast('$routeChangeStart');
                });

                it('raise edit.mode.unlock notification', function () {
                    expect(topics['edit.mode.unlock']).toEqual(scope.item.id);
                });
            });

            describe('on route change start notification and state is not dirty', function () {
                beforeEach(function () {
                    scope.unchanged = true;
                    scope.$broadcast('$routeChangeStart');
                });

                it('raise edit.mode.lock notification', function () {
                    expect(topics['edit.mode.unlock']).toBeUndefined();
                });
            });
        });

        it('masking fields on payload', function () {
            scope.init(
                {unmasked: 'original', masked1: 'original', masked2: 'original'},
                {mask: {masked1: 'masked', masked2: 'masked'}}
            );
            scope.update();
            expect(writer.data().unmasked).toEqual('original');
            expect(writer.data().masked1).toEqual('masked');
            expect(writer.data().masked2).toEqual('masked');
        });
    });

    describe('MoveCatalogItemController', function () {
        var session, writer, topics;

        beforeEach(inject(function (sessionStorage, updateCatalogItemWriterSpy, topicRegistryMock, topicMessageDispatcherMock) {
            session = sessionStorage;
            writer = updateCatalogItemWriterSpy;
            topics = topicRegistryMock;
            dispatcher = topicMessageDispatcherMock;
        }));

        describe('given at least 2 controllers initialized with their own item', function () {
            var ctrl1, ctrl2, scope1, scope2, onCutEventHandlers, onPasteEventHandlers;

            beforeEach(inject(function ($controller) {
                onCutEventHandlers = [];
                onPasteEventHandlers = [];
                scope1 = {};
                scope2 = {};
                ctrl1 = $controller(MoveCatalogItemController, {$scope: scope1});
                onCutEventHandlers.push(topics['catalog.item.cut']);
                onPasteEventHandlers.push(topics['catalog.item.paste']);
                ctrl2 = $controller(MoveCatalogItemController, {$scope: scope2});
                onCutEventHandlers.push(topics['catalog.item.cut']);
                onPasteEventHandlers.push(topics['catalog.item.paste']);
                scope1.init({id: 'item-1', priority: 1});
                scope2.init({id: 'item-2', priority: 2});
            }));

            it('then controllers are in idle mode', function () {
                expect(scope1.idle).toEqual(true);
                expect(scope2.idle).toEqual(true);
            });

            describe('when cutting an item', function () {
                beforeEach(function () {
                    scope1.cut();
                });

                it('then the item id is kept in session storage', function () {
                    expect(session.moveCatalogItemClipboard).toEqual('item-1');
                });

                it('raise catalog.item.cut', function () {
                    expect(dispatcher['catalog.item.cut']).toEqual('ok');
                });

                it('on catalog.item.cut exit idle mode', function () {
                    onCutEventHandlers.forEach(function (it) {
                        it();
                    });
                    expect(scope1.idle).toEqual(false);
                    expect(scope2.idle).toEqual(false);
                });

                describe('and pasting it on another', function () {
                    beforeEach(function () {
                        scope2.paste();
                    });

                    it('then priority is updated', function () {
                        expect(writer.data().treatInputAsId).toBe(false);
                        expect(writer.data().context).toEqual('updatePriority');
                        expect(writer.data().id.id).toEqual('item-1');
                        expect(writer.data().priority).toEqual(2);
                    });

                    it('no catalog.item.paste should be raised yet', function () {
                        expect(dispatcher['catalog.item.paste']).toBeUndefined()
                    });

                    describe('on success', function () {
                        beforeEach(function () {
                            writer.success();
                        });

                        it('raise catalog.item.paste event', function () {
                            expect(dispatcher['catalog.item.paste']).toEqual({id: 'item-1', priority: 2});
                        });

                        it('on catalog.item.paste enter idle mode', function () {
                            onPasteEventHandlers.forEach(function (it) {
                                it();
                            });
                            expect(scope1.idle).toEqual(true);
                            expect(scope2.idle).toEqual(true);
                        });
                    });
                });
            });
        });
    });

    describe('CatalogItemUpdatedDecorators', function () {
        var decorator;

        beforeEach(inject(function (catalogItemUpdatedDecorator) {
            decorator = catalogItemUpdatedDecorator;
        }));

        describe('when decorating', function () {
            it('return args by default', function () {
                expect(decorator({context: 'unregistered', id: 'I'})).toEqual({context: 'unregistered', id: 'I'});
            });

            describe('with a registered decorator', function () {
                it('test', function () {
                    expect(decorator({context: 'context'}).decorated).toBeTruthy();
                })
            });
        });
    });

    describe('on update catalog item', function () {
        var writer, onSuccessSpy, sut, args;

        beforeEach(inject(function (updateCatalogItem, updateCatalogItemWriterSpy, topicMessageDispatcherMock) {
            sut = updateCatalogItem;
            args = {
                data: {
                    id: 'item-id',
                    context: 'update-id'
                }
            };
            onSuccessSpy = jasmine.createSpy('onSuccessSpy');
            args.success = onSuccessSpy;
            writer = updateCatalogItemWriterSpy;
            dispatcher = topicMessageDispatcherMock;
            sut(args);
        }));

        it('invoke writer', function () {
            writer.invokedFor(args);
        });

        it('treat input as id is enabled by default', function () {
            expect(writer.data().treatInputAsId).toBeTruthy();
        });

        it('treat input as id can be overridden', function () {
            writer.spy.calls.reset();
            args.data.treatInputAsId = false;
            sut(args);
            expect(writer.data().treatInputAsId).toBeFalsy();
        });

        describe('on write success', function () {
            beforeEach(function () {
                writer.success();
            });

            it('raise system success', function () {
                expect(dispatcher['system.success']).toEqual({
                    code: 'catalog.item.updated',
                    default: 'Catalog item updated!'
                });
            });

            it('raise catalog item updated', function () {
                expect(dispatcher['catalog.item.updated']).toEqual(args.data);
            });

            it('execute on success handler', function () {
                expect(onSuccessSpy.calls.first()).toBeTruthy();
            });

            it('support updatePriority context', function () {
                args.data.context = 'updatePriority';
                args.data.id = {id: 'I'};
                writer.success();
                expect(dispatcher['catalog.item.updated']).toEqual({id: 'I'});
            })
        });

        describe('when success notification is disabled', function () {
            beforeEach(function () {
                args.successNotification = false;
                sut(args);
            });

            describe('on write success', function () {
                beforeEach(function () {
                    writer.success();
                });

                it('do not raise system success', function () {
                    expect(dispatcher['system.success']).toBeUndefined();
                });

                it('raise catalog item updated', function () {
                    expect(dispatcher['catalog.item.updated']).toEqual(args.data);
                });

                it('execute on success handler', function () {
                    expect(onSuccessSpy.calls.first()).toBeTruthy();
                });
            });
        });
    });

    describe('splitInRows directive', function () {
        var element, html, scope;

        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope.$new();
            scope.collection = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            html = '<div split-in-rows="collection" columns="3"></div>';
            element = angular.element(html);
            $compile(element)(scope);
        }));

        [
            {columns: 0, expected: []},
            {
                columns: 1, expected: [
                [1],
                [2],
                [3],
                [4],
                [5],
                [6],
                [7],
                [8],
                [9],
                [10]
            ]
            },
            {
                columns: 2, expected: [
                [1, 2],
                [3, 4],
                [5, 6],
                [7, 8],
                [9, 10]
            ]
            },
            {
                columns: 3, expected: [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9],
                [10]
            ]
            },
            {
                columns: 4, expected: [
                [1, 2, 3, 4],
                [5, 6, 7, 8],
                [9, 10]
            ]
            },
            {
                columns: 5, expected: [
                [1, 2, 3, 4, 5],
                [6, 7, 8, 9, 10]
            ]
            },
            {
                columns: 6, expected: [
                [1, 2, 3, 4, 5, 6],
                [7, 8, 9, 10]
            ]
            },
            {
                columns: 7, expected: [
                [1, 2, 3, 4, 5, 6, 7],
                [8, 9, 10]
            ]
            },
            {
                columns: 8, expected: [
                [1, 2, 3, 4, 5, 6, 7, 8],
                [9, 10]
            ]
            },
            {
                columns: 9, expected: [
                [1, 2, 3, 4, 5, 6, 7, 8, 9],
                [10]
            ]
            },
            {
                columns: 10, expected: [
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            ]
            }
        ].forEach(function (value) {
            describe('creates rows for collection', function () {
                beforeEach(inject(function ($rootScope, $compile) {
                    html = '<div split-in-rows="collection" columns="' + value.columns + '"></div>';
                    element = angular.element(html);
                    $compile(element)(scope);
                    scope.$digest();
                }));

                it('given column count ' + value.columns, function () {
                    expect(scope.rows).toEqual(value.expected);
                });
            });
        });

        it('when the collection is undefined', function () {
            scope.collection = undefined;
            scope.$digest();

            expect(scope.rows).toBeUndefined();
        });

        it('when the collection changes', function () {
            scope.collection.push(11);
            scope.collection.push(12);
            scope.collection.push(13);
            scope.$digest();

            expect(scope.rows).toEqual([
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9],
                [10, 11, 12],
                [13]
            ]);
        });
    });

    describe('movable-items directive', function () {
        var $scope, $compile;

        beforeEach(inject(function ($rootScope, _$compile_, topicRegistryMock) {
            $scope = $rootScope.$new();
            $compile = _$compile_;
            notifications = topicRegistryMock;

        }));

        it('directive receives default configuration values', function () {
            var element = $compile('<div movable-items></div>')($scope);
            expect(element.isolateScope().items).toEqual([]);
            expect(element.isolateScope().orientation).toEqual('asc');
            expect(element.isolateScope().when).toEqual(true);
        });

        it('directive can be configured', function () {
            $scope.items = ['one', 'two'];
            $scope.enabled = false;
            var element = $compile('<div movable-items="items" orientation="desc" when="enabled"></div>')($scope);
            expect(element.isolateScope().items).toEqual($scope.items);
            expect(element.isolateScope().orientation).toEqual('desc');
            expect(element.isolateScope().when).toEqual($scope.enabled);
        });

        describe('when directive is enabled for asc', function () {
            var element;

            beforeEach(function () {
                $scope.items = [
                    {id: 'I1', priority: 1},
                    {id: 'I2', priority: 2},
                    {id: 'I3', priority: 3}
                ];
                element = $compile('<div movable-items="items"></div>')($scope);
            });

            describe('and catalog.item.paste is fired', function () {
                it('first to middle', function () {
                    notifications['catalog.item.paste']({id: 'I1', priority: 2});
                    expect($scope.items[0]).toEqual({id: 'I2', priority: 1});
                    expect($scope.items[1]).toEqual({id: 'I1', priority: 2});
                    expect($scope.items[2]).toEqual({id: 'I3', priority: 3});
                });

                it('first to last', function () {
                    notifications['catalog.item.paste']({id: 'I1', priority: 3});
                    expect($scope.items[0]).toEqual({id: 'I2', priority: 1});
                    expect($scope.items[1]).toEqual({id: 'I3', priority: 2});
                    expect($scope.items[2]).toEqual({id: 'I1', priority: 3});
                });

                it('last to first', function () {
                    notifications['catalog.item.paste']({id: 'I3', priority: 1});
                    expect($scope.items[0]).toEqual({id: 'I3', priority: 1});
                    expect($scope.items[1]).toEqual({id: 'I1', priority: 2});
                    expect($scope.items[2]).toEqual({id: 'I2', priority: 3});
                });

                it('to self', function () {
                    notifications['catalog.item.paste']({id: 'I2', priority: 2});
                    expect($scope.items[0]).toEqual({id: 'I1', priority: 1});
                    expect($scope.items[1]).toEqual({id: 'I2', priority: 2});
                    expect($scope.items[2]).toEqual({id: 'I3', priority: 3});
                });
            });
        });

        describe('when directive is enabled for desc', function () {
            var element;

            beforeEach(function () {
                $scope.items = [
                    {id: 'I3', priority: 3},
                    {id: 'I2', priority: 2},
                    {id: 'I1', priority: 1}
                ];
                element = $compile('<div movable-items="items" orientation="desc"></div>')($scope);
            });

            describe('and catalog.item.paste is fired', function () {
                it('first to middle', function () {
                    notifications['catalog.item.paste']({id: 'I3', priority: 2});
                    expect($scope.items[0]).toEqual({id: 'I2', priority: 3});
                    expect($scope.items[1]).toEqual({id: 'I3', priority: 2});
                    expect($scope.items[2]).toEqual({id: 'I1', priority: 1});
                });

                it('first to last', function () {
                    notifications['catalog.item.paste']({id: 'I3', priority: 1});
                    expect($scope.items[0]).toEqual({id: 'I2', priority: 3});
                    expect($scope.items[1]).toEqual({id: 'I1', priority: 2});
                    expect($scope.items[2]).toEqual({id: 'I3', priority: 1});
                });

                it('last to first', function () {
                    notifications['catalog.item.paste']({id: 'I1', priority: 3});
                    expect($scope.items[0]).toEqual({id: 'I1', priority: 3});
                    expect($scope.items[1]).toEqual({id: 'I3', priority: 2});
                    expect($scope.items[2]).toEqual({id: 'I2', priority: 1});
                });

                it('to self', function () {
                    notifications['catalog.item.paste']({id: 'I2', priority: 2});
                    expect($scope.items[0]).toEqual({id: 'I3', priority: 3});
                    expect($scope.items[1]).toEqual({id: 'I2', priority: 2});
                    expect($scope.items[2]).toEqual({id: 'I1', priority: 1});
                });
            });
        });

    });

    describe('itemPinner', function () {
        var pinner, rest, config;
        var ctx;
        var isSuccess;

        beforeEach(inject(function (itemPinner, restServiceHandler, _config_) {
            pinner = itemPinner;
            rest = restServiceHandler;
            config = _config_;
            config.baseUri = 'base-uri/';
            rest.calls.reset();
            rest.and.returnValue('promise');
            ctx = {
                item: {
                    id: 1
                },
                success: function () {
                    isSuccess = true;
                }
            }
        }));

        function request() {
            return rest.calls.argsFor(0)[0];
        }

        describe('when pinning an item', function () {
            var returnValue;

            beforeEach(function () {
                returnValue = pinner.pin(ctx);
            });

            it('usecase request is sent', function () {
                expect(request().params.method).toEqual('POST');
                expect(request().params.withCredentials).toEqual(true);
                expect(request().params.url).toEqual(config.baseUri + 'api/usecase');
                expect(request().params.data.headers.usecase).toEqual('catalog.item.pin');
                expect(request().params.data.payload.id).toEqual(ctx.item.id);
            });

            it('returns rest promise', function () {
                expect(returnValue).toEqual('promise');
            });

            describe('on success', function () {
                beforeEach(function () {
                    request().success('data');
                });

                it('success handler is executed', function () {
                    expect(isSuccess).toEqual(true);
                });

                it('catalog.item.pinned events are fired', inject(function (topicMessageDispatcherMock) {
                    expect(topicMessageDispatcherMock['catalog.item.pinned']).toEqual(ctx.item);
                    expect(topicMessageDispatcherMock['catalog.item.pinned.' + ctx.item.id]).toEqual(ctx.item);
                }))
            });
        });

        describe('when unpinning an item', function () {
            var returnValue;

            beforeEach(function () {
                returnValue = pinner.unpin(ctx);
            });

            it('usecase request is sent', function () {
                expect(request().params.method).toEqual('POST');
                expect(request().params.withCredentials).toEqual(true);
                expect(request().params.url).toEqual(config.baseUri + 'api/usecase');
                expect(request().params.data.headers.usecase).toEqual('catalog.item.unpin');
                expect(request().params.data.payload.id).toEqual(ctx.item.id);
            });

            it('returns rest promise', function () {
                expect(returnValue).toEqual('promise');
            });

            describe('on success', function () {
                beforeEach(function () {
                    request().success('data');
                });

                it('success handler is executed', function () {
                    expect(isSuccess).toEqual(true);
                });

                it('catalog.item.unpinned events are fired', inject(function (topicMessageDispatcherMock) {
                    expect(topicMessageDispatcherMock['catalog.item.unpinned']).toEqual(ctx.item);
                    expect(topicMessageDispatcherMock['catalog.item.unpinned.' + ctx.item.id]).toEqual(ctx.item);
                }))
            });
        });
    });

    describe('PinItemController', function () {
        var ctrl, pinner, item;

        beforeEach(inject(function ($controller, itemPinner, $rootScope) {
            spyOn(itemPinner, 'pin');
            spyOn(itemPinner, 'unpin');
            ctrl = $controller('PinItemController', {$scope: $rootScope.$new()});
            item = {
                id: 1
            };
            ctrl.init(item);
        }));

        describe('when pinning', function () {
            beforeEach(function () {
                ctrl.pin();
            });

            it('call the item pinner', inject(function (itemPinner) {
                expect(itemPinner.pin.calls.argsFor(0)[0].item.id).toEqual(item.id);
            }));

            describe('with success', function () {
                beforeEach(inject(function (itemPinner) {
                    itemPinner.pin.calls.argsFor(0)[0].success();
                }));

                it('the item is flagged as pinned', function () {
                    expect(item.pinned).toBe(true);
                })
            });
        });

        describe('when unpinning', function () {
            beforeEach(function () {
                ctrl.unpin();
            });

            it('call the item pinner', inject(function (itemPinner) {
                expect(itemPinner.unpin.calls.argsFor(0)[0].item.id).toEqual(item.id);
            }));

            describe('with success', function () {
                beforeEach(inject(function (itemPinner) {
                    itemPinner.unpin.calls.argsFor(0)[0].success();
                }));

                it('the item is flagged as not pinned', function () {
                    expect(item.pinned).toBe(false);
                })
            });
        });

        it('when another controller for the same item pins we need to update the flag', inject(function (topicRegistryMock) {
            topicRegistryMock['catalog.item.pinned.' + item.id](item);
            expect(item.pinned).toBe(true);
        }));

        it('when another controller for the same item unpins we need to update the flag', inject(function (topicRegistryMock) {
            topicRegistryMock['catalog.item.unpinned.' + item.id](item);
            expect(item.pinned).toBe(false);
        }))
    });

    describe('binSpotlightController', function () {
        var component, location;
        var binarta = {
            application: {
                config: {
                    findPublic: jasmine.createSpy('findPublic'),
                    observePublic: jasmine.createSpy('observePublic')
                }
            },
            schedule: function (fn) {
                this.scheduledFn = fn;
            }
        };
        var configWriter = jasmine.createSpy('configWriter');
        var disconnectObserver = jasmine.createSpy('disconnectObserver');

        beforeEach(inject(function ($controller, $location) {
            location = $location;
            component = $controller('binSpotlightController', {binarta: binarta, configWriter: configWriter});
            component.type = 'type';
            binarta.application.config.findPublic.calls.reset();
            binarta.application.config.observePublic.calls.reset();
            configWriter.calls.reset();
            disconnectObserver.calls.reset();
            binarta.application.config.observePublic.and.returnValue({disconnect: disconnectObserver});
        }));

        it('total item count initializes to 0', function () {
            expect(component.totalItemCount).toEqual(0);
        });

        describe('$onInit', function () {
            beforeEach(function () {
                component.$onInit();
            });

            describe('and edit.mode was fired', function () {
                beforeEach(inject(function (topicRegistryMock) {
                    topicRegistryMock['edit.mode'](true);
                }));

                it('then editing flag is updated', function () {
                    expect(component.editing).toBe(true);
                })
            });

            describe('and scheduled action was executed', function () {
                beforeEach(function () {
                    binarta.scheduledFn();
                });

                it('public config was consulted', function () {
                    expect(binarta.application.config.findPublic.calls.argsFor(0)[0]).toEqual('catalog.type.recent.items');
                });

                describe('and public config results are triggered', function () {
                    beforeEach(function () {
                        binarta.application.config.findPublic.calls.argsFor(0)[1]('true');
                    });

                    it('then flags are set', function () {
                        expect(component.recentItems).toBe(true);
                    });

                    describe('and recent items are toggled', function () {
                        beforeEach(function () {
                            component.toggleRecentItems();
                        });

                        it('then the flag is updated', function () {
                            expect(component.recentItems).toBe(false);
                        });

                        it('and config is written', function () {
                            expect(configWriter.calls.argsFor(0)[0]).toEqual({
                                key: 'catalog.type.recent.items',
                                value: component.recentItems,
                                scope: 'public'
                            });
                        });
                    });
                });

                describe('and public config results are triggered with boolean', function () {
                    beforeEach(function () {
                        binarta.application.config.findPublic.calls.argsFor(0)[1](true);
                    });

                    it('then flags are set', function () {
                        expect(component.recentItems).toBe(true);
                    });
                });

                describe('and $onDestroy', function () {
                    beforeEach(function () {
                        component.$onDestroy();
                    });

                    it('unsubscribed from edit.mode', inject(function (topicRegistryMock) {
                        expect(topicRegistryMock['edit.mode']).toBeUndefined();
                    }));
                });
            });

            it('on go to overview', function () {
                component.goToOverview();
                expect(location.path()).toEqual('/lang/browse/type/');
            });
        });

        it('total item count can be manipulated', function () {
            component.plus({size: 1});
            expect(component.totalItemCount).toEqual(1);
        });

        it('pinned item count can be manipulated', function () {
            component.plus({size: 1, isPinned: true});
            expect(component.pinnedItemCount).toEqual(1);
        });
    });

    describe('binSpotlightItemsController', function () {
        var $ctrl;
        var visibleXs;
        var viewport = {
            visibleXs: function () {
                return visibleXs;
            }
        };
        var search;

        beforeEach(inject(function ($controller, binartaSearch) {
            $ctrl = $controller('binSpotlightItemsController', {viewport: viewport});

            $ctrl.spotlightCtrl = {
                type: 'type',
                plus: jasmine.createSpy('plus')
            };

            visibleXs = false;
            search = binartaSearch;
        }));

        function args() {
            return search.calls.argsFor(0)[0];
        }

        describe('$onInit', function () {
            beforeEach(function () {
                $ctrl.$onInit();
            });

            it('default template is set', function () {
                expect($ctrl.templateUrl).toEqual('bin-catalog-item-list-default.html');
            });

            it('results are initialized to empty list', function () {
                expect($ctrl.results.length).toEqual(0);
            });

            describe('on edit.mode was fired', function () {
                beforeEach(inject(function (topicRegistryMock) {
                    topicRegistryMock['edit.mode'](true);
                }));

                it('then editing flag is updated', function () {
                    expect($ctrl.editing).toBe(true);
                })
            });

            it('search is executed', function () {
                expect(args().entity).toEqual('catalog-item');
                expect(args().action).toEqual('search');
                expect(args().subset).toEqual({
                    offset: 0,
                    count: 8
                });
                expect(args().includeCarouselItems).toBe(true);
                expect(args().sortings).toEqual([
                    {on: 'creationTime', orientation: 'desc'}
                ]);
                expect(args().filters).toEqual({
                    type: $ctrl.spotlightCtrl.type
                });
                expect(args().complexResult).toBe(true);
            });

            it('when viewport is for small device we limit to search pages of 6 items', function () {
                visibleXs = true;
                search.calls.reset();
                $ctrl.$onInit();
                expect(args().subset.count).toEqual(6);
            });

            describe('with success', function () {
                var items;

                beforeEach(function () {
                    items = [
                        {id: 1},
                        {id: 2}
                    ];
                    search.calls.argsFor(0)[0].success({
                        hasMore: true,
                        results: items
                    });
                });

                it('then items are exposed', function () {
                    expect($ctrl.results).toEqual(items);
                });

                it('search for more flag is exposed', function () {
                    expect($ctrl.searchForMore).toBe(true);
                });

                it('and item count is sent to parent ctrl', function () {
                    expect($ctrl.spotlightCtrl.plus).toHaveBeenCalledWith({size: items.length, isPinned: false});
                });

                describe('and component is destroyed', function () {
                    beforeEach(function () {
                        $ctrl.$onDestroy();
                    });

                    it('negative item count is sent to parent ctrl', function () {
                        expect($ctrl.spotlightCtrl.plus).toHaveBeenCalledWith({size: -items.length, isPinned: false});
                    });
                });
            });

        });

        describe('$onInit with pinned configuration', function () {
            var items;

            beforeEach(function () {
                items = [
                    {id: 1},
                    {id: 2}
                ];
                $ctrl.pinned = 'true';
                $ctrl.$onInit();
                search.calls.argsFor(0)[0].success({
                    hasMore: true,
                    results: items
                })
            });

            it('search for more is always true', function () {
                expect($ctrl.searchForMore).toBe(true);
            });

            it('search is filtered by pinned', function () {
                expect(args().filters.pinned).toBe(true);
            });

            it('topic handlers are installed', inject(function (topicRegistryMock) {
                expect(topicRegistryMock['catalog.item.pinned']).toBeDefined();
                expect(topicRegistryMock['catalog.item.unpinned']).toBeDefined();
            }));

            it('and item count is sent to parent ctrl', function () {
                expect($ctrl.spotlightCtrl.plus).toHaveBeenCalledWith({size: items.length, isPinned: true});
            });

            describe('and catalog.item.pinned event is received', function () {
                beforeEach(inject(function (topicRegistryMock) {
                    topicRegistryMock['catalog.item.pinned']({id: 3, type: 'type'});
                }));

                it('item is added to the list', function () {
                    expect($ctrl.results[2]).toEqual({id: 3, type: 'type'})
                });

                it('and increase item count by 1 on parent', function () {
                    expect($ctrl.spotlightCtrl.plus).toHaveBeenCalledWith({size: 1, isPinned: true});
                });

                it('when item.pinned is received for wrong type do not add to list', inject(function (topicRegistryMock) {
                    $ctrl.spotlightCtrl.plus.calls.reset();
                    topicRegistryMock['catalog.item.pinned']({id: 4, type: 'wrong'});
                    expect($ctrl.results.length).toBe(3);
                    expect($ctrl.spotlightCtrl.plus).not.toHaveBeenCalled();
                }));

                describe('and catalog.item.unpinned event is received', function () {
                    beforeEach(inject(function (topicRegistryMock) {
                        topicRegistryMock['catalog.item.unpinned']({id: 3});
                    }));

                    it('item is removed again', function () {
                        expect($ctrl.results.length).toEqual(2);
                    });

                    it('and decrease item count by 1 on parent', function () {
                        expect($ctrl.spotlightCtrl.plus).toHaveBeenCalledWith({size: -1, isPinned: true});
                    });
                });

                describe('and $onDestroy', function () {
                    beforeEach(function () {
                        $ctrl.$onDestroy();
                    });

                    it('then topic handlers are uninstalled', inject(function (topicRegistryMock) {
                        expect(topicRegistryMock['catalog.item.pinned']).toBeUndefined();
                        expect(topicRegistryMock['catalog.item.unpinned']).toBeUndefined();
                    }));

                    it('negative item count is sent to parent ctrl', function () {
                        expect($ctrl.spotlightCtrl.plus).toHaveBeenCalledWith({size: -items.length, isPinned: true});
                    });
                });
            });
        });

        describe('$onInit with specific template', function () {
            beforeEach(function () {
                $ctrl.spotlightCtrl.itemTemplateUrl = 'custom.html';
                $ctrl.$onInit();
            });

            it('custom template is set', function () {
                expect($ctrl.templateUrl).toEqual('custom.html');
            });
        });

        describe('$onInit with cols setting', function () {
            beforeEach(function () {
                $ctrl.spotlightCtrl.cols = 'xs-12 sm-6';
                $ctrl.$onInit();
            });

            it('cols property is set', function () {
                expect($ctrl.cols).toEqual('xs-12 sm-6');
            });
        });

        describe('$onInit with center setting', function () {
            beforeEach(function () {
                $ctrl.spotlightCtrl.center = 'true';
                $ctrl.$onInit();
            });

            it('center property is set', function () {
                expect($ctrl.center).toEqual('true');
            });
        });
    });

    describe('binCatalogItemList component', function () {
        var $componentController, $ctrl, bindings, items, writer;

        beforeEach(inject(function (_$componentController_, updateCatalogItemWriter) {
            $componentController = _$componentController_;
            writer = updateCatalogItemWriter;
            items = [
                {id: 1, priority: 3},
                {id: 2, priority: 2},
                {id: 3, priority: 1}
            ];
            bindings = {
                items: items
            };
        }));

        describe('and items are not movable', function () {
            beforeEach(function () {
                $ctrl = $componentController('binCatalogItemList', null, bindings);
                $ctrl.$onInit();
            });

            it('move actions are not available', function () {
                expect($ctrl.moveUp).toBeUndefined();
                expect($ctrl.moveDown).toBeUndefined();
                expect($ctrl.moveTop).toBeUndefined();
                expect($ctrl.moveBottom).toBeUndefined();
            });
        });

        describe('and items are movable', function () {
            beforeEach(function () {
                bindings.movable = 'true';
                $ctrl = $componentController('binCatalogItemList', null, bindings);
                $ctrl.$onInit();
            });

            describe('on move up', function () {
                var done;

                beforeEach(function () {
                    $ctrl.moveUp(items[2]).finally(function () {
                        done = true;
                    });
                });

                it('update item priority', function () {
                    expect(writer).toHaveBeenCalledWith({
                        data: {
                            treatInputAsId: false,
                            context: 'updatePriority',
                            id: {id: 3},
                            priority: 2
                        },
                        success: jasmine.any(Function)
                    });
                });

                describe('on update success', function () {
                    beforeEach(function () {
                        writer.calls.mostRecent().args[0].success();
                    });

                    it('item are reprioritized and sorted', function () {
                        expect(items).toEqual([
                            {id: 1, priority: 3},
                            {id: 3, priority: 2},
                            {id: 2, priority: 1}
                        ]);
                    });

                    it('promise is resolved', function () {
                        expect(done).toBeTruthy();
                    });
                });
            });

            describe('on move first item up', function () {
                beforeEach(function () {
                    $ctrl.moveUp(items[0]);
                });

                it('item is not updated', function () {
                    expect(writer).not.toHaveBeenCalled();
                });
            });

            describe('on move down', function () {
                var done;

                beforeEach(function () {
                    $ctrl.moveDown(items[0]).finally(function () {
                        done = true;
                    });
                });

                it('update item priority', function () {
                    expect(writer).toHaveBeenCalledWith({
                        data: {
                            treatInputAsId: false,
                            context: 'updatePriority',
                            id: {id: 1},
                            priority: 2
                        },
                        success: jasmine.any(Function)
                    });
                });

                describe('on update success', function () {
                    beforeEach(function () {
                        writer.calls.mostRecent().args[0].success();
                    });

                    it('item are reprioritized and sorted', function () {
                        expect(items).toEqual([
                            {id: 2, priority: 3},
                            {id: 1, priority: 2},
                            {id: 3, priority: 1}
                        ]);
                    });

                    it('promise is resolved', function () {
                        expect(done).toBeTruthy();
                    });
                });
            });

            describe('on move last item down', function () {
                beforeEach(function () {
                    $ctrl.moveDown(items[2]);
                });

                it('item is not updated', function () {
                    expect(writer).not.toHaveBeenCalled();
                });
            });

            describe('on move to top', function () {
                var done;

                beforeEach(function () {
                    $ctrl.moveTop(items[2]).finally(function () {
                        done = true;
                    });
                });

                it('update item priority', function () {
                    expect(writer).toHaveBeenCalledWith({
                        data: {
                            treatInputAsId: false,
                            context: 'updatePriority',
                            id: {id: 3},
                            priority: 3
                        },
                        success: jasmine.any(Function)
                    });
                });

                describe('on update success', function () {
                    beforeEach(function () {
                        writer.calls.mostRecent().args[0].success();
                    });

                    it('item are reprioritized and sorted', function () {
                        expect(items).toEqual([
                            {id: 3, priority: 3},
                            {id: 1, priority: 2},
                            {id: 2, priority: 1}
                        ]);
                    });

                    it('promise is resolved', function () {
                        expect(done).toBeTruthy();
                    });
                });
            });

            describe('on move first item to top', function () {
                beforeEach(function () {
                    $ctrl.moveTop(items[0]);
                });

                it('item is not updated', function () {
                    expect(writer).not.toHaveBeenCalled();
                });
            });

            describe('on move to bottom', function () {
                var done;

                beforeEach(function () {
                    $ctrl.moveBottom(items[0]).finally(function () {
                        done = true;
                    });
                });

                it('update item priority', function () {
                    expect(writer).toHaveBeenCalledWith({
                        data: {
                            treatInputAsId: false,
                            context: 'updatePriority',
                            id: {id: 1},
                            priority: 1
                        },
                        success: jasmine.any(Function)
                    });
                });

                describe('on update success', function () {
                    beforeEach(function () {
                        writer.calls.mostRecent().args[0].success();
                    });

                    it('item are reprioritized and sorted', function () {
                        expect(items).toEqual([
                            {id: 2, priority: 3},
                            {id: 3, priority: 2},
                            {id: 1, priority: 1}
                        ]);
                    });

                    it('promise is resolved', function () {
                        expect(done).toBeTruthy();
                    });
                });
            });

            describe('on move last item to bottom', function () {
                beforeEach(function () {
                    $ctrl.moveBottom(items[2]);
                });

                it('item is not updated', function () {
                    expect(writer).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe('binCatalogListItem component', function () {
        var $componentController, $ctrl, listCtrl;

        beforeEach(inject(function (_$componentController_) {
            $componentController = _$componentController_;
            listCtrl = {
                moveUp: jasmine.createSpy().and.returnValue(true),
                moveDown: jasmine.createSpy().and.returnValue(true),
                moveTop: jasmine.createSpy().and.returnValue(true),
                moveBottom: jasmine.createSpy().and.returnValue(true)
            };
            $ctrl = $componentController('binCatalogListItem', null, {item: 'item'});
            $ctrl.listCtrl = listCtrl;
        }));

        it('with default template', function () {
            $ctrl.$onInit();
            expect($ctrl.templateUrl).toEqual('bin-catalog-item-list-default.html');
        });

        it('with specific template', function () {
            $ctrl.listCtrl.itemTemplateUrl = 'custom.html';
            $ctrl.$onInit();
            expect($ctrl.templateUrl).toEqual('custom.html');
        });

        describe('and items are not movable', function () {
            beforeEach(function () {
                $ctrl.$onInit();
            });

            it('move actions are not available', function () {
                expect($ctrl.moveUp).toBeUndefined();
                expect($ctrl.moveDown).toBeUndefined();
                expect($ctrl.moveTop).toBeUndefined();
                expect($ctrl.moveBottom).toBeUndefined();
            });
        });

        describe('and items are movable', function () {
            beforeEach(function () {
                listCtrl.movable = 'true';
                $ctrl.$onInit();
            });

            it('on move up', function () {
                var actual = $ctrl.moveUp();
                expect(listCtrl.moveUp).toHaveBeenCalledWith('item');
                expect(actual).toBeTruthy();
            });

            it('on move down', function () {
                var actual = $ctrl.moveDown();
                expect(listCtrl.moveDown).toHaveBeenCalledWith('item');
                expect(actual).toBeTruthy();
            });

            it('on move to top', function () {
                var actual = $ctrl.moveTop();
                expect(listCtrl.moveTop).toHaveBeenCalledWith('item');
                expect(actual).toBeTruthy();
            });

            it('on move to bottom', function () {
                var actual = $ctrl.moveBottom();
                expect(listCtrl.moveBottom).toHaveBeenCalledWith('item');
                expect(actual).toBeTruthy();
            });
        });
    });


    describe('binCatalogItemPublisher service', function () {
        var sut, item, editModeRendererMock, currentTime, updater;

        beforeEach(inject(function (binCatalogItemPublisher, editModeRenderer, updateCatalogItemWriter) {
            sut = binCatalogItemPublisher;
            editModeRendererMock = editModeRenderer;
            updater = updateCatalogItemWriter;
            updater.and.returnValue('promise');
            item = {
                id: 'id',
                type: 'type',
                blogType: 'blog-type'
            };
        }));

        describe('on publish', function () {
            var scope;

            beforeEach(function () {
                currentTime = moment();
                sut.publish(item);
                scope = editModeRendererMock.open.calls.mostRecent().args[0].scope;
            });

            it('edit-mode renderer is opened', function () {
                expect(editModeRendererMock.open).toHaveBeenCalled();
            });

            it('publication time is on scope and set to current date and time', function () {
                expect(scope.publicationTime).toEqual(currentTime);
            });

            it('on cancel', function () {
                scope.cancel();
                expect(editModeRendererMock.close).toHaveBeenCalled();
            });

            describe('on submit', function () {
                var newTime = 'May 31, 2016 10:00 AM', newTimeFormatted;

                beforeEach(function () {
                    newTimeFormatted = moment(newTime, 'lll').format();
                    scope.publicationTime = newTime;
                    scope.submit();
                });

                it('is working', function () {
                    expect(scope.working).toBeTruthy();
                });

                it('item update is requested', function () {
                    expect(updater).toHaveBeenCalledWith({
                        data: {
                            treatInputAsId: false,
                            context: 'update',
                            id: item.id,
                            type: item.type,
                            blogType: item.blogType,
                            status: 'published',
                            publicationTime: newTimeFormatted
                        },
                        success: jasmine.any(Function),
                        error: jasmine.any(Function)
                    });
                });

                describe('on error', function () {
                    beforeEach(function () {
                        updater.calls.mostRecent().args[0].error();
                    });

                    it('show violation', function () {
                        expect(scope.violation).toBeTruthy();
                    });

                    it('not working', function () {
                        expect(scope.working).toBeFalsy();
                    });
                });

                describe('on success', function () {
                    beforeEach(function () {
                        updater.calls.mostRecent().args[0].success();
                    });

                    it('item is updated', function () {
                        expect(item.status).toEqual('published');
                        expect(item.publicationTime).toEqual(newTimeFormatted);
                    });

                    it('edit-mode renderer is closed', function () {
                        expect(editModeRendererMock.close).toHaveBeenCalled();
                    });
                });
            });
        });

        describe('on publish with previous publication time', function () {
            var scope, time = '2016-05-31T08:00:00Z';

            beforeEach(function () {
                currentTime = moment();
                item.publicationTime = time;
                sut.publish(item);
                scope = editModeRendererMock.open.calls.mostRecent().args[0].scope;
            });

            it('publication time is on scope', function () {
                expect(scope.publicationTime).toEqual(moment(time));
            });
        });

        describe('on unpublish', function () {
            var returned;

            beforeEach(function () {
                returned = sut.unpublish(item);
            });

            it('item update is requested', function () {
                expect(updater).toHaveBeenCalledWith({
                    data: {
                        treatInputAsId: false,
                        context: 'update',
                        id: item.id,
                        type: item.type,
                        blogType: item.blogType,
                        status: 'draft'
                    },
                    success: jasmine.any(Function)
                });
            });

            it('on success, update item', function () {
                updater.calls.mostRecent().args[0].success();
                expect(item.status).toEqual('draft');
            });

            it('propagate promise from updater', function () {
                expect(returned).toEqual('promise');
            });
        });
    });

    describe('binCatalogList component', function () {
        var $ctrl, $componentController, $routeParams, search;
        var type = 'type';
        var partition = 'partition';
        var defaultCount = 50;

        beforeEach(inject(function (_$componentController_, _$routeParams_, binartaSearch) {
            $componentController = _$componentController_;
            $routeParams = _$routeParams_;
            search = binartaSearch;
        }));

        describe('when type is not given', function () {
            describe('with catalog route params', function () {
                beforeEach(function () {
                    $routeParams.d0 = 'type';
                    $routeParams.d1 = 'p1';
                    $routeParams.d2 = 'p2';
                    $ctrl = $componentController('binCatalogList', null, {});
                    $ctrl.$onInit();
                });

                it('parse type and partition from route', function () {
                    expect($ctrl.type).toEqual('type');
                    expect($ctrl.partition).toEqual('/type/p1/p2/');
                });
            });

            describe('with type route param', function () {
                beforeEach(function () {
                    $routeParams.type = 'type';
                    $ctrl = $componentController('binCatalogList', null, {});
                    $ctrl.$onInit();
                });

                it('parse type and partition from route', function () {
                    expect($ctrl.type).toEqual('type');
                    expect($ctrl.partition).toEqual('/');
                });
            });
        });

        describe('when type is given', function () {
            beforeEach(function () {
                $ctrl = $componentController('binCatalogList', null, {type: type});
                $ctrl.$onInit();
            });

            it('type is available on controller', function () {
                expect($ctrl.type).toEqual(type);
            });

            it('no items yet', function () {
                expect($ctrl.items.length).toEqual(0);
            });

            it('items are requested', function () {
                expect(search).toHaveBeenCalledWith({
                    action: 'search',
                    entity: 'catalog-item',
                    filters: {
                        type: type
                    },
                    sortings: [{
                        on: 'partition',
                        orientation: 'asc'
                    }, {
                        on: 'priority',
                        orientation: 'desc'
                    }],
                    subset: {
                        count: defaultCount,
                        offset: 0
                    },
                    includeCarouselItems: true,
                    complexResult: true,
                    success: jasmine.any(Function),
                    rejected: jasmine.any(Function)
                });
            });

            it('is working', function () {
                expect($ctrl.isWorking()).toBeTruthy();
            });

            it('triggering search again while working does nothing', function () {
                $ctrl.searchMore();
                expect(search.calls.count()).toEqual(1);
            });

            describe('on success', function () {
                var items = [
                    {id: 1, priority: 3},
                    {id: 2, priority: 2},
                    {id: 3, priority: 1}
                ];

                beforeEach(function () {
                    search.calls.mostRecent().args[0].success({
                        hasMore: true,
                        results: items
                    });
                });

                it('new items are added', function () {
                    expect($ctrl.items).toEqual(items);
                });

                it('more items are available', function () {
                    expect($ctrl.hasMore()).toBeTruthy();
                });

                it('not working', function () {
                    expect($ctrl.isWorking()).toBeFalsy();
                });

                describe('on search again', function () {
                    beforeEach(function () {
                        $ctrl.searchMore();
                    });

                    it('new items are requested with an offset', function () {
                        expect(search.calls.mostRecent().args[0].subset).toEqual({
                            count: defaultCount,
                            offset: defaultCount
                        });
                    });

                    describe('when no more new items', function () {
                        beforeEach(function () {
                            search.calls.mostRecent().args[0].success({
                                hasMore: false,
                                results: []
                            });
                        });

                        it('search again does nothing', function () {
                            search.calls.reset();
                            $ctrl.searchMore();
                            expect(search).not.toHaveBeenCalled();
                        });
                    });
                });

                describe('on new search', function () {
                    var previousItems;

                    beforeEach(function () {
                        previousItems = $ctrl.items;
                        $ctrl.search();
                    });

                    it('new items are requested and offset is reset', function () {
                        expect(search.calls.mostRecent().args[0].subset).toEqual({
                            count: defaultCount,
                            offset: 0
                        });
                    });

                    it('more items check is reset', function () {
                        expect($ctrl.hasMore()).toBeFalsy();
                    });

                    describe('on success', function () {
                        var newItems;

                        beforeEach(function () {
                            newItems = [{id: 'new'}];
                            search.calls.mostRecent().args[0].success({
                                hasMore: false,
                                results: newItems
                            });
                        });

                        it('items are replaced', function () {
                            expect($ctrl.items).toEqual(newItems);
                        });

                        it('reference to items is not changed', function () {
                            expect($ctrl.items).toBe(previousItems);
                        });
                    });
                });
            });

            describe('on rejected', function () {
                beforeEach(function () {
                    search.calls.mostRecent().args[0].rejected();
                });

                it('not working', function () {
                    expect($ctrl.isWorking()).toBeFalsy();
                });
            });
        });

        describe('when type and partition are given', function () {
            beforeEach(function () {
                $ctrl = $componentController('binCatalogList', null, {
                    type: type,
                    partition: partition
                });
                $ctrl.$onInit();
            });

            it('catalog properties are available on controller', function () {
                expect($ctrl.type).toEqual(type);
                expect($ctrl.partition).toEqual(partition);
            });

            it('items are requested', function () {
                expect(search).toHaveBeenCalledWith({
                    action: 'search',
                    entity: 'catalog-item',
                    filters: {
                        type: type,
                        partition: partition
                    },
                    sortings: [{
                        on: 'partition',
                        orientation: 'asc'
                    }, {
                        on: 'priority',
                        orientation: 'desc'
                    }],
                    subset: {
                        count: defaultCount,
                        offset: 0
                    },
                    includeCarouselItems: true,
                    complexResult: true,
                    success: jasmine.any(Function),
                    rejected: jasmine.any(Function)
                });
            });
        });

        describe('when requesting partitions recursively', function () {
            beforeEach(function () {
                $ctrl = $componentController('binCatalogList', null, {
                    type: type,
                    partition: partition,
                    recursivelyByPartition: 'true'
                });
                $ctrl.$onInit();
            });

            it('items are requested', function () {
                expect(search.calls.mostRecent().args[0].filters).toEqual({
                    type: type,
                    recursivelyByPartition: partition
                });
            });
        });

        describe('when requesting with a custom count', function () {
            beforeEach(function () {
                $ctrl = $componentController('binCatalogList', null, {
                    type: type,
                    partition: partition,
                    count: '20'
                });
                $ctrl.$onInit();
            });

            it('items are requested', function () {
                expect(search.calls.mostRecent().args[0].subset).toEqual({
                    count: 20,
                    offset: 0
                });
            });
        });

        describe('when requesting with a query parameter', function () {
            var searchParam;

            beforeEach(function () {
                searchParam = 'search';
                location.search().q = searchParam;
                $ctrl = $componentController('binCatalogList', null, {type: type});
                $ctrl.$onInit();
            });

            it('items are requested', function () {
                expect(search).toHaveBeenCalledWith({
                    action: 'search',
                    entity: 'catalog-item',
                    filters: {
                        type: type
                    },
                    q: searchParam,
                    sortings: [{
                        on: 'partition',
                        orientation: 'asc'
                    }, {
                        on: 'priority',
                        orientation: 'desc'
                    }],
                    subset: {
                        count: defaultCount,
                        offset: 0
                    },
                    includeCarouselItems: true,
                    complexResult: true,
                    success: jasmine.any(Function),
                    rejected: jasmine.any(Function)
                });
            });
        });
    });

    describe('binCatalogPartitions component', function () {
        var $ctrl, $timeout, findCatalogPartitionsMock, partitions, topicsMock;

        beforeEach(inject(function ($componentController, _$timeout_, topicRegistryMock) {
            $timeout = _$timeout_;
            binarta.checkpoint.gateway.permissions = [];
            binarta.checkpoint.registrationForm.submit({username: 'u', password: 'p', email: 'e'});
            findCatalogPartitionsMock = jasmine.createSpy('spy');
            topicsMock = topicRegistryMock;
            $ctrl = $componentController('binCatalogPartitions', {
                findCatalogPartitions: findCatalogPartitionsMock
            });
            partitions = ['1', '2', '3'];
        }));

        describe('with listCtrl', function () {
            beforeEach(function () {
                $ctrl.listCtrl = {
                    partition: 'partition',
                    parent: 'parent'
                };
                $ctrl.$onInit();
            });

            it('set values from listCtrl', function () {
                expect($ctrl.partition).toEqual('partition');
                expect($ctrl.parent).toEqual('parent');
            });
        });

        describe('with partition', function () {
            beforeEach(function () {
                $ctrl.partition = 'partition';
                $ctrl.$onInit();
            });

            it('sub-partitions are requested', function () {
                expect(findCatalogPartitionsMock).toHaveBeenCalledWith({
                    query: 'ownedBy',
                    filters: {owner: 'partition'},
                    success: jasmine.any(Function)
                });
            });

            describe('on success', function () {
                beforeEach(function () {
                    findCatalogPartitionsMock.calls.mostRecent().args[0].success(partitions);
                });

                it('partitions are added', function () {
                    expect($ctrl.partitions).toEqual(partitions);
                });
            });
        });

        describe('when no partitions', function () {
            beforeEach(function () {
                $ctrl.$onInit();
            });

            describe('and is on root', function () {
                beforeEach(function () {
                    $ctrl.parent = '/';
                });

                it('is on root', function () {
                    expect($ctrl.isOnRoot()).toBeTruthy();
                });

                it('partition list should not be visible', function () {
                    expect($ctrl.isPartitionListVisible()).toBeFalsy();
                });

                describe('and is in edit mode', function () {
                    beforeEach(function () {
                        topicsMock['edit.mode'](true);
                    });

                    it('partition list should be visible', function () {
                        expect($ctrl.isPartitionListVisible()).toBeTruthy();
                    });
                });
            });

            describe('and is not on root', function () {
                beforeEach(function () {
                    $ctrl.parent = '/p/';
                });

                it('is on root', function () {
                    expect($ctrl.isOnRoot()).toBeFalsy();
                });

                it('partition list should be visible', function () {
                    expect($ctrl.isPartitionListVisible()).toBeTruthy();
                });
            });
        });

        describe('with partitions', function () {
            beforeEach(function () {
                $ctrl.$onInit();
                $ctrl.partitions = partitions;
            });

            describe('and is on root', function () {
                beforeEach(function () {
                    $ctrl.parent = '/';
                });

                it('is on root', function () {
                    expect($ctrl.isOnRoot()).toBeTruthy();
                });

                it('partition list should be visible', function () {
                    expect($ctrl.isPartitionListVisible()).toBeTruthy();
                });
            });

            describe('and is not on root', function () {
                beforeEach(function () {
                    $ctrl.parent = '/p/';
                });

                it('is on root', function () {
                    expect($ctrl.isOnRoot()).toBeFalsy();
                });

                it('partition list should be visible', function () {
                    expect($ctrl.isPartitionListVisible()).toBeTruthy();
                });
            });

            it('add partition is not yet possible', function () {
                expect($ctrl.isAddAllowed()).toBeFalsy();
            });

            describe('when in edit mode', function () {
                beforeEach(function () {
                    topicsMock['edit.mode'](true);
                });

                it('add partition is not yet possible', function () {
                    expect($ctrl.isAddAllowed()).toBeFalsy();
                });

                describe('when user has catalog.partition.add permission', function () {
                    beforeEach(function () {
                        binarta.checkpoint.gateway.addPermission('catalog.partition.add');
                        binarta.checkpoint.profile.refresh();
                    });

                    it('add partition is possible', function () {
                        expect($ctrl.isAddAllowed()).toBeTruthy();
                    });
                });
            });

            describe('on add', function () {
                var partition;

                beforeEach(function () {
                    partition = {id: 'foo'};
                    $ctrl.add(partition);
                });

                it('partition is added to partition list and uiStatus is applied', function () {
                    expect($ctrl.partitions[$ctrl.partitions.length - 1]).toEqual({id: 'foo', uiStatus: 'added'});
                });

                it('after delay, uiStatus is removed', function () {
                    $timeout.flush(300);
                    expect($ctrl.partitions[$ctrl.partitions.length - 1]).toEqual(partition);
                });

                describe('on remove', function () {
                    beforeEach(function () {
                        $ctrl.remove(partition);
                    });

                    it('uiStatus is applied', function () {
                        expect(partition.uiStatus).toEqual('removed');
                    });

                    it('after delay, remove partition from list', function () {
                        $timeout.flush(300);
                        expect($ctrl.partitions).not.toContain(partition);
                    });
                });
            });
        });
    });

    describe('binCatalogPartitionAdd component', function () {
        var $ctrl, $rootScope, addMock, addDeferred, editModeRenderer;

        beforeEach(inject(function ($q, _$rootScope_, $componentController, _editModeRenderer_) {
            $rootScope = _$rootScope_;
            editModeRenderer = _editModeRenderer_;
            addMock = jasmine.createSpy('add');
            addDeferred = $q.defer();
            addMock.and.returnValue(addDeferred.promise);
            $ctrl = $componentController('binCatalogPartitionAdd', {addCatalogPartition: addMock}, {});
            $ctrl.partitionsCtrl = {
                partition: 'p',
                add: jasmine.createSpy('spy')
            };
        }));

        it('fallback to partition from partitionsCtrl', function () {
            $ctrl.$onInit();
            expect($ctrl.partition).toEqual('p');
        });

        describe('with partition', function () {
            beforeEach(function () {
                $ctrl.partition = 'partition';
                $ctrl.$onInit();
            });

            describe('on submit', function () {
                beforeEach(function () {
                    $ctrl.submit();
                });

                it('edit-mode renderer is opened', function () {
                    expect(editModeRenderer.open).toHaveBeenCalledWith({
                        templateUrl: 'bin-catalog-edit-name.html',
                        scope: jasmine.any(Object)
                    });
                });

                describe('with edit-mode renderer scope', function () {
                    var scope;

                    beforeEach(function () {
                        scope = editModeRenderer.open.calls.mostRecent().args[0].scope;
                    });

                    it('i18n prefix code is available', function () {
                        expect(scope.i18nPrefix).toEqual('catalog.partition.name');
                    });

                    it('on cancel', function () {
                        scope.cancel();
                        expect(editModeRenderer.close).toHaveBeenCalled();
                    });

                    describe('on submit', function () {
                        var name;

                        beforeEach(function () {
                            name = 'name';
                            scope.name = name;
                            scope.submit();
                        });

                        it('is working', function () {
                            expect(scope.working).toBeTruthy();
                        });

                        it('add partition request', function () {
                            expect(addMock).toHaveBeenCalledWith({
                                partition: $ctrl.partition,
                                name: name,
                                success: jasmine.any(Function),
                                rejected: jasmine.any(Function)
                            });
                        });

                        describe('on success', function () {
                            beforeEach(function () {
                                addMock.calls.mostRecent().args[0].success('p');
                                addDeferred.resolve();
                                $rootScope.$digest();
                            });

                            it('is not working', function () {
                                expect(scope.working).toBeFalsy();
                            });

                            it('new partition is added to list', function () {
                                expect($ctrl.partitionsCtrl.add).toHaveBeenCalledWith('p');
                            });

                            it('edit-mode renderer is closed', function () {
                                expect(editModeRenderer.close).toHaveBeenCalled();
                            });
                        });

                        describe('on rejected', function () {
                            beforeEach(function () {
                                addMock.calls.mostRecent().args[0].rejected('v');
                                addDeferred.reject();
                                $rootScope.$digest();
                            });

                            it('is not working', function () {
                                expect(scope.working).toBeFalsy();
                            });

                            it('violations are available', function () {
                                expect(scope.violations).toEqual('v');
                            });
                        });
                    });
                });
            });
        });
    });

    describe('binCatalogPartition component', function () {
        var $ctrl, $rootScope, removeMock, removeDeferred, partition;

        beforeEach(inject(function ($q, _$rootScope_, $componentController) {
            binarta.checkpoint.gateway.permissions = [];
            binarta.checkpoint.registrationForm.submit({username: 'u', password: 'p', email: 'e'});
            $rootScope = _$rootScope_;
            removeMock = jasmine.createSpy('remove');
            removeDeferred = $q.defer();
            removeMock.and.returnValue(removeDeferred.promise);
            partition = {
                id: 'partition-id'
            };
            $ctrl = $componentController('binCatalogPartition', {removeCatalogPartition: removeMock}, {});
            $ctrl.partitionsCtrl = {
                remove: jasmine.createSpy('spy')
            };
        }));

        it('assert default template', function () {
            $ctrl.$onInit();
            expect($ctrl.templateUrl).toEqual('bin-catalog-partition-list-default.html');
        });

        it('assert override template', function () {
            $ctrl.templateUrl = 'override.html';
            $ctrl.$onInit();
            expect($ctrl.templateUrl).toEqual('override.html');
        });

        describe('check if remove action is allowed', function () {
            beforeEach(function () {
                $ctrl.partition = partition;
                $ctrl.$onInit();
            });

            it('when removable but no permission', function () {
                $ctrl.removable = 'true';
                expect($ctrl.isRemoveAllowed()).toBeFalsy();
            });

            describe('when user has permission', function () {
                beforeEach(function () {
                    binarta.checkpoint.gateway.addPermission('catalog.partition.remove');
                    binarta.checkpoint.profile.refresh();
                });

                it('and is removable', function () {
                    $ctrl.removable = 'true';
                    expect($ctrl.isRemoveAllowed()).toBeTruthy();
                });

                it('and is not removable', function () {
                    $ctrl.removable = 'false';
                    expect($ctrl.isRemoveAllowed()).toBeFalsy();
                });
            });
        });

        describe('and partition is removable', function () {
            beforeEach(function () {
                $ctrl.partition = partition;
                $ctrl.removable = 'true';
                $ctrl.$onInit();
            });

            describe('on remove', function () {
                var actual;

                beforeEach(function () {
                    $ctrl.remove().then(function () {
                        actual = true;
                    });
                });

                it('catalog partition remove requested', function () {
                    expect(removeMock).toHaveBeenCalledWith({id: partition.id});
                });

                describe('on success', function () {
                    beforeEach(function () {
                        removeDeferred.resolve();
                        $rootScope.$digest();
                    });

                    it('partition is removed', function () {
                        expect($ctrl.partitionsCtrl.remove).toHaveBeenCalledWith(partition);
                    });

                    it('when called again', function () {
                        removeMock.calls.reset();
                        $ctrl.remove();
                        removeDeferred.resolve();
                        $rootScope.$digest();
                        expect(removeMock).not.toHaveBeenCalled();
                    });
                });
            });
        });
    });

    describe('binCatalogBreadcrumb component', function () {
        var $ctrl, $location;

        beforeEach(inject(function ($componentController, _$location_) {
            $location = _$location_;
            $location.path('/browse/p');
            $ctrl = $componentController('binCatalogBreadcrumb');
        }));

        describe('with listCtrl and parent', function () {
            beforeEach(function () {
                $ctrl.listCtrl = {
                    type: 'type',
                    partition: 'partition',
                    parent: 'parent'
                };
                $ctrl.$onInit();
            });

            it('values are set on controller', function () {
                expect($ctrl.partition).toEqual('parent');
                expect($ctrl.item).toEqual('partition');
            });

            it('breadcrumb is updated', function () {
                expect($ctrl.breadcrumb).toEqual([
                    {id: 'navigation.label.partition'}
                ]);
            });
        });

        describe('with listCtrl and no parent', function () {
            beforeEach(function () {
                $ctrl.listCtrl = {
                    type: 'type',
                    partition: 'partition',
                    parent: ''
                };
                $ctrl.$onInit();
            });

            it('values are set on controller', function () {
                expect($ctrl.partition).toEqual('');
                expect($ctrl.item).toEqual('type');
            });

            it('breadcrumb is updated', function () {
                expect($ctrl.breadcrumb).toEqual([
                    {id: 'navigation.label.type'}
                ]);
            });
        });

        describe('with detailsCtrl', function () {
            beforeEach(function () {
                $ctrl.detailsCtrl = {
                    onItemUpdate: jasmine.createSpy('spy')
                };
                $ctrl.$onInit();
                $ctrl.detailsCtrl.onItemUpdate.calls.mostRecent().args[0]({
                    partition: 'partition',
                    id: 'id'
                });
            });

            it('values are set on controller', function () {
                expect($ctrl.partition).toEqual('partition');
                expect($ctrl.item).toEqual('id');
            });

            it('breadcrumb is updated', function () {
                expect($ctrl.breadcrumb).toEqual([
                    {id: 'navigation.label.id'}
                ]);
            });
        });

        it('when item is undefined', function () {
            $ctrl.$onChanges();
            expect($ctrl.breadcrumb).toBeUndefined();
        });

        describe('when on parent', function () {
            beforeEach(function () {
                $ctrl.partition = '/';
                $ctrl.item = '/p/';
                $ctrl.$onChanges();
            });

            it('no back link', function () {
                expect($ctrl.back).toBeUndefined();
            });

            it('breadcrumb is updated', function () {
                expect($ctrl.breadcrumb).toEqual([
                    {id: 'navigation.label.p'}
                ]);
            });
        });

        describe('when partition is not given', function () {
            beforeEach(function () {
                $ctrl.item = '/p/';
                $ctrl.$onChanges();
            });

            it('breadcrumb is updated', function () {
                expect($ctrl.breadcrumb).toEqual([
                    {id: 'navigation.label.p'}
                ]);
            });

            describe('and item has no slashes', function () {
                beforeEach(function () {
                    $ctrl.item = 'p';
                    $ctrl.$onChanges();
                });

                it('breadcrumb is updated', function () {
                    expect($ctrl.breadcrumb).toEqual([
                        {id: 'navigation.label.p'}
                    ]);
                });
            });
        });

        describe('with partition and item', function () {
            beforeEach(function () {
                $ctrl.partition = '/p/p1/p2/';
                $ctrl.item = '/p/p1/p2/item';
                $ctrl.$onChanges();
            });

            it('back link is available', function () {
                expect($ctrl.back).toEqual({id: '/p/p1/p2/', path: '/browse/p/p1/p2/'});
            });

            it('breadcrumb is available', function () {
                expect($ctrl.breadcrumb).toEqual([
                    {id: 'navigation.label.p', path: '/browse/p/'},
                    {id: '/p/p1/', path: '/browse/p/p1/'},
                    {id: '/p/p1/p2/', path: '/browse/p/p1/p2/'},
                    {id: '/p/p1/p2/item'}
                ]);
            });

            describe('on change', function () {
                beforeEach(function () {
                    $ctrl.partition = '/p/';
                    $ctrl.item = '/p/p1/';
                    $ctrl.$onChanges();
                });

                it('back link is available', function () {
                    expect($ctrl.back).toEqual({id: 'navigation.label.p', path: '/browse/p/'});
                });

                it('breadcrumb is updated', function () {
                    expect($ctrl.breadcrumb).toEqual([
                        {id: 'navigation.label.p', path: '/browse/p/'},
                        {id: '/p/p1/'}
                    ]);
                });
            });
        });

        describe('when not on "browse" path', function () {
            beforeEach(function () {
                $location.path('/path');
            });

            describe('when on parent', function () {
                beforeEach(function () {
                    $ctrl.partition = '/';
                    $ctrl.item = '/p/';
                    $ctrl.$onChanges();
                });

                it('back link is available', function () {
                    expect($ctrl.back).toEqual({id: 'navigation.label.p', path: '/browse/p/'});
                });

                it('breadcrumb is updated', function () {
                    expect($ctrl.breadcrumb).toEqual([
                        {id: 'navigation.label.p', path: '/browse/p/'}
                    ]);
                });
            });

            describe('and item has no slashes', function () {
                beforeEach(function () {
                    $ctrl.item = 'p';
                    $ctrl.$onChanges();
                });

                it('back link is available', function () {
                    expect($ctrl.back).toEqual({id: 'navigation.label.p', path: '/browse/p/'});
                });

                it('breadcrumb is updated', function () {
                    expect($ctrl.breadcrumb).toEqual([
                        {id: 'navigation.label.p', path: '/browse/p/'}
                    ]);
                });
            });
        });

        describe('when "blog" item', function () {
            beforeEach(function () {
                $ctrl.partition = '/blog/';
                $ctrl.item = '/blog/item';
                $ctrl.$onChanges();
            });

            it('back link is available', function () {
                expect($ctrl.back).toEqual({id: 'navigation.label.blog', path: '/blog'});
            });

            it('breadcrumb is available', function () {
                expect($ctrl.breadcrumb).toEqual([
                    {id: 'navigation.label.blog', path: '/blog'},
                    {id: '/blog/item'}
                ]);
            });
        });
    });

    describe('binCatalogSearch component', function () {
        var $componentController, $ctrl, $timeout, elementSpy, inputSpy, searchParam, type, fadeDuration = 150;

        beforeEach(inject(function (_$componentController_, _$timeout_) {
            $componentController = _$componentController_;
            $timeout = _$timeout_;
            elementSpy = jasmine.createSpyObj('element', ['find']);
            inputSpy = jasmine.createSpyObj('input', ['bind', 'focus', 'fadeIn', 'fadeOut']);
            $ctrl = $componentController('binCatalogSearch', {$element: elementSpy}, {});
            searchParam = 'search';
            type = 'type';
        }));

        function assertSearch() {
            it('search param is added to location', function () {
                expect(location.search().q).toEqual(searchParam);
            });

            it('redirect to search path', function () {
                expect(location.path()).toEqual('/lang/search/' + type);
            });
        }

        function assertNoSearch() {
            it('search param is not added to location', function () {
                expect(location.search().q).not.toEqual(searchParam);
            });

            it('not redirected to search path', function () {
                expect(location.path()).not.toEqual('/lang/search/' + type);
            });
        }

        describe('when search param is defined', function () {
            beforeEach(function () {
                location.search().q = searchParam;
                $ctrl.$onInit();
            });

            it('search param is available on controller', function () {
                expect($ctrl.q).toEqual(searchParam);
            });
        });

        describe('when not on search path', function () {
            beforeEach(function () {
                $ctrl.$onInit();
                $ctrl.type = type;
            });

            describe('on submit', function () {
                beforeEach(function () {
                    $ctrl.q = searchParam;
                    $ctrl.submit();
                });

                assertSearch();
            });
        });

        describe('with listCtrl', function () {
            beforeEach(function () {
                $ctrl.listCtrl = {
                    type: type,
                    search: jasmine.createSpy('spy')
                };
                $ctrl.$onInit();
            });

            it('type is set', function () {
                expect($ctrl.type).toEqual(type);
            });

            describe('on submit', function () {
                beforeEach(function () {
                    $ctrl.q = searchParam;
                    $ctrl.submit();
                });

                assertSearch();

                it('search for new items', function () {
                    expect($ctrl.listCtrl.search).toHaveBeenCalled();
                });
            });
        });

        describe('with detailsCtrl', function () {
            beforeEach(function () {
                $ctrl.detailsCtrl = {
                    type: type
                };
                $ctrl.$onInit();
            });

            it('type is set', function () {
                expect($ctrl.type).toEqual(type);
            });

            describe('on submit', function () {
                beforeEach(function () {
                    $ctrl.q = searchParam;
                    $ctrl.submit();
                });

                assertSearch();
            });
        });

        describe('when no input element is present', function () {
            beforeEach(function () {
                $ctrl.$onInit();
                $ctrl.$postLink();
                $ctrl.type = 'type';
                $ctrl.q = searchParam;
            });

            describe('on searchOnFocus', function () {
                beforeEach(function () {
                    $ctrl.submitWhenFocussed();
                });

                assertSearch();
            });
        });

        describe('with input element', function () {
            beforeEach(function () {
                elementSpy.find.and.returnValue(inputSpy);
                $ctrl.$onInit();
                $ctrl.$postLink();
                $ctrl.type = 'type';
                $ctrl.q = searchParam;
            });

            describe('on searchOnFocus', function () {
                beforeEach(function () {
                    $ctrl.submitWhenFocussed();
                });

                it('input element is fade in', function () {
                    expect(inputSpy.fadeIn).toHaveBeenCalledWith(fadeDuration);
                });

                it('set focus on input element', function () {
                    expect(inputSpy.focus).toHaveBeenCalled();
                });

                it('focus event is bound', function () {
                    expect(inputSpy.bind).toHaveBeenCalledWith('focus', jasmine.any(Function));
                });

                it('blur event is bound', function () {
                    expect(inputSpy.bind).toHaveBeenCalledWith('blur', jasmine.any(Function));
                });

                assertNoSearch();

                describe('on focus', function () {
                    beforeEach(function () {
                        inputSpy.bind.calls.first().args[1]();
                    });

                    describe('when method is executed again', function () {
                        beforeEach(function () {
                            $ctrl.submitWhenFocussed();
                        });

                        assertSearch();
                    });

                    describe('when element loses focus', function () {
                        beforeEach(function () {
                            inputSpy.bind.calls.mostRecent().args[1]();
                            $timeout.flush();
                        });

                        it('input element is fade out', function () {
                            expect(inputSpy.fadeOut).toHaveBeenCalledWith(fadeDuration);
                        });

                        describe('when method is executed again', function () {
                            beforeEach(function () {
                                inputSpy.focus.calls.reset();
                                $ctrl.submitWhenFocussed();
                            });

                            assertNoSearch();

                            it('set focus on input element', function () {
                                expect(inputSpy.focus).toHaveBeenCalled();
                            });
                        });
                    });
                });
            });
        });
    });

    describe('binCatalogItemGroups component', function () {
        var $componentController, $ctrl;

        beforeEach(inject(function (_$componentController_) {
            $componentController = _$componentController_;
            $ctrl = $componentController('binCatalogItemGroups', null, {items: []});
            $ctrl.$onInit();
        }));

        describe('with main partition', function () {
            beforeEach(function () {
                $ctrl.partition = 'p';
            });

            it('and no items in main partition', function () {
                expect($ctrl.noItemsInMainPartition()).toBeTruthy();
            });

            it('and with items in main partition', function () {
                $ctrl.items.push({id: 1, partition: 'p'});
                expect($ctrl.noItemsInMainPartition()).toBeFalsy();
            });
        });
    });

    describe('binCatalogItems component', function () {
        var $componentController, $ctrl, $timeout, bindings, items, writer, topics;

        beforeEach(inject(function (_$componentController_, _$timeout_, updateCatalogItemWriter, topicRegistryMock) {
            binarta.checkpoint.gateway.permissions = [];
            binarta.checkpoint.registrationForm.submit({username: 'u', password: 'p', email: 'e'});
            $componentController = _$componentController_;
            $timeout = _$timeout_;
            writer = updateCatalogItemWriter;
            topics = topicRegistryMock;
            items = [
                {id: 1, priority: 3},
                {id: 2, priority: 2},
                {id: 3, priority: 1}
            ];
            bindings = {};
        }));

        describe('with itemGroups controller', function () {
            beforeEach(function () {
                bindings.groupsCtrl = {
                    items: ['item'],
                    type: 'type',
                    partition: 'partition',
                    movable: 'false',
                    pinnable: 'true',
                    removable: 'false',
                    addable: 'false',
                    linkable: 'true',
                    publishable: 'true',
                    redirectOnAdd: 'true',
                    itemTemplateUrl: 'template',
                    cols: 'cols',
                    center: 'center'
                };
                $ctrl = $componentController('binCatalogItems', null, bindings);
                $ctrl.$onInit();
            });

            it('settings from groupsCtrl are used', function () {
                expect($ctrl.items).toEqual(['item']);
                expect($ctrl.type).toEqual('type');
                expect($ctrl.partition).toEqual('partition');
                expect($ctrl.movable).toEqual('false');
                expect($ctrl.pinnable).toEqual('true');
                expect($ctrl.removable).toEqual('false');
                expect($ctrl.addable).toEqual('false');
                expect($ctrl.linkable).toEqual('true');
                expect($ctrl.publishable).toEqual('true');
                expect($ctrl.redirectOnAdd).toEqual('true');
                expect($ctrl.itemTemplateUrl).toEqual('template');
                expect($ctrl.cols).toEqual('cols');
                expect($ctrl.center).toEqual('center');
            });
        });

        describe('with list controller', function () {
            beforeEach(function () {
                bindings.listCtrl = {
                    items: ['item'],
                    type: 'type',
                    partition: 'partition'
                };
                $ctrl = $componentController('binCatalogItems', null, bindings);
                $ctrl.$onInit();
            });

            it('settings from list controller are used', function () {
                expect($ctrl.items).toEqual(['item']);
                expect($ctrl.type).toEqual('type');
                expect($ctrl.partition).toEqual('partition');
            });
        });

        describe('with items', function () {
            beforeEach(function () {
                bindings.items = items;
                $ctrl = $componentController('binCatalogItems', null, bindings);
                $ctrl.$onInit();
            });

            describe('on move up', function () {
                var done;

                beforeEach(function () {
                    $ctrl.moveUp(items[2]).finally(function () {
                        done = true;
                    });
                });

                it('update item priority', function () {
                    expect(writer).toHaveBeenCalledWith({
                        data: {
                            treatInputAsId: false,
                            context: 'updatePriority',
                            id: {id: 3},
                            priority: 2
                        },
                        success: jasmine.any(Function)
                    });
                });

                describe('on update success', function () {
                    beforeEach(function () {
                        writer.calls.mostRecent().args[0].success();
                    });

                    it('item are reprioritized and sorted', function () {
                        expect(items).toEqual([
                            {id: 1, priority: 3},
                            {id: 3, priority: 2},
                            {id: 2, priority: 1}
                        ]);
                    });

                    it('promise is resolved', function () {
                        expect(done).toBeTruthy();
                    });
                });
            });

            describe('on move first item up', function () {
                beforeEach(function () {
                    $ctrl.moveUp(items[0]);
                });

                it('item is not updated', function () {
                    expect(writer).not.toHaveBeenCalled();
                });
            });

            describe('on move down', function () {
                var done;

                beforeEach(function () {
                    $ctrl.moveDown(items[0]).finally(function () {
                        done = true;
                    });
                });

                it('update item priority', function () {
                    expect(writer).toHaveBeenCalledWith({
                        data: {
                            treatInputAsId: false,
                            context: 'updatePriority',
                            id: {id: 1},
                            priority: 2
                        },
                        success: jasmine.any(Function)
                    });
                });

                describe('on update success', function () {
                    beforeEach(function () {
                        writer.calls.mostRecent().args[0].success();
                    });

                    it('item are reprioritized and sorted', function () {
                        expect(items).toEqual([
                            {id: 2, priority: 3},
                            {id: 1, priority: 2},
                            {id: 3, priority: 1}
                        ]);
                    });

                    it('promise is resolved', function () {
                        expect(done).toBeTruthy();
                    });
                });
            });

            describe('on move last item down', function () {
                beforeEach(function () {
                    $ctrl.moveDown(items[2]);
                });

                it('item is not updated', function () {
                    expect(writer).not.toHaveBeenCalled();
                });
            });

            describe('on move to top', function () {
                var done;

                beforeEach(function () {
                    $ctrl.moveTop(items[2]).finally(function () {
                        done = true;
                    });
                });

                it('update item priority', function () {
                    expect(writer).toHaveBeenCalledWith({
                        data: {
                            treatInputAsId: false,
                            context: 'updatePriority',
                            id: {id: 3},
                            priority: 3
                        },
                        success: jasmine.any(Function)
                    });
                });

                describe('on update success', function () {
                    beforeEach(function () {
                        writer.calls.mostRecent().args[0].success();
                    });

                    it('item are reprioritized and sorted', function () {
                        expect(items).toEqual([
                            {id: 3, priority: 3},
                            {id: 1, priority: 2},
                            {id: 2, priority: 1}
                        ]);
                    });

                    it('promise is resolved', function () {
                        expect(done).toBeTruthy();
                    });
                });
            });

            describe('on move first item to top', function () {
                beforeEach(function () {
                    $ctrl.moveTop(items[0]);
                });

                it('item is not updated', function () {
                    expect(writer).not.toHaveBeenCalled();
                });
            });

            describe('on move to bottom', function () {
                var done;

                beforeEach(function () {
                    $ctrl.moveBottom(items[0]).finally(function () {
                        done = true;
                    });
                });

                it('update item priority', function () {
                    expect(writer).toHaveBeenCalledWith({
                        data: {
                            treatInputAsId: false,
                            context: 'updatePriority',
                            id: {id: 1},
                            priority: 1
                        },
                        success: jasmine.any(Function)
                    });
                });

                describe('on update success', function () {
                    beforeEach(function () {
                        writer.calls.mostRecent().args[0].success();
                    });

                    it('item are reprioritized and sorted', function () {
                        expect(items).toEqual([
                            {id: 2, priority: 3},
                            {id: 3, priority: 2},
                            {id: 1, priority: 1}
                        ]);
                    });

                    it('promise is resolved', function () {
                        expect(done).toBeTruthy();
                    });
                });
            });

            describe('on move last item to bottom', function () {
                beforeEach(function () {
                    $ctrl.moveBottom(items[2]);
                });

                it('item is not updated', function () {
                    expect(writer).not.toHaveBeenCalled();
                });
            });

            it('add item is not yet possible', function () {
                expect($ctrl.isAddAllowed()).toBeFalsy();
            });

            describe('when in edit mode', function () {
                beforeEach(function () {
                    topics['edit.mode'](true);
                });

                it('add item is not yet possible', function () {
                    expect($ctrl.isAddAllowed()).toBeFalsy();
                });

                describe('when user has catalog.item.add permission', function () {
                    beforeEach(function () {
                        binarta.checkpoint.gateway.addPermission('catalog.item.add');
                        binarta.checkpoint.profile.refresh();
                    });

                    it('add item is possible', function () {
                        expect($ctrl.isAddAllowed()).toBeTruthy();
                    });
                });
            });

            describe('on add', function () {
                var item;

                beforeEach(function () {
                    item = {id: 'foo'};
                    $ctrl.add(item);
                });

                it('item is added to items list and uiStatus is applied', function () {
                    expect($ctrl.items[0]).toEqual({id: 'foo', uiStatus: 'added'});
                });

                it('after delay, uiStatus is removed', function () {
                    $timeout.flush(300);
                    expect($ctrl.items[0]).toEqual(item);
                });

                describe('on remove', function () {
                    beforeEach(function () {
                        $ctrl.remove(item);
                    });

                    it('uiStatus is applied', function () {
                        expect(item.uiStatus).toEqual('removed');
                    });

                    it('after delay, remove item from items', function () {
                        $timeout.flush(300);
                        expect($ctrl.items).not.toContain(item);
                    });
                });
            });
        });
    });

    describe('binCatalogItemAdd component', function () {
        var $ctrl, $rootScope, bindings, addMock, addDeferred, dispatcherMock;

        beforeEach(inject(function ($q, _$rootScope_, $componentController) {
            $rootScope = _$rootScope_;
            dispatcherMock = jasmine.createSpyObj('spy', ['fire']);
            addMock = jasmine.createSpy('add');
            addDeferred = $q.defer();
            addMock.and.returnValue(addDeferred.promise);
            $ctrl = $componentController('binCatalogItemAdd', {
                addCatalogItem: addMock,
                topicMessageDispatcher: dispatcherMock
            }, {});
            $ctrl.itemsCtrl = {
                items: [],
                add: jasmine.createSpy('spy')
            };
        }));

        it('fallbacks from itemsCtrl', function () {
            $ctrl.itemsCtrl.type = 'T';
            $ctrl.itemsCtrl.partition = 'P';
            $ctrl.itemsCtrl.redirectOnAdd = 'true';
            $ctrl.$onInit();
            expect($ctrl.type).toEqual('T');
            expect($ctrl.partition).toEqual('P');
            expect($ctrl.redirectToView).toEqual('true');
        });

        describe('on submit', function () {
            var type, partition;

            beforeEach(function () {
                type = 'type';
                partition = 'partition';
                $ctrl.type = type;
                $ctrl.partition = partition;
                $ctrl.$onInit();
                $ctrl.submit();
            });

            it('is working', function () {
                expect($ctrl.working).toBeTruthy();
            });

            it('add item request', function () {
                expect(addMock).toHaveBeenCalledWith({
                    item: {
                        type: type,
                        partition: partition,
                        defaultName: 'Item Name'
                    },
                    redirectToView: false,
                    success: jasmine.any(Function),
                    rejected: jasmine.any(Function)
                });
            });

            describe('on success', function () {
                var item;

                beforeEach(function () {
                    item = {id: 'item-id'};
                    addMock.calls.mostRecent().args[0].success(item);
                    addDeferred.resolve();
                    $rootScope.$digest();
                });

                it('is not working', function () {
                    expect($ctrl.working).toBeFalsy();
                });

                it('item priority is added', function () {
                    expect(item.priority).toEqual(1);
                });

                it('new partition is added to list', function () {
                    expect($ctrl.itemsCtrl.add).toHaveBeenCalledWith(item);
                });
            });

            describe('on rejected', function () {
                beforeEach(function () {
                    var violations = {
                        p: ['a', 'b'],
                        i: ['x', 'y']
                    };
                    addMock.calls.mostRecent().args[0].rejected(violations);
                    addDeferred.reject();
                    $rootScope.$digest();
                });

                it('is not working', function () {
                    expect($ctrl.working).toBeFalsy();
                });

                it('notifications are fired', function () {
                    expect(dispatcherMock.fire).toHaveBeenCalledWith('system.warning', {
                        code: 'catalog.violation.p.a',
                        default: 'a'
                    });
                    expect(dispatcherMock.fire).toHaveBeenCalledWith('system.warning', {
                        code: 'catalog.violation.p.b',
                        default: 'b'
                    });
                    expect(dispatcherMock.fire).toHaveBeenCalledWith('system.warning', {
                        code: 'catalog.violation.i.x',
                        default: 'x'
                    });
                    expect(dispatcherMock.fire).toHaveBeenCalledWith('system.warning', {
                        code: 'catalog.violation.i.y',
                        default: 'y'
                    });
                });
            });
        });
    });

    describe('binCatalogWorking component', function () {
        var $ctrl, $componentController, $timeout;

        beforeEach(inject(function (_$componentController_, _$timeout_) {
            $componentController = _$componentController_;
            $timeout = _$timeout_;
            $ctrl = $componentController('binCatalogWorking', null, {});
            $ctrl.listCtrl = {
                items: [],
                isWorking: jasmine.createSpy('spy')
            };
            $ctrl.$onInit();
        }));

        it('is not working', function () {
            $ctrl.listCtrl.isWorking.and.returnValue(false);
            expect($ctrl.isWorking()).toBeFalsy();
        });

        describe('when listCtrl is working', function () {
            beforeEach(function () {
                $ctrl.listCtrl.isWorking.and.returnValue(true);
            });

            it('is not working', function () {
                expect($ctrl.isWorking()).toBeFalsy();
            });

            describe('after a delay', function () {
                beforeEach(function () {
                    $ctrl.isWorking();
                    $timeout.flush(500);
                });

                it('is working', function () {
                    expect($ctrl.isWorking()).toBeTruthy();
                });

                describe('when listCtrl stops working', function () {
                    beforeEach(function () {
                        $ctrl.listCtrl.isWorking.and.returnValue(false);
                    });

                    it('is not working', function () {
                        expect($ctrl.isWorking()).toBeFalsy();
                    });
                });

                describe('when items are available', function () {
                    beforeEach(function () {
                        $ctrl.listCtrl.items.push({id: 0});
                    });

                    it('is not working', function () {
                        expect($ctrl.isWorking()).toBeFalsy();
                    });
                });
            });
        });
    });

    describe('binCatalogDetails component', function () {
        var $ctrl, $componentController, $routeParams, $location;

        beforeEach(inject(function (_$componentController_, _$routeParams_, _$location_) {
            $componentController = _$componentController_;
            $routeParams = _$routeParams_;
            $location = _$location_;
        }));

        describe('when bindings are not given', function () {
            beforeEach(function () {
                $routeParams.d0 = 'type';
                $routeParams.d1 = 'p1';
                $routeParams.d2 = 'item-id';
                $ctrl = $componentController('binCatalogDetails', null, {});
                $ctrl.$onInit();
            });

            it('catalog properties are parsed from route', function () {
                expect($ctrl.type).toEqual('type');
                expect($ctrl.partition).toEqual('/type/p1/');
                expect($ctrl.itemId).toEqual('/type/p1/item-id');
            });
        });

        describe('with bindings', function () {
            var type = 'type';
            var partition = 'partition';
            var itemId = 'item-id';
            var findCatalogItemByIdMock;

            beforeEach(function () {
                findCatalogItemByIdMock = jasmine.createSpy('spy');
                $ctrl = $componentController('binCatalogDetails', {
                    findCatalogItemById: findCatalogItemByIdMock
                }, {
                    type: type,
                    partition: partition,
                    itemId: itemId
                });
                $ctrl.$onInit();
            });

            it('type and partition are available on controller', function () {
                expect($ctrl.type).toEqual(type);
                expect($ctrl.partition).toEqual(partition);
            });

            it('item is requested', function () {
                expect(findCatalogItemByIdMock).toHaveBeenCalledWith(itemId, jasmine.any(Function));
            });

            describe('with item update listeners', function () {
                var actual;

                beforeEach(function () {
                    $ctrl.onItemUpdate(function (item) {
                        actual = item;
                    });
                });

                describe('when item has a localizedId that is different from id param', function () {
                    var item;

                    beforeEach(function () {
                        item = {
                            localizedId: '/localized-id'
                        };
                        findCatalogItemByIdMock.calls.mostRecent().args[1](item);
                    });

                    it('redirect to localized version under the current language', function () {
                        expect($location.path()).toEqual('/lang/view' + item.localizedId);
                    });

                    it('item is not updated', function () {
                        expect(actual).toBeUndefined();
                    });
                });

                describe('when localizedId is the same as id param', function () {
                    var item;

                    beforeEach(function () {
                        item = {
                            id: itemId,
                            localizedId: itemId
                        };
                        findCatalogItemByIdMock.calls.mostRecent().args[1](item);
                    });

                    it('item is updated', function () {
                        expect(actual).toEqual(item);
                    });

                    describe('on refresh', function () {
                        var returned;

                        beforeEach(function () {
                            findCatalogItemByIdMock.calls.reset();
                            findCatalogItemByIdMock.and.returnValue('promise');
                            returned = $ctrl.refresh();
                        });

                        it('item is requested', function () {
                            expect(findCatalogItemByIdMock).toHaveBeenCalledWith(itemId, jasmine.any(Function));
                        });

                        it('refresh returns promise from findCatalogItemById', function () {
                            expect(returned).toEqual('promise');
                        });
                    });
                });
            });

            it('on register component', function () {
                $ctrl.registerComponent('a');
                $ctrl.registerComponent('b');
                expect($ctrl.isComponentRegistered('a')).toBeTruthy();
                expect($ctrl.isComponentRegistered('b')).toBeTruthy();
                expect($ctrl.isComponentRegistered('c')).toBeFalsy();
            });
        });
    });

    describe('binCatalogItem component', function () {
        var $ctrl, $rootScope, $componentController, $location, topicsMock, pinnerMock, removeMock, removeDeferred;
        var item, findCatalogItemByIdMock, editModeRendererMock, binLinkMock, writer, publisherMock, imageCarousel, moment;

        beforeEach(inject(function ($q, _$rootScope_, _$componentController_, _$location_, topicRegistryMock,
                                    editModeRenderer, binLink, updateCatalogItemWriter, binImageCarousel, _moment_) {
            binarta.checkpoint.gateway.permissions = [];
            binarta.checkpoint.registrationForm.submit({username: 'u', password: 'p', email: 'e'});
            $rootScope = _$rootScope_;
            $componentController = _$componentController_;
            $location = _$location_;
            topicsMock = topicRegistryMock;
            editModeRendererMock = editModeRenderer;
            binLinkMock = binLink;
            writer = updateCatalogItemWriter;
            imageCarousel = binImageCarousel;
            moment = _moment_;
            pinnerMock = {};
            pinnerMock.pin = jasmine.createSpy('pin').and.returnValue(true);
            pinnerMock.unpin = jasmine.createSpy('unpin').and.returnValue(true);
            removeMock = jasmine.createSpy('remove');
            removeDeferred = $q.defer();
            removeMock.and.returnValue(removeDeferred.promise);
            findCatalogItemByIdMock = jasmine.createSpy('spy');
            publisherMock = jasmine.createSpyObj('spy', ['publish', 'unpublish']);
            item = {
                id: 'item-id'
            };
            $ctrl = $componentController('binCatalogItem', {
                itemPinner: pinnerMock,
                removeCatalogItem: removeMock,
                findCatalogItemById: findCatalogItemByIdMock,
                binCatalogItemPublisher: publisherMock
            }, {});
        }));

        describe('with item', function () {
            beforeEach(function () {
                $ctrl.$onInit();
                $ctrl.item = item;
                $ctrl.$onChanges();
            });

            it('i18n codes are available', function () {
                expect($ctrl.i18n).toEqual({
                    title: 'item-id',
                    altTitle: 'item-id.title',
                    lead: 'item-id.lead',
                    body: 'item-id.body'
                });
            });

            it('image code is available', function () {
                expect($ctrl.image).toEqual({
                    cover: 'imagesitem-id/cover.img'
                });
            });

            it('item path is available', function () {
                expect($ctrl.itemPath).toEqual('/viewitem-id');
            });

            it('when item has a localized id', function () {
                $ctrl.item.localizedId = '/local';
                $ctrl.$onChanges();
                expect($ctrl.itemPath).toEqual('/view/local');
            });

            describe('when item has a carousel', function () {
                beforeEach(function () {
                    $ctrl.item.carousel = [{id: '/image/id'}];
                    imageCarousel.getHeroImage.and.returnValue({path: 'hero'});
                    $ctrl.$onChanges();
                });

                it('hero image is requested', function () {
                    expect(imageCarousel.getHeroImage).toHaveBeenCalledWith({
                        prefetchedItems: $ctrl.item.carousel
                    });
                });

                it('hero image code is available', function () {
                    expect($ctrl.image.hero).toEqual('hero');
                });
            });

            describe('exposes update function', function () {
                var successSpy, errorSpy;

                beforeEach(function () {
                    successSpy = jasmine.createSpy('success');
                    errorSpy = jasmine.createSpy('error');
                    $ctrl.update({key: 'customKey', value: 'customValue'}, {success: successSpy, error: errorSpy});
                });

                it('item is updated', function () {
                    expect(writer).toHaveBeenCalledWith({
                        data: {
                            treatInputAsId: false,
                            context: 'update',
                            id: $ctrl.item.id,
                            type: $ctrl.item.type,
                            customKey: 'customValue'
                        },
                        success: jasmine.any(Function),
                        error: errorSpy
                    });
                });

                describe('on success', function () {
                    beforeEach(function () {
                        writer.calls.mostRecent().args[0].success();
                    });

                    it('value on item is updated', function () {
                        expect($ctrl.item['customKey']).toEqual('customValue');
                    });

                    it('success handler is executed', function () {
                        expect(successSpy).toHaveBeenCalled();
                    });
                });

                describe('on error', function () {
                    beforeEach(function () {
                        writer.calls.mostRecent().args[0].error();
                    });

                    it('error handler is executed', function () {
                        expect(errorSpy).toHaveBeenCalled();
                    });
                });
            });

            describe('when item has no status', function () {
                it('it is published by default', function () {
                    expect($ctrl.isPublished()).toBeTruthy();
                });

                it('it is not in draft', function () {
                    expect($ctrl.isDraft()).toBeFalsy();
                });

                it('it is not scheduled', function () {
                    expect($ctrl.isScheduled()).toBeFalsy();
                });
            });

            describe('when item has status "draft"', function () {
                beforeEach(function () {
                    $ctrl.item.status = 'draft';
                });

                it('it is not published', function () {
                    expect($ctrl.isPublished()).toBeFalsy();
                });

                it('it is in draft', function () {
                    expect($ctrl.isDraft()).toBeTruthy();
                });

                it('it is not scheduled', function () {
                    expect($ctrl.isScheduled()).toBeFalsy();
                });
            });

            describe('when item has status "published" and has publication time in the past', function () {
                beforeEach(function () {
                    $ctrl.item.status = 'published';
                    $ctrl.item.publicationTime = moment().subtract(1, 'day');
                });

                it('it is published', function () {
                    expect($ctrl.isPublished()).toBeTruthy();
                });

                it('it is not in draft', function () {
                    expect($ctrl.isDraft()).toBeFalsy();
                });

                it('it is not scheduled', function () {
                    expect($ctrl.isScheduled()).toBeFalsy();
                });
            });

            describe('when item has status "published" and has publication time in future', function () {
                beforeEach(function () {
                    $ctrl.item.status = 'published';
                    $ctrl.item.publicationTime = moment().add(1, 'day');
                });

                it('it is published', function () {
                    expect($ctrl.isPublished()).toBeTruthy();
                });

                it('it is not in draft', function () {
                    expect($ctrl.isDraft()).toBeFalsy();
                });

                it('it is scheduled', function () {
                    expect($ctrl.isScheduled()).toBeTruthy();
                });
            });
        });

        describe('with detailsCtrl', function () {
            beforeEach(function () {
                $ctrl.detailsCtrl = jasmine.createSpyObj('spy', ['onItemUpdate']);
            });

            it('not movable', function () {
                $ctrl.$onInit();
                expect($ctrl.movable).toEqual('false');
            });

            it('assert default template', function () {
                $ctrl.$onInit();
                expect($ctrl.templateUrl).toEqual('bin-catalog-item-details-default.html');
            });

            it('override template', function () {
                $ctrl.templateUrl = 'override.html';
                $ctrl.$onInit();
                expect($ctrl.templateUrl).toEqual('override.html');
            });

            it('subscribes for item updates', function () {
                $ctrl.$onInit();
                expect($ctrl.detailsCtrl.onItemUpdate).toHaveBeenCalled();
            });

            describe('on item update', function () {
                beforeEach(function () {
                    $ctrl.$onInit();
                    $ctrl.detailsCtrl.onItemUpdate.calls.mostRecent().args[0](item);
                });

                it('item is available on ctrl', function () {
                    expect($ctrl.item).toEqual(item);
                });

                it('i18n codes are available', function () {
                    expect($ctrl.i18n).toEqual({
                        title: 'item-id',
                        altTitle: 'item-id.title',
                        lead: 'item-id.lead',
                        body: 'item-id.body'
                    });
                });

                it('image code is available', function () {
                    expect($ctrl.image).toEqual({
                        cover: 'imagesitem-id/cover.img'
                    });
                });
            });

            it('when item is already given, do not listen for changes on detailsCtrl', function () {
                $ctrl.item = item;
                $ctrl.$onInit();
                expect($ctrl.detailsCtrl.onItemUpdate).not.toHaveBeenCalled();
            });
        });

        describe('with itemsCtrl', function () {
            beforeEach(function () {
                $ctrl.itemsCtrl = {
                    moveUp: jasmine.createSpy().and.returnValue(true),
                    moveDown: jasmine.createSpy().and.returnValue(true),
                    moveTop: jasmine.createSpy().and.returnValue(true),
                    moveBottom: jasmine.createSpy().and.returnValue(true)
                };
                $ctrl.item = item;
            });

            it('assert default template', function () {
                $ctrl.$onInit();
                expect($ctrl.templateUrl).toEqual('bin-catalog-item-list-default.html');
            });

            it('assert override template defined with itemsCtrl', function () {
                $ctrl.itemsCtrl.itemTemplateUrl = 'override.html';
                $ctrl.$onInit();
                expect($ctrl.templateUrl).toEqual('override.html');
            });

            it('override template', function () {
                $ctrl.templateUrl = 'override.html';
                $ctrl.$onInit();
                expect($ctrl.templateUrl).toEqual('override.html');
            });

            describe('and items are movable', function () {
                beforeEach(function () {
                    $ctrl.itemsCtrl.movable = true;
                    $ctrl.$onInit();
                });

                it('on move up', function () {
                    var actual = $ctrl.moveUp();
                    expect($ctrl.itemsCtrl.moveUp).toHaveBeenCalledWith(item);
                    expect(actual).toBeTruthy();
                });

                it('on move down', function () {
                    var actual = $ctrl.moveDown();
                    expect($ctrl.itemsCtrl.moveDown).toHaveBeenCalledWith(item);
                    expect(actual).toBeTruthy();
                });

                it('on move to top', function () {
                    var actual = $ctrl.moveTop();
                    expect($ctrl.itemsCtrl.moveTop).toHaveBeenCalledWith(item);
                    expect(actual).toBeTruthy();
                });

                it('on move to bottom', function () {
                    var actual = $ctrl.moveBottom();
                    expect($ctrl.itemsCtrl.moveBottom).toHaveBeenCalledWith(item);
                    expect(actual).toBeTruthy();
                });
            });

            it('on catalog.item.pinned event', function () {
                $ctrl.$onInit();
                topicsMock['catalog.item.pinned.' + item.id]();
                expect($ctrl.item.pinned).toBeTruthy();
            });

            it('on catalog.item.unpinned event', function () {
                $ctrl.$onInit();
                topicsMock['catalog.item.unpinned.' + item.id]();
                expect($ctrl.item.pinned).toBeFalsy();
            });

            it('on destroy, unsubscribe events', function () {
                $ctrl.$onInit();
                $ctrl.$onDestroy();
                expect(topicsMock['catalog.item.pinned.' + item.id]).toBeUndefined();
                expect(topicsMock['catalog.item.unpinned.' + item.id]).toBeUndefined();
            });

            describe('check if move action is allowed', function () {
                beforeEach(function () {
                    $ctrl.item = item;
                    $ctrl.$onInit();
                });

                it('when movable but no permission', function () {
                    $ctrl.movable = 'true';
                    expect($ctrl.isMoveAllowed()).toBeFalsy();
                });

                describe('when user has permission', function () {
                    beforeEach(function () {
                        binarta.checkpoint.gateway.addPermission('catalog.item.update');
                        binarta.checkpoint.profile.refresh();
                    });

                    it('and is movable', function () {
                        $ctrl.movable = 'true';
                        expect($ctrl.isMoveAllowed()).toBeTruthy();
                    });

                    it('and is not movable', function () {
                        $ctrl.movable = 'false';
                        expect($ctrl.isMoveAllowed()).toBeFalsy();
                    });
                });
            });
        });

        describe('on refresh', function () {
            var returned;

            beforeEach(function () {
                findCatalogItemByIdMock.and.returnValue('promise');
                $ctrl.item = item;
                $ctrl.$onInit();
                returned = $ctrl.refresh();
            });

            it('item is requested', function () {
                expect(findCatalogItemByIdMock).toHaveBeenCalledWith(item.id, jasmine.any(Function));
            });

            it('request returns promise', function () {
                expect(returned).toEqual('promise');
            });

            describe('on success', function () {
                var newItem;

                beforeEach(function () {
                    newItem = {
                        id: 'new-item-id'
                    };
                    findCatalogItemByIdMock.calls.mostRecent().args[1](newItem);
                });

                it('item is updated', function () {
                    expect($ctrl.item).toEqual(newItem);
                });
            });
        });

        describe('check if pin action is allowed', function () {
            beforeEach(function () {
                $ctrl.item = item;
                $ctrl.$onInit();
            });

            it('when pinnable but no permission', function () {
                $ctrl.pinnable = 'true';
                expect($ctrl.isPinAllowed()).toBeFalsy();
            });

            describe('when user has permission', function () {
                beforeEach(function () {
                    binarta.checkpoint.gateway.addPermission('catalog.item.pin');
                    binarta.checkpoint.profile.refresh();
                });

                it('and is pinnable', function () {
                    $ctrl.pinnable = 'true';
                    expect($ctrl.isPinAllowed()).toBeTruthy();
                });

                it('and is not pinnable', function () {
                    $ctrl.pinnable = 'false';
                    expect($ctrl.isPinAllowed()).toBeFalsy();
                });

                it('and item is already pinned', function () {
                    $ctrl.pinnable = 'true';
                    $ctrl.item.pinned = true;
                    expect($ctrl.isPinAllowed()).toBeFalsy();
                });
            });
        });

        describe('check if unpin action is allowed', function () {
            beforeEach(function () {
                $ctrl.item = item;
                $ctrl.$onInit();
            });

            it('when pinnable but no permission', function () {
                $ctrl.pinnable = 'true';
                expect($ctrl.isUnpinAllowed()).toBeFalsy();
            });

            describe('when user has permission', function () {
                beforeEach(function () {
                    binarta.checkpoint.gateway.addPermission('catalog.item.unpin');
                    binarta.checkpoint.profile.refresh();
                });

                it('and is pinnable', function () {
                    $ctrl.pinnable = 'true';
                    $ctrl.item.pinned = true;
                    expect($ctrl.isUnpinAllowed()).toBeTruthy();
                });

                it('and is not pinnable', function () {
                    $ctrl.pinnable = 'false';
                    $ctrl.item.pinned = true;
                    expect($ctrl.isUnpinAllowed()).toBeFalsy();
                });

                it('and item is not pinned', function () {
                    $ctrl.pinnable = 'true';
                    $ctrl.item.pinned = false;
                    expect($ctrl.isUnpinAllowed()).toBeFalsy();
                });
            });
        });

        describe('check if remove action is allowed', function () {
            beforeEach(function () {
                $ctrl.item = item;
                $ctrl.$onInit();
            });

            it('when removable but no permission', function () {
                $ctrl.removable = 'true';
                expect($ctrl.isRemoveAllowed()).toBeFalsy();
            });

            describe('when user has permission', function () {
                beforeEach(function () {
                    binarta.checkpoint.gateway.addPermission('catalog.item.remove');
                    binarta.checkpoint.profile.refresh();
                });

                it('and is removable', function () {
                    $ctrl.removable = 'true';
                    expect($ctrl.isRemoveAllowed()).toBeTruthy();
                });

                it('and is not removable', function () {
                    $ctrl.removable = 'false';
                    expect($ctrl.isRemoveAllowed()).toBeFalsy();
                });
            });
        });

        describe('check if link action is allowed', function () {
            beforeEach(function () {
                $ctrl.item = item;
                $ctrl.$onInit();
            });

            it('when linkable but no permission', function () {
                $ctrl.linkable = 'true';
                expect($ctrl.isLinkAllowed()).toBeFalsy();
            });

            describe('when user has permission', function () {
                beforeEach(function () {
                    binarta.checkpoint.gateway.addPermission('catalog.item.update');
                    binarta.checkpoint.profile.refresh();
                });

                it('and is linkable', function () {
                    $ctrl.linkable = 'true';
                    expect($ctrl.isLinkAllowed()).toBeTruthy();
                });

                it('and is not linkable', function () {
                    $ctrl.linkable = 'false';
                    expect($ctrl.isLinkAllowed()).toBeFalsy();
                });
            });
        });

        describe('check if publish action is allowed', function () {
            beforeEach(function () {
                $ctrl.item = item;
                $ctrl.$onInit();
            });

            it('when publishable but no permission', function () {
                $ctrl.publishable = 'true';
                expect($ctrl.isPublishAllowed()).toBeFalsy();
            });

            describe('when user has permission', function () {
                beforeEach(function () {
                    binarta.checkpoint.gateway.addPermission('catalog.item.update');
                    binarta.checkpoint.profile.refresh();
                });

                it('and is publishable', function () {
                    $ctrl.publishable = 'true';
                    expect($ctrl.isPublishAllowed()).toBeFalsy();
                });

                describe('and item is in status "draft"', function () {
                    beforeEach(function () {
                        $ctrl.item.status = 'draft';
                    });

                    it('and is publishable', function () {
                        $ctrl.publishable = 'true';
                        expect($ctrl.isPublishAllowed()).toBeTruthy();
                    });

                    it('and is not publishable', function () {
                        $ctrl.publishable = 'false';
                        expect($ctrl.isPublishAllowed()).toBeFalsy();
                    });
                });
            });
        });

        describe('check if unpublish action is allowed', function () {
            beforeEach(function () {
                $ctrl.item = item;
                $ctrl.$onInit();
            });

            it('when publishable but no permission', function () {
                $ctrl.publishable = 'true';
                expect($ctrl.isUnpublishAllowed()).toBeFalsy();
            });

            describe('when user has permission', function () {
                beforeEach(function () {
                    binarta.checkpoint.gateway.addPermission('catalog.item.update');
                    binarta.checkpoint.profile.refresh();
                });

                it('and is publishable', function () {
                    $ctrl.publishable = 'true';
                    expect($ctrl.isUnpublishAllowed()).toBeFalsy();
                });

                describe('and item is in status "published"', function () {
                    beforeEach(function () {
                        $ctrl.item.status = 'published';
                    });

                    it('and is publishable', function () {
                        $ctrl.publishable = 'true';
                        expect($ctrl.isUnpublishAllowed()).toBeTruthy();
                    });

                    it('and is not publishable', function () {
                        $ctrl.publishable = 'false';
                        expect($ctrl.isUnpublishAllowed()).toBeFalsy();
                    });
                });
            });
        });

        describe('when items are pinnable', function () {
            beforeEach(function () {
                $ctrl.item = item;
                $ctrl.$onInit();
            });

            describe('on pin', function () {
                var returnValue;

                beforeEach(function () {
                    returnValue = $ctrl.pin();
                });

                it('call the item pinner', function () {
                    expect(pinnerMock.pin.calls.mostRecent().args[0].item.id).toEqual($ctrl.item.id);
                });

                it('pass the return value', function () {
                    expect(returnValue).toBe(true);
                });

                describe('on success', function () {
                    beforeEach(function () {
                        pinnerMock.pin.calls.mostRecent().args[0].success();
                    });

                    it('the item is flagged as pinned', function () {
                        expect($ctrl.item.pinned).toBeTruthy();
                    })
                });
            });

            describe('on unpin', function () {
                var returnValue;

                beforeEach(function () {
                    returnValue = $ctrl.unpin();
                });

                it('call the item pinner', function () {
                    expect(pinnerMock.unpin.calls.argsFor(0)[0].item.id).toEqual($ctrl.item.id);
                });

                it('pass the return value', function () {
                    expect(returnValue).toBe(true);
                });

                describe('on success', function () {
                    beforeEach(function () {
                        pinnerMock.unpin.calls.argsFor(0)[0].success();
                    });

                    it('the item is flagged as not pinned', function () {
                        expect($ctrl.item.pinned).toBe(false);
                    })
                });
            });
        });

        describe('and item is removable', function () {
            beforeEach(function () {
                $ctrl.item = item;
                $ctrl.$onInit();
            });

            describe('on remove', function () {
                var actual;

                beforeEach(function () {
                    $ctrl.remove().then(function () {
                        actual = true;
                    });
                });

                it('catalog item remove requested', function () {
                    expect(removeMock).toHaveBeenCalledWith({id: item.id});
                });

                it('when called again after item is removed', function () {
                    removeMock.calls.reset();
                    removeDeferred.resolve();
                    $rootScope.$digest();
                    $ctrl.remove();
                    expect(removeMock).not.toHaveBeenCalled();
                });

                describe('when used with detailsCtrl', function () {
                    beforeEach(function () {
                        $ctrl.detailsCtrl = {
                            partition: '/partition'
                        };
                        removeDeferred.resolve();
                        $rootScope.$digest();
                    });

                    it('redirect to browse page', function () {
                        expect($location.path()).toEqual('/lang/browse/partition');
                    });
                });

                describe('when used with detailsCtrl and type is "blog"', function () {
                    beforeEach(function () {
                        $ctrl.detailsCtrl = {
                            type: 'blog',
                            partition: '/partition'
                        };
                        removeDeferred.resolve();
                        $rootScope.$digest();
                    });

                    it('redirect to browse page', function () {
                        expect($location.path()).toEqual('/lang/blog');
                    });
                });

                describe('when used with itemsCtrl', function () {
                    beforeEach(function () {
                        $ctrl.itemsCtrl = {
                            remove: jasmine.createSpy('spy')
                        };
                        removeDeferred.resolve();
                        $rootScope.$digest();
                    });

                    it('item is removed from items', function () {
                        expect($ctrl.itemsCtrl.remove).toHaveBeenCalledWith(item);
                    });
                });
            });
        });

        describe('and item is linkable', function () {
            beforeEach(function () {
                $ctrl.item = item;
                $ctrl.$onInit();
            });

            describe('on link', function () {
                beforeEach(function () {
                    $ctrl.link();
                });

                it('binLink is opened', function () {
                    expect(binLinkMock.open).toHaveBeenCalled();
                });

                describe('onSubmit callback', function () {
                    var link, target, successSpy, errorSpy;

                    beforeEach(function () {
                        link = 'link';
                        target = '_blank';
                        successSpy = jasmine.createSpy('spy');
                        errorSpy = jasmine.createSpy('spy');
                        binLinkMock.open.calls.mostRecent().args[0].onSubmit({
                            href: link,
                            target: target,
                            success: successSpy,
                            error: errorSpy
                        });
                    });

                    it('writer is called', function () {
                        expect(writer).toHaveBeenCalledWith({
                            data: {
                                treatInputAsId: false,
                                context: 'update',
                                id: $ctrl.item.id,
                                type: $ctrl.item.type,
                                link: link,
                                linkTarget: target
                            },
                            success: jasmine.any(Function),
                            error: jasmine.any(Function)
                        });
                    });

                    describe('on write success', function () {
                        beforeEach(function () {
                            writer.calls.mostRecent().args[0].success();
                        });

                        it('item is updated', function () {
                            expect($ctrl.item.link).toEqual(link);
                            expect($ctrl.item.linkTarget).toEqual(target);
                        });

                        it('success callback is executed', function () {
                            expect(successSpy).toHaveBeenCalled();
                        });
                    });

                    describe('on write success', function () {
                        beforeEach(function () {
                            writer.calls.mostRecent().args[0].error();
                        });

                        it('error callback is executed', function () {
                            expect(errorSpy).toHaveBeenCalled();
                        });
                    });
                });

                describe('onRemove callback', function () {
                    var successSpy, errorSpy;

                    beforeEach(function () {
                        successSpy = jasmine.createSpy('spy');
                        errorSpy = jasmine.createSpy('spy');
                        binLinkMock.open.calls.mostRecent().args[0].onRemove({
                            success: successSpy,
                            error: errorSpy
                        });
                    });

                    it('writer is called', function () {
                        expect(writer).toHaveBeenCalledWith({
                            data: {
                                treatInputAsId: false,
                                context: 'update',
                                id: $ctrl.item.id,
                                type: $ctrl.item.type,
                                link: '',
                                linkTarget: ''
                            },
                            success: jasmine.any(Function),
                            error: jasmine.any(Function)
                        });
                    });

                    describe('on write success', function () {
                        beforeEach(function () {
                            writer.calls.mostRecent().args[0].success();
                        });

                        it('item is updated', function () {
                            expect($ctrl.item.link).toEqual('');
                            expect($ctrl.item.linkTarget).toEqual('');
                        });

                        it('success callback is executed', function () {
                            expect(successSpy).toHaveBeenCalled();
                        });
                    });

                    describe('on write success', function () {
                        beforeEach(function () {
                            writer.calls.mostRecent().args[0].error();
                        });

                        it('error callback is executed', function () {
                            expect(errorSpy).toHaveBeenCalled();
                        });
                    });
                });
            });

            describe('on link with previous data', function () {
                beforeEach(function () {
                    $ctrl.item.link = 'http://test.com';
                    $ctrl.item.linkTarget = '_blank';
                    $ctrl.link();
                });

                it('binLink is opened', function () {
                    expect(binLinkMock.open).toHaveBeenCalledWith({
                        href: $ctrl.item.link,
                        target: $ctrl.item.linkTarget,
                        onSubmit: jasmine.any(Function),
                        onRemove: jasmine.any(Function)
                    });
                });
            });
        });

        describe('and item is publishable', function () {
            beforeEach(function () {
                $ctrl.item = item;
                $ctrl.$onInit();
            });

            it('on publish', function () {
                $ctrl.publish();
                expect(publisherMock.publish).toHaveBeenCalledWith(item);
            });

            describe('on unpublish', function () {
                var returned;

                beforeEach(function () {
                    publisherMock.unpublish.and.returnValue('promise');
                    returned = $ctrl.unpublish();
                });

                it('unpublish is requested', function () {
                    expect(publisherMock.unpublish).toHaveBeenCalledWith(item);
                });

                it('propagates promise', function () {
                    expect(returned).toEqual('promise');
                });
            });
        });

        describe('and subscribes to edit.mode notification', function () {
            beforeEach(function () {
                $ctrl.$onInit();
            });

            it('when in edit-mode', function () {
                topicsMock['edit.mode'](true);
                expect($ctrl.editing).toBeTruthy();
            });

            it('when not in edit-mode', function () {
                topicsMock['edit.mode'](false);
                expect($ctrl.editing).toBeFalsy();
            });

            it('unsubscribe on destroy', function () {
                $ctrl.$onDestroy();
                expect(topicsMock['edit.mode']).toBeUndefined();
            });
        });
    });

    describe('binCatalogPublicationTime component', function () {
        var $ctrl;

        beforeEach(inject(function ($componentController) {
            $ctrl = $componentController('binCatalogPublicationTime');
            $ctrl.$onInit();
        }));

        describe('when in draft', function () {
            beforeEach(function () {
                $ctrl.status = 'draft';
                $ctrl.$onChanges();
            });

            it('is in draft', function () {
                expect($ctrl.isDraft()).toBeTruthy();
            });

            it('publication time is empty', function () {
                expect($ctrl.publicationTime).toEqual('');
            });
        });

        describe('when in draft with previous publication time', function () {
            beforeEach(function () {
                $ctrl.status = 'draft';
                $ctrl.time = '2017-07-19 10:00';
                $ctrl.$onChanges();
            });

            it('is in draft', function () {
                expect($ctrl.isDraft()).toBeTruthy();
            });

            it('publication time is empty', function () {
                expect($ctrl.publicationTime).toEqual('');
            });
        });

        describe('when published', function () {
            beforeEach(function () {
                $ctrl.status = 'published';
                $ctrl.time = '2017-06-19 10:00';
                $ctrl.$onChanges();
            });

            it('is not in draft', function () {
                expect($ctrl.isDraft()).toBeFalsy();
            });

            it('publication time is formatted', function () {
                expect($ctrl.publicationTime).toEqual('Jun 19, 2017 10:00 AM');
            });

            it('is not scheduled', function () {
                expect($ctrl.isScheduled()).toBeFalsy();
            });
        });

        describe('when published with custom format', function () {
            beforeEach(function () {
                $ctrl.status = 'published';
                $ctrl.time = '2017-06-19 10:00';
                $ctrl.format = 'LL';
                $ctrl.$onChanges();
            });

            it('is not in draft', function () {
                expect($ctrl.isDraft()).toBeFalsy();
            });

            it('publication time is formatted', function () {
                expect($ctrl.publicationTime).toEqual('June 19, 2017');
            });

            it('is not scheduled', function () {
                expect($ctrl.isScheduled()).toBeFalsy();
            });
        });

        describe('when published in the future', function () {
            beforeEach(function () {
                $ctrl.status = 'published';
                $ctrl.time = moment().add(1, 'days');
                $ctrl.$onChanges();
            });

            it('is not in draft', function () {
                expect($ctrl.isDraft()).toBeFalsy();
            });

            it('is scheduled', function () {
                expect($ctrl.isScheduled()).toBeTruthy();
            });
        });
    });

    describe('binCatalogItemCta', function () {
        var $ctrl, i18n, i18nDeferred, item, binPages;

        beforeEach(inject(function ($q, $componentController, _binPages_) {
            i18n = jasmine.createSpyObj('i18n', ['resolve']);
            i18nDeferred = $q.defer();
            i18n.resolve.and.returnValue(i18nDeferred.promise);
            binPages = _binPages_;
            item = {id: 'itemId'};
            $ctrl = $componentController('binCatalogItemCta', {i18n: i18n}, {item: item});
            $ctrl.$onInit();
        }));

        it('initial contact path', function () {
            expect($ctrl.contactPath).toEqual('/contact');
        });

        it('has no price', function () {
            expect($ctrl.hasPrice()).toBeFalsy();
        });

        it('when price is zero', function () {
            $ctrl.item.price = 0;
            expect($ctrl.hasPrice()).toBeFalsy();
        });

        it('when price is greater than zero', function () {
            $ctrl.item.price = 1;
            expect($ctrl.hasPrice()).toBeTruthy();
        });

        describe('with price', function () {
            beforeEach(function () {
                $ctrl.item.price = 1;
            });

            it('when item is purchasable', function () {
                $ctrl.purchasable = 'true';
                expect($ctrl.isPurchasable()).toBeTruthy();
            });

            it('when item is not purchasable', function () {
                $ctrl.purchasable = 'false';
                expect($ctrl.isPurchasable()).toBeFalsy();
            });
        });

        it('when contact section is not active', function () {
            binPages.isActive.and.returnValue(false);
            var actual = $ctrl.isContactActive();
            expect(binPages.isActive).toHaveBeenCalledWith('contact');
            expect(actual).toBeFalsy();
        });

        describe('when contact section is active', function () {
            beforeEach(function () {
                binPages.isActive.and.returnValue(true);
                $ctrl.$onInit();
            });

            it('contact is active', function () {
                expect($ctrl.isContactActive()).toBeTruthy();
            });

            it('catalog name and subject prefix are requested', function () {
                expect(i18n.resolve).toHaveBeenCalledWith({code: item.id});
                expect(i18n.resolve).toHaveBeenCalledWith({
                    code: 'catalog.item.more.info.about.button',
                    default: 'More info about'
                });
            });

            describe('when i18n values are resolved', function () {
                beforeEach(function () {
                    i18nDeferred.resolve('t');
                    $rootScope.$digest();
                });

                it('contact path is updated', function () {
                    expect($ctrl.contactPath).toEqual('/contact?subject=t t');
                });
            });
        });
    });

    describe('binCatalogItemRequestInfoForm', function () {
        var $ctrl, i18n, item, topics;

        beforeEach(inject(function ($componentController) {
            i18n = jasmine.createSpyObj('i18n', ['resolve']);
            topics = jasmine.createSpyObj('topics', ['subscribe', 'unsubscribe']);
            $ctrl = $componentController('binCatalogItemRequestInfoForm', {i18n: i18n, topicRegistry: topics});
            $ctrl.detailsCtrl = jasmine.createSpyObj('detailsCtrl', ['registerComponent', 'isComponentRegistered', 'onItemUpdate']);
            item = {
                id: 'id'
            };
        }));

        describe('on init', function () {
            beforeEach(function () {
                $ctrl.$onInit();
            });

            it('component is registered on detailsCtrl', function () {
                expect($ctrl.detailsCtrl.registerComponent).toHaveBeenCalledWith('requestInfoForm');
            });

            it('is listening on item updates', function () {
                expect($ctrl.detailsCtrl.onItemUpdate).toHaveBeenCalled();
            });

            it('default templateUrl is set', function () {
                expect($ctrl.templateUrl).toEqual('bin-catalog-item-request-info-form.html');
            });

            describe('on item update', function () {
                beforeEach(function () {
                    i18n.resolve.and.returnValues('foo', 'bar');
                    $ctrl.detailsCtrl.onItemUpdate.calls.mostRecent().args[0](item);
                });

                it('i18n translations are requested', function () {
                    expect(i18n.resolve).toHaveBeenCalledWith({code: 'catalog.item.more.info.about.button'});
                    expect(i18n.resolve).toHaveBeenCalledWith({code: 'id'});
                });

                describe('on i18n values resolved', function () {
                    beforeEach(function () {
                        $rootScope.$digest();
                    });

                    it('subject is available', function () {
                        expect($ctrl.subject).toEqual('foo - bar -');
                    });

                    it('listen for item name changes', function () {
                        expect(topics.subscribe).toHaveBeenCalledWith('i18n.updated', jasmine.any(Function));
                    });

                    it('when name changes, update subject', function () {
                        topics.subscribe.calls.mostRecent().args[1]({code: item.id, translation: 't'});
                        expect($ctrl.subject).toEqual('foo - t -');
                    });

                    it('when event is received for other code, do not update subject', function () {
                        topics.subscribe.calls.mostRecent().args[1]({code: 'other', translation: 't'});
                        expect($ctrl.subject).toEqual('foo - bar -');
                    });

                    describe('on component destroyed', function () {
                        beforeEach(function () {
                            $ctrl.$onDestroy();
                        });

                        it('unsubscribe handler for listening on name changes', function () {
                            expect(topics.unsubscribe).toHaveBeenCalledWith('i18n.updated', topics.subscribe.calls.mostRecent().args[1]);
                        });
                    });
                });
            });
        });

        describe('when component has already been registered', function () {
            beforeEach(function () {
                $ctrl.detailsCtrl.isComponentRegistered.and.returnValue(true);
                $ctrl.$onInit();
            });

            it('new instance is not registered', function () {
                expect($ctrl.detailsCtrl.registerComponent).not.toHaveBeenCalled();
            });

            it('is not listening on item updates', function () {
                expect($ctrl.detailsCtrl.onItemUpdate).not.toHaveBeenCalled();
            });

            it('templateUrl is not set', function () {
                expect($ctrl.templateUrl).toBeUndefined();
            });
        });
    });
});

angular.module('test.app', ['catalog']).config(['catalogItemUpdatedDecoratorProvider', function (catalogItemUpdatedDecoratorProvider) {
    catalogItemUpdatedDecoratorProvider.add('context', function (args) {
        args.decorated = true;
        return args;
    })
}]);
