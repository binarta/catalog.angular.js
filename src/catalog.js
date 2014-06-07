angular.module('catalog', ['ngRoute', 'catalogx.gateway', 'angular.usecase.adapter'])
    .factory('updateCatalogItem', ['updateCatalogItemWriter', 'topicMessageDispatcher', UpdateCatalogItemFactory])
    .factory('findAllCatalogItemTypes', ['config', '$http', FindAllCatalogItemTypesFactory])
    .factory('findCatalogPartitions', ['config', '$http', FindCatalogPartitionsFactory])
    .factory('findCatalogItemById', ['config', 'restServiceHandler', FindCatalogItemByIdFactory])
    .factory('findCatalogItemsByPartition', ['config', 'restServiceHandler', FindCatalogItemsByPartitionFactory])
    .factory('catalogPathProcessor', [CatalogPathProcessorFactory])
    .factory('catalogPathParser', ['catalogPathProcessor', CatalogPathParserFactory])
    .controller('ListCatalogPartitionsController', ['$scope', 'findCatalogPartitions', 'ngRegisterTopicHandler', ListCatalogPartitionsController])
    .controller('AddToCatalogController', ['config', '$scope', '$location', 'topicRegistry', 'topicMessageDispatcher', 'findAllCatalogItemTypes', 'scopedRestServiceHandler', '$location', 'localeResolver', AddToCatalogController])
    .controller('RemoveCatalogPartitionController', ['config', '$scope', '$location', 'scopedRestServiceHandler', 'topicMessageDispatcher', 'topicRegistry', RemoveCatalogPartitionController])
    .controller('RemoveItemFromCatalogController', ['config', '$scope', '$location', 'catalogPathProcessor', 'topicMessageDispatcher', 'scopedRestServiceHandler', 'localStorage', RemoveItemFromCatalogController])
    .controller('QueryCatalogController', ['$scope', 'ngRegisterTopicHandler', 'findCatalogItemsByPartition', 'findCatalogItemById', 'topicMessageDispatcher', QueryCatalogController])
    .controller('AddPartitionToCatalogController', ['config', '$scope', '$location', '$routeParams', 'scopedRestServiceHandler', 'topicMessageDispatcher', AddPartitionToCatalogController])
    .controller('UpdateCatalogItemController', ['config', '$scope', 'updateCatalogItem', 'usecaseAdapterFactory', 'topicMessageDispatcher', 'findCatalogItemById', UpdateCatalogItemController])
    .controller('BrowseCatalogController', ['$scope', '$routeParams', 'catalogPathParser', BrowseCatalogController])
    .controller('ViewCatalogItemController', ['config', '$scope', '$http', '$routeParams', 'catalogPathParser', 'topicRegistry', 'findCatalogItemById', ViewCatalogItemController])
    .controller('MoveCatalogItemController', ['$scope', 'sessionStorage', 'updateCatalogItem', 'usecaseAdapterFactory', 'ngRegisterTopicHandler', 'topicMessageDispatcher', MoveCatalogItemController])
    .directive('splitInRows', splitInRowsDirectiveFactory)
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
                $routeProvider.when('/browse' + path + '/', {templateUrl: 'partials/catalog/browse.html', controller: BrowseCatalogController});
                $routeProvider.when('/view' + path, {templateUrl: 'partials/catalog/item.html', controller: ViewCatalogItemController});
                $routeProvider.when('/:locale/browse' + path + '/', {templateUrl: 'partials/catalog/browse.html', controller: BrowseCatalogController});
                $routeProvider.when('/:locale/view' + path, {templateUrl: 'partials/catalog/item.html', controller: ViewCatalogItemController});
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
}

