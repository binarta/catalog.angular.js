angular.module('catalog', ['ngRoute'])
    .factory('findAllCatalogItemTypes', ['config', '$http', FindAllCatalogItemTypesFactory])
    .factory('findCatalogPartitions', ['config', '$http', FindCatalogPartitionsFactory])
    .factory('findCatalogItemById', ['config', 'restServiceHandler', FindCatalogItemByIdFactory])
    .factory('findCatalogItemsByPartition', ['config', 'restServiceHandler', FindCatalogItemsByPartitionFactory])
    .factory('catalogPathProcessor', [CatalogPathProcessorFactory])
    .factory('catalogPathParser', ['catalogPathProcessor', CatalogPathParserFactory])
    .controller('ListCatalogPartitionsController', ['$scope', 'findCatalogPartitions', 'topicRegistry', ListCatalogPartitionsController])
    .controller('AddToCatalogController', ['config', '$scope', '$location', 'topicRegistry', 'topicMessageDispatcher', 'findAllCatalogItemTypes', 'scopedRestServiceHandler', AddToCatalogController])
    .controller('RemoveCatalogPartitionController', ['config', '$scope', '$location', 'scopedRestServiceHandler', 'topicMessageDispatcher', 'topicRegistry', RemoveCatalogPartitionController])
    .controller('RemoveItemFromCatalogController', ['config', '$scope', '$location', 'catalogPathProcessor', 'topicMessageDispatcher', 'scopedRestServiceHandler', 'localStorage', RemoveItemFromCatalogController])
    .controller('QueryCatalogController', ['$scope', 'topicRegistry', 'findCatalogItemsByPartition', 'findCatalogItemById', QueryCatalogController])
    .controller('AddPartitionToCatalogController', ['config', '$scope', '$location', '$routeParams', 'scopedRestServiceHandler', 'topicMessageDispatcher', AddPartitionToCatalogController])
    .controller('UpdateCatalogItemController', ['config', '$scope', 'scopedRestServiceHandler', 'topicMessageDispatcher', UpdateCatalogItemController])
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
                $routeProvider.when('/browse' + path + '/', {templateUrl: 'partials/catalog/browse.html', controller: ['$scope', '$routeParams', 'catalogPathParser', BrowseCatalogController]});
                $routeProvider.when('/view' + path, {templateUrl: 'partials/catalog/item.html', controller: ['config', '$scope', '$http', '$routeParams', 'catalogPathParser', 'topicRegistry', ViewCatalogItemController]});
                $routeProvider.when('/:locale/browse' + path + '/', {templateUrl: 'partials/catalog/browse.html', controller: ['$scope', '$routeParams', 'catalogPathParser', BrowseCatalogController]});
                $routeProvider.when('/:locale/view' + path, {templateUrl: 'partials/catalog/item.html', controller: ['config', '$scope', '$http', '$routeParams', 'catalogPathParser', 'topicRegistry', ViewCatalogItemController]});
            });
    }]);

function FindCatalogPartitionsFactory(config, $http) {
    return function (query, owner, onSuccess) {
        var onError = function () {
            onSuccess([]);
        };

        if (!owner) onSuccess([]);
        else $http.post((config.baseUri || '') + 'api/query/catalog-partition/' + query, {args: {
            namespace: config.namespace,
            owner: owner
        }}).error(onError).success(onSuccess);
    }
}

function FindCatalogItemByIdFactory(config, restServiceHandler) {
    return function (id, onSuccess) {
        restServiceHandler({
            params: {
                method: 'GET',
                url: (config.baseUri || '') + 'api/entity/catalog-item?id=' + encodeURIComponent(id),
                withCredentials:true
            },
            error: function () {
                onSuccess([])
            },
            success: onSuccess
        });
    }
}

