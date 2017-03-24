angular.module('catalog', ['ngRoute', 'binarta-applicationjs-angular1', 'catalogx.gateway', 'notifications', 'config', 'rest.client', 'i18n', 'web.storage', 'angular.usecase.adapter', 'toggle.edit.mode', 'checkpoint', 'application', 'bin.price'])
    .provider('catalogItemUpdatedDecorator', CatalogItemUpdatedDecoratorsFactory)
    .factory('updateCatalogItem', ['updateCatalogItemWriter', 'topicMessageDispatcher', 'catalogItemUpdatedDecorator', UpdateCatalogItemFactory])
    .factory('addCatalogItem', ['$location', 'config', 'localeResolver', 'restServiceHandler', 'topicMessageDispatcher', 'i18nLocation', 'editMode', AddCatalogItemFactory])
    .factory('findAllCatalogItemTypes', ['config', '$http', FindAllCatalogItemTypesFactory])
    .factory('findCatalogPartitions', ['config', '$http', FindCatalogPartitionsFactory])
    .factory('findCatalogItemById', ['config', 'restServiceHandler', 'binarta', FindCatalogItemByIdFactory])
    .factory('findCatalogItemsByPartition', ['config', 'restServiceHandler', FindCatalogItemsByPartitionFactory])
    .factory('catalogPathProcessor', [CatalogPathProcessorFactory])
    .factory('catalogPathParser', ['catalogPathProcessor', CatalogPathParserFactory])
    .factory('itemPinner', ['topicMessageDispatcher', 'restServiceHandler', 'config', ItemPinnerFactory])
    .controller('ListCatalogPartitionsController', ['$scope', 'findCatalogPartitions', 'ngRegisterTopicHandler', ListCatalogPartitionsController])
    .controller('AddToCatalogController', ['$scope', '$routeParams', 'topicRegistry', 'findAllCatalogItemTypes', 'addCatalogItem', 'usecaseAdapterFactory', AddToCatalogController])
    .controller('RemoveCatalogPartitionController', ['config', '$scope', '$location', 'scopedRestServiceHandler', 'topicMessageDispatcher', 'topicRegistry', RemoveCatalogPartitionController])
    .controller('RemoveItemFromCatalogController', ['config', '$scope', 'i18nLocation', 'catalogPathProcessor', 'topicMessageDispatcher', 'scopedRestServiceHandler', RemoveItemFromCatalogController])
    .controller('QueryCatalogController', ['$scope', 'ngRegisterTopicHandler', 'findCatalogItemsByPartition', 'findCatalogItemById', 'topicMessageDispatcher', '$q', QueryCatalogController])
    .controller('AddPartitionToCatalogController', ['config', '$scope', '$location', '$routeParams', 'scopedRestServiceHandler', 'topicMessageDispatcher', AddPartitionToCatalogController])
    .controller('UpdateCatalogItemController', ['config', '$scope', 'updateCatalogItem', 'usecaseAdapterFactory', 'topicMessageDispatcher', 'findCatalogItemById', UpdateCatalogItemController])
    .controller('BrowseCatalogController', ['$scope', '$routeParams', 'catalogPathParser', BrowseCatalogController])
    .controller('ViewCatalogItemController', ['$scope', 'i18nLocation', '$routeParams', 'catalogPathParser', 'topicRegistry', 'findCatalogItemById', 'binarta', ViewCatalogItemController])
    .controller('MoveCatalogItemController', ['$scope', 'sessionStorage', 'updateCatalogItem', 'usecaseAdapterFactory', 'ngRegisterTopicHandler', 'topicMessageDispatcher', MoveCatalogItemController])
    .controller('PinItemController', ['$scope', 'itemPinner', 'ngRegisterTopicHandler', PinItemController])
    .controller('binSpotlightController', ['topicRegistry', 'binarta', 'configWriter', BinSpotlightController])
    .controller('binSpotlightItemsController', ['topicRegistry', 'binartaSearch', 'viewport', BinSpotlightItemsController])
    .directive('splitInRows', ['$log', splitInRowsDirectiveFactory])
    .directive('movableItems', ['ngRegisterTopicHandler', MovableItemsDirectiveFactory])
    .component('binCatalogItemList', new BinCatalogItemListComponent())
    .component('binCatalogListRows', new BinCatalogListRowsComponent())
    .component('binCatalogListItem', new BinCatalogListItemComponent())
    .component('binPinnedItemsToggle', new BinPinnedItemsToggle())
    .component('binSpotlight', new BinSpotlightComponent())
    .component('binSpotlightItems', new BinSpotlightItemsComponent())
    .component('binBreadcrumb', new BinBreadcrumbComponent())
    .config(['catalogItemUpdatedDecoratorProvider', function (catalogItemUpdatedDecoratorProvider) {
        catalogItemUpdatedDecoratorProvider.add('updatePriority', function (args) {
            return args.id;
        })
    }])
    .config(['$routeProvider', function ($routeProvider) {
        [
            [],
            [':d0'],
            [':d0', ':d1'],
            [':d0', ':d1', ':d2'],
            [':d0', ':d1', ':d2', ':d3'],
            [':d0', ':d1', ':d2', ':d3', ':d4'],
            [':d0', ':d1', ':d2', ':d3', ':d4', ':d5'],
            [':d0', ':d1', ':d2', ':d3', ':d4', ':d5', ':d6'],
            [':d0', ':d1', ':d2', ':d3', ':d4', ':d5', ':d6', ':d7'],
            [':d0', ':d1', ':d2', ':d3', ':d4', ':d5', ':d6', ':d7', ':d8'],
            [':d0', ':d1', ':d2', ':d3', ':d4', ':d5', ':d6', ':d7', ':d8', ':d9'],
            [':d0', ':d1', ':d2', ':d3', ':d4', ':d5', ':d6', ':d7', ':d8', ':d9', ':d10']
        ].forEach(function (it) {
            var path = it.length ? '/' + it.join('/') : '';
            $routeProvider.when('/browse' + path + '/', {
                templateUrl: 'partials/catalog/browse.html',
                controller: 'BrowseCatalogController as catalogCtrl'
            });
            $routeProvider.when('/view' + path, {
                templateUrl: 'partials/catalog/item.html',
                controller: 'ViewCatalogItemController as catalogCtrl'
            });
            $routeProvider.when('/:locale/browse' + path + '/', {
                templateUrl: 'partials/catalog/browse.html',
                controller: 'BrowseCatalogController as catalogCtrl'
            });
            $routeProvider.when('/:locale/view' + path, {
                templateUrl: 'partials/catalog/item.html',
                controller: 'ViewCatalogItemController as catalogCtrl'
            });
        });
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
    }
}

function FindCatalogItemByIdFactory(config, restServiceHandler, binarta) {
    return function (id, onSuccess) {
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
                onSuccess([])
            },
            success: onSuccess
        });
    }
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
                args.success([])
            },
            success: args.success
        });
    }
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
    }
}

