(function () {
    angular.module('catalog', [
        'angular.usecase.adapter',
        'angularx',
        'application',
        'application.pages',
        'bin.price',
        'binarta-applicationjs-angular1',
        'binarta-checkpointjs-angular1',
        'binarta-catalogjs-angular1',
        'carousel',
        'catalogx.gateway',
        'checkpoint',
        'config',
        'grid.layout',
        'i18n',
        'image.carousel',
        'momentx',
        'ngRoute',
        'notifications',
        'rest.client',
        'toggle.edit.mode',
        'web.storage'
    ])
        .provider('catalogItemUpdatedDecorator', CatalogItemUpdatedDecoratorsFactory)
        .factory('updateCatalogItem', ['updateCatalogItemWriter', 'topicMessageDispatcher', 'catalogItemUpdatedDecorator', UpdateCatalogItemFactory])
        .factory('addCatalogItem', ['$location', 'config', 'localeResolver', 'restServiceHandler', 'topicMessageDispatcher', 'i18nLocation', 'editMode', AddCatalogItemFactory])
        .factory('removeCatalogItem', ['config', 'restServiceHandler', RemoveCatalogItemFactory])
        .factory('addCatalogPartition', ['config', 'restServiceHandler', AddCatalogPartitionFactory])
        .factory('removeCatalogPartition', ['config', 'restServiceHandler', RemoveCatalogPartitionFactory])
        .factory('findAllCatalogItemTypes', ['config', '$http', FindAllCatalogItemTypesFactory])
        .factory('findCatalogPartitions', ['config', '$http', FindCatalogPartitionsFactory])
        .factory('findCatalogItemById', ['$q', 'config', 'restServiceHandler', 'binarta', FindCatalogItemByIdFactory])
        .factory('findCatalogItemsByPartition', ['config', 'restServiceHandler', FindCatalogItemsByPartitionFactory])
        .factory('catalogPathProcessor', [CatalogPathProcessorFactory])
        .factory('catalogPathParser', ['catalogPathProcessor', 'catalogPathLimit', CatalogPathParserFactory])
        .factory('itemPinner', ['topicMessageDispatcher', 'restServiceHandler', 'config', ItemPinnerFactory])
        .service('binCatalogItemPublisher', ['$rootScope', 'moment', 'updateCatalogItemWriter', 'editModeRenderer', BinCatalogItemPublisherService])
        .service('binWidgetSettings', ['$rootScope', 'binarta', 'updateCatalogItemWriter', 'editModeRenderer', BinWidgetSettingsService])
        .controller('BinBrowseCatalogPage', ['binarta', 'config', 'catalogPathParser', '$routeParams', '$log', BinBrowseCatalogPage])
        .controller('ListCatalogPartitionsController', ['$scope', 'findCatalogPartitions', 'ngRegisterTopicHandler', ListCatalogPartitionsController])
        .controller('AddToCatalogController', ['$scope', '$routeParams', 'topicRegistry', 'findAllCatalogItemTypes', 'addCatalogItem', 'usecaseAdapterFactory', AddToCatalogController])
        .controller('RemoveCatalogPartitionController', ['config', '$scope', '$location', 'scopedRestServiceHandler', 'topicMessageDispatcher', 'topicRegistry', RemoveCatalogPartitionController])
        .controller('RemoveItemFromCatalogController', ['config', '$scope', 'i18nLocation', 'catalogPathProcessor', 'topicMessageDispatcher', 'scopedRestServiceHandler', RemoveItemFromCatalogController])
        .controller('QueryCatalogController', ['$scope', 'ngRegisterTopicHandler', 'findCatalogItemsByPartition', 'findCatalogItemById', 'topicMessageDispatcher', '$q', QueryCatalogController])
        .controller('AddPartitionToCatalogController', ['config', '$scope', '$location', '$routeParams', 'scopedRestServiceHandler', 'topicMessageDispatcher', AddPartitionToCatalogController])
        .controller('UpdateCatalogItemController', ['config', '$scope', 'updateCatalogItem', 'usecaseAdapterFactory', 'topicMessageDispatcher', 'findCatalogItemById', UpdateCatalogItemController])
        .controller('binSpotlightController', ['topicRegistry', 'binarta', 'configWriter', 'i18nLocation', BinSpotlightController])
        .controller('binSpotlightItemsController', ['topicRegistry', 'binartaSearch', 'viewport', BinSpotlightItemsController])
        .component('binSpotlight', new BinSpotlightComponent())
        .component('binSpotlightItems', new BinSpotlightItemsComponent())
        .component('binCatalogBrowse', new BinCatalogBrowseComponent())
        .component('binCatalogBrowsePartitions', new BinCatalogBrowsePartitionsComponent())
        .component('binCatalogList', new BinCatalogListComponent())
        .component('binCatalogPartitions', new BinCatalogPartitionsComponent())
        .component('binCatalogPartitionAdd', new BinCatalogPartitionAddComponent())
        .component('binCatalogPartition', new BinCatalogPartitionComponent())
        .component('binCatalogPartitionTitle', new BinCatalogPartitionTitleComponent())
        .component('binCatalogRawPartitionTitle', new BinCatalogRawPartitionTitleComponent())
        .component('binCatalogPartitionDescription', new BinCatalogPartitionDescriptionComponent())
        .component('binCatalogBreadcrumb', new BinCatalogBreadcrumbComponent())
        .component('binCatalogRawBreadcrumb', new BinCatalogRawBreadcrumbComponent())
        .component('binCatalogSearch', new BinCatalogSearchComponent())
        .component('binCatalogRawSearch', new BinCatalogRawSearchComponent())
        .component('binCatalogItemGroups', new BinCatalogItemGroupsComponent())
        .component('binCatalogItems', new BinCatalogItemsComponent())
        .component('binCatalogItemAdd', new BinCatalogItemAddComponent())
        .component('binCatalogSearchMore', new BinCatalogSearchMoreComponent())
        .component('binCatalogWorking', new BinCatalogWorkingComponent())
        .component('binCatalogEmpty', new BinCatalogEmptyComponent())
        .component('binCatalogDetails', new BinCatalogDetailsComponent())
        .component('binCatalogItem', new BinCatalogItemComponent())
        .component('binCatalogItemImage', new BinCatalogItemImageComponent())
        .component('binCatalogItemImageGallery', new BinCatalogItemImageGalleryComponent())
        .component('binCatalogItemSpecSheet', new BinCatalogItemSpecSheetComponent())
        .component('binCatalogPublicationTime', new BinCatalogPublicationTime())
        .component('binCatalogItemCta', new BinCatalogItemCta())
        .component('binCatalogItemTitle', new BinCatalogItemTitleComponent())
        .component('binCatalogItemRequestInfoForm', new BinCatalogItemRequestInfoForm())
        .component('binCatalogItemRequestInfoButton', new BinCatalogItemRequestInfoButton())
        .constant('catalogPathLimit', 10)
        .config(['catalogItemUpdatedDecoratorProvider', function (catalogItemUpdatedDecoratorProvider) {
            catalogItemUpdatedDecoratorProvider.add('updatePriority', function (args) {
                return args.id;
            });
        }])
        .config(['$routeProvider', 'catalogPathLimit', function ($routeProvider, catalogPathLimit) {
            for (var i = 0; i <= catalogPathLimit; i++) {
                var path = generatePath(i);
                $routeProvider.when('/browse' + path + '/', {
                    templateUrl: 'bin-catalog-browse-page.html',
                    controller: 'BinBrowseCatalogPage as $ctrl'
                });
                $routeProvider.when('/view' + path, {templateUrl: 'partials/catalog/item.html'});
                $routeProvider.when('/:locale/browse' + path + '/', {
                    templateUrl: 'bin-catalog-browse-page.html',
                    controller: 'BinBrowseCatalogPage as $ctrl'
                });
                $routeProvider.when('/:locale/view' + path, {templateUrl: 'partials/catalog/item.html'});
            }

            function generatePath(levels) {
                var path = '';
                for (var i = 0; i <= levels; i++) path += '/:d' + i;
                return path;
            }
        }]);

    function FindCatalogPartitionsFactory(config, $http) {
        return function (args) {
            var onSuccess = args.success;
            var onError = function () {
                onSuccess([]);
            };

            if (!args.filters.owner) onSuccess([]);
            else {
                var ctx = {
                    namespace: config.namespace,
                    owner: args.filters.owner
                };
                if (args.sortings) ctx.sortings = args.sortings;
                if (args.subset) ctx.subset = args.subset;
                $http.post((config.baseUri || '') + 'api/query/catalog-partition/' + args.query, {args: ctx}).error(onError).success(onSuccess);
            }
        };
    }

    function FindCatalogItemByIdFactory($q, config, restServiceHandler, binarta) {
        return function (id, onSuccess) {
            var deferred = $q.defer();
            binarta.schedule(function () {
                var locale = binarta.application.localeForPresentation() || binarta.application.locale();
                return restServiceHandler({
                    params: {
                        method: 'GET',
                        url: (config.baseUri || '') + 'api/entity/catalog-item?id=' + encodeURIComponent(id) + '&locale=' + locale,
                        headers: {'X-Binarta-Carousel': true},
                        params: {
                            treatInputAsId: true
                        },
                        withCredentials: true
                    },
                    error: function () {
                        onSuccess([]);
                    },
                    success: onSuccess
                }).then(deferred.resolve, deferred.reject);
            });
            return deferred.promise;
        };
    }

    function FindCatalogItemsByPartitionFactory(config, restServiceHandler) {
        return function (args) {
            args.namespace = config.namespace;

            restServiceHandler({
                params: {
                    method: 'POST',
                    url: (config.baseUri || '') + 'api/query/catalog-item/findByPartition',
                    data: {args: args},
                    withCredentials: true
                },
                error: function () {
                    args.success([]);
                },
                success: args.success
            });
        };
    }

    function CatalogPathProcessorFactory() {
        var toParts = function (path) {
            var parts = path.split('/');
            parts.pop();
            parts.shift();
            return parts;
        };

        var toHead = function (parts) {
            return parts ? parts[0] : undefined;
        };

        var toName = function (parts) {
            return parts ? parts[parts.length - 1] : undefined;
        };

        var toBreadcrumbs = function (parts, type) {
            return parts.map(function (it, idx) {
                var active = idx + 1 == parts.length;
                return {
                    path: '/' + parts.slice(0, idx + 1).join('/') + (type == 'file' && active ? '' : '/'),
                    name: it,
                    active: active
                };
            });
        };

        var toParent = function (parts) {
            if (parts.length == 0) return '';
            var parent = parts.slice(0, parts.length - 1);
            if (parent.length == 0) return '/';
            return '/' + parent.join('/') + '/';
        };

        return function (path, type) {
            var parts = toParts(path);
            return {
                path: type == 'file' && path.slice(-1) == '/' ? path.slice(0, path.length - 1) : path,
                parts: parts,
                head: toHead(parts),
                name: toName(parts),
                breadcrumbs: toBreadcrumbs(parts, type),
                parent: toParent(parts)
            };
        };
    }

    function CatalogPathParserFactory(catalogPathProcessor, catalogPathLimit) {
        var toPath = function (params) {
            var path = '/';
            for (var i = 0; i <= catalogPathLimit; i++)
                path += params['d' + i] ? params['d' + i] + '/' : '';
            path = path + (path.slice(-1) == '/' ? '' : '/');
            return path;
        };

        return function (params, type) {
            var path = toPath(params);
            return catalogPathProcessor(path, type);
        };
    }

    function QueryCatalogController($scope, ngRegisterTopicHandler, findCatalogItemsByPartition, findCatalogItemById, topicMessageDispatcher, $q) {
        $scope.items = [];

        $scope.decorator = function (item) {
            $scope.items.push(item);
        };

        $scope.filtersCustomizer = function (args) {
            var deferred = $q.defer();
            args.filters.offset = args.subset.offset;
            args.filters.count = args.subset.count;
            deferred.resolve();
            return deferred.promise;
        };

        $scope.forPartition = function (partition, args) {
            $scope.partition = partition;
            if (!args) args = {};

            ngRegisterTopicHandler($scope, 'catalog.item.added', function (id) {
                findCatalogItemById(id, function (item) {
                    if (args.onAddition == 'prepend') $scope.items.unshift(item);
                    else $scope.items.push(item);
                });
            });

            ngRegisterTopicHandler($scope, 'catalog.item.updated', function (args) {
                findCatalogItemById(args.id, function (item) {
                    for (var i = 0; i < $scope.items.length; i++) {
                        if ($scope.items[i].id == args.id) {
                            $scope.items[i] = item;
                            break;
                        }
                    }
                });
            });

            ngRegisterTopicHandler($scope, 'catalog.item.removed', function (id) {
                $scope.items.forEach(function (it) {
                    if (it.id == id) $scope.items.splice($scope.items.indexOf(it), 1);
                });
            });

            ngRegisterTopicHandler($scope, 'catalog.item.paste', function (evt) {
                var fromIdx = $scope.items.reduce(function (p, c, i) {
                    return c.id == evt.id ? i : p;
                }, undefined);
                var from = $scope.items[fromIdx];

                var toIdx = $scope.items.reduce(function (p, c, i) {
                    return c.priority == evt.priority ? i : p;
                }, undefined);
                var to = $scope.items[toIdx];

                $scope.items.forEach(function (it) {
                    it.priority += (it.priority <= evt.priority && it.priority > from.priority ? -1 : 0);
                    it.priority += (it.priority >= evt.priority && it.priority < from.priority ? 1 : 0);
                });

                from.priority = evt.priority;

                $scope.items.sort(function (x, y) {
                    return x.priority - y.priority;
                });
            });
        };
    }

    function BinBrowseCatalogPage(binarta, config, catalogPathParser, $routeParams, $log) {
        var $ctrl = this;

        $ctrl.templateUrl = 'bin-catalog-browse-page-default.html';
        if (!config.BinBrowseCatalogPage || !config.BinBrowseCatalogPage.useLibraryTemplate) {
            $ctrl.templateUrl = 'partials/catalog/browse.html';
            $log.warn('@Deprecated - BinBrowseCatalogPage.templateUrl = \"' + $ctrl.templateUrl + '\"! Set config.BinBrowseCatalogPage.useDefaultTemplate = true to remedy!');
        }
        if (config.BinBrowseCatalogPage) {
            if (config.BinBrowseCatalogPage.templateUrl)
                $ctrl.templateUrl = config.BinBrowseCatalogPage.templateUrl;
        }

        var c = catalogPathParser($routeParams);
        $ctrl.type = c.head || $routeParams.type;
        binarta.catalog.browser.type($ctrl.type);
        binarta.catalog.browser.path(c.path);
        if(c.parent)
            binarta.catalog.browser.parentPath(c.parent);
    }

    function ListCatalogPartitionsController($scope, findCatalogPartitions, ngRegisterTopicHandler) {
        var self = this;

        this.toParent = function (path) {
            if (path) {
                var parts = path.split('/');
                parts.pop();
                parts.pop();
                return parts.join('/') + '/';
            } else return '/';
        };

        $scope.init = function (q, p) {
            init(q, p, $scope);
        };
        this.init = function (q, p) {
            init(q, p, self);
        };

        function init(query, partition, context) {
            var args;

            if (query && partition) {
                args = {query: query, owner: partition};
            } else {
                args = query;
            }

            var defaultSubset;
            if (args.subset) defaultSubset = args.subset;

            var ctx = {
                query: args.query,
                filters: {owner: args.owner}
            };

            function executeQuery() {
                ctx.success = function (partitions) {
                    if (!context.partitions) context.partitions = [];

                    if (ctx.subset) ctx.subset.offset += partitions.length;
                    partitions.forEach(function (it) {
                        context.partitions.push(it);
                    });
                };
                if (args.sortings) ctx.sortings = args.sortings;
                if (!ctx.subset && defaultSubset) {
                    ctx.subset = {offset: defaultSubset.offset, count: defaultSubset.count};
                }
                findCatalogPartitions(ctx);
            }

            context.partition = args.owner;
            context.parent = context.partition == '/' ? undefined : self.toParent(context.partition);
            context.searchForMore = function () {
                executeQuery();
            };

            var added = function (partition) {
                if (partition.owner == context.partition) context.partitions.push(partition);
            };

            var removed = function (id) {
                context.partitions.forEach(function (it) {
                    if (it.id == id) context.partitions.splice(context.partitions.indexOf(it), 1);
                });
            };

            ngRegisterTopicHandler($scope, 'app.start', function () {
                executeQuery();
            });

            ngRegisterTopicHandler($scope, 'catalog.partition.added', added);
            ngRegisterTopicHandler($scope, 'catalog.partition.removed', removed);
        }
    }

    function RemoveCatalogPartitionController(config, $scope, $location, scopedRestServiceHandler, topicMessageDispatcher, topicRegistry) {
        var self = this;

        $scope.init = function (id) {
            self.id = id;

        };

        $scope.submit = function (redirectPath) {
            scopedRestServiceHandler({
                scope: $scope,
                params: {
                    method: 'DELETE',
                    url: (config.baseUri || '') + 'api/entity/catalog-partition?id=' + encodeURIComponent(self.id),
                    withCredentials: true
                },
                success: function () {
                    topicMessageDispatcher.fire('system.success', {
                        code: 'catalog.partition.remove.success',
                        default: 'Partition removed!'
                    });
                    topicMessageDispatcher.fire('catalog.partition.removed', self.id);
                    if (redirectPath) $location.path(redirectPath);
                }
            });
        };
    }

    function FindAllCatalogItemTypesFactory(config, $http) {
        return function (onSuccess) {
            $http.post((config.baseUri || '') + 'api/query/catalog-item-type').success(onSuccess);
        };
    }

    function AddCatalogItemFactory($location, config, localeResolver, restServiceHandler, topicMessageDispatcher, i18nLocation, editMode) {
        return function (args) {
            args.item.namespace = config.namespace;
            if (!args.item.locale) args.item.locale = localeResolver();

            return restServiceHandler({
                params: {
                    method: 'PUT',
                    url: (config.baseUri || '') + 'api/entity/catalog-item',
                    data: args.item,
                    withCredentials: true
                },
                success: function (item) {
                    topicMessageDispatcher.fire('catalog.item.added', item.id);
                    if (args.success) args.success(item);
                    if (args.redirectTo) $location.path(args.redirectTo);
                    if (args.redirectToView) i18nLocation.path('/view' + item.id);
                    if (args.editMode) editMode.enable();
                },
                rejected: args.rejected
            });
        };
    }

    function RemoveCatalogItemFactory(config, restServiceHandler) {
        return function (args) {
            return restServiceHandler({
                params: {
                    method: 'DELETE',
                    url: (config.baseUri || '') + 'api/entity/catalog-item?id=' + encodeURIComponent(args.id),
                    withCredentials: true
                }
            });
        };
    }

    function AddCatalogPartitionFactory(config, restServiceHandler) {
        return function (args) {
            return restServiceHandler({
                params: {
                    method: 'PUT',
                    url: (config.baseUri || '') + 'api/entity/catalog-partition',
                    data: {
                        namespace: config.namespace,
                        owner: args.partition,
                        name: args.name
                    },
                    withCredentials: true
                },
                success: function (partition) {
                    if (args.success) args.success(partition);
                },
                rejected: function (violations) {
                    if (args.rejected) args.rejected(violations);
                }
            });
        };
    }

    function RemoveCatalogPartitionFactory(config, restServiceHandler) {
        return function (args) {
            return restServiceHandler({
                params: {
                    method: 'DELETE',
                    url: (config.baseUri || '') + 'api/entity/catalog-partition?id=' + encodeURIComponent(args.id),
                    withCredentials: true
                }
            });
        };
    }

    function AddToCatalogController($scope, $routeParams, topicRegistry, findAllCatalogItemTypes, addCatalogItem, usecaseAdapterFactory) {
        var self = this;

        var preselectedType, locale;
        var reset = function () {
            $scope.partition = $scope.partition || $routeParams.partition || '';
            $scope.item = {};
            $scope.item.type = $routeParams.type || preselectedType || '';
            $scope.item.name = '';
            $scope.typeSelected = $routeParams.type;
            if ($routeParams.partition) $scope.partition = $routeParams.partition;
            if ($scope.form) $scope.form.$setPristine();
        };

        $scope.noredirect = function (partition, type) {
            $scope.init({partition: partition, type: type});
        };

        $scope.init = function (params) {
            $scope.config = params;
            if (params.partition) $scope.partition = params.partition;
            if (params.type) preselectedType = params.type;
            if (params.redirectTo) $scope.redirectTo = params.redirectTo;
            if (params.locale) locale = params.locale;
        };

        $scope.templateUri = function () {
            return 'partials/catalog/add/' + (!$scope.item || $scope.item.type == '' ? 'default' : $scope.item.type) + '.html';
        };

        $scope.submit = function () {
            var onSuccess = function (item) {
                if ($scope.success) $scope.success(item);
                reset();
                if (isSuccessHandlerPresent()) executeSuccessHandler(item);
            };

            $scope.violations = undefined;
            if ($scope.catalogItemAddForm && $scope.catalogItemAddForm.defaultName.$invalid) {
                $scope.violations = {
                    defaultName: ['required']
                };
            }

            var ctx = usecaseAdapterFactory($scope);

            if (!$scope.violations) {
                $scope.item.partition = $scope.partition;
                $scope.item.locale = locale;

                addCatalogItem({
                    item: $scope.item,
                    success: onSuccess,
                    rejected: ctx.rejected,
                    redirectTo: $scope.redirectTo,
                    redirectToView: $scope.config && $scope.config.redirectToView,
                    editMode: $scope.config && $scope.config.editMode
                });
            }
        };

        function isSuccessHandlerPresent() {
            return $scope.config && $scope.config.success;
        }

        function executeSuccessHandler(item) {
            $scope.config.success(item);
        }

        topicRegistry.subscribe('app.start', function () {
            findAllCatalogItemTypes(function (types) {
                $scope.types = types;
                reset();
            });
        });
    }

    function AddPartitionToCatalogController(config, $scope, $location, $routeParams, restServiceHandler, topicMessageDispatcher) {
        var self = this;

        $scope.owner = $location.search().owner;
        this.noredirect = false;

        $scope.init = function (owner) {
            $scope.owner = owner;
            $scope.name = '';
            self.noredirect = true;
        };

        $scope.submit = function (onSuccessPath) {
            restServiceHandler({
                scope: $scope,
                params: {
                    method: 'PUT',
                    url: (config.baseUri || '') + 'api/entity/catalog-partition',
                    data: {
                        namespace: config.namespace,
                        owner: $scope.owner,
                        name: $scope.name
                    },
                    withCredentials: true
                },
                success: function (it) {
                    if (!self.noredirect)
                        $location.path(onSuccessPath || '/catalog/' + $routeParams.owner);
                    else {
                        topicMessageDispatcher.fire('catalog.partition.added', {
                            id: it.id,
                            owner: $scope.owner,
                            name: $scope.name
                        });
                        $scope.name = '';
                    }
                }
            });
        };
    }

    function RemoveItemFromCatalogController(config, $scope, i18nLocation, catalogPathProcessor, topicMessageDispatcher, scopedRestServiceHandler) {
        var self = this;
        self.config = {};

        $scope.init = function (config) {
            self.config = config;
        };

        function isRedirectEnabled() {
            return !self.config.noredirect;
        }

        function isSuccessHandlerPresent() {
            return self.config.success;
        }

        function executeSuccessHandler() {
            self.config.success();
        }

        function toParent(current) {
            return '/browse' + current.parent;
        }

        $scope.submit = function (id) {
            var current = catalogPathProcessor(id + '/', 'file');
            $scope.current = current;
            scopedRestServiceHandler({
                scope: $scope,
                params: {
                    method: 'DELETE',
                    url: (config.baseUri || '') + 'api/entity/catalog-item?id=' + encodeURIComponent(id),
                    withCredentials: true
                },
                success: function () {
                    if (self.config.successNotification != false) topicMessageDispatcher.fire('system.success', {
                        code: 'catalog.item.removed',
                        default: 'Item removed!'
                    });
                    topicMessageDispatcher.fire('catalog.item.removed', id);
                    topicMessageDispatcher.fire('edit.mode.unlock', id);
                    if (isRedirectEnabled()) i18nLocation.path(self.config.redirect || toParent(current)).search({});
                    if (isSuccessHandlerPresent()) executeSuccessHandler();
                }
            });
        };
    }

    function UpdateCatalogItemController(config, $scope, updateCatalogItem, usecaseAdapterFactory, topicMessageDispatcher, findCatalogItemById) {
        var unbindWatch;
        var self = this;
        self.config = {};

        $scope.init = function (item, config) {
            if (config == undefined) config = {};
            $scope.item = angular.copy(item);
            $scope.item.context = 'update';
            $scope.unchanged = true;
            if (config.mask) Object.keys(config.mask).forEach(function (it) {
                $scope.item[it] = config.mask[it];
            });
            if ($scope.form) $scope.form.$setPristine();
            if (config.lockEditModeOnDirty || config.lockEditModeOnDirty == undefined) bindWatch();
            self.config = config || {};
        };

        function isSuccessHandlerPresent() {
            return self.config.success;
        }

        function executeSuccessHandler() {
            findCatalogItemById($scope.item.id, function (item) {
                self.config.success(item);
            });
        }

        function bindWatch() {
            if (unbindWatch) unbindWatch();
            unbindWatch = $scope.$watch('item', function (newValue, oldValue) {
                if (newValue != oldValue && $scope.unchanged) {
                    $scope.unchanged = false;
                    topicMessageDispatcher.fire('edit.mode.lock', $scope.item.id);
                }
            }, true);
        }

        $scope.cancel = function () {
            findCatalogItemById($scope.item.id, function (item) {
                $scope.init(item);
            });
            topicMessageDispatcher.fire('edit.mode.unlock', $scope.item.id);
        };

        $scope.update = function (params) {
            if (params && params.beforeUpdate) params.beforeUpdate($scope.item);
            $scope.item.namespace = config.namespace;
            var ctx = usecaseAdapterFactory($scope);
            ctx.data = $scope.item;
            ctx.success = function () {
                if (params && params.success) params.success($scope.item);
                topicMessageDispatcher.fire('edit.mode.unlock', $scope.item.id);
                $scope.unchanged = true;
                if ($scope.form) $scope.form.$setPristine();
                if (isSuccessHandlerPresent()) executeSuccessHandler();
            };
            updateCatalogItem(ctx);
        };

        $scope.$on('$routeChangeStart', function () {
            if (!$scope.unchanged) topicMessageDispatcher.fire('edit.mode.unlock', $scope.item.id);
        });
    }

    function CatalogItemUpdatedDecoratorsFactory() {
        var decorators = {};
        var defaultDecorator = function (args) {
            return args;
        };
        return {
            add: function (context, decorator) {
                decorators[context] = decorator;
            },
            $get: function () {
                return function (args) {
                    return decorators[args.context] ? decorators[args.context](args) : defaultDecorator(args);
                };
            }
        };
    }

    function UpdateCatalogItemFactory(updateCatalogItemWriter, topicMessageDispatcher, catalogItemUpdatedDecorator) {
        return function (args) {
            if (args.data.treatInputAsId == undefined) args.data.treatInputAsId = true;
            var onSuccess = args.success;
            args.success = function () {
                if (args.successNotification != false) fireSuccessNotification();
                topicMessageDispatcher.fire('catalog.item.updated', catalogItemUpdatedDecorator(args.data));
                onSuccess();
            };
            updateCatalogItemWriter(args);
        };

        function fireSuccessNotification() {
            topicMessageDispatcher.fire('system.success', {
                code: 'catalog.item.updated',
                default: 'Catalog item updated!'
            });
        }
    }

    function ItemPinnerFactory(topics, rest, config) {
        function params(usecase, ctx) {
            usecase = usecase || 'catalog.item.pin';
            return {
                method: 'POST',
                withCredentials: true,
                url: (config.baseUri || '') + 'api/usecase',
                data: {
                    headers: {usecase: usecase},
                    payload: {id: ctx.item.id}
                }
            };
        }

        function sucessAndFireTopic(topic, ctx) {
            return function (payload) {
                topics.fire(topic, ctx.item);
                topics.fire(topic + '.' + ctx.item.id, ctx.item);
                if (ctx.success) ctx.success(payload);
            };
        }

        return {
            pin: function (ctx) {
                return rest({
                    params: params('catalog.item.pin', ctx),
                    success: sucessAndFireTopic('catalog.item.pinned', ctx)
                });
            },
            unpin: function (ctx) {
                return rest({
                    params: params('catalog.item.unpin', ctx),
                    success: sucessAndFireTopic('catalog.item.unpinned', ctx)
                });
            }
        };
    }

    function BinSpotlightComponent() {
        this.bindings = {
            type: '@',
            cols: '@',
            center: '@',
            itemTemplateUrl: '<?',
            onNoItems: '&',
            onHasItems: '&'
        };
        this.transclude = {
            header: '?binSpotlightHeader',
            footer: '?binSpotlightFooter'
        };
        this.templateUrl = 'bin-spotlight.html';
        this.controller = 'binSpotlightController';
    }

    function BinSpotlightController(topics, binarta, configWriter, location) {
        var $ctrl = this;
        $ctrl.totalItemCount = 0;
        $ctrl.pinnedItemCount = 0;

        this.$onInit = function () {
            topics.subscribe('edit.mode', onEditMode);

            binarta.schedule(function () {
                binarta.application.config.findPublic('catalog.' + $ctrl.type + '.recent.items', function (value) {
                    $ctrl.recentItems = (value == 'true' || value === true);
                });

                binarta.application.config.findPublic('catalog.' + $ctrl.type + '.spotlight.view.switch.allowed', function (value) {
                    $ctrl.allowViewSwitch = (value == 'true' || value === true);
                });

                binarta.application.config.findPublic('catalog.' + $ctrl.type + '.spotlight.view', function (value) {
                    $ctrl.view = value || 'default';
                });
            });

            $ctrl.goToOverview = function () {
                location.path('/browse/' + $ctrl.type + '/');
            };

            $ctrl.$onDestroy = function () {
                topics.unsubscribe('edit.mode', onEditMode);
            };

            executeCallbacks();
        };

        this.areRecentItemsAllowed = function () {
            return $ctrl.view === 'default';
        };

        this.plus = function (args) {
            $ctrl.totalItemCount += args.size;
            executeCallbacks();
            if (args.isPinned) $ctrl.pinnedItemCount += args.size;
        };

        this.toggleRecentItems = function () {
            $ctrl.recentItems = !$ctrl.recentItems;
            configWriter({key: 'catalog.' + $ctrl.type + '.recent.items', value: $ctrl.recentItems, scope: 'public'});
        };

        this.switchToDefaultView = function () {
            $ctrl.view = 'default';
            configWriter({key: 'catalog.' + $ctrl.type + '.spotlight.view', value: $ctrl.view, scope: 'public'});
        };

        this.switchToGridView = function () {
            $ctrl.view = 'grid';
            configWriter({key: 'catalog.' + $ctrl.type + '.spotlight.view', value: $ctrl.view, scope: 'public'});
        };

        function onEditMode(editing) {
            $ctrl.editing = editing;
            executeCallbacks();
        }

        function executeCallbacks() {
            if ($ctrl.totalItemCount <= 0 && !$ctrl.editing) {
                if ($ctrl.onNoItems) $ctrl.onNoItems();
            } else if ($ctrl.onHasItems) $ctrl.onHasItems();
        }
    }

    function BinSpotlightItemsComponent() {
        this.bindings = {
            pinned: '@'
        };
        this.require = {
            spotlightCtrl: '^binSpotlight'
        };
        this.templateUrl = 'bin-spotlight-items.html';
        this.controller = 'binSpotlightItemsController';
    }

    function BinSpotlightItemsController(topics, search, viewport) {
        var $ctrl = this, isPinned;

        this.$onInit = function () {
            $ctrl.cols = $ctrl.spotlightCtrl.cols;
            $ctrl.center = $ctrl.spotlightCtrl.center;
            $ctrl.itemTemplateUrl = $ctrl.spotlightCtrl.itemTemplateUrl || 'bin-catalog-item-list-default.html';
            isPinned = $ctrl.pinned == 'true';
            $ctrl.results = [];
            if (isPinned) initPinnedConfiguration();
            topics.subscribe('edit.mode', onEditMode);

            var args = {
                entity: 'catalog-item',
                action: 'search',
                subset: {
                    offset: 0,
                    count: getSubsetCount()
                },
                includeCarouselItems: true,
                sortings: [
                    {on: 'creationTime', orientation: 'desc'}
                ],
                filters: {
                    type: $ctrl.spotlightCtrl.type
                },
                complexResult: true,
                success: render
            };
            if (isPinned) args.filters.pinned = true;
            search(args);

            function getSubsetCount() {
                return isPinned ? 50 : viewport.visibleXs() ? 6 : 8;
            }

            function render(data) {
                $ctrl.results = data.results;
                if ($ctrl.pinned != 'true') $ctrl.searchForMore = data.hasMore;
                $ctrl.spotlightCtrl.plus({size: $ctrl.results.length, isPinned: isPinned});
            }

            $ctrl.$onDestroy = function () {
                if ($ctrl.pinned == 'true') uninstallPinnedTopics();
                $ctrl.spotlightCtrl.plus({size: -$ctrl.results.length, isPinned: isPinned});
            };
        };

        function onEditMode(editing) {
            $ctrl.editing = editing;
        }

        function initPinnedConfiguration() {
            topics.subscribe('catalog.item.pinned', onPinned);
            topics.subscribe('catalog.item.unpinned', onUnpinned);
            $ctrl.searchForMore = true;
        }

        function uninstallPinnedTopics() {
            topics.unsubscribe('catalog.item.pinned', onPinned);
            topics.unsubscribe('catalog.item.unpinned', onUnpinned);
        }

        function onPinned(item) {
            if (item.type == $ctrl.spotlightCtrl.type) {
                $ctrl.results.push(item);
                $ctrl.spotlightCtrl.plus({size: 1, isPinned: isPinned});
            }
        }

        function onUnpinned(item) {
            var idx = $ctrl.results.reduce(function (p, c, i) {
                if (c.id == item.id) return i;
                return p;
            }, -1);
            if (idx > -1) {
                $ctrl.results.splice(idx, 1);
                $ctrl.spotlightCtrl.plus({size: -1, isPinned: isPinned});
            }
        }
    }

// Start of new components

    function BinCatalogItemPublisherService($rootScope, moment, updateCatalogItem, editModeRenderer) {
        var published = 'published', draft = 'draft', timeFormat = 'lll';

        this.publish = function (item) {
            var scope = $rootScope.$new();
            scope.publicationTime = item.publicationTime ? moment(item.publicationTime) : moment();
            scope.cancel = editModeRenderer.close;

            scope.submit = function () {
                scope.violation = false;
                scope.working = true;
                var time = moment(scope.publicationTime, timeFormat).format();

                updateCatalogItem({
                    data: {
                        treatInputAsId: false,
                        context: 'update',
                        id: item.id,
                        type: item.type,
                        blogType: item.blogType,
                        status: published,
                        publicationTime: time
                    },
                    success: onSuccess,
                    error: onError
                });

                function onSuccess() {
                    item.status = published;
                    item.publicationTime = time;
                    editModeRenderer.close();
                }

                function onError() {
                    scope.violation = true;
                    scope.working = false;
                }
            };

            editModeRenderer.open({
                templateUrl: 'bin-catalog-item-publisher-edit.html',
                scope: scope
            });
        };

        this.unpublish = function (item) {
            return updateCatalogItem({
                data: {
                    treatInputAsId: false,
                    context: 'update',
                    id: item.id,
                    type: item.type,
                    blogType: item.blogType,
                    status: draft
                },
                success: onSuccess
            });

            function onSuccess() {
                item.status = draft;
            }
        };
    }

    function BinWidgetSettingsService($rootScope, binarta, updateCatalogItem, editModeRenderer) {
        this.configure = function (args) {
            var ui = args.ui;
            var item = args.item;
            var widget = args.widget;
            var component = args.component;
            var overrideAttribute = args.overrideAttribute;
            var settings = binarta.application.display.settings.component(component).widget(widget);

            var scope = $rootScope.$new();
            scope.item = item;
            scope.fittingRuleAttribute = overrideAttribute;
            scope.status = 'defaults-mode';
            scope.cancel = editModeRenderer.close;
            scope.$on('$destroy', settings.observe({
                attributes: function (it) {
                    scope.working = false;
                    scope.defaultAttributes = it;
                },
                working: function () {
                    scope.working = true;
                },
                rejected: function (report) {
                    scope.working = false;
                    scope.violations = report;
                },
                saved: function () {
                    editModeRenderer.close();
                    if (ui && ui.updated)
                        ui.updated();
                }
            }).disconnect);

            scope.switchToItemMode = function () {
                scope.status = 'item-mode';
            };

            scope.switchToDefaultsMode = function () {
                scope.status = 'defaults-mode';
            };

            scope.submit = function () {
                scope.violations = {};

                if (scope.status == 'defaults-mode')
                    settings.save(scope.defaultAttributes);
                else if (scope.status == 'item-mode') {
                    scope.working = true;

                    var data = {
                        treatInputAsId: false,
                        context: 'update',
                        id: item.id,
                        type: item.type
                    };
                    data[overrideAttribute] = item[overrideAttribute];
                    updateCatalogItem({
                        data: data,
                        success: onSuccess,
                        error: onError,
                        rejected: function (report) {
                            scope.violations = report;
                        }
                    });

                    function onSuccess() {
                        scope.working = false;
                        editModeRenderer.close();
                        if (ui && ui.updated)
                            ui.updated();
                    }

                    function onError() {
                        scope.working = false;
                    }
                }
            };

            editModeRenderer.open({
                templateUrl: 'bin-widget-settings.html',
                scope: scope
            });
        };
    }

    function BinCatalogBrowseComponent() {
        this.templateUrl = 'bin-catalog-browse-component.html';
        this.bindings = {
            searchMode: '@',
            itemTemplateUrl: '@',
            partitionsTemplateUrl: '@',
            partitionTitleTemplateUrl: '@'
        };
        this.controller = ['binarta', binComponentController(function (binarta) {
            var $ctrl = this;

            $ctrl.addInitHandler(function () {
                $ctrl.partitionsTemplateUrl = $ctrl.partitionsTemplateUrl || 'bin-catalog-browse-component-partitions-default.html';

                $ctrl.addDestroyHandler(binarta.catalog.browser.observe({
                    type: function (it) {
                        $ctrl.type = it;
                    }
                }).disconnect);
            });
        })]
    }

    function BinCatalogBrowsePartitionsComponent() {
        this.templateUrl = 'bin-catalog-browse-partitions-component.html';
        this.require = {parent: '^^binCatalogBrowse'};
    }

    function BinCatalogListComponent() {
        this.templateUrl = ['$attrs', function ($attrs) {
            return $attrs.templateUrl || 'bin-catalog-transclude.html';
        }];
        this.transclude = true;

        this.bindings = {
            type: '@',
            partition: '@',
            recursivelyByPartition: '@',
            oneLevelPartition: '@',
            count: '@'
        };

        this.controller = ['binarta', '$location', '$routeParams', 'catalogPathParser', 'binartaSearch', binComponentController(function (binarta, $location, $routeParams, catalogPathParser, binartaSearch) {
            var $ctrl = this;
            var count = 50, offset = 0, moreItemsAvailable = false, working = false;

            $ctrl.addInitHandler(function () {
                if (!$ctrl.type)
                    $ctrl.addDestroyHandler(binarta.catalog.browser.observe({
                        type: function (it) {
                            $ctrl.type = it;
                        },
                        path: function (it) {
                            $ctrl.partition = it;
                        },
                        parentPath: function (it) {
                            $ctrl.parent = it;
                        }
                    }).disconnect);
                $ctrl.items = [];
                if ($ctrl.count) count = parseInt($ctrl.count);
                $ctrl.search = search;
                $ctrl.refresh = search;
                $ctrl.searchMore = searchItems;
                $ctrl.hasMore = hasMore;
                $ctrl.isWorking = isWorking;
                searchItems();
            });

            function search() {
                reset();
                searchItems();
            }

            function reset() {
                $ctrl.items.splice(0, $ctrl.items.length);
                offset = 0;
                moreItemsAvailable = false;
            }

            function searchItems() {
                if (working) return;
                working = true;
                var filters = {type: $ctrl.type};
                var sortings = [
                    {on: 'partition', orientation: 'asc'},
                    {on: 'priority', orientation: 'desc'}
                ];
                if ($ctrl.partition) {
                    if ($ctrl.recursivelyByPartition === 'true') filters.recursivelyByPartition = $ctrl.partition;
                    else if ($ctrl.oneLevelPartition === 'true') {
                        filters.oneLevelPartition = $ctrl.partition;
                        sortings.unshift({on: 'partitionPriority', orientation: 'asc'});
                    } else filters.partition = $ctrl.partition;
                }
                var ctx = {
                    action: 'search',
                    entity: 'catalog-item',
                    filters: filters,
                    sortings: sortings,
                    subset: {count: count, offset: offset},
                    includeCarouselItems: true,
                    complexResult: true,
                    success: onSuccess,
                    rejected: onRejected
                };
                if ($location.search().q) ctx.q = $location.search().q;
                binartaSearch(ctx);
            }

            function onSuccess(data) {
                moreItemsAvailable = data.hasMore;
                if (moreItemsAvailable) offset += count;
                else $ctrl.searchMore = function () {
                };
                data.results.forEach(function (item) {
                    $ctrl.items.push(item);
                });
                working = false;
            }

            function onRejected() {
                working = false;
            }

            function hasMore() {
                return moreItemsAvailable;
            }

            function isWorking() {
                return working;
            }
        })];
    }

    function BinCatalogPartitionsComponent() {
        this.templateUrl = ['$attrs', function ($attrs) {
            return $attrs.templateUrl || 'bin-catalog-partitions.html';
        }];

        this.transclude = true;

        this.bindings = {
            partition: '@',
            parent: '@',
            removable: '@',
            addable: '@'
        };

        this.require = {
            listCtrl: '?^^binCatalogList'
        };

        this.controller = ['$timeout', 'findCatalogPartitions', 'topicRegistry', 'binarta', 'config', 'restServiceHandler', '$q', function ($timeout, findCatalogPartitions, topicRegistry, binarta, config, rest, $q) {
            var $ctrl = this,
                editing = false,
                delay = 300;

            $ctrl.$onInit = function () {
                $ctrl.partitions = [];
                if ($ctrl.listCtrl) {
                    if (!$ctrl.partition) $ctrl.partition = $ctrl.listCtrl.partition;
                    if (!$ctrl.parent) $ctrl.parent = $ctrl.listCtrl.parent;
                }
                installMoveActions();
                search();

                $ctrl.isPartitionListVisible = function () {
                    return $ctrl.partitions.length > 1 || $ctrl.parent !== '/' || editing;
                };

                $ctrl.isOnRoot = function () {
                    return $ctrl.parent === '/';
                };

                $ctrl.isAddAllowed = function () {
                    return isEnabledByDefault($ctrl.addable) && editing && hasCatalogPartitionAddPermission();
                };

                $ctrl.add = function (partition) {
                    partition.uiStatus = 'added';
                    $timeout(function () {
                        delete partition.uiStatus;
                    }, delay);
                    $ctrl.partitions.push(partition);
                };

                $ctrl.remove = function (partition) {
                    partition.uiStatus = 'removed';
                    $timeout(function () {
                        $ctrl.partitions.splice($ctrl.partitions.indexOf(partition), 1);
                    }, delay);
                };

                topicRegistry.subscribe('edit.mode', editModeListener);

                $ctrl.$onDestroy = function () {
                    topicRegistry.unsubscribe('edit.mode', editModeListener);
                };
            };

            function editModeListener(e) {
                editing = e;
            }

            function search() {
                findCatalogPartitions({
                    query: 'ownedBy',
                    filters: {owner: $ctrl.partition},
                    sortings: [{on: 'priority', orientation: 'asc'}],
                    success: onSuccess
                });
            }

            function onSuccess(partitions) {
                partitions.forEach(function (it) {
                    $ctrl.partitions.push(it);
                });
            }

            function hasCatalogPartitionAddPermission() {
                return binarta.checkpoint.profile.hasPermission('catalog.partition.add');
            }

            function installMoveActions() {
                $ctrl.moveUp = moveUp;
                $ctrl.moveDown = moveDown;
                $ctrl.moveTop = moveTop;
                $ctrl.moveBottom = moveBottom;

                function moveUp(item) {
                    var priority = $ctrl.partitions.reduce(function (p, c) {
                        return c.priority < item.priority ? c.priority : p;
                    }, item.priority);
                    if (priority != item.priority)
                        return setPriority(item.id, priority);
                }

                function moveDown(item) {
                    var priority = $ctrl.partitions.reduce(function (p, c) {
                        if (p > item.priority)
                            return p;
                        return c.priority > item.priority ? c.priority : p;
                    }, item.priority);
                    if (priority != item.priority)
                        return setPriority(item.id, priority);
                }

                function moveTop(partition) {
                    var first = $ctrl.partitions[0];
                    if (first != partition)
                        return setPriority(partition.id, first.priority);
                }

                function moveBottom(partition) {
                    var last = $ctrl.partitions[$ctrl.partitions.length - 1];
                    if (last !== partition)
                        return setPriority(partition.id, last.priority);
                }

                function setPriority(partitionId, priority) {
                    var d = $q.defer();
                    rest({
                        params: {
                            url: (config.baseUri || '') + 'api/usecase',
                            method: 'POST',
                            data: {
                                headers: {usecase: 'catalog.partition.update.priority'},
                                payload: {
                                    id: partitionId,
                                    priority: priority
                                }
                            },
                            withCredentials: true
                        },
                        success: function () {
                            rearrangePriorities(partitionId, priority);
                            sort();
                            d.resolve();
                        }
                    });
                    return d.promise;
                }

                function rearrangePriorities(partitionId, priority) {
                    var partition = $ctrl.partitions.reduce(function (p, c) {
                        return c.id == partitionId ? c : p;
                    }, undefined);
                    $ctrl.partitions.forEach(function (it) {
                        it.priority += (it.priority >= priority && it.priority < partition.priority ? 1 : 0);
                        it.priority += (it.priority <= priority && it.priority > partition.priority ? -1 : 0);
                    });
                    partition.priority = priority;
                }

                function sort() {
                    $ctrl.partitions.sort(function (x, y) {
                        return x.priority - y.priority;
                    });
                }
            }
        }];
    }

    function BinCatalogPartitionAddComponent() {
        this.templateUrl = 'bin-catalog-partition-add.html';

        this.bindings = {
            partition: '@'
        };

        this.require = {
            partitionsCtrl: '^^binCatalogPartitions'
        };

        this.controller = ['$rootScope', 'addCatalogPartition', 'editModeRenderer', function ($rootScope, addCatalogPartition, editModeRenderer) {
            var $ctrl = this;

            $ctrl.$onInit = function () {
                if (!$ctrl.partition) $ctrl.partition = $ctrl.partitionsCtrl.partition;

                $ctrl.submit = function () {
                    var scope = $rootScope.$new();
                    scope.cancel = editModeRenderer.close;
                    scope.i18nPrefix = 'catalog.partition.name';
                    scope.submit = function () {
                        scope.working = true;
                        addCatalogPartition({
                            partition: $ctrl.partition,
                            name: scope.name,
                            success: onSuccess,
                            rejected: onError
                        }).finally(function () {
                            scope.working = false;
                        });
                    };

                    function onSuccess(partition) {
                        $ctrl.partitionsCtrl.add(partition);
                        editModeRenderer.close();
                    }

                    function onError(error) {
                        scope.violations = error;
                    }

                    editModeRenderer.open({
                        templateUrl: 'bin-catalog-edit-name.html',
                        scope: scope
                    });
                };
            };
        }];
    }

    function BinCatalogPartitionComponent() {
        this.templateUrl = 'bin-catalog-partition.html';

        this.bindings = {
            partition: '<',
            templateUrl: '@',
            removable: '@'
        };

        this.require = {
            partitionsCtrl: '^^binCatalogPartitions'
        };

        this.controller = ['binarta', 'removeCatalogPartition', function (binarta, removeCatalogPartition) {
            var $ctrl = this;

            $ctrl.$onInit = function () {
                if (!$ctrl.removable) $ctrl.removable = $ctrl.partitionsCtrl.removable;
                if (!$ctrl.templateUrl) $ctrl.templateUrl = 'bin-catalog-partition-list-default.html';

                $ctrl.isMoveAllowed = function () {
                    return isEnabledByDefault($ctrl.movable) && hasCatalogPartitionUpdatePriorityPermission();
                };
                $ctrl.isRemoveAllowed = function () {
                    return $ctrl.partition && isEnabledByDefault($ctrl.removable) && hasCatalogPartitionRemovePermission();
                };

                installMoveActions();
                installRemoveAction();
            };

            function hasCatalogPartitionUpdatePriorityPermission() {
                return binarta.checkpoint.profile.hasPermission('catalog.partition.update.priority');
            }

            function hasCatalogPartitionRemovePermission() {
                return binarta.checkpoint.profile.hasPermission('catalog.partition.remove');
            }

            function installMoveActions() {
                $ctrl.moveUp = function () {
                    return $ctrl.partitionsCtrl.moveUp($ctrl.partition);
                };
                $ctrl.moveDown = function () {
                    return $ctrl.partitionsCtrl.moveDown($ctrl.partition);
                };
                $ctrl.moveTop = function () {
                    return $ctrl.partitionsCtrl.moveTop($ctrl.partition);
                };
                $ctrl.moveBottom = function () {
                    return $ctrl.partitionsCtrl.moveBottom($ctrl.partition);
                };
                $ctrl.isFirst = function () {
                    return $ctrl.partitionsCtrl.partitions[0] === $ctrl.partition;
                };
                $ctrl.isLast = function () {
                    return $ctrl.partitionsCtrl.partitions[$ctrl.partitionsCtrl.partitions.length - 1] === $ctrl.partition;
                };
            }

            function installRemoveAction() {
                var removed = false;

                $ctrl.remove = function () {
                    if (removed) return;
                    return removeCatalogPartition({id: $ctrl.partition.id}).then(function () {
                        removed = true;
                        $ctrl.partitionsCtrl.remove($ctrl.partition);
                    });
                };
            }
        }];
    }

    function BinCatalogPartitionTitleComponent() {
        this.templateUrl = 'bin-catalog-partition-title.html';

        this.bindings = {
            type: '@',
            partition: '@',
            parent: '@',
            templateUrl: '@'
        };

        this.require = {
            listCtrl: '?^^binCatalogList'
        };

        this.controller = function () {
            var $ctrl = this;
            $ctrl.i18n = {};

            $ctrl.$onInit = function () {
                if ($ctrl.listCtrl) {
                    if (!$ctrl.type) $ctrl.type = $ctrl.listCtrl.type;
                    if (!$ctrl.partition) $ctrl.partition = $ctrl.listCtrl.partition;
                    if (!$ctrl.parent) $ctrl.parent = $ctrl.listCtrl.parent;
                }
                $ctrl.i18n.title = $ctrl.parent === '/' ? 'navigation.label.' + $ctrl.type : $ctrl.partition;
                $ctrl.$onChanges();
            };

            $ctrl.$onChanges = function () {
                $ctrl.templateUrl = $ctrl.templateUrl || 'bin-catalog-partition-title-default.html';
            }
        };
    }

    function BinCatalogRawPartitionTitleComponent() {
        this.templateUrl = 'bin-catalog-raw-partition-title.html';
        this.require = {parent: '^^binCatalogPartitionTitle'};
        this.controller = function () {
            var $ctrl = this;

            $ctrl.$onInit = function () {
                $ctrl.code = $ctrl.parent.i18n.title;
                $ctrl.default = $ctrl.parent.type;
            }
        }
    }

    function BinCatalogPartitionDescriptionComponent() {
        this.templateUrl = ['$attrs', function ($attrs) {
            return $attrs.templateUrl || 'bin-catalog-partition-description.html';
        }];

        this.bindings = {
            partition: '@'
        };

        this.require = {
            listCtrl: '?^^binCatalogList'
        };

        this.controller = ['topicRegistry', function (topicRegistry) {
            var $ctrl = this;

            $ctrl.$onInit = function () {
                if (!$ctrl.partition && $ctrl.listCtrl) $ctrl.partition = $ctrl.listCtrl.partition;
                topicRegistry.subscribe('edit.mode', editModeListener);
                $ctrl.$onDestroy = function () {
                    topicRegistry.unsubscribe('edit.mode', editModeListener);
                };
            };

            function editModeListener(e) {
                $ctrl.editing = e;
            }
        }];
    }

    function BinCatalogRawBreadcrumbComponent() {
        this.templateUrl = 'bin-catalog-raw-breadcrumb.html';
        this.require = {parent: '^^binCatalogBreadcrumb'};
    }

    function BinCatalogBreadcrumbComponent() {
        this.templateUrl = ['$attrs', function ($attrs) {
            return $attrs.templateUrl || 'bin-catalog-breadcrumb.html';
        }];

        this.bindings = {
            partition: '<',
            item: '<',
            includeHome: '@'
        };

        this.require = {
            listCtrl: '?^^binCatalogList',
            detailsCtrl: '?^^binCatalogDetails'
        };

        this.controller = ['$location', 'config', function ($location, config) {
            var $ctrl = this, breadcrumb, partition, browse = '/browse';
            $ctrl.renderingMode = 'legacy';

            $ctrl.$onInit = function () {
                if (config.binCatalogBreadcrumbComponent) {
                    if (config.binCatalogBreadcrumbComponent.disableLegacyRendering)
                        $ctrl.renderingMode = 'latest';
                }
                if ($ctrl.listCtrl) {
                    if (!$ctrl.partition) $ctrl.partition = $ctrl.listCtrl.parent;
                    if (!$ctrl.item) $ctrl.item = $ctrl.listCtrl.parent ? $ctrl.listCtrl.partition : $ctrl.listCtrl.type;
                    $ctrl.$onChanges();
                }
                if ($ctrl.detailsCtrl) {
                    $ctrl.detailsCtrl.onItemUpdate(function (item) {
                        if (!$ctrl.partition) $ctrl.partition = item.partition;
                        if (!$ctrl.item) $ctrl.item = item.id;
                        $ctrl.$onChanges();
                    });
                }
            };

            $ctrl.$onChanges = function () {
                if ($ctrl.item) {
                    setBreadcrumb();
                    setBackItem();
                }
            };

            function setBreadcrumb() {
                breadcrumb = [];
                partition = $ctrl.partition || '/';
                partition.split('/').reduce(transform);
                breadcrumb.push({id: breadcrumb.length === 0 ? toFirstItemId($ctrl.item) : $ctrl.item});
                if (isSingleItemAndNotOnBrowseOrBlogPath()) setBrowsePathOnFirstItem();
                if (isBlogPath()) updateBlogPathForFirstItem();
                if ($ctrl.includeHome === 'true') breadcrumb.unshift({id: 'navigation.label.home', path: '/'});

                $ctrl.breadcrumb = breadcrumb;
            }

            function transform(it, curr) {
                it += '/' + curr;
                if (curr) breadcrumb.push({
                    id: breadcrumb.length === 0 ? toFirstItemId(curr) : it + '/',
                    path: browse + it + '/'
                });
                return it;
            }

            function toFirstItemId(item) {
                return 'navigation.label.' + stripSlashes(item);
            }

            function isSingleItemAndNotOnBrowseOrBlogPath() {
                return breadcrumb.length === 1 && isNotOnBrowsePath() && isNotOnBlogPath();
            }

            function isNotOnBrowsePath() {
                return $location.path().indexOf(browse + '/') === -1;
            }

            function isNotOnBlogPath() {
                return $location.path().indexOf('/blog') === -1;
            }

            function setBrowsePathOnFirstItem() {
                breadcrumb[0].path = toBrowsePath($ctrl.item);
            }

            function toBrowsePath(item) {
                return browse + '/' + stripSlashes(item) + '/';
            }

            function setBackItem() {
                $ctrl.back = isSingleItemAndNotOnBrowseOrBlogPath() ? breadcrumb[0] : breadcrumb[breadcrumb.length - 2];
            }

            function stripSlashes(item) {
                return item.replace(/\//g, '');
            }

            function isBlogPath() {
                return breadcrumb[0].path === '/browse/blog/';
            }

            function updateBlogPathForFirstItem() {
                breadcrumb[0].path = '/blog';
            }
        }];
    }

    function BinCatalogRawSearchComponent() {
        this.templateUrl = 'bin-catalog-raw-search.html';
        this.require = {parent: '^^binCatalogSearch'};
    }

    function BinCatalogSearchComponent() {
        this.templateUrl = ['$attrs', function ($attrs) {
            return $attrs.templateUrl || 'bin-catalog-search.html';
        }];

        this.bindings = {
            type: '@',
            static: '@',
            searchMode: '@'
        };

        this.require = {
            listCtrl: '?^^binCatalogList',
            detailsCtrl: '?^^binCatalogDetails'
        };

        this.controller = ['$element', '$location', '$timeout', 'i18nLocation', 'config', function ($element, $location, $timeout, i18nLocation, config) {
            var $ctrl = this, isFocused, fadeDuration = 150, input;
            $ctrl.renderingMode = 'legacy';

            $ctrl.$onInit = function () {
                if (config.binCatalogSearchComponent) {
                    if (config.binCatalogSearchComponent.disableLegacyRendering)
                        $ctrl.renderingMode = 'latest';
                }

                $ctrl.static = $ctrl.static === 'true';
                $ctrl.q = $location.search().q;
                if (!$ctrl.type && $ctrl.listCtrl) $ctrl.type = $ctrl.listCtrl.type;
                if (!$ctrl.type && $ctrl.detailsCtrl) $ctrl.type = $ctrl.detailsCtrl.type;

                $ctrl.submit = function () {
                    if ($ctrl.searchMode == 'on-focus')
                        $ctrl.submitWhenFocussed();
                    else executeSearch();
                };

                function withInput(f) {
                    return function () {
                        if (!input) {
                            input = $element.find('input');
                            if (input && !$ctrl.static) bindInputEvents();
                        }
                        f();
                    };
                }

                function executeSearch() {
                    $location.search('q', $ctrl.q);
                    i18nLocation.path('/search/' + $ctrl.type);
                    if ($ctrl.listCtrl) $ctrl.listCtrl.search();
                }

                $ctrl.submitWhenFocussed = withInput(function () {
                    if (isFocused || !input) {
                        if ($ctrl.q) executeSearch();
                    } else focus();
                });
            };

            function focus() {
                input.fadeIn(fadeDuration);
                input.focus();
            }

            function bindInputEvents() {
                input.bind('focus', function () {
                    isFocused = true;
                });

                input.bind('blur', function () {
                    $timeout(function () {
                        isFocused = false;
                        input.fadeOut(fadeDuration);
                    });
                });
            }
        }];
    }

    function BinCatalogItemGroupsComponent() {
        this.templateUrl = 'bin-catalog-item-groups.html';

        this.bindings = {
            items: '<',
            type: '@',
            partition: '@',
            movable: '@',
            pinnable: '@',
            removable: '@',
            addable: '@',
            linkable: '@',
            publishable: '@',
            configurableComponent: '@',
            configurableWidget: '@',
            redirectOnAdd: '@',
            itemTemplateUrl: '@',
            cols: '@',
            center: '@'
        };

        this.require = {
            listCtrl: '?^^binCatalogList'
        };
        this.controller = function () {
            var $ctrl = this;

            $ctrl.$onInit = function () {
                if ($ctrl.listCtrl) {
                    if (!$ctrl.items) $ctrl.items = $ctrl.listCtrl.items;
                    if (!$ctrl.partition) $ctrl.partition = $ctrl.listCtrl.partition;
                    if ($ctrl.listCtrl)
                        $ctrl.refresh = $ctrl.listCtrl.refresh;
                }

                $ctrl.noItemsInMainPartition = function () {
                    var check = true;
                    angular.forEach($ctrl.items, function (item) {
                        if (item.partition === $ctrl.partition) check = false;
                    });
                    return check;
                };
            };
        };
    }

    function BinCatalogItemsComponent() {
        this.templateUrl = ['$attrs', function ($attrs) {
            return $attrs.templateUrl || 'bin-catalog-items.html';
        }];

        this.bindings = {
            items: '<',
            type: '@',
            partition: '@',
            movable: '@',
            pinnable: '@',
            removable: '@',
            addable: '@',
            linkable: '@',
            publishable: '@',
            configurableComponent: '@',
            configurableWidget: '@',
            redirectOnAdd: '@',
            itemTemplateUrl: '@',
            cols: '@',
            center: '@'
        };

        this.require = {
            listCtrl: '?^^binCatalogList',
            groupsCtrl: '?^^binCatalogItemGroups'
        };

        this.controller = ['$q', '$timeout', 'binarta', 'topicRegistry', 'updateCatalogItemWriter', function ($q, $timeout, binarta, topicRegistry, updateCatalogItem) {
            var $ctrl = this,
                editing = false,
                delay = 300;

            $ctrl.$onInit = function () {
                if ($ctrl.groupsCtrl) {
                    if (!$ctrl.items) $ctrl.items = $ctrl.groupsCtrl.items;
                    if (!$ctrl.type) $ctrl.type = $ctrl.groupsCtrl.type;
                    if (!$ctrl.partition) $ctrl.partition = $ctrl.groupsCtrl.partition;
                    if (!$ctrl.movable) $ctrl.movable = $ctrl.groupsCtrl.movable;
                    if (!$ctrl.pinnable) $ctrl.pinnable = $ctrl.groupsCtrl.pinnable;
                    if (!$ctrl.removable) $ctrl.removable = $ctrl.groupsCtrl.removable;
                    if (!$ctrl.addable) $ctrl.addable = $ctrl.groupsCtrl.addable;
                    if (!$ctrl.linkable) $ctrl.linkable = $ctrl.groupsCtrl.linkable;
                    if (!$ctrl.publishable) $ctrl.publishable = $ctrl.groupsCtrl.publishable;
                    if (!$ctrl.configurableComponent) $ctrl.configurableComponent = $ctrl.groupsCtrl.configurableComponent;
                    if (!$ctrl.configurableWidget) $ctrl.configurableWidget = $ctrl.groupsCtrl.configurableWidget;
                    if (!$ctrl.redirectOnAdd) $ctrl.redirectOnAdd = $ctrl.groupsCtrl.redirectOnAdd;
                    if (!$ctrl.itemTemplateUrl) $ctrl.itemTemplateUrl = $ctrl.groupsCtrl.itemTemplateUrl;
                    if (!$ctrl.cols) $ctrl.cols = $ctrl.groupsCtrl.cols;
                    if (!$ctrl.center) $ctrl.center = $ctrl.groupsCtrl.center;
                    $ctrl.refresh = $ctrl.groupsCtrl.refresh;
                }
                if ($ctrl.listCtrl) {
                    if (!$ctrl.items) $ctrl.items = $ctrl.listCtrl.items;
                    if (!$ctrl.type) $ctrl.type = $ctrl.listCtrl.type;
                    if (!$ctrl.partition) $ctrl.partition = $ctrl.listCtrl.partition;
                    $ctrl.refresh = $ctrl.listCtrl.refresh;
                }
                installMoveActions();

                $ctrl.isAddAllowed = function () {
                    return isEnabledByDefault($ctrl.addable) && editing && hasCatalogItemAddPermission();
                };

                $ctrl.add = function (item) {
                    item.uiStatus = 'added';
                    $timeout(function () {
                        delete item.uiStatus;
                    }, delay);
                    $ctrl.items.unshift(item);
                };

                $ctrl.remove = function (item) {
                    item.uiStatus = 'removed';
                    $timeout(function () {
                        removeItemFromList($ctrl.items, item);
                        ['groupsCtrl', 'listCtrl'].forEach(function (ctrl) {
                            if ($ctrl[ctrl]) removeItemFromList($ctrl[ctrl].items, item);
                        });
                    }, delay);

                    function removeItemFromList(items, item) {
                        var index = items.indexOf(item);
                        if (index !== -1) items.splice(index, 1);
                    }
                };

                topicRegistry.subscribe('edit.mode', editModeListener);

                $ctrl.$onDestroy = function () {
                    topicRegistry.unsubscribe('edit.mode', editModeListener);
                };
            };

            function editModeListener(e) {
                editing = e;
            }

            function installMoveActions() {
                $ctrl.moveUp = moveUp;
                $ctrl.moveDown = moveDown;
                $ctrl.moveTop = moveTop;
                $ctrl.moveBottom = moveBottom;

                function moveUp(item) {
                    var newPriority;
                    for (var i = 0; i < $ctrl.items.length; i++) {
                        if ($ctrl.items[i] === item) break;
                        newPriority = $ctrl.items[i].priority;
                    }

                    if (newPriority) return update({
                        priority: newPriority,
                        item: item
                    });
                }

                function moveDown(item) {
                    var newPriority;
                    for (var i = 0; i < $ctrl.items.length - 1; i++) {
                        if ($ctrl.items[i] === item) {
                            newPriority = $ctrl.items[++i].priority;
                            break;
                        }
                    }

                    if (newPriority) return update({
                        priority: newPriority,
                        item: item
                    });
                }

                function moveTop(item) {
                    var firstItem = $ctrl.items[0];
                    if (firstItem !== item) return update({
                        priority: firstItem.priority,
                        item: item
                    });
                }

                function moveBottom(item) {
                    var lastItem = $ctrl.items[$ctrl.items.length - 1];
                    if (lastItem !== item) return update({
                        priority: lastItem.priority,
                        item: item
                    });
                }

                function update(args) {
                    var deferred = $q.defer();
                    updateCatalogItem({
                        data: {
                            treatInputAsId: false,
                            context: 'updatePriority',
                            id: {id: args.item.id},
                            priority: args.priority
                        },
                        success: onSuccess
                    });
                    return deferred.promise;

                    function onSuccess() {
                        rearrangePriorities(args);
                        sort();
                        deferred.resolve();
                    }
                }

                function rearrangePriorities(args) {
                    $ctrl.items.forEach(function (it) {
                        it.priority += (it.priority >= args.priority && it.priority < args.item.priority ? 1 : 0);
                        it.priority += (it.priority <= args.priority && it.priority > args.item.priority ? -1 : 0);
                    });
                    args.item.priority = args.priority;
                }

                function sort() {
                    $ctrl.items.sort(function (x, y) {
                        return y.priority - x.priority;
                    });
                }
            }

            function hasCatalogItemAddPermission() {
                return binarta.checkpoint.profile.hasPermission('catalog.item.add');
            }
        }];
    }

    function BinCatalogItemAddComponent() {
        this.templateUrl = 'bin-catalog-item-add.html';

        this.bindings = {
            type: '@',
            partition: '@',
            redirectToView: '@'
        };

        this.require = {
            itemsCtrl: '^^binCatalogItems'
        };

        this.controller = ['$rootScope', 'addCatalogItem', 'topicMessageDispatcher', function ($rootScope, addCatalogItem, topicMessageDispatcher) {
            var $ctrl = this;

            $ctrl.$onInit = function () {
                if (!$ctrl.type) $ctrl.type = $ctrl.itemsCtrl.type;
                if (!$ctrl.partition) $ctrl.partition = $ctrl.itemsCtrl.partition;
                if (!$ctrl.redirectToView) $ctrl.redirectToView = $ctrl.itemsCtrl.redirectOnAdd;

                $ctrl.submit = function () {
                    $ctrl.working = true;
                    addCatalogItem({
                        item: {
                            type: $ctrl.type,
                            partition: $ctrl.partition,
                            defaultName: 'Item Name'
                        },
                        success: onSuccess,
                        rejected: onRejected,
                        redirectToView: isDisabledByDefault($ctrl.redirectToView)
                    }).finally(function () {
                        $ctrl.working = false;
                    });

                    function onSuccess(item) {
                        if (!item.priority) item.priority = $ctrl.itemsCtrl.items.length + 1;
                        $ctrl.itemsCtrl.add(item);
                    }

                    function onRejected(violations) {
                        for (var key in violations) {
                            for (var i = 0; i < violations[key].length; i++) {
                                var v = violations[key][i];
                                var code = 'catalog.violation.' + key + '.' + v;
                                topicMessageDispatcher.fire('system.warning', {code: code, default: v});
                            }
                        }
                    }
                };
            };
        }];
    }

    function BinCatalogSearchMoreComponent() {
        this.templateUrl = ['$attrs', function ($attrs) {
            return $attrs.templateUrl || 'bin-catalog-search-more.html';
        }];

        this.require = {
            listCtrl: '^^binCatalogList'
        };

        this.controller = function () {
            var $ctrl = this;
            $ctrl.$onInit = function () {
                $ctrl.searchMore = $ctrl.listCtrl.searchMore;
                $ctrl.hasMore = $ctrl.listCtrl.hasMore;
                $ctrl.isWorking = $ctrl.listCtrl.isWorking;
            };
        };
    }

    function BinCatalogWorkingComponent() {
        this.templateUrl = ['$attrs', function ($attrs) {
            return $attrs.templateUrl || 'bin-catalog-working.html';
        }];

        this.require = {
            listCtrl: '^^binCatalogList'
        };

        this.controller = ['$timeout', function ($timeout) {
            var $ctrl = this;
            $ctrl.$onInit = function () {
                var delay = 500, delayStarted, delayFinished;
                reset();

                $ctrl.isWorking = function () {
                    var working = ($ctrl.listCtrl.items.length === 0) && $ctrl.listCtrl.isWorking();
                    if (!working) reset();
                    if (working && !delayStarted) startDelay();
                    return working && delayFinished;
                };

                function reset() {
                    delayStarted = false;
                    delayFinished = false;
                }

                function startDelay() {
                    delayStarted = true;
                    $timeout(function () {
                        delayFinished = true;
                    }, delay);
                }
            };
        }];
    }

    function BinCatalogEmptyComponent() {
        this.templateUrl = ['$attrs', function ($attrs) {
            return $attrs.templateUrl || 'bin-catalog-empty.html';
        }];

        this.require = {
            listCtrl: '^^binCatalogList'
        };

        this.controller = function () {
            var $ctrl = this;

            $ctrl.$onInit = function () {
                $ctrl.isEmpty = function () {
                    return $ctrl.listCtrl.items.length === 0 && !$ctrl.listCtrl.isWorking();
                };
            };
        };
    }

    function BinCatalogDetailsComponent() {
        this.templateUrl = ['$attrs', function ($attrs) {
            return $attrs.templateUrl || 'bin-catalog-transclude.html';
        }];
        this.transclude = true;

        this.bindings = {
            type: '@',
            partition: '@',
            itemId: '@'
        };

        this.controller = ['i18nLocation', '$routeParams', 'catalogPathParser', 'findCatalogItemById',
            function ($location, $routeParams, catalogPathParser, findCatalogItemById) {
                var $ctrl = this,
                    onItemUpdateListeners = [],
                    componentRegistrations = [];

                this.$onInit = function () {
                    if (!$ctrl.type) parsePropertiesFromRoute();
                    $ctrl.refresh = findItem;
                    $ctrl.onItemUpdate = addUpdateItemListener;
                    findItem();

                    $ctrl.registerComponent = function (name) {
                        componentRegistrations.push(name);
                    };

                    $ctrl.isComponentRegistered = function (name) {
                        return componentRegistrations.indexOf(name) !== -1;
                    };
                };

                function parsePropertiesFromRoute() {
                    var c = catalogPathParser($routeParams, 'file');
                    $ctrl.type = c.head;
                    $ctrl.partition = c.parent;
                    $ctrl.itemId = c.path;
                }

                function addUpdateItemListener(cb) {
                    onItemUpdateListeners.push(cb);
                }

                function findItem() {
                    return findCatalogItemById($ctrl.itemId, applyItem);
                }

                function applyItem(item) {
                    if (item.localizedId && $ctrl.itemId !== item.localizedId) $location.path('/view' + item.localizedId);
                    else updateItemOnListeners(item);
                }

                function updateItemOnListeners(item) {
                    onItemUpdateListeners.forEach(function (cb) {
                        cb(item);
                    });
                }
            }];
    }

    function BinCatalogItemComponent() {
        this.templateUrl = 'bin-catalog-item.html';

        this.bindings = {
            item: '<',
            templateUrl: '@',
            pinnable: '@',
            removable: '@',
            linkable: '@',
            publishable: '@',
            resizable: '@',
            configurableComponent: '@',
            configurableWidget: '@',
            fittingRuleAttribute: '@'
        };

        this.require = {
            itemsCtrl: '?^^binCatalogItems',
            detailsCtrl: '?^^binCatalogDetails'
        };

        this.controller = ['$q', 'binarta', 'itemPinner', 'topicRegistry', 'removeCatalogItem', 'i18nLocation', 'findCatalogItemById',
            'updateCatalogItemWriter', 'binLink', 'binCatalogItemPublisher', 'binImageCarousel', 'binWidgetSettings', 'moment', 'i18n',
            function ($q, binarta, pinner, topics, removeCatalogItem, i18nLocation, findCatalogItemById,
                      updateCatalogItem, binLink, publisher, binImageCarousel, widget, moment, i18n) {
                var $ctrl = this,
                    destroyHandlers = [],
                    draft = 'draft',
                    published = 'published';
                $ctrl.i18n = {};
                $ctrl.image = {};
                $ctrl.editActions = [];

                $ctrl.$onInit = function () {
                    if ($ctrl.detailsCtrl) withDetailsController();
                    else if ($ctrl.itemsCtrl) withItemsController();

                    $ctrl.refresh = function () {
                        if ($ctrl.itemsCtrl) $ctrl.itemsCtrl.refresh();
                        else return findCatalogItemById($ctrl.item.id, applyItem);
                    };

                    $ctrl.update = function (request, response) {
                        var deferred = $q.defer();
                        var data = {
                            treatInputAsId: false,
                            context: 'update',
                            id: $ctrl.item.id,
                            type: $ctrl.item.type
                        };
                        data[request.key] = request.value;

                        updateCatalogItem({
                            data: data,
                            success: onSuccess,
                            error: onError
                        });

                        function onSuccess() {
                            $ctrl.item[request.key] = request.value;
                            if (response && response.success) response.success();
                            deferred.resolve();
                        }

                        function onError(body, status) {
                            if (response && response.error) response.error(body, status);
                            deferred.reject();
                        }

                        return deferred.promise;
                    };

                    $ctrl.isDraft = function () {
                        return $ctrl.item.status === draft;
                    };

                    $ctrl.isScheduled = function () {
                        return $ctrl.item.status === published && moment().isBefore($ctrl.item.publicationTime);
                    };

                    $ctrl.isPublished = function () {
                        return !$ctrl.item.status || $ctrl.item.status === published;
                    };

                    $ctrl.isMoveAllowed = function () {
                        return $ctrl.item && $ctrl.itemsCtrl && isEnabledByDefault($ctrl.movable) && hasCatalogItemUpdatePermission();
                    };
                    $ctrl.isPinAllowed = function () {
                        return $ctrl.item && !$ctrl.item.pinned && isDisabledByDefault($ctrl.pinnable) && hasCatalogItemPinPermission();
                    };
                    $ctrl.isUnpinAllowed = function () {
                        return $ctrl.item && $ctrl.item.pinned && isDisabledByDefault($ctrl.pinnable) && hasCatalogItemUnpinPermission();
                    };
                    $ctrl.isRemoveAllowed = function () {
                        return $ctrl.item && isEnabledByDefault($ctrl.removable) && hasCatalogItemRemovePermission();
                    };
                    $ctrl.isLinkAllowed = function () {
                        return $ctrl.item && isDisabledByDefault($ctrl.linkable) && hasCatalogItemUpdatePermission();
                    };
                    $ctrl.isPublishAllowed = function () {
                        return $ctrl.item && $ctrl.item.status === draft && isDisabledByDefault($ctrl.publishable) && hasCatalogItemUpdatePermission();
                    };
                    $ctrl.isUnpublishAllowed = function () {
                        return $ctrl.item && $ctrl.item.status === published && isDisabledByDefault($ctrl.publishable) && hasCatalogItemUpdatePermission();
                    };
                    $ctrl.isResizeAllowed = function () {
                        return $ctrl.item && isDisabledByDefault($ctrl.resizable) && hasCatalogItemUpdatePermission();
                    };
                    $ctrl.isConfigureWidgetAllowed = function () {
                        return $ctrl.item && $ctrl.configurableComponent && $ctrl.configurableWidget && hasConfigureWidgetPermission();
                    };

                    $ctrl.installEditAction = function (action) {
                        $ctrl.editActions.push(action);
                    };

                    installPinActions();
                    installRemoveAction();
                    installLinkAction();
                    installPublishAction();
                    installResizeActions();
                    installConfigureWidgetActions();

                    topics.subscribe('edit.mode', editModeListener);
                    destroyHandlers.push(function () {
                        topics.unsubscribe('edit.mode', editModeListener);
                    });
                };

                $ctrl.$onDestroy = function () {
                    destroyHandlers.forEach(function (handler) {
                        handler();
                    });
                };

                $ctrl.$onChanges = function () {
                    if ($ctrl.item) {
                        $ctrl.i18n.title = $ctrl.item.id;
                        $ctrl.i18n.altTitle = $ctrl.item.id + '.title';
                        $ctrl.i18n.lead = $ctrl.item.id + '.lead';
                        $ctrl.i18n.body = $ctrl.item.id + '.body';
                        $ctrl.i18n.cta = $ctrl.item.id + '.cta';
                        $ctrl.image.cover = 'images' + $ctrl.item.id + '/cover.img';
                        $ctrl.itemPath = '/view' + ($ctrl.item.localizedId || $ctrl.item.id);
                        var heroImage = binImageCarousel.getHeroImage({prefetchedItems: $ctrl.item.carousel});
                        if (heroImage) $ctrl.image.hero = heroImage.path;
                    }
                };

                function editModeListener(e) {
                    $ctrl.editing = e;
                }

                function applyItem(item) {
                    $ctrl.item = item;
                }

                function withDetailsController() {
                    if (!$ctrl.item) listenForItemUpdates();
                    if (!$ctrl.templateUrl) $ctrl.templateUrl = 'bin-catalog-item-details-default.html';
                    $ctrl.movable = 'false';

                    function listenForItemUpdates() {
                        $ctrl.detailsCtrl.onItemUpdate(function (item) {
                            $ctrl.item = item;
                            $ctrl.$onChanges();
                        });
                    }
                }

                function withItemsController() {
                    if (!$ctrl.templateUrl) $ctrl.templateUrl = $ctrl.itemsCtrl.itemTemplateUrl || 'bin-catalog-item-list-default.html';
                    if (!$ctrl.movable) $ctrl.movable = $ctrl.itemsCtrl.movable;
                    if (!$ctrl.pinnable) $ctrl.pinnable = $ctrl.itemsCtrl.pinnable;
                    if (!$ctrl.removable) $ctrl.removable = $ctrl.itemsCtrl.removable;
                    if (!$ctrl.linkable) $ctrl.linkable = $ctrl.itemsCtrl.linkable;
                    if (!$ctrl.publishable) $ctrl.publishable = $ctrl.itemsCtrl.publishable;
                    if (!$ctrl.configurableComponent) $ctrl.configurableComponent = $ctrl.itemsCtrl.configurableComponent;
                    if (!$ctrl.configurableWidget) $ctrl.configurableWidget = $ctrl.itemsCtrl.configurableWidget;
                    installMoveActions();

                    var pinnedTopic = 'catalog.item.pinned.' + $ctrl.item.id;
                    var unpinnedTopic = 'catalog.item.unpinned.' + $ctrl.item.id;
                    topics.subscribe(pinnedTopic, pin);
                    topics.subscribe(unpinnedTopic, unpin);
                    destroyHandlers.push(function () {
                        topics.unsubscribe(pinnedTopic, pin);
                    });
                    destroyHandlers.push(function () {
                        topics.unsubscribe(unpinnedTopic, unpin);
                    });
                }

                function hasCatalogItemUpdatePermission() {
                    return binarta.checkpoint.profile.hasPermission('catalog.item.update');
                }

                function hasConfigureWidgetPermission() {
                    return binarta.checkpoint.profile.hasPermission('save.widget.attributes');
                }

                function hasCatalogItemPinPermission() {
                    return binarta.checkpoint.profile.hasPermission('catalog.item.pin');
                }

                function hasCatalogItemUnpinPermission() {
                    return binarta.checkpoint.profile.hasPermission('catalog.item.unpin');
                }

                function hasCatalogItemRemovePermission() {
                    return binarta.checkpoint.profile.hasPermission('catalog.item.remove');
                }

                function installMoveActions() {
                    $ctrl.moveUp = function () {
                        return $ctrl.itemsCtrl.moveUp($ctrl.item);
                    };
                    $ctrl.moveDown = function () {
                        return $ctrl.itemsCtrl.moveDown($ctrl.item);
                    };
                    $ctrl.moveTop = function () {
                        return $ctrl.itemsCtrl.moveTop($ctrl.item);
                    };
                    $ctrl.moveBottom = function () {
                        return $ctrl.itemsCtrl.moveBottom($ctrl.item);
                    };
                    $ctrl.isFirst = function () {
                        return $ctrl.itemsCtrl.items[0] === $ctrl.item;
                    };
                    $ctrl.isLast = function () {
                        return $ctrl.itemsCtrl.items[$ctrl.itemsCtrl.items.length - 1] === $ctrl.item;
                    };
                }

                function installResizeActions() {
                    var key = 'size';

                    $ctrl.makeLarge = function () {
                        return $ctrl.update({
                            key: key,
                            value: {colspan: 2, rowspan: 2, cssClass: 'large'}
                        });
                    };
                    $ctrl.makeWide = function () {
                        return $ctrl.update({
                            key: key,
                            value: {colspan: 2, rowspan: 1, cssClass: 'wide'}
                        });
                    };
                    $ctrl.makeTall = function () {
                        return $ctrl.update({
                            key: key,
                            value: {colspan: 1, rowspan: 2, cssClass: 'tall'}
                        });
                    };
                    $ctrl.resetSize = function () {
                        return $ctrl.update({
                            key: key,
                            value: {colspan: 1, rowspan: 1, cssClass: ''}
                        });
                    };
                }

                function installPinActions() {
                    $ctrl.pin = function () {
                        return pinner.pin({item: $ctrl.item, success: pin});
                    };
                    $ctrl.unpin = function () {
                        return pinner.unpin({item: $ctrl.item, success: unpin});
                    };
                }

                function pin() {
                    $ctrl.item.pinned = true;
                }

                function unpin() {
                    $ctrl.item.pinned = false;
                }

                function installRemoveAction() {
                    var removed = false;

                    $ctrl.remove = function () {
                        if (removed) return;
                        return removeCatalogItem({id: $ctrl.item.id}).then(function () {
                            removed = true;
                            if ($ctrl.detailsCtrl) redirectToPartition($ctrl.detailsCtrl.type, $ctrl.detailsCtrl.partition);
                            if ($ctrl.itemsCtrl) $ctrl.itemsCtrl.remove($ctrl.item);
                        });
                    };
                }

                function redirectToPartition(type, partition) {
                    i18nLocation.path(type === 'blog' ? '/' + type : '/browse' + partition);
                }

                function installLinkAction() {
                    $ctrl.link = function (args) {
                        var ctx = {
                            href: $ctrl.item.link,
                            target: $ctrl.item.linkTarget,
                            onSubmit: onSubmit
                        };
                        if (!args || args.allowRemove !== false) ctx.onRemove = onRemove;
                        if (args && args.i18nCode) {
                            i18n.resolve({code: args.i18nCode}).then(function (text) {
                                ctx.text = text;
                                ctx.allowText = true;
                                binLink.open(ctx);
                            });
                        } else {
                            binLink.open(ctx);
                        }

                        function onRemove(removeArgs) {
                            onSubmit({href: '', target: '', success: removeArgs.success, error: removeArgs.error});
                        }

                        function onSubmit(submitArgs) {
                            if (args && args.i18nCode) i18n.translate({
                                code: args.i18nCode,
                                translation: submitArgs.text
                            });

                            updateCatalogItem({
                                data: {
                                    treatInputAsId: false,
                                    context: 'update',
                                    id: $ctrl.item.id,
                                    type: $ctrl.item.type,
                                    link: submitArgs.href,
                                    linkTarget: submitArgs.target
                                },
                                success: onSuccess,
                                error: submitArgs.error
                            });

                            function onSuccess() {
                                $ctrl.item.link = submitArgs.href;
                                $ctrl.item.linkTarget = submitArgs.target;
                                submitArgs.success();
                            }
                        }
                    };
                }

                function installPublishAction() {
                    $ctrl.publish = function () {
                        publisher.publish($ctrl.item);
                    };

                    $ctrl.unpublish = function () {
                        return publisher.unpublish($ctrl.item);
                    };
                }

                function installConfigureWidgetActions() {
                    $ctrl.configureWidget = function () {
                        widget.configure({
                            component: $ctrl.configurableComponent,
                            widget: $ctrl.configurableWidget,
                            item: $ctrl.item,
                            overrideAttribute: $ctrl.fittingRuleAttribute,
                            ui: {
                                updated: $ctrl.refresh
                            }
                        });
                    }
                }
            }];
    }

    function BinCatalogItemImageComponent() {
        this.templateUrl = 'bin-catalog-item-image-component.html';
        this.bindings = {
            bottomTemplateUrl: '@',
            defaultAspectRatio: '<',
            defaultFittingRule: '@'
        };
        this.require = {
            parent: '^^binCatalogItem'
        };
        this.controller = function () {
            var $ctrl = this;

            $ctrl.$onInit = function () {
                if (!$ctrl.bottomTemplateUrl)
                    $ctrl.bottomTemplateUrl = 'bin-catalog-item-image-component-bottom.html';
                $ctrl.src = $ctrl.parent.image.hero;
                $ctrl.aspectRatio = $ctrl.parent.item.imageAspectRatio || $ctrl.defaultAspectRatio;
                $ctrl.fittingRule = $ctrl.parent.item.imageFittingRule || $ctrl.defaultFittingRule;
            }
        }
    }

    function BinCatalogItemImageGalleryComponent() {
        this.templateUrl = 'bin-catalog-item-image-gallery.html';
        this.require = {parent: '^^binCatalogItem'};
        this.transclude = true;
    }

    function BinCatalogItemSpecSheetComponent() {
        this.templateUrl = 'bin-catalog-item-spec-sheet.html';
        this.require = {parent: '^^binCatalogItem'};
        this.transclude = true;
    }

    function BinCatalogPublicationTime() {
        this.templateUrl = 'bin-catalog-publication-time.html';

        this.bindings = {
            time: '<',
            status: '<',
            format: '@',
            icon: '@'
        };

        this.controller = ['moment', function (moment) {
            var $ctrl = this;

            $ctrl.$onInit = function () {
                $ctrl.isScheduled = function () {
                    return moment().isBefore($ctrl.time) && !$ctrl.isDraft();
                };

                $ctrl.isDraft = isDraft;
            };

            $ctrl.$onChanges = function () {
                $ctrl.publicationTime = isDraft() ? '' : moment($ctrl.time).format(getFormat());
                setIcon();
            };

            function setIcon() {
                if (!$ctrl.icon) $ctrl.icon = 'fa-clock-o';
                if ($ctrl.icon === 'false') $ctrl.icon = undefined;
            }

            function isDraft() {
                return $ctrl.status === 'draft';
            }

            function getFormat() {
                return $ctrl.format || 'lll';
            }
        }];
    }

    function BinCatalogItemCta() {
        this.templateUrl = 'bin-catalog-item-cta.html';

        this.bindings = {
            item: '<',
            purchasable: '@'
        };

        this.require = {
            itemCtrl: '^^binCatalogItem'
        };

        this.controller = ['$scope', 'editModeRenderer', 'i18n', function ($scope, renderer, i18n) {
            var $ctrl = this;

            $ctrl.$onInit = function () {
                $ctrl.i18nCode = $ctrl.item.id + '.cta';
                i18n.resolve({
                    code: $ctrl.item.id
                }).then(function(message) {
                    $ctrl.itemName = message;
                });

                $ctrl.isPurchasable = function () {
                    return isEnabledByDefault($ctrl.purchasable) && hasPrice();
                };

                $ctrl.itemCtrl.installEditAction({
                    action: edit,
                    iconClass: 'fa-bullhorn',
                    i18nCode: 'catalog.item.edit.cta'
                });

                function hasPrice() {
                    return $ctrl.item.price && $ctrl.item.price > 0;
                }

                function edit() {
                    var rendererScope = $scope.$new();

                    rendererScope.cta = $ctrl.item.cta || 'default';

                    rendererScope.configureLink = function () {
                        $ctrl.itemCtrl.link({
                            i18nCode: $ctrl.i18nCode,
                            allowRemove: false
                        });
                    };

                    rendererScope.submit = function () {
                        $ctrl.itemCtrl.update({
                            key: 'cta',
                            value: rendererScope.cta
                        }, {
                            success: function () {
                            },
                            error: function () {
                            }
                        });
                    };

                    rendererScope.close = renderer.close;

                    renderer.open({
                        templateUrl: 'bin-catalog-item-cta-edit.html',
                        scope: rendererScope
                    });
                }
            };
        }];
    }

    function BinCatalogItemTitleComponent() {
        this.templateUrl = 'bin-catalog-item-title.html';

        this.bindings = {
            templateUrl: '@',
            item: '<'
        };

        this.require = {
            detailsCtrl: '?^^binCatalogDetails'
        };

        this.controller = function () {
            var $ctrl = this;
            $ctrl.i18n = {};

            $ctrl.$onInit = function () {
                $ctrl.templateUrl = $ctrl.templateUrl || 'bin-catalog-item-title-default.html';
                if ($ctrl.item) setTitle();
                if (!$ctrl.item && $ctrl.detailsCtrl) $ctrl.detailsCtrl.onItemUpdate(function (item) {
                    $ctrl.item = item;
                    setTitle();
                });
            };

            function setTitle() {
                $ctrl.i18n.title = $ctrl.item.id;
            }
        };
    }

    function BinCatalogItemRequestInfoForm() {
        this.templateUrl = ['$attrs', function ($attrs) {
            return $attrs.templateUrl || 'bin-catalog-item-request-info-form.html';
        }];

        this.bindings = {
            templateUrl: '@'
        };

        this.require = {
            detailsCtrl: '^^binCatalogDetails'
        };

        this.controller = ['$q', '$log', 'i18n', 'topicRegistry', function ($q, $log, i18n, topicRegistry) {
            var $ctrl = this, destroyHandlers = [], name = 'requestInfoForm';

            $ctrl.$onInit = function () {
                if ($ctrl.detailsCtrl.isComponentRegistered(name)) {
                    $log.warn('Request info form can only be used once on the same page.');
                    return;
                }
                $ctrl.detailsCtrl.registerComponent(name);
                $ctrl.detailsCtrl.onItemUpdate(onItemUpdate);
            };

            $ctrl.$onDestroy = function () {
                destroyHandlers.forEach(function (handler) {
                    handler();
                });
            };

            function onItemUpdate(item) {
                $q.all([
                    i18n.resolve({code: 'catalog.item.more.info.about.button'}),
                    i18n.resolve({code: item.id})
                ]).then(function (result) {
                    setSubject(result[0], result[1]);
                    topicRegistry.subscribe('i18n.updated', i18nUpdatedEvent);

                    function i18nUpdatedEvent(ctx) {
                        if (ctx.code === item.id) setSubject(result[0], ctx.translation);
                    }

                    destroyHandlers.push(function () {
                        topicRegistry.unsubscribe('i18n.updated', i18nUpdatedEvent);
                    });
                });
            }

            function setSubject(prefix, itemName) {
                $ctrl.subject = prefix + ' - ' + itemName + ' -';
            }
        }];
    }

    function BinCatalogItemRequestInfoButton() {
        this.templateUrl = 'bin-catalog-item-request-info-button.html';

        this.bindings = {
            item: '<',
            buttonClass: '@'
        };

        this.require = {
            detailsCtrl: '?^^binCatalogDetails'
        };

        this.controller = ['$q', 'i18n', 'binSections', 'binScrollTo', function ($q, i18n, sections, scrollTo) {
            var $ctrl = this;

            $ctrl.$onInit = function () {
                $ctrl.contactPath = '/contact';
                $ctrl.buttonClass = $ctrl.buttonClass || 'btn btn-primary';

                $ctrl.isContactActive = function () {
                    return sections.isActive('contact');
                };

                $ctrl.isRequestInfoFormRegistered = function () {
                    return $ctrl.detailsCtrl && $ctrl.detailsCtrl.isComponentRegistered('requestInfoForm');
                };

                $ctrl.scrollToForm = function () {
                    scrollTo('bin-catalog-item-request-info-form');
                };

                if ($ctrl.isContactActive()) {
                    $q.all([
                        i18n.resolve({code: 'catalog.item.more.info.about.button'}),
                        i18n.resolve({code: $ctrl.item.id})
                    ]).then(function (result) {
                        $ctrl.contactPath += '?subject=' + encodeURIComponent(result[0] + ' ' + result[1]);
                    });
                }
            };
        }];
    }

    function isEnabledByDefault(prop) {
        return prop !== 'false';
    }

    function isDisabledByDefault(prop) {
        return prop === 'true';
    }
})();