function QueryCatalogController($scope, ngRegisterTopicHandler, findCatalogItemsByPartition, findCatalogItemById, topicMessageDispatcher) {
    $scope.forPartition = function (partition, args) {
        $scope.partition = partition;
        $scope.items = [];
        if (!args) args = {};
        var ctx = {
            partition: partition
        };

        if (args.sortBy) ctx.sortBy = args.sortBy;
        if (args.sortOrder) ctx.sortOrder = args.sortOrder;
        if (args.subset) {
            ctx.offset = args.subset.offset || 0;
            ctx.count = args.subset.count;
        }
        ctx.success = function (items) {
            if (args.subset) ctx.offset += items.length;
            items.forEach(function (it) {
                $scope.items.push(it);
            });
            if ($scope.items.length > 0 && items.length == 0)
                topicMessageDispatcher.fire('system.success', {
                    code: 'no.more.results.found',
                    default: 'No more results found.'
                });
        };

        function executeQuery() {
            findCatalogItemsByPartition(ctx);
        }

        ngRegisterTopicHandler($scope, 'app.start', function () {
            executeQuery();
        });

        $scope.searchForMore = function () {
            executeQuery();
        };

        ngRegisterTopicHandler($scope, 'catalog.item.added', function (id) {
            findCatalogItemById(id, function (item) {
                if (args.onAddition == 'prepend') $scope.items.unshift(item);
                else $scope.items.push(item);
            });
        });

        ngRegisterTopicHandler($scope, 'catalog.item.updated', function (id) {
            findCatalogItemById(id, function (item) {
                for (var i = 0; i < $scope.items.length; i++) {
                    if ($scope.items[i].id == id) {
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

    $scope.init = function (query, partition) {
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
                if (ctx.subset) ctx.subset.offset += partitions.length;
                partitions.forEach(function (it) {
                    $scope.partitions.push(it);
                });
            };
            if (args.sortings) ctx.sortings = args.sortings;
            if (!ctx.subset && defaultSubset) {
                ctx.subset = {offset: defaultSubset.offset, count: defaultSubset.count};
            }
            findCatalogPartitions(ctx);
        }

        $scope.partitions = [];
        $scope.partition = args.owner;
        $scope.parent = $scope.partition == '/' ? undefined : self.toParent($scope.partition);
        $scope.searchForMore = function () {
            executeQuery();
        };

        var added = function (partition) {
            if (partition.owner == $scope.partition) $scope.partitions.push(partition);
        };

        var removed = function (id) {
            $scope.partitions.forEach(function (it) {
                if (it.id == id) $scope.partitions.splice($scope.partitions.indexOf(it), 1);
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

function AddToCatalogController(config, $scope, $routeParams, topicRegistry, topicMessageDispatcher, findAllCatalogItemTypes, restServiceHandler, $location, localeResolver) {
    var self = this;

    var preselectedType;
    var reset = function () {
        $scope.partition = $scope.partition || $routeParams.partition || '';
        $scope.item = {};
        $scope.item.type = $routeParams.type || preselectedType || '';
        $scope.item.name = '';
        $scope.typeSelected = $routeParams.type;
        if ($routeParams.partition) $scope.partition = $routeParams.partition;
        if ($scope.form) $scope.form.$setPristine();
    };

    var redirect = function (to) {
        $location.path(to);
    };

    $scope.noredirect = function (partition, type) {
        $scope.init({partition: partition, type: type});
    };

    $scope.init = function (params) {
        $scope.config = params;
        if (params.partition)  $scope.partition = params.partition;
        if (params.type) preselectedType = params.type;
        if (params.redirectTo) $scope.redirectTo = params.redirectTo;
    };

    $scope.templateUri = function () {
        return 'partials/catalog/add/' + (!$scope.item || $scope.item.type == '' ? 'default' : $scope.item.type) + '.html';
    };

    $scope.submit = function () {
        var onSuccess = function (item) {
            topicMessageDispatcher.fire('catalog.item.added', item.id);
            reset();
            if ($scope.redirectTo) redirect($scope.redirectTo);
            if ($scope.config && $scope.config.redirectToView) redirect('/' + localeResolver() + '/view' + item.id);
        };

        $scope.item.namespace = config.namespace;
        $scope.item.partition = $scope.partition;
        restServiceHandler({
            scope: $scope,
            params: {
                method: 'PUT',
                url: (config.baseUri || '') + 'api/entity/catalog-item',
                data: $scope.item,
                withCredentials: true
            },
            success: onSuccess
        });
    };

    topicRegistry.subscribe('app.start', function () {
        findAllCatalogItemTypes(function (types) {
            $scope.types = types;
            reset();
        });
    });
}

function ViewCatalogItemController(config, $scope, $http, $routeParams, catalogPathParser, topicRegistry, findCatalogItemById) {
    var current = catalogPathParser($routeParams, 'file');

    $scope.path = current.path;
    $scope.head = current.head;
    $scope.name = current.name;
    $scope.parent = current.parent;
    $scope.breadcrumbs = current.breadcrumbs;

    $scope.templateUri = function () {
        return 'partials/catalog/item/' + ($scope.type == undefined ? 'default' : $scope.type) + '.html';
    };

    var applyItemToScope = function (item) {
        addItemToScope(item);
        $scope.item = item;
    };

    // @deprecated instead put item on $scope.item
    function addItemToScope(item) {
        Object.keys(item).forEach(function (key) {
            $scope[key] = item[key];
        });
    }

    $scope.init = function (path) {
        topicRegistry.subscribe('app.start', function () {
            if ($routeParams.id)
                $http.get('api/entity/catalog-item?id=/' + $routeParams.id).success(applyItemToScope);
            else
                $http.get((config.baseUri || '') + 'api/entity/catalog-item?id=' + path,
                    {headers: {'x-namespace': config.namespace}}).success(applyItemToScope);
        });
    };

    var updated = function (id) {
        findCatalogItemById(id, function (item) {
            $scope.item = item;
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

function RemoveItemFromCatalogController(config, $scope, $location, catalogPathProcessor, topicMessageDispatcher, scopedRestServiceHandler, localStorage) {
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
        return (localStorage.locale ? localStorage.locale : '') + '/browse' + current.parent;
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
                topicMessageDispatcher.fire('system.success', {
                    code: 'catalog.item.removed',
                    default: 'Item removed!'
                });
                topicMessageDispatcher.fire('catalog.item.removed', id);
                topicMessageDispatcher.fire('edit.mode.unlock', id);
                if (isRedirectEnabled()) $location.path(self.config.redirect || toParent(current)).search({});
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
        bindWatch();
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

    $scope.update = function () {
        $scope.item.namespace = config.namespace;
        var ctx = usecaseAdapterFactory($scope);
        ctx.data = $scope.item;
        ctx.success = function () {
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

function UpdateCatalogItemFactory(updateCatalogItemWriter, topicMessageDispatcher) {
    return function (args) {
        var onSuccess = args.success;
        args.success = function () {
            topicMessageDispatcher.fire('system.success', {
                code: 'catalog.item.updated',
                default: 'Catalog item updated!'
            });
            topicMessageDispatcher.fire('catalog.item.updated', args.data.id);
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