function CatalogPathParserFactory(catalogPathProcessor) {
    var toPath = function (params) {
        var path = '/';
        for (var i = 0; i < 11; i++)
            path += params['d' + i] ? params['d' + i] + '/' : '';
        path = path + (path.slice(-1) == '/' ? '' : '/');
        return path;
    };

    return function (params, type) {
        var path = toPath(params);
        return catalogPathProcessor(path, type);
    }
}

function BrowseCatalogController($scope, $routeParams, catalogPathParser) {
    var current = catalogPathParser($routeParams);

    $scope.path = current.path;
    $scope.head = current.head;
    $scope.name = current.name;
    $scope.parent = current.parent;
    $scope.breadcrumbs = current.breadcrumbs;

    this.path = current.path;
    this.head = current.head;
    this.name = current.name;
    this.parent = current.parent;
    this.breadcrumbs = current.breadcrumbs;
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
                return x.priority - y.priority
            });
        });
    };
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
            args = {query: query, owner: partition}
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
    }
}

function FindAllCatalogItemTypesFactory(config, $http) {
    return function (onSuccess) {
        $http.post((config.baseUri || '') + 'api/query/catalog-item-type').success(onSuccess);
    }
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
    }
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
        if (params.partition)  $scope.partition = params.partition;
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
        $scope.config.success(item)
    }

    topicRegistry.subscribe('app.start', function () {
        findAllCatalogItemTypes(function (types) {
            $scope.types = types;
            reset();
        });
    });
}

