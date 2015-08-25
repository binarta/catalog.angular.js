describe('catalog', function () {
    var usecase, ctrl, scope, params, $httpBackend, dispatcher, location, payload, notifications;
    var onSuccess, receivedPayload, rest, i18n;

    angular.module('toggle.edit.mode', []);

    beforeEach(module('catalog'));
    beforeEach(module('config'));
    beforeEach(module('notifications'));
    beforeEach(module('rest.client'));
    beforeEach(module('web.storage'));
    beforeEach(module('i18n'));
    beforeEach(module('test.app'));

    beforeEach(inject(function ($injector, $location, config) {
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
        rest = {service: function (it) {
            rest.ctx = it;
        }};
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
                usecase({query:'query-name', filters:{owner:el}, success:onSuccess});
                expect(receivedPayload).toEqual([]);
            });
        });

        it('on execute perform rest call', inject(function (config) {
            config.namespace = 'namespace';
            $httpBackend.expect('POST', 'api/query/catalog-partition/query-name', {args: {
                namespace: config.namespace,
                owner: 'owner-id'
            }}).respond(200);
            usecase({query:'query-name', filters:{owner:'owner-id'}, success:onSuccess});
            $httpBackend.flush();
        }));

        it('with sortings', inject(function (config) {
            config.namespace = 'namespace';
            $httpBackend.expect('POST', 'api/query/catalog-partition/query-name', {args: {
                namespace: config.namespace,
                owner: 'owner-id',
                sortings:'sortings'
            }}).respond(200);
            usecase({query:'query-name', filters:{owner:'owner-id'}, sortings:'sortings', success:onSuccess});
            $httpBackend.flush();
        }));

        it('with sub set', inject(function (config) {
            config.namespace = 'namespace';
            $httpBackend.expect('POST', 'api/query/catalog-partition/query-name', {args: {
                namespace: config.namespace,
                owner: 'owner-id',
                subset:'subset'
            }}).respond(200);
            usecase({query:'query-name', filters:{owner:'owner-id'}, subset:'subset', success:onSuccess});
            $httpBackend.flush();
        }));

        it('on execute with baseUri perform rest call', inject(function (config) {
            config.baseUri = 'http://host/context';
            $httpBackend.expect('POST', config.baseUri + 'api/query/catalog-partition/query-name').respond(200);
            usecase({query:'query-name', filters:{owner:'owner-id'}, success:onSuccess});
            $httpBackend.flush();
        }));

        it('unexpected responses resolve to an empty set', function () {
            $httpBackend.expect('POST', /.*/).respond(0);
            usecase({query:'query-name', filters:{owner:'owner-id'}, success:onSuccess});
            $httpBackend.flush();
            expect(receivedPayload).toEqual([]);
        });

        it('response payload is passed to success callback', function () {
            $httpBackend.expect('POST', /.*/).respond(200, payload);
            usecase({query:'query-name', filters:{owner:'owner-id'}, success:onSuccess});
            $httpBackend.flush();
            expect(receivedPayload).toEqual(payload);
        })
    });

    describe('findCatalogItemById', function () {
        var fixture;

        beforeEach(inject(function (config, findCatalogItemById, restServiceHandler) {
            config.namespace = 'namespace';
            fixture = {
                config: config,
                rest: restServiceHandler,
                usecase: findCatalogItemById
            };
            payload = undefined;
            onSuccess = function (item) {
                receivedPayload = item;
            };
        }));

        it('on execute perform rest call', function () {
            fixture.usecase('item-id', onSuccess);
            expect(fixture.rest.calls[0].args[0].params.withCredentials).toEqual(true);
            expect(fixture.rest.calls[0].args[0].params.method).toEqual('GET');
            expect(fixture.rest.calls[0].args[0].params.url).toEqual('api/entity/catalog-item?id=item-id');
        });

        it('on execute with baseUri', function () {
            fixture.config.baseUri = 'http://host/context/';
            fixture.usecase('item/id', onSuccess);
            expect(fixture.rest.calls[0].args[0].params.url).toEqual(fixture.config.baseUri + 'api/entity/catalog-item?id=' + encodeURIComponent('item/id'));
        });

        it('unexpected responses resolve to an empty set', function () {
            fixture.usecase('item-id', onSuccess);
            fixture.rest.calls[0].args[0].error();
            expect(receivedPayload).toEqual([]);
        });

        it('response payload is passed to success callback', function () {
            fixture.usecase('type', onSuccess);
            fixture.rest.calls[0].args[0].success(payload);
            expect(receivedPayload).toEqual(payload);
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
            expect(fixture.rest.calls[0].args[0].params.withCredentials).toEqual(true);
            expect(fixture.rest.calls[0].args[0].params.method).toEqual('POST');
            expect(fixture.rest.calls[0].args[0].params.url).toEqual('api/query/catalog-item/findByPartition');
            expect(fixture.rest.calls[0].args[0].params.data).toEqual({
                args: {
                    namespace: config.namespace,
                    partition: 'partition-id'
                }
            });
        }));

        it('on execute with sorting info', inject(function (config) {
            fixture.usecase({partition: 'partition-id', sortBy: 'creationTime', sortOrder: 'desc'}, onSuccess);
            expect(fixture.rest.calls[0].args[0].params.url).toEqual('api/query/catalog-item/findByPartition');
            expect(fixture.rest.calls[0].args[0].params.data).toEqual({
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
            expect(fixture.rest.calls[0].args[0].params.url).toEqual(fixture.config.baseUri + 'api/query/catalog-item/findByPartition');
        }));

        it('unexpected responses resolve to an empty set', function () {
            fixture.usecase({partition: 'partition-id', success: onSuccess});
            fixture.rest.calls[0].args[0].error();
            expect(receivedPayload).toEqual([]);
        });

        it('response payload is passed to success callback', function () {
            fixture.usecase({partition: 'type', success: onSuccess});
            fixture.rest.calls[0].args[0].success(payload);
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

        describe('exposes decorator', function() {
            it('items get added to items array', function() {
                scope.decorator({id:'I'});
                expect(scope.items).toEqual([{id:'I'}]);
            })
        });

        describe('exposes filters customizer', function() {
            var promise;
            var filters = {};
            var subset = {offset:10, count:5};
            var promiseWasResolved = false;

            beforeEach(function() {
                promise = scope.filtersCustomizer({filters:filters, subset:subset})
            });

            it('subset is copied onto filters', function() {
                promise.then(function() {
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
                    expect(fixture.entity.calls[0].args[0]).toEqual(id);
                });

                describe('when catalog item received', function () {
                    beforeEach(function () {
                        fixture.entity.calls[0].args[1](payload);
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
                            fixture.entity.calls[0].args[1](payload);
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
                    notifications['catalog.item.updated']({id:'item-2'});
                });

                it('request catalog item for that id', function () {
                    expect(fixture.entity.calls[0].args[0]).toEqual('item-2');
                });

                describe('when catalog item received', function () {
                    beforeEach(function () {
                        fixture.entity.calls[0].args[1](payload);
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
                        fixture.entity.calls[0].args[1](payload);
                    });

                    it('append item on local scope', function () {
                        expect(scope.items[1]).toEqual(payload);
                    });
                });
            });

            describe('catalog.item.paste notification received', function() {
                beforeEach(function() {
                    scope.items = [
                        {id:'I1', priority:1},
                        {id:'I2', priority:2},
                        {id:'I3', priority:3}
                    ];
                });

                it('first to middle', function() {
                    notifications['catalog.item.paste']({id:'I1', priority:2});
                    expect(scope.items[0]).toEqual({id:'I2', priority:1});
                    expect(scope.items[1]).toEqual({id:'I1', priority:2});
                    expect(scope.items[2]).toEqual({id:'I3', priority:3});
                });

                it('first to last', function() {
                    notifications['catalog.item.paste']({id:'I1', priority:3});
                    expect(scope.items[0]).toEqual({id:'I2', priority:1});
                    expect(scope.items[1]).toEqual({id:'I3', priority:2});
                    expect(scope.items[2]).toEqual({id:'I1', priority:3});
                });

                it('last to first', function() {
                    notifications['catalog.item.paste']({id:'I3', priority:1});
                    expect(scope.items[0]).toEqual({id:'I3', priority:1});
                    expect(scope.items[1]).toEqual({id:'I1', priority:2});
                    expect(scope.items[2]).toEqual({id:'I2', priority:3});
                });

                it('to self', function() {
                    notifications['catalog.item.paste']({id:'I2', priority:2});
                    expect(scope.items[0]).toEqual({id:'I1', priority:1});
                    expect(scope.items[1]).toEqual({id:'I2', priority:2});
                    expect(scope.items[2]).toEqual({id:'I3', priority:3});
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
            return fixture.query.calls[0].args[0];
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

                    it('simple search', function() {
                        ctx.init({query:'ownedBy', owner:'/parent/'});
                        subscribers['app.start']();
                        expect(request().query).toEqual('ownedBy');
                        expect(request().filters.owner).toEqual('/parent/');
                    });

                    it('with sortings', function() {
                        ctx.init({query:'ownedBy', owner:'/parent/', sortings:[{on:'name', orientation:'asc'}]});
                        subscribers['app.start']();
                        expect(request().sortings).toEqual([{on:'name', orientation:'asc'}]);
                    });

                    it('with sub set', function() {
                        ctx.init({query:'ownedBy', owner:'/parent/', subset:{offset:0, count:2}});
                        subscribers['app.start']();
                        expect(request().subset).toEqual({offset:0, count:2});
                    });

                    describe('on search results', function() {
                        beforeEach(function() {
                            ctx.init({query:'ownedBy', owner:'/parent/', subset:{offset:0, count:2}});
                            subscribers['app.start']();
                            request().success([{id:1}]);
                        });

                        it('expose results on scope', function() {
                            expect(ctx.partitions.length).toEqual(1);
                            expect(ctx.partitions[0].id).toEqual(1);
                        });

                        it('increment offset with count', function() {
                            expect(request().subset).toEqual({offset:1, count:2});
                        });

                        describe('when searching for more', function() {
                            beforeEach(function() {
                                fixture.query.reset();
                                ctx.searchForMore();
                                request().success([{id:2}]);
                            });

                            it('increment offset with count', function() {
                                expect(request().subset).toEqual({offset:2, count:2});
                            });

                            it('extends the results', function() {
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
                                expect(fixture.query.calls[0].args[0].query).toEqual('ownedBy');
                                expect(fixture.query.calls[0].args[0].filters.owner).toEqual('/parent/');
                            });

                            describe('and partitions received', function () {
                                beforeEach(function () {
                                    payload = [
                                        {id: '/parent/path/'},
                                        {id: '/parent/another/'}
                                    ];
                                    fixture.query.calls[0].args[0].success(payload);
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
        var ctx, createCtrl, itemTypesLoaded, subscriptions;
        var editMode;
        var handler = function (it) {
            ctx = it;
        };
        var findAllCatalogItemTypes = function (onSuccess) {
            itemTypesLoaded = onSuccess;
        };

        beforeEach(inject(function ($controller, config, topicRegistryMock) {
            editMode = jasmine.createSpyObj('editMode', ['enable']);
            subscriptions = topicRegistryMock;
            config.namespace = 'namespace';
            ctx = {};
            itemTypesLoaded = undefined;
            ctrl = $controller(AddToCatalogController, {
                $scope: scope,
                $routeParams: params,
                topicMessageDispatcher: dispatcher,
                findAllCatalogItemTypes: findAllCatalogItemTypes,
                restServiceHandler: handler,
                editMode: editMode
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
                            scope.item = {
                                type: 'type',
                                name: 'name'
                            };
                            scope.submit();
                        });

                        it('perform rest call', function () {
                            expect(ctx.scope).toEqual(scope);
                            expect(ctx.params.method).toEqual('PUT');
                            expect(ctx.params.url).toEqual('api/entity/catalog-item');
                            expect(ctx.params.data).toEqual({type: 'type', name: 'name', namespace: 'namespace', partition: 'partition', locale: 'l'});
                            expect(ctx.params.withCredentials).toEqual(true);
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
                            expect(ctx.params).toBeUndefined();
                        });
                    });

                    describe('without violation', function () {
                        assertSubmit();
                    });

                    describe('with previous violation', function () {
                        beforeEach(function () {
                            scope.violations = {};
                        });

                        assertSubmit();
                    });
                });

                describe('on submit with baseUri', function () {
                    beforeEach(inject(function (config) {
                        config.baseUri = 'http://host/context/';
                        scope.item = {};
                        scope.submit();
                    }));

                    it('perform rest call', inject(function (config) {
                        expect(ctx.params.url).toEqual(config.baseUri + 'api/entity/catalog-item');
                    }));
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
                    expect(ctx.scope).toEqual(scope);
                    expect(ctx.params.method).toEqual('PUT');
                    expect(ctx.params.url).toEqual('api/entity/catalog-item');
                    expect(ctx.params.data).toEqual({namespace: 'namespace', type: 'type', name: 'name', partition: '', locale: 'l'});
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
                    ctx.success({});
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
                        ctx.success({id: 'item-id'});
                        expect(location.path()).toEqual('/');
                    });

                    it('on submit success raise item added notification', function () {
                        scope.item.name = 'name';
                        scope.item.custom = 'custom-field';

                        scope.submit();
                        ctx.success({id: 'item-id'});

                        expect(dispatcher['catalog.item.added']).toEqual('item-id');
                    });

                    it('on submit clear form dirty state', function () {
                        var pristine = false;
                        scope.form = {
                            $setPristine: function () {
                                pristine = true;
                            }
                        };
                        scope.submit();
                        ctx.success({id: 'item-id'});

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
                ctx.success({id: 'item-id'});
                expect(location.path()).toEqual('/path');
            });
        });

        it('init with redirect to view', function() {
            params.redirectToView = true;
            params.partition = '/partition/';
            subscriptions['app.start']();
            itemTypesLoaded();
            scope.init(params);
            scope.submit();
            ctx.success({id:'/item-id'});
            expect(location.path()).toEqual('/lang/view/item-id');
        });

        it('on success then registered success handler gets executed', function() {
            var successWasCalled = undefined;
            var item = {};
            subscriptions['app.start']();
            itemTypesLoaded();
            scope.success = function(item) {successWasCalled = item; };
            scope.submit();
            ctx.success(item);
            expect(successWasCalled).toEqual(item);
        });

        it('init with edit mode enabled', function() {
            params.editMode = true;
            params.partition = '/partition/';
            subscriptions['app.start']();
            itemTypesLoaded();
            scope.init(params);
            scope.submit();
            ctx.success({id:'/item-id'});
            expect(editMode.enable).toHaveBeenCalled();
        })
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
        }));

        [
            {params: {id: 'id'}, queryString: 'id=/id'}
        ].forEach(function (el) {
                describe('on init with params=' + JSON.stringify(el), function () {
                    it('on init fetch item details', inject(function (topicRegistryMock) {
                        Object.keys(el.params).forEach(function (key) {
                            params[key] = el.params[key];
                        });

                        //$httpBackend.expect('GET', 'api/entity/catalog-item?' + el.queryString).respond(200, {});
                        scope.init();
                        topicRegistryMock['app.start']();
                        //$httpBackend.flush();
                        $httpBackend.verifyNoOutstandingExpectation();
                        $httpBackend.verifyNoOutstandingRequest();
                        expect(fixture.entity.calls[0].args[0]).toEqual(el.params.id);

                        fixture.entity.calls[0].args[1]({
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
                //$httpBackend.expect('GET', /.*/).respond(200, {
                //    id: 'id',
                //    type: 'type',
                //    name: 'name',
                //    locale: 'en'
                //});

                scope.init();
                topicRegistryMock['app.start']();
                expect(fixture.entity.calls[0].args[0]).toEqual('id');
                fixture.entity.calls[0].args[1]({
                    id: 'id',
                    type: 'type',
                    name: 'name',
                    locale: 'en'
                });
                //$httpBackend.flush();
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
                notifications['catalog.item.updated']({id:'item-2'});
            });

            it('request catalog item for that id', function () {
                expect(fixture.entity.calls[0].args[0]).toEqual('item-2');
            });

            describe('when catalog item received', function () {
                beforeEach(function () {
                    fixture.entity.calls[0].args[1](payload);
                });

                it('update item on local scope', function () {
                    expect(scope.item).toEqual(payload);
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
            ctrl = $controller(AddPartitionToCatalogController, {$scope: scope, $routeParams: params, restServiceHandler: handler});
        }));

        describe('with query params', function () {
            beforeEach(inject(function ($controller) {
                params = {owner: 'owner'};
                location.search(params);
                ctrl = $controller(AddPartitionToCatalogController, {$scope: scope, $routeParams: params, restServiceHandler: handler});
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
                expect(messages['catalog.partition.added'].name).toNotEqual('');
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
                    expectRedirectTo('/browse/parent/');
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
                expect(location.path()).toEqual('/path/');
            });

            it('when initialised with on success handler execute it after item removal', function() {
                var executed = false;
                scope.init({success:function() {executed = true;}});
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
                                findCatalogItemById:findItemById
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
                                    topicRegistryMock['app.start']();
                                    expect(findItemById.calls[0].args[0]).toEqual(filePath);
                                }
                            }));
                        });

                        describe('on init using controller', function () {
                            beforeEach(function () {
                                ctrl.init(filePath)
                            });

                            it('and app.start notification received', inject(function (config, topicRegistryMock) {
                                if (filePath) {
                                    topicRegistryMock['app.start']();
                                    expect(findItemById.calls[0].args[0]).toEqual(filePath);
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

                    describe('with registered success handler', function() {
                        var updatedItem;

                        beforeEach(function() {
                            scope.init(item, {success:function(args){updatedItem = args}});
                            writer.success();
                        });

                        describe('look up item by id', function() {
                            it('with id from scoped item', inject(function() {
                                expect(fixture.entity.calls[0].args[0]).toEqual(scope.item.id);
                            }));

                            describe('on find by id callback', function() {
                                var refreshedItem = {name:'item-id-1'};

                                beforeEach(function() {
                                    fixture.entity.calls[0].args[1](refreshedItem);
                                });

                                it('test', inject(function() {
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
                    expect(fixture.entity.calls[0].args[0]).toEqual(scope.item.id);
                });

                describe('when catalog item received', function () {
                    beforeEach(function () {
                        scope.item.customField = 'modified';

                        fixture.entity.calls[0].args[1](payload);
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

        it('masking fields on payload', function() {
            scope.init(
                {unmasked:'original',masked1:'original', masked2:'original'},
                {mask:{masked1:'masked', masked2:'masked'}}
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
                scope1.init({id: 'item-1', priority:1});
                scope2.init({id: 'item-2', priority:2});
            }));

            it('then controllers are in idle mode', function() {
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

                it('raise catalog.item.cut', function() {
                    expect(dispatcher['catalog.item.cut']).toEqual('ok');
                });

                it('on catalog.item.cut exit idle mode', function() {
                    onCutEventHandlers.forEach(function(it) {it();});
                    expect(scope1.idle).toEqual(false);
                    expect(scope2.idle).toEqual(false);
                });

                describe('and pasting it on another', function() {
                    beforeEach(function() {
                        scope2.paste();
                    });

                    it('then priority is updated', function() {
                        expect(writer.data().context).toEqual('updatePriority');
                        expect(writer.data().id.id).toEqual('item-1');
                        expect(writer.data().priority).toEqual(2);
                    });

                    it('no catalog.item.paste should be raised yet', function() {
                        expect(dispatcher['catalog.item.paste']).toBeUndefined()
                    });

                    describe('on success', function() {
                        beforeEach(function() {
                            writer.success();
                        });

                        it('raise catalog.item.paste event', function() {
                            expect(dispatcher['catalog.item.paste']).toEqual({id:'item-1', priority:2});
                        });

                        it('on catalog.item.paste enter idle mode', function() {
                            onPasteEventHandlers.forEach(function(it) {it();});
                            expect(scope1.idle).toEqual(true);
                            expect(scope2.idle).toEqual(true);
                        });
                    });
                });
            });
        });
    });

    describe('CatalogItemUpdatedDecorators', function() {
        var decorator;

        beforeEach(inject(function(catalogItemUpdatedDecorator) {
            decorator = catalogItemUpdatedDecorator;
        }));

        describe('when decorating', function() {
            it('return args by default', function() {
                expect(decorator({context:'unregistered', id: 'I'})).toEqual({context:'unregistered', id: 'I'});
            });

            describe('with a registered decorator', function() {
                it('test', function() {
                    expect(decorator({context:'context'}).decorated).toBeTruthy();
                })
            });
        });
    });

    describe('on update catalog item', function () {
        var writer, onSuccessSpy;
        var args = {
            data: {
                id: 'item-id',
                context: 'update-id'
            }
        };

        beforeEach(inject(function (updateCatalogItem, updateCatalogItemWriterSpy, topicMessageDispatcherMock) {
            onSuccessSpy = jasmine.createSpy('onSuccessSpy');
            args.success = onSuccessSpy;
            writer = updateCatalogItemWriterSpy;
            dispatcher = topicMessageDispatcherMock;
            updateCatalogItem(args);
        }));

        it('invoke writer', function() {
            writer.invokedFor(args);
        });

        describe('on write success', function() {
            beforeEach(function() {
                writer.success();
            });

            it('raise system success', function() {
                expect(dispatcher['system.success']).toEqual({
                    code: 'catalog.item.updated',
                    default: 'Catalog item updated!'
                });
            });

            it('raise catalog item updated', function() {
                expect(dispatcher['catalog.item.updated']).toEqual(args.data);
            });

            it('execute on success handler', function() {
                expect(onSuccessSpy.calls[0]).toBeTruthy();
            });

            it('support updatePriority context', function() {
                args.data.context = 'updatePriority';
                args.data.id = {id:'I'};
                writer.success();
                expect(dispatcher['catalog.item.updated']).toEqual({id:'I'});
            })
        });
    });

    describe('catalogItemPrice directive', function () {
        var element, html, scope, isolateScope, editMode, editModeRenderer, writer, topics;

        beforeEach(inject(function ($rootScope, $compile, _editMode_, _editModeRenderer_, updateCatalogItemWriterSpy, topicRegistryMock) {
            editMode = _editMode_;
            editModeRenderer = _editModeRenderer_;
            writer = updateCatalogItemWriterSpy;
            topics = topicRegistryMock;
            scope = $rootScope.$new();
            scope.item = {
                price: 1050
            };
            html = '<div catalog-item-price="item"></div>';
            element = angular.element(html);
            $compile(element)(scope);
            isolateScope = element.isolateScope();
        }));

        it('item is passed to directive', function () {
            expect(isolateScope.item).toEqual(scope.item);
        });

        it('price is on isolate scope', function () {
            isolateScope.$digest();

            expect(isolateScope.price).toEqual(10.5);
        });

        it('template is rendered', function () {
            isolateScope.$digest();

            expect(element.text()).toEqual('$10.50');
        });

        it('edit mode is bound', function () {
            expect(editMode.bindEvent).toHaveBeenCalledWith({
                scope: isolateScope,
                element: element,
                permission: 'catalog.item.update',
                onClick: jasmine.any(Function)
            });
        });

        it('put editing on isolate scope', function () {
            expect(isolateScope.editing).toBeFalsy();
        });

        describe('when edit mode is enabled', function () {
            beforeEach(function () {
                topics['edit.mode'](true);
            });

            it('put editing on isolate scope', function () {
                expect(isolateScope.editing).toBeTruthy();
            });
        });

        describe('on click', function () {
            beforeEach(function () {
                editMode.bindEvent.mostRecentCall.args[0].onClick();
            });

            it('editModeRenderer is opended', function () {
                expect(editModeRenderer.open).toHaveBeenCalled();
            });

            describe('with editModeRenderer scope', function () {
                var rendererScope;

                beforeEach(function () {
                    rendererScope = editModeRenderer.open.mostRecentCall.args[0].scope;
                });

                it('price is recalculated', function () {
                    expect(rendererScope.price).toEqual(10.5);
                });

                describe('on update with valid form', function () {
                    beforeEach(function () {
                        rendererScope.catalogItemPriceForm = {
                            catalogItemPrice: {
                                $invalid: false
                            },
                            $valid: true
                        };
                        rendererScope.price = 20.6567;
                        rendererScope.update();
                    });

                    it('invoke writer', function() {
                        expect(writer.data()).toEqual({
                            price: 2066,
                            context: 'update'
                        });
                    });

                    it('on success', function () {
                        writer.success();

                        expect(isolateScope.price).toEqual(20.66);
                        expect(editModeRenderer.close).toHaveBeenCalled();
                    });
                });

                describe('on update with invalid form', function () {
                    beforeEach(function () {
                        rendererScope.catalogItemPriceForm = {
                            catalogItemPrice: {
                                $invalid: true
                            },
                            $valid: false
                        };

                        rendererScope.update();
                    });

                    it('put violation on scope', function () {
                        expect(rendererScope.violations).toEqual({
                            price: ['invalid']
                        });
                    });
                });

                it('on close', function () {
                    rendererScope.close();

                    expect(editModeRenderer.close).toHaveBeenCalled();
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
            {columns: 1, expected: [
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
            ]},
            {columns: 2, expected: [
                [1, 2],
                [3, 4],
                [5, 6],
                [7, 8],
                [9, 10]
            ]},
            {columns: 3, expected: [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9],
                [10]
            ]},
            {columns: 4, expected: [
                [1, 2, 3, 4],
                [5, 6, 7, 8],
                [9, 10]
            ]},
            {columns: 5, expected: [
                [1, 2, 3, 4, 5],
                [6, 7, 8, 9, 10]
            ]},
            {columns: 6, expected: [
                [1, 2, 3, 4, 5, 6],
                [7, 8, 9, 10]
            ]},
            {columns: 7, expected: [
                [1, 2, 3, 4, 5, 6, 7],
                [8, 9, 10]
            ]},
            {columns: 8, expected: [
                [1, 2, 3, 4, 5, 6, 7, 8],
                [9, 10]
            ]},
            {columns: 9, expected: [
                [1, 2, 3, 4, 5, 6, 7, 8, 9],
                [10]
            ]},
            {columns: 10, expected: [
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            ]}
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
});

angular.module('test.app', ['catalog']).config(['catalogItemUpdatedDecoratorProvider', function(catalogItemUpdatedDecoratorProvider) {
    catalogItemUpdatedDecoratorProvider.add('context', function(args) {
        args.decorated = true;
        return args;
    })
}]);
