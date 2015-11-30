angular.module("catalog.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("catalog-breadcrumb.html","<section id=\"breadcrumb\"><div class=\"container\"><div class=\"row\"><div ng-if=\"::catalogCtrl.breadcrumbs\"><ol class=\"breadcrumb\" ng-if=\"viewport.xs && catalogCtrl.breadcrumbs.length > 1\"><li><a ng-href=\"#!{{::localePrefix}}/browse{{::catalogCtrl.breadcrumbs[breadcrumbs.length - 2].path}}\" i18n=\"\" code=\"navigation.label.{{::catalogCtrl.head}}\" read-only=\"\" ng-if=\"::catalogCtrl.breadcrumbs[breadcrumbs.length - 2].name == catalogCtrl.head\"><i class=\"fa fa-angle-left fa-fw\"></i> {{::var}}</a> <a class=\"inline\" ng-href=\"#!{{::localePrefix}}/browse{{::catalogCtrl.breadcrumbs[breadcrumbs.length - 2].path}}\" i18n=\"\" code=\"{{::catalogCtrl.breadcrumbs[breadcrumbs.length - 2].path}}\" default=\"{{::catalogCtrl.breadcrumbs[breadcrumbs.length - 2].name}}\" ng-if=\"::catalogCtrl.breadcrumbs[breadcrumbs.length - 2].name != catalogCtrl.head\"><i class=\"fa fa-angle-left fa-fw\"></i> {{var}}</a></li></ol><ol class=\"breadcrumb\" ng-if=\"!viewport.xs\"><li ng-class=\"::{active: $last}\" ng-repeat=\"breadcrumb in ::catalogCtrl.breadcrumbs\"><a ng-href=\"#!{{::localePrefix}}/browse{{::breadcrumb.path}}\" i18n=\"\" code=\"navigation.label.{{::catalogCtrl.head}}\" read-only=\"\" ng-if=\"::!$last && breadcrumb.name == catalogCtrl.head\">{{::var}}</a> <span ng-if=\"::$last && breadcrumb.name == catalogCtrl.head\" i18n=\"\" code=\"navigation.label.{{::catalogCtrl.head}}\" read-only=\"\">{{::var}}</span> <a class=\"inline\" ng-href=\"#!{{::localePrefix}}/browse{{::breadcrumb.path}}\" i18n=\"\" code=\"{{::breadcrumb.path}}\" default=\"{{::breadcrumb.name}}\" ng-if=\"::!$last && breadcrumb.name != catalogCtrl.head\">{{var}}</a> <span class=\"inline\" ng-if=\"::$last && breadcrumb.name != catalogCtrl.head\" i18n=\"\" code=\"{{::breadcrumb.path}}\" default=\"{{::breadcrumb.name}}\">{{var}}</span></li></ol></div><div ng-if=\"::searchCtrl.filters.type\"><ol class=\"breadcrumb\"><li class=\"inline\" i18n=\"\" code=\"navigation.label.{{::searchCtrl.filters.type}}\" read-only=\"\"><a ng-href=\"#!{{::localePrefix}}/browse/{{::searchCtrl.filters.type}}/\"><i class=\"fa fa-angle-left fa-fw\"></i> {{::var}}</a></li></ol></div></div></div></section>");
$templateCache.put("catalog-browse-header.html","<div class=\"page-header-wrapper\"><div class=\"container\"><div class=\"row\"><div class=\"col-xs-12\"><div class=\"page-header\"><h1 ng-if=\"::catalogCtrl.parent != \'/\'\"><span class=\"inline\" i18n=\"\" code=\"{{::catalogCtrl.path}}\" default=\"{{::catalogCtrl.name}}\">{{var}}</span> <span checkpoint-permission-for=\"catalog.partition.remove\"><span ng-controller=\"RemoveCatalogPartitionController\" ng-init=\"init(catalogCtrl.path)\" ng-if=\"permitted\" i18n=\"\" code=\"catalog.remove.partition.confirm\" read-only=\"\"><button type=\"button\" class=\"btn btn-danger btn-sm\" ng-click-confirm=\"submit(\'/browse\'+parent)\" confirm-message=\"{{::var}}\" ng-disabled=\"working\" ng-if=\"::var\"><i class=\"fa fa-times fa-fw\"></i> <span i18n=\"\" code=\"catalog.remove.partition.button\" read-only=\"\">{{::var}}</span></button></span></span></h1><h1 i18n=\"\" code=\"navigation.label.{{::catalogCtrl.name}}\" read-only=\"\" ng-bind=\"var\" ng-if=\"::catalogCtrl.parent == \'/\'\"></h1></div></div></div></div></div>");
$templateCache.put("catalog-browse.html","<div class=\"bin-catalog\" ng-controller=\"ListCatalogPartitionsController as listCtrl\" ng-init=\"listCtrl.init(\'ownedBy\', catalogCtrl.path)\"><div ng-controller=\"ConfigureVatRateController as vat\"><div class=\"container\" ng-if=\"!working && !vat.checkForVatRate\"><div class=\"row\"><div class=\"col-xs-12 col-sm-4 col-md-3\" ng-if=\"listCtrl.partitions.length > 0 || catalogCtrl.parent != \'/\'\"><div class=\"list-group\" checkpoint-permission-for=\"catalog.partition.add\"><a class=\"list-group-item\" ng-if=\"::catalogCtrl.parent != \'/\'\" ng-href=\"#!{{::localePrefix}}/browse{{::catalogCtrl.parent}}\"><i class=\"fa fa-folder-o fa-fw\"></i> ..</a> <a class=\"list-group-item\" ng-repeat=\"partition in listCtrl.partitions track by partition.id\" ng-href=\"#!{{::localePrefix}}/browse{{::partition.id}}\" i18n=\"\" code=\"{{::partition.id}}\" default=\"{{::partition.name}}\">{{var}} <span class=\"pull-right\"><i class=\"fa fa-angle-right fa-fw\"></i></span></a><div class=\"list-group-item\" ng-if=\"permitted\"><form ng-controller=\"AddPartitionToCatalogController\" ng-init=\"init(catalogCtrl.path)\" ng-submit=\"submit()\"><div class=\"input-group\" ng-class=\"{\'has-error\': violations[\'name\']}\"><input type=\"text\" class=\"form-control\" ng-model=\"$parent.name\" i18n=\"\" code=\"{{\'catalog.\' + (catalogCtrl.parent == \'/\' ? \'partition\' : \'subpartition\') + \'.add.placeholder\'}}\" read-only=\"\" placeholder=\"{{::var}}\" required=\"\" ng-disabled=\"working\"><div class=\"input-group-btn\"><button class=\"btn btn-primary\" type=\"submit\" ng-disabled=\"working\"><i class=\"fa fa-plus\"></i></button></div></div><div class=\"help-block text-danger\" ng-repeat=\"v in violations[\'name\']\" i18n=\"\" code=\"catalog.partition.name.{{::v}}\" default=\"{{::v}}\">{{::var}}</div></form></div></div></div><div class=\"col-xs-12\" ng-if=\"listCtrl.partitions.length == 0 && catalogCtrl.parent == \'/\'\"><div checkpoint-permission-for=\"catalog.partition.add\"><div ng-if=\"permitted\"><h3 class=\"bin-empty-title\" i18n=\"\" code=\"catalog.add.first.partition.message\" read-only=\"\" ng-bind=\"::var\"></h3><div class=\"row\"><div class=\"col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4\"><form ng-controller=\"AddPartitionToCatalogController as addPartitionCtrl\" ng-init=\"init(catalogCtrl.path); addPartitionCtrl.noredirect = false;\" ng-submit=\"submit(localePrefix + \'/browse\' + catalogCtrl.path + name)\"><div class=\"input-group input-group-lg\" ng-class=\"{\'has-error\': violations[\'name\']}\"><input type=\"text\" class=\"form-control\" ng-model=\"$parent.name\" i18n=\"\" code=\"catalog.partition.add.placeholder\" read-only=\"\" placeholder=\"{{::var}}\" required=\"\" ng-disabled=\"working\"><div class=\"input-group-btn\"><button class=\"btn btn-primary\" type=\"submit\" ng-disabled=\"working\"><i class=\"fa fa-plus\"></i></button></div></div><div class=\"help-block text-danger\" ng-repeat=\"v in violations[\'name\']\" i18n=\"\" code=\"catalog.partition.name.{{::v}}\" default=\"{{::v}}\">{{::var}}</div></form></div></div></div></div></div><div class=\"col-xs-12 col-sm-8 col-md-9\"><div checkpoint-permission-for=\"catalog.item.add\"><div ng-if=\"catalogCtrl.parent != \'/\' && permitted\"><div class=\"row\"><div class=\"col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4\"><div class=\"list-group\"><div class=\"list-group-item\"><form ng-controller=\"AddToCatalogController\" ng-init=\"init({ partition: catalogCtrl.path, type: catalogCtrl.head, redirectToView: true, editMode: true })\" ng-submit=\"submit()\" name=\"catalogItemAddForm\"><div class=\"bin-action-visual\"><i class=\"fa fa-plus\"></i></div><div class=\"input-group\" ng-class=\"{\'has-error\': violations[\'defaultName\']}\"><input type=\"text\" class=\"form-control\" name=\"defaultName\" ng-model=\"$parent.item.defaultName\" i18n=\"\" code=\"catalog.{{::catalogCtrl.head}}.add.placeholder\" default=\"New item\" read-only=\"\" placeholder=\"{{::var}}\" required=\"\" ng-disabled=\"working\"><div class=\"input-group-btn\"><button class=\"btn btn-primary\" type=\"submit\" ng-disabled=\"working\"><i class=\"fa fa-plus\"></i></button></div></div><div class=\"help-block text-danger\" ng-repeat=\"v in violations[\'defaultName\']\" i18n=\"\" code=\"catalog.item.defaultName.{{::v}}\" default=\"{{::v}}\">{{::var}}</div></form></div></div></div></div><hr></div></div><div ng-if=\"listCtrl.partitions.length > 0 && catalogCtrl.parent == \'/\'\" ng-controller=\"BinartaSearchController as searchCtrl\" ng-init=\"searchCtrl.init({ entity:\'catalog-item\', context:\'search\', filters:{ type: catalogCtrl.head, sortings: [ {on:\'creationTime\', orientation:\'desc\'} ] }, autosearch:true, noMoreResultsNotification: false, subset:{count: viewport.xs || viewport.sm ? 6 : 8} })\"><div class=\"bin-catalog-group\"><h2 class=\"group-title\"><span i18n=\"\" code=\"catalog.latest.prefix\" read-only=\"\" ng-bind=\"::var\"></span> <span i18n=\"\" code=\"navigation.label.{{::catalogCtrl.name}}\" read-only=\"\" ng-bind=\"var | lowercase\"></span></h2><ng-include src=\"\'catalog-list-rows.html\'\"></ng-include></div></div><div ng-if=\"::catalogCtrl.parent != \'/\'\" ng-controller=\"BinartaSearchController as searchCtrl\" ng-init=\"searchCtrl.init({ entity:\'catalog-item\', context:\'search\', filters:{ type: catalogCtrl.head, partition: listCtrl.partition, sortings: [ {on:\'creationTime\', orientation:\'desc\'} ] }, autosearch:true, noMoreResultsNotification: false, subset:{count: 12} })\"><ng-include src=\"\'catalog-list-rows.html\'\"></ng-include><ng-include src=\"\'search-for-more.html\'\"></ng-include></div></div></div></div><div class=\"container\" ng-if=\"!working && vat.checkForVatRate\"><div class=\"row\"><div class=\"col-xs-12 col-sm-6 col-sm-offset-3\"><ng-include src=\"\'catalog-vat-rate-form.html\'\"></ng-include></div></div></div></div></div>");
$templateCache.put("catalog-list-item-default.html","<div class=\"bin-catalog-item thumbnail clearfix\"><div class=\"clerk-actions-wrapper\" ng-controller=\"catalogClerkActionsController as itemActions\" ng-class=\"{open: itemActions.open}\" ng-swipe-left=\"itemActions.show()\" ng-swipe-right=\"itemActions.hide()\" ng-swipe-disable-mouse=\"\"><a class=\"item-image\" ng-href=\"#!{{::localePrefix}}/view{{::item.id}}\"><img bin-image=\"carousels{{::item.id}}/0.img\"></a><div class=\"caption\"><a ng-href=\"#!{{::localePrefix}}/view{{::item.id}}\"><h3 class=\"item-title\" i18n=\"\" code=\"{{::item.id}}\">{{var}}</h3></a><p class=\"item-lead\" i18n=\"\" code=\"{{::item.id}}.body\" editor=\"full\" ng-bind-html=\"var|words:8\"></p><div class=\"item-price\" ng-class=\"{\'text-muted\':!item.price || item.price == 0}\" catalog-item-price=\"item\"></div></div><div class=\"clerk-actions\" ng-if=\"itemActions.permitted\"><div class=\"clerk-actions-toggle\" ng-click=\"itemActions.toggle()\"><span class=\"arrow\"><i class=\"fa fa-angle-left fa-fw text-muted\"></i></span> <span class=\"cross\"><i class=\"fa fa-times fa-fw\"></i></span></div><div class=\"actions\"><div checkpoint-permission-for=\"catalog.item.remove\"><form ng-controller=\"RemoveItemFromCatalogController\" ng-init=\"init({noredirect:true, success:item.remove})\" ng-if=\"permitted\" i18n=\"\" code=\"catalog.remove.item.confirm\" read-only=\"\"><button type=\"button\" class=\"btn btn-danger btn-sm\" ng-click-confirm=\"submit(item.id)\" confirm-message=\"{{::var}}\" ng-disabled=\"working\" ng-if=\"::var\"><i class=\"fa fa-times fa-fw\"></i> <span class=\"visible-xs-inline\" i18n=\"\" code=\"catalog.remove.item.button\" read-only=\"\">{{::var}}</span></button></form></div></div></div></div></div>");
$templateCache.put("catalog-list-rows.html","<div class=\"bin-catalog-items\" ng-if=\"viewport.xs\"><div class=\"row\" ng-repeat=\"item in searchCtrl.results track by item.id\"><div class=\"col-xs-12\"><ng-include src=\"\'catalog-list-item-default.html\'\"></ng-include></div></div></div><div class=\"bin-catalog-items\" ng-if=\"viewport.sm\"><div bin-split-in-rows=\"searchCtrl.results\" columns=\"3\"><div class=\"row\" ng-repeat=\"row in rows track by row.id\"><div class=\"col-sm-4\" ng-repeat=\"item in row.items track by item.id\"><ng-include src=\"\'catalog-list-item-default.html\'\"></ng-include></div></div></div></div><div class=\"bin-catalog-items\" ng-if=\"viewport.md || viewport.lg\"><div bin-split-in-rows=\"searchCtrl.results\" columns=\"4\"><div class=\"row\" ng-repeat=\"row in rows track by row.id\"><div class=\"col-md-3\" ng-repeat=\"item in row.items track by item.id\"><ng-include src=\"\'catalog-list-item-default.html\'\"></ng-include></div></div></div></div>");
$templateCache.put("catalog-search-form.html","<section id=\"search\"><div class=\"container\"><div class=\"row\"><div class=\"col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3\"><i18n code=\"catalog.search.all.prefix\" read-only=\"\" var=\"searchAll\"></i18n><form ng-submit=\"submit()\" ng-controller=\"RedirectToSearchController\" ng-init=\"init({page:\'/search/\' + catalogCtrl.head})\" ng-if=\"::catalogCtrl\"><div class=\"input-group input-group-lg\"><input type=\"text\" class=\"form-control\" ng-model=\"$parent.q\" i18n=\"\" code=\"navigation.label.{{::catalogCtrl.head}}\" read-only=\"\" placeholder=\"{{::searchAll}} {{var | lowercase}}\"><div class=\"input-group-btn\"><button class=\"btn btn-primary\" type=\"submit\"><i class=\"fa fa-search\"></i></button></div></div></form><form ng-submit=\"searchCtrl.search()\" ng-if=\"::searchCtrl\"><div class=\"input-group input-group-lg\"><input type=\"text\" class=\"form-control\" ng-model=\"searchCtrl.q\" i18n=\"\" code=\"navigation.label.{{::searchCtrl.filters.type}}\" read-only=\"\" placeholder=\"{{::searchAll}} {{var | lowercase}}\"><div class=\"input-group-btn\"><button class=\"btn btn-primary\" type=\"submit\" ng-disabled=\"searchCtrl.working\"><i class=\"fa fa-search\"></i></button></div></div></form></div></div></div></section>");
$templateCache.put("catalog-search.html","<div class=\"bin-catalog\" ng-init=\"searchCtrl.init({ entity:\'catalog-item\', context:\'search\', filters:{ locale: \'default\', sortings: [ {on:\'name\', orientation:\'asc\'} ] }, autosearch:true, noMoreResultsNotification: false, subset:{count:12}})\"><div class=\"container\"><div class=\"row\"><div class=\"col-xs-12 col-sm-10 col-sm-offset-1 col-lg-8 col-lg-offset-2\"><ng-include src=\"\'catalog-list-rows.html\'\"></ng-include><ng-include src=\"\'search-for-more.html\'\"></ng-include></div></div></div></div>");
$templateCache.put("catalog-vat-rate-form.html","<form name=\"form\" ng-submit=\"vat.submit()\"><div class=\"form-group\" ng-class=\"{\'has-error\': form[\'config-vat-rate-country-code\'].$invalid}\"><label i18n=\"\" code=\"catalog.config.vat.country.code.label\" read-only=\"\" for=\"config-vat-rate-country-code\">{{::var}}</label><select class=\"form-control\" id=\"config-vat-rate-country-code\" name=\"config-vat-rate-country-code\" ng-model=\"vat.countryCode\" ng-change=\"vat.getStandardVatRate()\" ng-options=\"c.code as c.country for c in vat.countries\" required=\"\"></select></div><div class=\"form-group\" ng-class=\"{\'has-error\': form[\'config-vat-rate\'].$invalid}\" ng-if=\"vat.countryCode\"><label i18n=\"\" code=\"catalog.config.vat.rate.label\" read-only=\"\" for=\"config-vat-rate\">{{::var}}</label><div class=\"row\"><div class=\"col-xs-12 col-sm-6\"><div class=\"input-group\"><input type=\"number\" min=\"0\" max=\"100\" class=\"form-control\" id=\"config-vat-rate\" name=\"config-vat-rate\" ng-model=\"vat.vatRate\"><div class=\"input-group-addon\">%</div></div></div></div></div><div class=\"form-group\"><button type=\"submit\" class=\"btn btn-success\" ng-disabled=\"working || !vat.isValid()\" i18n=\"\" code=\"catalog.config.save.button\" read-only=\"\"><span ng-show=\"!working\"><i class=\"fa fa-check-circle fa-fw\"></i></span> <span ng-show=\"working\"><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> {{::var}}</button></div></form>");
$templateCache.put("catalog-view-item-header.html","<div class=\"page-header-wrapper\"><div class=\"container\"><div class=\"row\"><div class=\"col-xs-12\"><div class=\"page-header\"><h1 class=\"bin-catalog-title inline\" i18n=\"\" code=\"{{::catalogCtrl.breadcrumbs[breadcrumbs.length - 2].path}}\" default=\"{{::catalogCtrl.breadcrumbs[breadcrumbs.length - 2].name}}\">{{var}}</h1></div></div></div></div></div>");
$templateCache.put("catalog-view-item.html","<div class=\"bin-catalog\"><div class=\"container\"><div class=\"row bin-catalog-item\"><div class=\"col-xs-12 col-sm-4 col-md-3\"><div class=\"list-group\"><a class=\"list-group-item\" ng-href=\"#!{{::localePrefix}}/browse{{::catalogCtrl.parent}}\"><i class=\"fa fa-folder-o fa-fw\"></i> ..</a></div></div><div class=\"col-xs-12 col-sm-8 col-md-9\"><div class=\"row\"><div class=\"col-xs-12 col-sm-8 col-sm-offset-4\"><h2 class=\"item-title inline\" i18n=\"\" code=\"{{::catalogCtrl.path}}\" var=\"itemName\">{{var}}</h2><div class=\"pull-right\" checkpoint-permission-for=\"catalog.item.remove\"><form ng-controller=\"RemoveItemFromCatalogController\" ng-if=\"permitted\" i18n=\"\" code=\"catalog.remove.item.confirm\" read-only=\"\"><button type=\"button\" class=\"btn btn-danger btn-sm\" ng-click-confirm=\"submit(item.id)\" confirm-message=\"{{::var}}\" ng-disabled=\"working\" ng-if=\"::var\"><i class=\"fa fa-times fa-fw\"></i> <span i18n=\"\" code=\"catalog.remove.item.button\" read-only=\"\">{{::var}}</span></button></form></div></div></div><div class=\"row\"><div class=\"col-xs-12 col-sm-4\"><div class=\"item-image\"><img bin-image=\"carousels{{::catalogCtrl.item.id}}/0.img\"></div></div><div class=\"col-xs-12 col-sm-8\"><div class=\"item-price\" ng-class=\"{\'text-muted\':!item.price || item.price == 0}\" catalog-item-price=\"catalogCtrl.item\"></div><div ng-if=\"::catalogCtrl.head == \'services\'\"><a ng-href=\"#!{{::localePrefix}}/contact?subject=Subscribe for {{itemName}}\" class=\"btn btn-success\" i18n=\"\" code=\"catalog.item.subscribe.button\" read-only=\"\">{{::var}}</a></div><div ng-if=\"::catalogCtrl.head != \'services\'\"><a ng-href=\"#!{{::localePrefix}}/contact?subject=Pre-order for {{itemName}}\" class=\"btn btn-success\" i18n=\"\" code=\"catalog.item.preorder.button\" read-only=\"\">{{::var}}</a></div><p class=\"item-body\" i18n=\"\" code=\"{{::catalogCtrl.path}}.body\" editor=\"full\" ng-bind-html=\"var|trust\"></p></div></div></div></div></div></div>");}]);