function ViewCatalogItemController($scope, $location, $routeParams, catalogPathParser, topicRegistry, findCatalogItemById, binarta) {
    var self = this;
    var current = catalogPathParser($routeParams, 'file');
    var requestedId;

    $scope.path = current.path;
    $scope.head = current.head;
    $scope.name = current.name;
    $scope.parent = current.parent;
    $scope.breadcrumbs = current.breadcrumbs;

    this.path = current.path;
    this.head = current.head;
    this.name = current.name;
    this.parent = current.parent;
    this.breadcrumbs = current.breadcrumbs;

    $scope.templateUri = function () {
        return templateUri($scope);
    };

    this.templateUri = function () {
        return templateUri(self);
    };

    function templateUri(ctx) {
        return 'partials/catalog/item/' + (!ctx.item || ctx.item.type == undefined ? 'default' : ctx.item.type) + '.html';
    }

    var applyItemToScope = function (item) {
        if(item.localizedId && requestedId != item.localizedId) {
            $location.path('/view' + item.localizedId);
        } else {
            addItemToScope(item);
            $scope.item = item;
            self.item = item;
        }
    };

    // @deprecated instead put item on $scope.item
    function addItemToScope(item) {
        Object.keys(item).forEach(function (key) {
            if (key != 'locale') $scope[key] = item[key];
        });
    }

    $scope.init = init;
    this.init = init;

    function init(path) {
        binarta.schedule(function() {
            requestedId = $routeParams.id || path;
            findCatalogItemById(requestedId, applyItemToScope);
        });
    }

    this.refresh = function (args) {
        var id = args ? args.id : self.item.id;
        return findCatalogItemById(id, applyItemToScope);
    };

    topicRegistry.subscribe('catalog.item.updated', self.refresh);

    $scope.$on('$destroy', function () {
        topicRegistry.unsubscribe('catalog.item.updated', self.refresh);
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
        self.config.success()
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
    }
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
            }
        }
    }
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

function MoveCatalogItemController($scope, sessionStorage, updateCatalogItem, usecaseAdapterFactory, ngRegisterTopicHandler, topicMessageDispatcher) {
    var self = this;

    $scope.idle = true;
    $scope.init = function (item) {
        self.item = item
    };
    $scope.cut = function () {
        sessionStorage.moveCatalogItemClipboard = self.item.id;
        topicMessageDispatcher.fire('catalog.item.cut', 'ok');
    };
    $scope.paste = function () {
        var ctx = usecaseAdapterFactory($scope);
        ctx.data = {
            treatInputAsId: false,
            context: 'updatePriority',
            id: {id: sessionStorage.moveCatalogItemClipboard},
            priority: self.item.priority
        };
        ctx.success = function () {
            topicMessageDispatcher.fire('catalog.item.paste', {
                id: sessionStorage.moveCatalogItemClipboard,
                priority: self.item.priority
            });
        };
        updateCatalogItem(ctx);
    };

    ngRegisterTopicHandler($scope, 'catalog.item.cut', function () {
        $scope.idle = false;
    });
    ngRegisterTopicHandler($scope, 'catalog.item.paste', function () {
        $scope.idle = true;
    });
}

