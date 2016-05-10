angular.module('catalog', ['ngRoute', 'catalogx.gateway', 'notifications', 'config', 'rest.client', 'i18n', 'web.storage', 'angular.usecase.adapter', 'toggle.edit.mode', 'checkpoint'])
    .provider('catalogItemUpdatedDecorator', CatalogItemUpdatedDecoratorsFactory)
    .factory('updateCatalogItem', ['updateCatalogItemWriter', 'topicMessageDispatcher', 'catalogItemUpdatedDecorator', UpdateCatalogItemFactory])
    .factory('addCatalogItem', ['$location', 'config', 'localeResolver', 'restServiceHandler', 'topicMessageDispatcher', 'i18nLocation', 'editMode', AddCatalogItemFactory])
    .factory('findAllCatalogItemTypes', ['config', '$http', FindAllCatalogItemTypesFactory])
    .factory('findCatalogPartitions', ['config', '$http', FindCatalogPartitionsFactory])
    .factory('findCatalogItemById', ['config', 'restServiceHandler', FindCatalogItemByIdFactory])
    .factory('findCatalogItemsByPartition', ['config', 'restServiceHandler', FindCatalogItemsByPartitionFactory])
    .factory('catalogPathProcessor', [CatalogPathProcessorFactory])
    .factory('catalogPathParser', ['catalogPathProcessor', CatalogPathParserFactory])
    .controller('ListCatalogPartitionsController', ['$scope', 'findCatalogPartitions', 'ngRegisterTopicHandler', ListCatalogPartitionsController])
    .controller('AddToCatalogController', ['$scope', '$routeParams', 'topicRegistry', 'findAllCatalogItemTypes', 'addCatalogItem', AddToCatalogController])
    .controller('RemoveCatalogPartitionController', ['config', '$scope', '$location', 'scopedRestServiceHandler', 'topicMessageDispatcher', 'topicRegistry', RemoveCatalogPartitionController])
    .controller('RemoveItemFromCatalogController', ['config', '$scope', 'i18nLocation', 'catalogPathProcessor', 'topicMessageDispatcher', 'scopedRestServiceHandler', RemoveItemFromCatalogController])
    .controller('QueryCatalogController', ['$scope', 'ngRegisterTopicHandler', 'findCatalogItemsByPartition', 'findCatalogItemById', 'topicMessageDispatcher', '$q', QueryCatalogController])
    .controller('AddPartitionToCatalogController', ['config', '$scope', '$location', '$routeParams', 'scopedRestServiceHandler', 'topicMessageDispatcher', AddPartitionToCatalogController])
    .controller('UpdateCatalogItemController', ['config', '$scope', 'updateCatalogItem', 'usecaseAdapterFactory', 'topicMessageDispatcher', 'findCatalogItemById', UpdateCatalogItemController])
    .controller('BrowseCatalogController', ['$scope', '$routeParams', 'catalogPathParser', BrowseCatalogController])
    .controller('ViewCatalogItemController', ['$scope', '$routeParams', 'catalogPathParser', 'topicRegistry', 'findCatalogItemById', ViewCatalogItemController])
    .controller('MoveCatalogItemController', ['$scope', 'sessionStorage', 'updateCatalogItem', 'usecaseAdapterFactory', 'ngRegisterTopicHandler', 'topicMessageDispatcher', MoveCatalogItemController])
    .controller('ConfigureVatRateController', ['$scope', 'config', 'configReader', 'configWriter', 'activeUserHasPermission', ConfigureVatRateController])
    .directive('catalogItemPrice', ['editMode', 'editModeRenderer', 'updateCatalogItem', 'usecaseAdapterFactory', 'ngRegisterTopicHandler', '$locale', 'configReader', 'configWriter', CatalogItemPriceDirective])
    .directive('splitInRows', splitInRowsDirectiveFactory)
    .config(['catalogItemUpdatedDecoratorProvider', function(catalogItemUpdatedDecoratorProvider) {
        catalogItemUpdatedDecoratorProvider.add('updatePriority', function(args) {
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
            [':d0', ':d1', ':d2', ':d3', ':d4', ':d5']
        ].forEach(function (it) {
                var path = it.length ? '/' + it.join('/') : '';
                $routeProvider.when('/browse' + path + '/', {templateUrl: 'partials/catalog/browse.html', controller: 'BrowseCatalogController as catalogCtrl'});
                $routeProvider.when('/view' + path, {templateUrl: 'partials/catalog/item.html', controller: 'ViewCatalogItemController as catalogCtrl'});
                $routeProvider.when('/:locale/browse' + path + '/', {templateUrl: 'partials/catalog/browse.html', controller: 'BrowseCatalogController as catalogCtrl'});
                $routeProvider.when('/:locale/view' + path, {templateUrl: 'partials/catalog/item.html', controller: 'ViewCatalogItemController as catalogCtrl'});
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

function FindCatalogItemByIdFactory(config, restServiceHandler) {
    return function (id, onSuccess) {
        restServiceHandler({
            params: {
                method: 'GET',
                url: (config.baseUri || '') + 'api/entity/catalog-item?id=' + encodeURIComponent(id),
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
        for (var i = 0; i < 6; i++)
            path += params['d' + i] ? params['d' + i] + '/' : '';
        path = path + (path.slice(-1) == '/' ? '' : '/');
        return  path;
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

    $scope.decorator = function(item) {
        $scope.items.push(item);
    };

    $scope.filtersCustomizer = function(args) {
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
            }
        });
    }
}

function AddToCatalogController($scope, $routeParams, topicRegistry, findAllCatalogItemTypes, addCatalogItem) {
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
        if (!$scope.violations) {
            $scope.item.partition = $scope.partition;
            $scope.item.locale = locale;

            addCatalogItem({
                item: $scope.item,
                success: onSuccess,
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

function ViewCatalogItemController($scope, $routeParams, catalogPathParser, topicRegistry, findCatalogItemById) {
    var self = this;
    var current = catalogPathParser($routeParams, 'file');

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
        addItemToScope(item);
        $scope.item = item;
        self.item = item;
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
        topicRegistry.subscribe('app.start', function () {
            findCatalogItemById($routeParams.id || path, applyItemToScope);
        });
    }

    var updated = function (args) {
        findCatalogItemById(args.id, function (item) {
            $scope.item = item;
            self.item = item;
        });
    };

    topicRegistry.subscribe('catalog.item.updated', updated);

    $scope.$on('$destroy', function () {
        topicRegistry.unsubscribe('catalog.item.updated', updated);
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
    var defaultDecorator = function(args) {
        return args;
    };
    return {
        add: function(context, decorator) {
            decorators[context] = decorator;
        },
        $get: function() {
            return function(args) {
                return decorators[args.context] ? decorators[args.context](args) : defaultDecorator(args);
            }
        }
    }
}

function UpdateCatalogItemFactory(updateCatalogItemWriter, topicMessageDispatcher, catalogItemUpdatedDecorator) {
    return function (args) {
        var onSuccess = args.success;
        args.success = function () {
            topicMessageDispatcher.fire('system.success', {
                code: 'catalog.item.updated',
                default: 'Catalog item updated!'
            });
            topicMessageDispatcher.fire('catalog.item.updated', catalogItemUpdatedDecorator(args.data));
            onSuccess();
        };
        updateCatalogItemWriter(args);
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
            context: 'updatePriority',
            id: {id: sessionStorage.moveCatalogItemClipboard},
            priority: self.item.priority
        };
        ctx.success = function () {
            topicMessageDispatcher.fire('catalog.item.paste', {id: sessionStorage.moveCatalogItemClipboard, priority: self.item.priority});
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

function CatalogItemPriceDirective(editMode, editModeRenderer, updateCatalogItem, usecaseAdapterFactory, ngRegisterTopicHandler, $locale, reader, writer) {
    return {
        restrict: 'A',
        scope: {
            item: '=catalogItemPrice'
        },
        template: '<span ng-if="item.price">{{(item.unitPrice || item.price) / 100 || 0 | currency}}</span>' +
        '<span ng-if="!item.price && editing" i18n code="catalog.item.price.add.label" read-only ng-bind="::var"></span>',
        link: function (scope, element) {
            ngRegisterTopicHandler(scope, 'edit.mode', function (editMode) {
                scope.editing = editMode;
            });

            editMode.bindEvent({
                scope: scope,
                element: element,
                permission: 'catalog.item.update',
                onClick: open
            });

            function open() {
                var vatOnPriceKey = 'shop.vat.on.price.interpreted.as';

                scope.rendererScope = angular.extend(scope.$new(), {
                    close: function () {
                        editModeRenderer.close();
                    },
                    update: function () {
                        if (scope.rendererScope.catalogItemPriceForm.catalogItemPrice.$invalid)
                            scope.rendererScope.violations = {
                                price: ['invalid']
                            };

                        if (scope.rendererScope.catalogItemPriceForm.$valid) {
                            scope.item.price = Math.round(scope.rendererScope.price * 100);
                            var ctx = usecaseAdapterFactory(scope.rendererScope);
                            ctx.data = scope.item;
                            ctx.data.context = 'update';
                            ctx.success = function () {
                                scope.rendererScope.close();
                            };
                            updateCatalogItem(ctx);
                        }
                    },
                    toggleVatOnPrice: function () {
                        writer({
                            $scope: scope.rendererScope,
                            key: vatOnPriceKey,
                            value: scope.rendererScope.vatOnPrice ? 'included' : 'excluded'
                        });
                        scope.rendererScope.price = getItemPrice();
                    },
                    currencySymbol: $locale.NUMBER_FORMATS.CURRENCY_SYM
                });

                reader({
                    $scope: scope.rendererScope,
                    key: vatOnPriceKey
                }).then(function (result) {
                    scope.rendererScope.vatOnPrice = result.data.value == 'included';
                }, function () {
                    scope.rendererScope.vatOnPrice = false;
                }).finally(function () {
                    scope.rendererScope.price = getItemPrice();
                });

                function getItemPrice() {
                    return (scope.rendererScope.vatOnPrice ? (scope.item.unitPrice || scope.item.price) : scope.item.price) / 100;
                }

                editModeRenderer.open({
                    template: '<form name="catalogItemPriceForm" ng-submit="update()">' +
                    '<div class="bin-menu-edit-body">' +
                    '<div class="form-group">' +
                    '<label for="catalogItemPrice" i18n code="catalog.item.price.label" read-only ng-bind="::var"></label> ' +
                    '<small ng-if="vatOnPrice == 1" i18n code="catalog.item.price.vat.incl" read-only ng-bind="::var"></small>' +
                    '<small ng-if="vatOnPrice == 0" i18n code="catalog.item.price.vat.excl" read-only ng-bind="::var"></small>' +
                    '<div class="input-group">' +
                    '<input type="number" min="0" step="any" name="catalogItemPrice" id="catalogItemPrice" ng-model="price" autofocus>' +
                    '<div class="input-group-addon" ng-bind="::currencySymbol"></div>' +
                    '</div>' +
                    '<div class="help-block text-danger" ng-repeat="v in violations[\'price\']"' +
                    'i18n code="catalog.item.price.{{v}}" default="{{v}}" read-only ng-bind="var">' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<div class="row">' +
                    '<div class="col-xs-12 col-sm-6">' +
                    '<table class="table">' +
                    '<tr>' +
                    '<th i18n code="catalog.item.price.input.vat.included" read-only ng-bind="::var"></th>' +
                    '<td>' +
                    '<div class="checkbox-switch" ng-show="vatOnPrice != undefined">' +
                    '<input type="checkbox" id="vat-on-price-switch" ng-model="vatOnPrice" ng-change="toggleVatOnPrice()">' +
                    '<label for="vat-on-price-switch"></label>' +
                    '</div>' +
                    '</td>' +
                    '</tr>' +
                    '</table>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="bin-menu-edit-actions">' +
                    '<button type="submit" class="btn btn-primary" i18n code="clerk.menu.save.button" read-only ng-bind="::var"></button>' +
                    '<button type="reset" class="btn btn-default" ng-click="close()" i18n code="clerk.menu.cancel.button" read-only ng-bind="::var"></button>' +
                    '</div>' +
                    '</form>',
                    scope: scope.rendererScope
                });
            }
        }
    }
}

function ConfigureVatRateController($scope, config, reader, writer, permission) {
    var self = this;

    permission({
        yes: function () {
            self.countries = config.countries;
            var countryCodeKey = 'shop.country.code';
            var defaultVatRateKey = 'shop.default.vat.rate';

            reader({
                $scope: $scope,
                key: countryCodeKey,
                success: function (data) {
                    if (data) self.countryCode = data.value;
                },
                notFound: function () {
                    self.checkForVatRate = true;
                }
            });

            reader({
                $scope: $scope,
                key: defaultVatRateKey,
                success: function (data) {
                    if (data) self.vatRate = parseFloat(data.value * 100);
                },
                notFound: function () {
                    self.checkForVatRate = true;
                }
            });

            self.isValid = function () {
                return self.countryCode && (self.vatRate || self.vatRate == 0);
            };

            self.getStandardVatRate = function () {
                var rate = undefined;
                if (config.euVatRates && config.euVatRates.rates) {
                    rate = config.euVatRates.rates[self.countryCode];
                }
                self.vatRate = rate ? parseFloat(rate.standard_rate) : rate;
            };

            self.submit = function () {
                if (self.isValid()) {
                    writer({
                        $scope: $scope,
                        key: countryCodeKey,
                        value: self.countryCode
                    });

                    writer({
                        $scope: $scope,
                        key: defaultVatRateKey,
                        value: self.vatRate / 100
                    });

                    self.checkForVatRate = false;
                }
            }
        },
        scope: $scope
    }, 'catalog.item.add');
}

// @deprecated use binarta.angularx instead
function splitInRowsDirectiveFactory() {
    return function ($scope, el, attrs) {
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