function FindCatalogItemsByPartitionFactory(config, restServiceHandler) {
    return function (id, onSuccess) {
        restServiceHandler({
            params: {
                method: 'POST',
                url: (config.baseUri || '') + 'api/query/catalog-item/findByPartition',
                data: {args: {
                    namespace: config.namespace,
                    partition: id
                }},
                withCredentials:true
            },
            error: function () {
                onSuccess([])
            },
            success: onSuccess
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

function QueryCatalogController($scope, topicRegistry, findCatalogItemsByPartition, findCatalogItemById) {
    $scope.forPartition = function (partition) {
        $scope.partition = partition;

        var updated = function (id) {
            findCatalogItemById(id, function (item) {
                for(var i = 0; i < $scope.items.length; i++) {
                    if ($scope.items[i].id == id) {
                        $scope.items[i] = item;
                        break;
                    }
                }
            });
        };

        var added = function (id) {
            findCatalogItemById(id, function (item) {
                $scope.items.push(item);
            });
        };

        var removed = function (id) {
            $scope.items = $scope.items.filter(function (it) {
                return it.id != id
            });
        };

        $scope.$on('$routeChangeStart', function() {
            topicRegistry.unsubscribe('catalog.item.added', added);
            topicRegistry.unsubscribe('catalog.item.updated', updated);
            topicRegistry.unsubscribe('catalog.item.removed', removed);
        });

        topicRegistry.subscribe('app.start', function () {
            findCatalogItemsByPartition(partition, function (items) {
                $scope.items = items;
            });
        });

        topicRegistry.subscribe('catalog.item.added', added);
        topicRegistry.subscribe('catalog.item.updated', updated);
        topicRegistry.subscribe('catalog.item.removed', removed);
    };
}

function ListCatalogPartitionsController($scope, findCatalogPartitions, topicRegistry) {
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
        $scope.partition = partition;
        $scope.parent = partition == '/' ? undefined : self.toParent(partition);

        var added = function (partition) {
            if (partition.owner == $scope.partition) $scope.partitions.push(partition);
        };

        var removed = function (id) {
            $scope.partitions = $scope.partitions.filter(function (it) {
                return it.id != id
            });
        };

        $scope.$on('$routeChangeStart', function() {
            topicRegistry.unsubscribe('catalog.partition.added', added);
            topicRegistry.unsubscribe('catalog.partition.removed', removed);
        });

        topicRegistry.subscribe('app.start', function () {
            findCatalogPartitions(query, partition, function (partitions) {
                $scope.partitions = partitions;
            });
        });

        topicRegistry.subscribe('catalog.partition.added', added);
        topicRegistry.subscribe('catalog.partition.removed', removed);
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

function AddToCatalogController(config, $scope, $routeParams, topicRegistry, topicMessageDispatcher, findAllCatalogItemTypes, restServiceHandler) {
    var self = this;

    var preselectedType;
    var init = function () {
        $scope.partition = $scope.partition || $routeParams.partition || '';
        $scope.item = {};
        $scope.item.type = $routeParams.type || preselectedType || '';
        $scope.item.name = '';
        $scope.typeSelected = $routeParams.type;
        if ($routeParams.partition) $scope.partition = $routeParams.partition;
    };

    $scope.noredirect = function (partition, type) {
        if (partition) $scope.partition = partition;
        if (type) preselectedType = type;
    };

    $scope.templateUri = function () {
        return 'partials/catalog/add/' + (!$scope.item || $scope.item.type == '' ? 'default' : $scope.item.type) + '.html';
    };

    $scope.submit = function () {
        var onSuccess = function (item) {
            topicMessageDispatcher.fire('catalog.item.added', item.id);
            init();
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
            init();
        });
    });
}

function ViewCatalogItemController(config, $scope, $http, $routeParams, catalogPathParser, topicRegistry) {
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
        Object.keys(item).forEach(function (key) {
            $scope[key] = item[key];
        });
    };

    $scope.init = function (path) {
        topicRegistry.subscribe('app.start', function () {
            if ($routeParams.id)
                $http.get('api/entity/catalog-item?id=/' + $routeParams.id).success(applyItemToScope);
            else
                $http.get((config.baseUri || '') + 'api/entity/catalog-item?id=' + path,
                    {headers: {'x-namespace': config.namespace}}).success(applyItemToScope);
        });
    }
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

    function redirectTo(partition) {
        $location.path((localStorage.locale ? localStorage.locale : '') + '/browse' + partition).search({});
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
                if (isRedirectEnabled()) redirectTo(current.parent);
            }
        });
    }
}

function UpdateCatalogItemController(config, $scope, scopedRestServiceHandler, topicMessageDispatcher) {
    var self = this;

    $scope.init = function (item) {
        $scope.item = item;
        $scope.item.context = 'update';
    };

    $scope.$watch('item', function (newValue, oldValue) {
        $scope.unchanged = (newValue == oldValue);
    }, true);

    $scope.update = function () {
        $scope.item.namespace = config.namespace;
        scopedRestServiceHandler({
            scope: $scope,
            params: {
                withCredentials: true,
                method: 'POST',
                url: (config.baseUri || '') + 'api/entity/catalog-item',
                data: $scope.item
            },
            success: function () {
                topicMessageDispatcher.fire('system.success', {
                    code: 'catalog.item.updated',
                    default: 'Catalog item updated!'
                });
                topicMessageDispatcher.fire('catalog.item.updated', $scope.item.id);
                $scope.unchanged = true;
            }
        });
    }
}