function MovableItemsDirectiveFactory(ngRegisterTopicHandler) {
    return {
        scope: {
            items:'=?movableItems',
            orientation:'@',
            when:'=?'
        },
        link:function($scope) {
            if ($scope.items == undefined) $scope.items = [];
            if ($scope.orientation == undefined) $scope.orientation = 'asc';
            if ($scope.when == undefined) $scope.when = true;
            if ($scope.when) ngRegisterTopicHandler($scope, 'catalog.item.paste', function (evt) {
                var fromIdx = $scope.items.reduce(function (p, c, i) {
                    return c.id == evt.id ? i : p;
                }, undefined);
                var from = $scope.items[fromIdx];

                $scope.items.forEach(function (it) {
                    if ($scope.orientation == 'asc') {
                        it.priority += (it.priority <= evt.priority && it.priority > from.priority ? -1 : 0);
                        it.priority += (it.priority >= evt.priority && it.priority < from.priority ? 1 : 0);
                    } else {
                        it.priority += (it.priority >= evt.priority && it.priority < from.priority ? 1 : 0);
                        it.priority += (it.priority <= evt.priority && it.priority > from.priority ? -1 : 0);
                    }
                });

                from.priority = evt.priority;

                $scope.items.sort(function (x, y) {
                    if ($scope.orientation == 'asc') {
                        return x.priority - y.priority;
                    } else {
                        return y.priority - x.priority;
                    }
                });
            })
        }
    }
}

function PinItemController($scope, pinner, ngRegisterTopicHandler) {
    var self = this;

    self.init = function(item) {
        self.item = item;
        ngRegisterTopicHandler($scope, 'catalog.item.pinned.' + item.id, pin);
        ngRegisterTopicHandler($scope, 'catalog.item.unpinned.' + item.id, unpin);
    };

    self.pin = function() {
        pinner.pin({item:self.item, success:pin});
    };

    self.unpin = function() {
        pinner.unpin({item:self.item, success: unpin});
    };

    function pin() {
        self.item.pinned = true;
    }

    function unpin() {
        self.item.pinned = false;
    }
}

function ItemPinnerFactory(topics, rest, config) {
    function params(usecase, ctx) {
        usecase = usecase || 'catalog.item.pin';
        return {
            method:'POST',
            withCredentials:true,
            url: (config.baseUri || '') + 'api/usecase',
            data: {
                headers:{usecase: usecase},
                payload: {id:ctx.item.id}
            }
        }
    }
    function sucessAndFireTopic(topic, ctx) {
        return function(payload) {
            topics.fire(topic, ctx.item);
            topics.fire(topic + '.' + ctx.item.id, ctx.item);
            if (ctx.success) ctx.success(payload);
        }
    }

    return {
        pin: function(ctx) {
            rest({
                params:params('catalog.item.pin', ctx),
                success: sucessAndFireTopic('catalog.item.pinned', ctx)
            })
        },
        unpin: function(ctx) {
            rest({
                params:params('catalog.item.unpin', ctx),
                success: sucessAndFireTopic('catalog.item.unpinned', ctx)

            })
        }
    }
}

function BinCatalogItemListComponent() {
    this.bindings = {
        items:'<',
        movable:'@',
        itemTemplateUrl: '<?',
        cols: '@',
        center: '@'
    };
    this.templateUrl = 'catalog-item-list.html';

    this.controller = ['$q', 'updateCatalogItemWriter', function ($q, updateCatalogItem) {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            if ($ctrl.movable == 'true') {
                $ctrl.moveUp = function (item) {
                    var newPriority;
                    for (var i = 0; i < $ctrl.items.length; i++) {
                        if ($ctrl.items[i] == item) break;
                        newPriority = $ctrl.items[i].priority;
                    }

                    if (newPriority) return update({
                        priority: newPriority,
                        item: item
                    });
                };

                $ctrl.moveDown = function (item) {
                    var newPriority;
                    for (var i = 0; i < $ctrl.items.length - 1; i++) {
                        if ($ctrl.items[i] == item) {
                            newPriority = $ctrl.items[++i].priority;
                            break;
                        }
                    }

                    if (newPriority) return update({
                        priority: newPriority,
                        item: item
                    });
                };

                $ctrl.moveTop = function (item) {
                    var firstItem = $ctrl.items[0];
                    if (firstItem != item) return update({
                        priority: firstItem.priority,
                        item: item
                    });
                };

                $ctrl.moveBottom = function (item) {
                    var lastItem = $ctrl.items[$ctrl.items.length - 1];
                    if (lastItem != item) return update({
                        priority: lastItem.priority,
                        item: item
                    });
                };
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
        };
    }];
}

function BinCatalogListRowsComponent() {
    this.bindings = {
        items:'<',
        partition:'<',
        movable:'@'
    };
    this.templateUrl = 'catalog-list-rows.html';
}

function BinCatalogListItemComponent() {
    this.templateUrl = 'catalog-list-item.html';
    this.bindings = {
        item:'<',
        isFirst: '<',
        isLast: '<'
    };
    this.require = {
        listCtrl: '^binCatalogItemList'
    };

    this.controller = [function () {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            $ctrl.templateUrl = $ctrl.listCtrl.itemTemplateUrl || 'catalog-list-item-default.html';
            $ctrl.movable = $ctrl.listCtrl.movable;

            if ($ctrl.movable == 'true') {
                $ctrl.moveUp = function () {
                    return $ctrl.listCtrl.moveUp($ctrl.item);
                };

                $ctrl.moveDown = function () {
                    return $ctrl.listCtrl.moveDown($ctrl.item);
                };

                $ctrl.moveTop = function () {
                    return $ctrl.listCtrl.moveTop($ctrl.item);
                };

                $ctrl.moveBottom = function () {
                    return $ctrl.listCtrl.moveBottom($ctrl.item);
                };
            }
        };
    }];
}

function BinSpotlightComponent() {
    this.bindings = {
        type:'@',
        cols:'@',
        center: '@',
        itemTemplateUrl: '<?'
    };
    this.transclude = {
        header: '?binSpotlightHeader',
        footer: '?binSpotlightFooter'
    };
    this.templateUrl = 'bin-spotlight.html';
    this.controller = 'binSpotlightController';
}

function BinSpotlightController(topics, binarta, configWriter) {
    var $ctrl = this;
    $ctrl.totalItemCount = 0;
    $ctrl.pinnedItemCount = 0;

    this.$onInit = function () {
        topics.subscribe('edit.mode', onEditMode);

        binarta.schedule(function () {
            binarta.application.config.findPublic('catalog.' + $ctrl.type + '.recent.items', function (value) {
                $ctrl.recentItems = (value == 'true' || value === true);
            });
        });

        $ctrl.$onDestroy = function () {
            topics.unsubscribe('edit.mode', onEditMode);
        };
    };

    this.plus = function (args) {
        $ctrl.totalItemCount += args.size;
        if (args.isPinned) $ctrl.pinnedItemCount += args.size;
    };

    this.toggleRecentItems = function () {
        $ctrl.recentItems = !$ctrl.recentItems;
        configWriter({key: 'catalog.' + $ctrl.type + '.recent.items', value: $ctrl.recentItems, scope: 'public'});
    };

    function onEditMode(editing) {
        $ctrl.editing = editing;
    }
}

function BinSpotlightItemsComponent() {
    this.bindings = {
        pinned:'@'
    };
    this.require = {
        spotlightCtrl: '^binSpotlight'
    };
    this.transclude = {
        footer: '?binSpotlightFooter'
    };
    this.templateUrl = 'bin-spotlight-items.html';
    this.controller = 'binSpotlightItemsController';
}

function BinSpotlightItemsController(topics, search, viewport) {
    var $ctrl = this, isPinned;

    this.$onInit = function () {
        $ctrl.cols = $ctrl.spotlightCtrl.cols;
        $ctrl.center = $ctrl.spotlightCtrl.center;
        $ctrl.templateUrl = $ctrl.spotlightCtrl.itemTemplateUrl || 'catalog-list-item-default.html';
        isPinned = $ctrl.pinned == 'true';
        $ctrl.results = [];
        if (isPinned) initPinnedConfiguration();
        topics.subscribe('edit.mode', onEditMode);

        var args = {
            entity: 'catalog-item',
            action: 'search',
            subset: {
                offset: 0,
                count: viewport.visibleXs() ? 6 : 8
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

        function render(data) {
            $ctrl.results = data.results;
            if ($ctrl.pinned != 'true') $ctrl.searchForMore = data.hasMore;
            $ctrl.spotlightCtrl.plus({size: $ctrl.results.length, isPinned: isPinned});
        }

        $ctrl.$onDestroy = function() {
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
        var idx = $ctrl.results.reduce(function(p, c, i) {
            if (c.id == item.id) return i;
            return p;
        }, -1);
        if (idx > -1) {
            $ctrl.results.splice(idx, 1);
            $ctrl.spotlightCtrl.plus({size: -1, isPinned: isPinned});
        }
    }
}

function BinPinnedItemsToggle() {
    this.bindings = {
        section: '@'
    };
    this.templateUrl = 'bin-pinned-items-toggle.html';
}

function BinBreadcrumbComponent() {
    this.templateUrl = 'bin-breadcrumb.html';
    this.bindings = {
        partition: '<',
        item: '<'
    };

    this.controller = ['$location', function ($location) {
        var $ctrl = this, breadcrumb, partition, browse = '/browse';

        $ctrl.$onChanges = function () {
            setBreadcrumb();
            setBackItem();
        };

        function setBreadcrumb() {
            breadcrumb = [];
            partition = $ctrl.partition || '/';
            partition.split('/').reduce(transform);
            breadcrumb.push({id: breadcrumb.length == 0 ? toFirstItemId($ctrl.item) : $ctrl.item});
            if (isSingleItemAndNotOnBrowsePath()) setBrowsePathOnFirstItem();
            $ctrl.breadcrumb = breadcrumb;
        }

        function transform(it, curr) {
            it += '/' + curr;
            if (curr) breadcrumb.push({
                id: breadcrumb.length == 0 ? toFirstItemId(curr) : it + '/',
                path: browse + it + '/'
            });
            return it;
        }

        function toFirstItemId(item) {
            return 'navigation.label.' + stripSlashes(item);
        }

        function isSingleItemAndNotOnBrowsePath() {
            return breadcrumb.length == 1 && isNotOnBrowsePath();
        }

        function isNotOnBrowsePath() {
            return $location.path().indexOf(browse + '/') == -1;
        }

        function setBrowsePathOnFirstItem() {
            breadcrumb[0].path = toBrowsePath($ctrl.item);
        }

        function toBrowsePath(item) {
            return browse + '/' + stripSlashes(item) + '/';
        }

        function setBackItem() {
            $ctrl.back = isSingleItemAndNotOnBrowsePath() ? breadcrumb[0] : breadcrumb[breadcrumb.length - 2];
        }

        function stripSlashes(item) {
            return item.replace(/\//g, '');
        }
    }];
}

// @deprecated
function splitInRowsDirectiveFactory($log) {
    return function ($scope, el, attrs) {
        $log.warn('Deprecation warning: splitInRows is no longer maintained, use binSplitInRows instead.');

        function splitInRows(items, columns) {
            var rows = [];
            var columnCount = parseInt(columns);
            if (columnCount > 0) {
                for (var i = 0; i <= (items.length - 1); i = i + columnCount) {
                    rows.push(items.slice(i, i + columnCount));
                }
            }
            return rows;
        }

        $scope.$watchCollection(attrs.splitInRows, function (newItems) {
            if (newItems) $scope.rows = splitInRows(newItems, attrs.columns);
        });
    }
}
