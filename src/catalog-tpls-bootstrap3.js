angular.module("catalog.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("bin-catalog-breadcrumb-back-link.html","<a bin-href=\"{{$ctrl.back.path}}\"><span><i class=\"fa fa-angle-left fa-fw\"></i></span> <span i18n=\"\" code=\"{{$ctrl.back.id}}\" read-only=\"\" ng-bind=\"var\"></span></a>");
$templateCache.put("bin-catalog-breadcrumb.html","<section id=\"breadcrumb\"><div class=\"container\"><div class=\"row\"><ol class=\"breadcrumb visible-xs\" ng-if=\"$ctrl.back\"><li ng-include=\"\'bin-catalog-breadcrumb-back-link.html\'\"></li></ol><ol class=\"breadcrumb hidden-xs\"><li ng-class=\"::{active: !it.path}\" ng-repeat=\"it in $ctrl.breadcrumb track by it.id\"><a ng-if=\"::it.path\" bin-href=\"{{::it.path}}\" i18n=\"\" code=\"{{::it.id}}\" read-only=\"\" ng-bind=\"var\"></a> <span ng-if=\"::!it.path\" i18n=\"\" code=\"{{::it.id}}\" read-only=\"\" ng-bind=\"var\"></span></li></ol></div></div></section>");
$templateCache.put("bin-catalog-edit-name.html","<form ng-submit=\"submit()\"><div class=\"bin-menu-edit-body\"><div class=\"form-group\"><label for=\"catalogNameInput\" i18n=\"\" code=\"{{::i18nPrefix}}.label\" read-only=\"\" ng-bind=\"::var\"></label> <input type=\"text\" id=\"catalogNameInput\" ng-model=\"name\" ng-disabled=\"working\" required=\"\" autofocus=\"\"></div><bin-violations src=\"violations[\'name\']\" fade-after=\"7000\" code-prefix=\"{{::i18nPrefix}}\"></bin-violations></div><div class=\"bin-menu-edit-actions\"><button type=\"submit\" class=\"btn btn-primary\" ng-disabled=\"working\" i18n=\"\" code=\"clerk.menu.save.button\" read-only=\"\"><span ng-show=\"working\"><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> <span ng-bind=\"::var\"></span></button> <button type=\"reset\" class=\"btn btn-default\" ng-click=\"cancel()\" ng-disabled=\"working\" i18n=\"\" code=\"clerk.menu.cancel.button\" read-only=\"\" ng-bind=\"::var\"></button></div></form>");
$templateCache.put("bin-catalog-empty.html","<div class=\"bin-state-empty\" ng-if=\"$ctrl.isEmpty()\"><div class=\"bin-status-visual\"><i class=\"fa fa-search\"></i></div><h3 class=\"bin-status-visual-title\" i18n=\"\" code=\"search.no.items.found.message\" read-only=\"\" ng-bind=\"::var\"></h3></div>");
$templateCache.put("bin-catalog-item-add.html","<button type=\"button\" class=\"bin-btn bin-btn-default\" ng-click=\"$ctrl.submit()\"><i class=\"fa fa-plus fa-fw\"></i> <span i18n=\"\" code=\"catalog.{{::$ctrl.type}}.add.placeholder\" default=\"add item\" read-only=\"\" ng-bind=\"::var\"></span></button>");
$templateCache.put("bin-catalog-item-details-default.html","<div class=\"bin-catalog\"><div class=\"container\"><div class=\"bin-catalog-item\"><div class=\"row\"><div class=\"col-xs-12 col-sm-4\"><div class=\"item-image\"><div bin-image-carousel=\"$ctrl.item.id\" items=\"$ctrl.item.carousel\"></div></div></div><div class=\"col-xs-12 col-sm-8\"><div class=\"item-body\" i18n=\"\" code=\"{{::$ctrl.item.id}}.body\" editor=\"full\" ng-show=\"var || editing\"><p ng-bind-html=\"var|trust\" seo-description=\"\"></p></div><div class=\"item-price\"><bin-price catalog-item=\"$ctrl.item\" on-config-changed=\"$ctrl.refresh()\"></bin-price></div><div ng-if=\"application.pages.contact.active\"><a bin-dhref=\"/contact?subject=More info about {{::var}}\" class=\"btn btn-success\" i18n=\"\" code=\"{{::$ctrl.item.id}}\" read-only=\"\"><span i18n=\"\" code=\"catalog.item.more.info.button\" read-only=\"\" ng-bind=\"var\"></span></a></div></div></div></div></div></div>");
$templateCache.put("bin-catalog-item-groups.html","<div bin-group-by=\"partition\" on=\"$ctrl.items\"><div ng-repeat=\"group in groups track by group.id\"><div class=\"row\" ng-if=\"::$ctrl.partition !== group.items[0].partition\"><div class=\"col-xs-12\"><h2 class=\"partition-title\" i18n=\"\" code=\"{{::group.items[0].partition}}\" read-only=\"\" ng-bind=\"::var\"></h2></div></div><bin-catalog-items items=\"group.items\"></bin-catalog-items></div></div>");
$templateCache.put("bin-catalog-item-list-default.html","<div class=\"bin-catalog-item thumbnail clearfix\" ng-controller=\"binImageCarouselHeroController as hero\" ng-init=\"hero.init({id: $ctrl.item.id, items: $ctrl.item.carousel})\"><a bin-href=\"/view{{::$ctrl.item.localizedId || $ctrl.item.id}}\"><div class=\"item-image\" ng-class=\"{\'item-image-not-found\': !hero.image}\"><div class=\"item-image\" bin-background-image=\"{{::hero.image.path}}\" read-only=\"\" ng-if=\"hero.image\"></div></div></a><div class=\"caption\"><a bin-href=\"/view{{::$ctrl.item.localizedId || $ctrl.item.id}}\"><h3 class=\"item-title\" i18n=\"\" code=\"{{::$ctrl.item.id}}\" read-only=\"\" ng-bind=\"::var\"></h3></a><div class=\"item-price\"><bin-price catalog-item=\"$ctrl.item\" read-only=\"\"></bin-price></div></div></div>");
$templateCache.put("bin-catalog-item.html","<div ng-class=\"$ctrl.item.uiStatus\"><bin-edit><bin-edit-actions><bin-edit-actions-selector for=\"move\" icon-class=\"fa-arrows\" i18n-code=\"catalog.item.move\" ng-show=\"$ctrl.isMoveAllowed()\"></bin-edit-actions-selector><bin-edit-action action=\"$ctrl.pin()\" icon-class=\"fa-thumb-tack\" i18n-code=\"catalog.item.pin.button\" ng-show=\"$ctrl.isPinAllowed()\"></bin-edit-action><bin-edit-action action=\"$ctrl.unpin()\" icon-class=\"fa-thumb-tack fa-rotate-90\" i18n-code=\"catalog.item.unpin.button\" ng-show=\"$ctrl.isUnpinAllowed()\"></bin-edit-action><bin-edit-actions-selector for=\"delete\" danger=\"\" icon-class=\"fa-trash\" i18n-code=\"catalog.item.remove\" ng-if=\"$ctrl.isRemoveAllowed()\"></bin-edit-actions-selector></bin-edit-actions><bin-edit-actions for=\"move\" button-i18n-code=\"catalog.item.move\"><bin-edit-action action=\"$ctrl.moveUp()\" icon-class=\"fa-angle-up\" i18n-code=\"catalog.item.move.up\" disabled=\"$ctrl.isFirst()\"></bin-edit-action><bin-edit-action action=\"$ctrl.moveDown()\" icon-class=\"fa-angle-down\" i18n-code=\"catalog.item.move.down\" disabled=\"$ctrl.isLast()\"></bin-edit-action><bin-edit-action action=\"$ctrl.moveTop()\" icon-class=\"fa-angle-double-up\" i18n-code=\"catalog.item.move.top\" disabled=\"$ctrl.isFirst()\"></bin-edit-action><bin-edit-action action=\"$ctrl.moveBottom()\" icon-class=\"fa-angle-double-down\" i18n-code=\"catalog.item.move.bottom\" disabled=\"$ctrl.isLast()\"></bin-edit-action></bin-edit-actions><bin-edit-actions for=\"delete\"><bin-edit-action action=\"$ctrl.remove()\" danger=\"\" icon-class=\"fa-trash\" i18n-code=\"catalog.item.remove.confirm\"></bin-edit-action></bin-edit-actions><bin-edit-body><ng-include src=\"$ctrl.templateUrl\"></ng-include></bin-edit-body></bin-edit></div>");
$templateCache.put("bin-catalog-items.html","<div class=\"row\"><div ng-if=\"$ctrl.isAddAllowed()\"><bin-cols index=\"0\" cols=\"{{::$ctrl.cols || \'sm-4 md-3\'}}\" length=\"$ctrl.items.length + 1\" center=\"{{::$ctrl.center}}\"><bin-catalog-item-add></bin-catalog-item-add></bin-cols></div><bin-cols index=\"$index + ($ctrl.isAddAllowed() ? 1 : 0)\" cols=\"{{::$ctrl.cols || \'sm-4 md-3\'}}\" length=\"$ctrl.items.length + ($ctrl.isAddAllowed() ? 1 : 0)\" center=\"{{::$ctrl.center}}\" ng-repeat=\"item in $ctrl.items track by item.id\"><bin-catalog-item item=\"item\"></bin-catalog-item></bin-cols></div>");
$templateCache.put("bin-catalog-partition-add.html","<button type=\"button\" class=\"bin-btn bin-btn-default\" ng-click=\"$ctrl.submit()\"><i class=\"fa fa-plus fa-fw\"></i> <span i18n=\"\" code=\"catalog.partition.add.placeholder\" read-only=\"\" ng-bind=\"::var\"></span></button>");
$templateCache.put("bin-catalog-partition-description.html","<div i18n=\"\" code=\"{{::$ctrl.partition}}.body\" editor=\"full-media\"><div ng-bind-html=\"var|trust\"></div><hr ng-if=\"var\"></div>");
$templateCache.put("bin-catalog-partition-list-default.html","<a bin-href=\"/browse{{::$ctrl.partition.id}}\"><span i18n=\"\" code=\"{{::$ctrl.partition.id}}\" default=\"{{::$ctrl.partition.name}}\" ng-bind=\"var\"></span></a>");
$templateCache.put("bin-catalog-partition-title.html","<div class=\"page-header-wrapper\"><div class=\"page-header\"><h1 i18n=\"\" code=\"{{::$ctrl.titleCode}}\" default=\"{{::$ctrl.defaultTitle}}\" seo-title=\"\" ng-bind=\"var\"></h1></div></div>");
$templateCache.put("bin-catalog-partition.html","<div ng-class=\"$ctrl.partition.uiStatus\"><bin-edit><bin-edit-actions><bin-edit-actions-selector for=\"delete\" danger=\"\" icon-class=\"fa-trash\" i18n-code=\"catalog.partition.remove\" ng-if=\"$ctrl.isRemoveAllowed()\"></bin-edit-actions-selector></bin-edit-actions><bin-edit-actions for=\"delete\"><bin-edit-action action=\"$ctrl.remove()\" danger=\"\" icon-class=\"fa-trash\" i18n-code=\"catalog.partition.remove.confirm\"></bin-edit-action></bin-edit-actions><bin-edit-body><ng-include src=\"$ctrl.templateUrl\"></ng-include></bin-edit-body></bin-edit></div>");
$templateCache.put("bin-catalog-partitions.html","<div class=\"row\"><div class=\"col-xs-12 col-sm-4 col-md-3\" ng-if=\"$ctrl.isPartitionListVisible()\"><div class=\"list-group\"><div class=\"list-group-item list-group-item-back\" ng-if=\"::!$ctrl.isOnRoot()\"><bin-catalog-breadcrumb template-url=\"bin-catalog-breadcrumb-back-link.html\"></bin-catalog-breadcrumb></div><div class=\"list-group-item\" ng-repeat=\"partition in $ctrl.partitions track by partition.id\"><bin-catalog-partition partition=\"partition\"></bin-catalog-partition></div><div class=\"list-group-item list-group-item-add\" ng-if=\"$ctrl.isAddAllowed()\"><bin-catalog-partition-add></bin-catalog-partition-add></div></div></div><div class=\"col-xs-12\" ng-class=\"{\'col-sm-8 col-md-9\': $ctrl.isPartitionListVisible()}\" ng-transclude=\"\"></div></div>");
$templateCache.put("bin-catalog-search-more.html","<div ng-show=\"$ctrl.hasMore()\"><div class=\"row\"><div class=\"col-xs-12\"><button type=\"button\" class=\"btn btn-primary btn-search-more\" ng-click=\"$ctrl.searchMore()\" ng-disabled=\"$ctrl.isWorking()\" i18n=\"\" code=\"search.for.more.button\" read-only=\"\"><span ng-if=\"$ctrl.isWorking()\"><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> <span ng-if=\"!$ctrl.isWorking()\"><i class=\"fa fa-angle-down fa-fw\"></i></span> <span ng-bind=\"::var\"></span></button></div></div></div>");
$templateCache.put("bin-catalog-search.html","<section id=\"search\"><div class=\"container\"><div class=\"row\"><div class=\"col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3\"><i18n code=\"catalog.search.all.prefix\" read-only=\"\" var=\"searchAll\"></i18n><form ng-submit=\"$ctrl.submit()\"><div class=\"input-group input-group-lg\"><input type=\"text\" class=\"form-control\" ng-model=\"$ctrl.q\" i18n=\"\" code=\"navigation.label.{{::$ctrl.type}}\" read-only=\"\" placeholder=\"{{::searchAll}} {{var|lowercase}}\"><div class=\"input-group-btn\"><button class=\"btn btn-primary\" type=\"submit\"><i class=\"fa fa-search\"></i></button></div></div></form></div></div></div></section>");
$templateCache.put("bin-catalog-working.html","<div class=\"dots\" ng-if=\"$ctrl.isWorking()\"><div class=\"dot\"></div><div class=\"dot\"></div><div class=\"dot\"></div></div>");
$templateCache.put("bin-pinned-items-toggle.html","<div class=\"row text-center\" ng-if=\"$root.editing\"><div class=\"col-xs-1 col-centered\"><span>Recent Items</span></div><div class=\"col-xs-1 col-centered\" ng-controller=\"binConfigController as configCtrl\" ng-init=\"configCtrl.init({key:\'application.page.home.section.\' + $ctrl.section + \'.pinned.items\', scope:\'public\'})\"><bin-toggle value=\"config.value\" on-change=\"configCtrl.submit(value)\"></bin-toggle></div><div class=\"col-xs-1 col-centered\"><span>Pinned Items</span></div></div>");
$templateCache.put("bin-spotlight-items.html","<bin-catalog-item-list items=\"$ctrl.results\" movable=\"false\" cols=\"{{::$ctrl.cols}}\" center=\"{{::$ctrl.center}}\" item-template-url=\"$ctrl.templateUrl\"></bin-catalog-item-list><div ng-if=\"$ctrl.searchForMore || $ctrl.editing\" ng-transclude=\"footer\"></div>");
$templateCache.put("bin-spotlight.html","<div ng-show=\"$ctrl.editing || $ctrl.totalItemCount > 0\"><div class=\"bin-spotlight\"><div class=\"container\"><bin-edit><bin-edit-actions><div class=\"bin-dropdown-menu-item\"><a class=\"bin-link\" bin-href=\"/browse/{{::$ctrl.type}}/\"><span><i class=\"fa fa-plus\"></i></span> <span i18n=\"\" code=\"catalog.{{::$ctrl.type}}.add.more.button\" read-only=\"\" ng-bind=\"::var\"></span></a></div><bin-edit-action action=\"$ctrl.toggleRecentItems()\"><span ng-if=\"!$ctrl.recentItems\"><span><i class=\"fa fa-eye\"></i></span> <span i18n=\"\" code=\"catalog.show.recent\" read-only=\"\" ng-bind=\"::var\"></span></span> <span ng-if=\"$ctrl.recentItems\"><span><i class=\"fa fa-eye-slash\"></i></span> <span i18n=\"\" code=\"catalog.hide.recent\" read-only=\"\" ng-bind=\"::var\"></span></span></bin-edit-action></bin-edit-actions><bin-edit-body><div ng-transclude=\"header\"></div><div class=\"alert alert-info\" ng-if=\"$ctrl.totalItemCount == 0\"><span><i class=\"fa fa-info-circle fa-fw\"></i></span> <span i18n=\"\" code=\"catalog.item.pin.spotlight.info\" read-only=\"\" ng-bind=\"::var\"></span></div><bin-spotlight-items pinned=\"true\"><bin-spotlight-footer ng-transclude=\"footer\" ng-if=\"!$ctrl.recentItems\"></bin-spotlight-footer></bin-spotlight-items><div ng-if=\"$ctrl.recentItems\"><h4 ng-if=\"$ctrl.pinnedItemCount > 0\"><span i18n=\"\" code=\"catalog.spotlight.most.recent.title\" ng-bind=\"var\"></span></h4><bin-spotlight-items><bin-spotlight-footer ng-transclude=\"footer\"></bin-spotlight-footer></bin-spotlight-items></div></bin-edit-body></bin-edit></div></div></div>");
$templateCache.put("catalog-add-partition-form.html","<div checkpoint-permission-for=\"catalog.partition.add\"><div class=\"list-group-item\" ng-if=\"permitted && editing\"><form ng-controller=\"AddPartitionToCatalogController\" ng-init=\"init(catalogCtrl.path)\" ng-submit=\"submit()\"><div class=\"input-group\" ng-class=\"{\'has-error\': violations[\'name\']}\"><input type=\"text\" class=\"form-control\" ng-model=\"$parent.name\" i18n=\"\" code=\"{{\'catalog.\' + (catalogCtrl.parent == \'/\' ? \'partition\' : \'subpartition\') + \'.add.placeholder\'}}\" read-only=\"\" placeholder=\"{{::var}}\" required=\"\" ng-disabled=\"working\"><div class=\"input-group-btn\"><button class=\"btn btn-primary\" type=\"submit\" ng-disabled=\"working\"><i class=\"fa fa-plus\"></i></button></div></div><div class=\"help-block text-danger\" ng-repeat=\"v in violations[\'name\']\" i18n=\"\" code=\"catalog.partition.name.{{::v}}\" default=\"{{::v}}\" read-only=\"\" ng-bind=\"::var\"></div></form></div></div>");
$templateCache.put("catalog-add-product-form.html","<div checkpoint-permission-for=\"catalog.item.add\"><div class=\"list-group\" ng-if=\"permitted && editing\"><div class=\"list-group-item\"><form ng-controller=\"AddToCatalogController\" ng-init=\"init({ partition: catalogCtrl.path, type: catalogCtrl.head, redirectToView: true, editMode: true })\" ng-submit=\"submit()\" name=\"catalogItemAddForm\"><div class=\"input-group\" ng-class=\"{\'has-error\': violations[\'defaultName\']}\"><input type=\"text\" class=\"form-control\" name=\"defaultName\" ng-model=\"$parent.item.defaultName\" i18n=\"\" code=\"catalog.{{::catalogCtrl.head}}.add.placeholder\" default=\"Add item\" read-only=\"\" placeholder=\"{{::var}}\" required=\"\" ng-disabled=\"working\"><div class=\"input-group-btn\"><button class=\"btn btn-primary\" type=\"submit\" ng-disabled=\"working\"><i class=\"fa fa-plus\"></i></button></div></div><div class=\"help-block text-danger\" ng-repeat=\"v in violations[\'defaultName\']\" i18n=\"\" code=\"catalog.item.defaultName.{{::v}}\" default=\"{{::v}}\" read-only=\"\" ng-bind=\"::var\"></div></form></div></div></div>");
$templateCache.put("catalog-breadcrumb.html","<bin-catalog-breadcrumb partition=\"catalogCtrl.parent\" item=\"catalogCtrl.path\" ng-if=\"::catalogCtrl && !catalogCtrl.item\"></bin-catalog-breadcrumb><bin-catalog-breadcrumb partition=\"catalogCtrl.item.partition\" item=\"catalogCtrl.item.id\" ng-if=\"::catalogCtrl && catalogCtrl.item\"></bin-catalog-breadcrumb><bin-catalog-breadcrumb item=\"searchCtrl.filters.type\" ng-if=\"::searchCtrl\"></bin-catalog-breadcrumb>");
$templateCache.put("catalog-browse-header.html","<div class=\"page-header-wrapper\"><div class=\"container\"><div class=\"row\"><div class=\"col-xs-12\"><div class=\"page-header\"><h1 ng-if=\"::catalogCtrl.parent != \'/\'\"><span class=\"inline\" i18n=\"\" code=\"{{::catalogCtrl.path}}\" default=\"{{::catalogCtrl.name}}\" seo-title=\"\">{{var}}</span> <span checkpoint-permission-for=\"catalog.partition.remove\"><span ng-controller=\"RemoveCatalogPartitionController\" ng-init=\"init(catalogCtrl.path)\" ng-if=\"permitted && editing\" i18n=\"\" code=\"catalog.remove.partition.confirm\" read-only=\"\"><button type=\"button\" class=\"bin-btn bin-btn-danger\" ng-click-confirm=\"submit(\'/browse\'+parent)\" confirm-message=\"{{::var}}\" ng-disabled=\"working\" ng-if=\"::var\"><span ng-hide=\"working\"><i class=\"fa fa-times fa-fw\"></i></span> <span ng-show=\"working\"><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> <span i18n=\"\" code=\"catalog.remove.partition.button\" read-only=\"\">{{::var}}</span></button></span></span></h1><h1 i18n=\"\" code=\"navigation.label.{{::catalogCtrl.name}}\" ng-bind=\"var\" seo-title=\"\" ng-if=\"::catalogCtrl.parent == \'/\'\"></h1></div></div></div></div></div>");
$templateCache.put("catalog-browse.html","<div class=\"bin-catalog\" ng-controller=\"ListCatalogPartitionsController as listCtrl\" ng-init=\"listCtrl.init(\'ownedBy\', catalogCtrl.path)\"><div class=\"container\"><div class=\"row\"><div class=\"col-xs-12 col-sm-4 col-md-3\" ng-if=\"listCtrl.partitions.length > 1 || catalogCtrl.parent != \'/\' || editing\"><div class=\"list-group\"><a class=\"list-group-item\" ng-if=\"::catalogCtrl.parent != \'/\'\" bin-href=\"/browse{{::catalogCtrl.parent}}\"><i class=\"fa fa-folder-o fa-fw\"></i> ..</a> <a class=\"list-group-item\" ng-repeat=\"partition in listCtrl.partitions track by partition.id\" bin-href=\"/browse{{::partition.id}}\" i18n=\"\" code=\"{{::partition.id}}\" default=\"{{::partition.name}}\" read-only=\"\">{{::var}} <span class=\"pull-right\"><i class=\"fa fa-angle-right fa-fw\"></i></span></a><ng-include src=\"\'catalog-add-partition-form.html\'\"></ng-include></div></div><div class=\"col-xs-12\" ng-class=\"{\'col-sm-8 col-md-9\': listCtrl.partitions.length > 1 || catalogCtrl.parent != \'/\'|| editing}\"><div i18n=\"\" code=\"{{::catalogCtrl.path}}.body\" var=\"partitionBody\" editor=\"full-media\" ng-show=\"var || editing\"><p ng-bind-html=\"var|trust\"></p><hr></div><div ng-controller=\"BinartaSearchController as searchCtrl\" ng-init=\"searchCtrl.init({ entity:\'catalog-item\', context:\'search\', filters:{ type: catalogCtrl.head, recursivelyByPartition: listCtrl.partition, sortings: [ {on:\'partition\', orientation:\'asc\'}, {on:\'priority\', orientation:\'desc\'} ] }, includeCarouselItems: true, autosearch:true, noMoreResultsNotification: false, subset:{count: 12} })\"><div class=\"row\"><div class=\"col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3\"><ng-include src=\"\'catalog-add-product-form.html\'\"></ng-include></div></div><bin-catalog-list-rows items=\"searchCtrl.results\" partition=\"catalogCtrl.path\" movable=\"true\"></bin-catalog-list-rows><ng-include src=\"\'search-for-more.html\'\"></ng-include></div></div></div></div></div>");
$templateCache.put("catalog-item-list.html","<div class=\"row bin-catalog-items\"><bin-cols index=\"$index\" cols=\"{{::$ctrl.cols || \'sm-4 md-3\'}}\" length=\"$ctrl.items.length\" center=\"{{::$ctrl.center}}\" ng-repeat=\"item in $ctrl.items track by item.id\"><bin-catalog-list-item item=\"item\" is-first=\"$first\" is-last=\"$last\"></bin-catalog-list-item></bin-cols></div>");
$templateCache.put("catalog-item-price-edit.html","<form name=\"catalogItemPriceForm\" ng-submit=\"update()\"><div class=\"bin-menu-edit-body\"><div class=\"form-group\"><label for=\"catalogItemPrice\" i18n=\"\" code=\"catalog.item.price.label\" read-only=\"\" ng-bind=\"::var\"></label> <small ng-if=\"vatOnPrice == 1\" i18n=\"\" code=\"catalog.item.price.vat.incl\" read-only=\"\" ng-bind=\"::var\"></small> <small ng-if=\"vatOnPrice == 0\" i18n=\"\" code=\"catalog.item.price.vat.excl\" read-only=\"\" ng-bind=\"::var\"></small><div class=\"input-group\"><div class=\"input-group-addon\" ng-bind=\"::currencySymbol\"></div><input type=\"number\" min=\"0\" step=\"any\" name=\"catalogItemPrice\" id=\"catalogItemPrice\" ng-model=\"price\" autofocus=\"\"></div><div class=\"help-block text-danger\" ng-repeat=\"v in violations[\'price\']\" i18n=\"\" code=\"catalog.item.price.{{v}}\" default=\"{{v}}\" read-only=\"\" ng-bind=\"var\"></div></div><div class=\"form-group\"><div class=\"row\"><div class=\"col-xs-12 col-sm-6\"><table class=\"table\"><tr><th i18n=\"\" code=\"catalog.item.price.input.vat.included\" read-only=\"\" ng-bind=\"::var\"></th><td><div class=\"checkbox-switch\" ng-show=\"vatOnPrice != undefined\"><input type=\"checkbox\" id=\"vat-on-price-switch\" ng-model=\"vatOnPrice\" ng-change=\"toggleVatOnPrice()\"> <label for=\"vat-on-price-switch\"></label></div></td></tr></table></div></div></div></div><div class=\"bin-menu-edit-actions\"><button type=\"submit\" class=\"btn btn-primary\" i18n=\"\" code=\"clerk.menu.save.button\" read-only=\"\" ng-bind=\"::var\"></button> <button type=\"reset\" class=\"btn btn-default\" ng-click=\"close()\" i18n=\"\" code=\"clerk.menu.cancel.button\" read-only=\"\" ng-bind=\"::var\"></button></div></form>");
$templateCache.put("catalog-list-item-default.html","<div class=\"bin-catalog-item thumbnail clearfix\" ng-controller=\"binImageCarouselHeroController as hero\" ng-init=\"hero.init({id: $ctrl.item.id, items: $ctrl.item.carousel})\"><a bin-href=\"/view{{::$ctrl.item.localizedId || $ctrl.item.id}}\"><div class=\"item-image\" ng-class=\"{\'item-image-not-found\': !hero.image}\"><div class=\"item-image\" bin-background-image=\"{{::hero.image.path}}\" read-only=\"\" ng-if=\"hero.image\"></div></div></a><div class=\"caption\"><a bin-href=\"/view{{::$ctrl.item.localizedId || $ctrl.item.id}}\"><h3 class=\"item-title\" i18n=\"\" code=\"{{::$ctrl.item.id}}\" read-only=\"\">{{::var}}</h3></a><div class=\"item-price\"><bin-price catalog-item=\"$ctrl.item\" read-only=\"\"></bin-price></div></div></div>");
$templateCache.put("catalog-list-item.html","<bin-edit><bin-edit-actions><div checkpoint-permission-for=\"catalog.item.update\" ng-show=\"permitted && $ctrl.movable == \'true\'\"><bin-edit-actions-selector for=\"move\"><span><i class=\"fa fa-arrows fa-fw\"></i></span> <span i18n=\"\" code=\"catalog.item.move\" read-only=\"\" ng-bind=\"::var\"></span></bin-edit-actions-selector></div><div ng-controller=\"PinItemController as pinner\" ng-init=\"pinner.init($ctrl.item)\"><div ng-hide=\"$ctrl.item.pinned\" checkpoint-permission-for=\"catalog.item.pin\"><bin-edit-action action=\"pinner.pin()\"><span><i class=\"fa fa-thumb-tack fa-fw\"></i></span> <span i18n=\"\" code=\"catalog.item.pin.button\" read-only=\"\">{{::var}}</span></bin-edit-action></div><div ng-show=\"$ctrl.item.pinned\" checkpoint-permission-for=\"catalog.item.unpin\"><bin-edit-action action=\"pinner.unpin()\"><span><i class=\"fa fa-thumb-tack fa-rotate-90 fa-fw\"></i></span> <span i18n=\"\" code=\"catalog.item.unpin.button\" read-only=\"\">{{::var}}</span></bin-edit-action></div></div></bin-edit-actions><bin-edit-actions for=\"move\" button-i18n-code=\"catalog.item.move\"><bin-edit-action action=\"$ctrl.moveUp()\" disabled=\"$ctrl.isFirst\"><span><i class=\"fa fa-angle-up fa-fw\"></i></span> <span i18n=\"\" code=\"catalog.item.move.up\" read-only=\"\" ng-bind=\"::var\"></span></bin-edit-action><bin-edit-action action=\"$ctrl.moveDown()\" disabled=\"$ctrl.isLast\"><span><i class=\"fa fa-angle-down fa-fw\"></i></span> <span i18n=\"\" code=\"catalog.item.move.down\" read-only=\"\" ng-bind=\"::var\"></span></bin-edit-action><bin-edit-action action=\"$ctrl.moveTop()\" disabled=\"$ctrl.isFirst\"><span><i class=\"fa fa-angle-double-up fa-fw\"></i></span> <span i18n=\"\" code=\"catalog.item.move.top\" read-only=\"\" ng-bind=\"::var\"></span></bin-edit-action><bin-edit-action action=\"$ctrl.moveBottom()\" disabled=\"$ctrl.isLast\"><span><i class=\"fa fa-angle-double-down fa-fw\"></i></span> <span i18n=\"\" code=\"catalog.item.move.bottom\" read-only=\"\" ng-bind=\"::var\"></span></bin-edit-action></bin-edit-actions><bin-edit-body><ng-include src=\"$ctrl.templateUrl\"></ng-include></bin-edit-body></bin-edit>");
$templateCache.put("catalog-list-rows.html","<div bin-group-by=\"partition\" on=\"$ctrl.items\"><div ng-repeat=\"group in groups\"><div class=\"row\" ng-if=\"::$ctrl.partition != group.items[0].partition\"><div class=\"col-xs-12\"><h2 class=\"partition-title\" i18n=\"\" code=\"{{::group.items[0].partition}}\" read-only=\"\" ng-bind=\"::var\"></h2></div></div><bin-catalog-item-list items=\"group.items\" movable=\"{{::$ctrl.movable}}\"></bin-catalog-item-list></div></div>");
$templateCache.put("catalog-search-form.html","<section id=\"search\"><div class=\"container\"><div class=\"row\"><div class=\"col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3\"><i18n code=\"catalog.search.all.prefix\" read-only=\"\" var=\"searchAll\"></i18n><form ng-submit=\"submit()\" ng-controller=\"RedirectToSearchController\" ng-init=\"init({page:\'/search/\' + catalogCtrl.head})\" ng-if=\"::catalogCtrl\"><div class=\"input-group input-group-lg\"><input type=\"text\" class=\"form-control\" ng-model=\"$parent.q\" i18n=\"\" code=\"navigation.label.{{::catalogCtrl.head}}\" read-only=\"\" placeholder=\"{{::searchAll}} {{var | lowercase}}\"><div class=\"input-group-btn\"><button class=\"btn btn-primary\" type=\"submit\"><i class=\"fa fa-search\"></i></button></div></div></form><form ng-submit=\"searchCtrl.search()\" ng-if=\"::searchCtrl\"><div class=\"input-group input-group-lg\"><input type=\"text\" class=\"form-control\" ng-model=\"searchCtrl.q\" i18n=\"\" code=\"navigation.label.{{::searchCtrl.filters.type}}\" read-only=\"\" placeholder=\"{{::searchAll}} {{var | lowercase}}\"><div class=\"input-group-btn\"><button class=\"btn btn-primary\" type=\"submit\" ng-disabled=\"searchCtrl.working\"><i class=\"fa fa-search\"></i></button></div></div></form></div></div></div></section>");
$templateCache.put("catalog-search.html","<div class=\"bin-catalog\" ng-init=\"searchCtrl.init({ entity:\'catalog-item\', context:\'search\', filters:{ locale: \'default\', sortings: [ {on:\'partition\', orientation:\'asc\'}, {on:\'name\', orientation:\'asc\'} ] }, includeCarouselItems: true, autosearch:true, noMoreResultsNotification: false, subset:{count:12}})\"><div class=\"container\"><div class=\"row\"><div class=\"col-xs-12 col-sm-10 col-sm-offset-1 col-lg-8 col-lg-offset-2\"><bin-catalog-list-rows items=\"searchCtrl.results\" partition=\"catalogCtrl.path\"></bin-catalog-list-rows><ng-include src=\"\'search-for-more.html\'\"></ng-include></div></div></div></div>");
$templateCache.put("catalog-vat-rate-form.html","<form name=\"form\" ng-submit=\"vat.submit()\"><div class=\"form-group\" ng-class=\"{\'has-error\': form[\'config-vat-rate-country-code\'].$invalid}\"><label i18n=\"\" code=\"catalog.config.vat.country.code.label\" read-only=\"\" for=\"config-vat-rate-country-code\">{{::var}}</label><select class=\"form-control\" id=\"config-vat-rate-country-code\" name=\"config-vat-rate-country-code\" ng-model=\"vat.countryCode\" ng-change=\"vat.getStandardVatRate()\" ng-options=\"c.code as c.country for c in vat.countries\" required=\"\"></select></div><div class=\"form-group\" ng-class=\"{\'has-error\': form[\'config-vat-rate\'].$invalid}\" ng-if=\"vat.countryCode\"><label i18n=\"\" code=\"catalog.config.vat.rate.label\" read-only=\"\" for=\"config-vat-rate\">{{::var}}</label><div class=\"row\"><div class=\"col-xs-12 col-sm-6\"><div class=\"input-group\"><input type=\"number\" min=\"0\" max=\"100\" class=\"form-control\" id=\"config-vat-rate\" name=\"config-vat-rate\" ng-model=\"vat.vatRate\"><div class=\"input-group-addon\">%</div></div></div></div></div><div class=\"form-group\" ng-class=\"{\'has-error\': form[\'config-currency\'].$invalid}\" ng-if=\"vat.currencies && vat.activeCurrency\"><label i18n=\"\" code=\"catalog.config.currency.label\" read-only=\"\" for=\"config-currency\" ng-bind=\"::var\"></label><div class=\"row\"><div class=\"col-xs-12 col-sm-6\"><div class=\"input-group\"><select class=\"form-control\" id=\"config-currency\" name=\"config-currency\" ng-model=\"vat.activeCurrency\" ng-options=\"c.code for c in vat.currencies track by c.code\" required=\"\"></select></div></div></div></div><div class=\"form-group\"><button type=\"submit\" class=\"btn btn-success\" ng-disabled=\"working || !vat.isValid()\" i18n=\"\" code=\"catalog.config.save.button\" read-only=\"\"><span ng-show=\"!working\"><i class=\"fa fa-check-circle fa-fw\"></i></span> <span ng-show=\"working\"><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> {{::var}}</button></div></form>");
$templateCache.put("catalog-view-item-header.html","<div class=\"page-header-wrapper\"><div class=\"container\"><div class=\"row\"><div class=\"col-xs-12\"><div class=\"page-header\"><h1 class=\"bin-catalog-title\"><span class=\"inline\" i18n=\"\" code=\"{{::catalogCtrl.item.id}}\" ng-bind=\"var\" seo-title=\"\"></span> <span checkpoint-permission-for=\"catalog.item.remove\"><span ng-controller=\"RemoveItemFromCatalogController\" ng-if=\"permitted && editing\" i18n=\"\" code=\"catalog.remove.item.confirm\" read-only=\"\"><button type=\"button\" class=\"bin-btn bin-btn-danger\" ng-click-confirm=\"submit(item.id)\" confirm-message=\"{{::var}}\" ng-disabled=\"working\" ng-if=\"::var\"><span ng-hide=\"working\"><i class=\"fa fa-times fa-fw\"></i></span> <span ng-show=\"working\"><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> <span i18n=\"\" code=\"catalog.remove.item.button\" read-only=\"\" ng-bind=\"::var\"></span></button></span></span></h1></div></div></div></div></div>");
$templateCache.put("catalog-view-item.html","<div class=\"bin-catalog\"><div class=\"container\"><div class=\"bin-catalog-item\"><div class=\"row\"><div class=\"col-xs-12 col-sm-4\"><div class=\"item-image\"><div bin-image-carousel=\"catalogCtrl.item.id\" items=\"catalogCtrl.item.carousel\"></div></div></div><div class=\"col-xs-12 col-sm-8\"><div class=\"item-body\" i18n=\"\" code=\"{{::catalogCtrl.item.id}}.body\" editor=\"full\" ng-show=\"var || editing\"><p ng-bind-html=\"var|trust\" seo-description=\"\"></p></div><div class=\"item-price\"><bin-price catalog-item=\"catalogCtrl.item\" on-config-changed=\"catalogCtrl.refresh()\"></bin-price></div><div ng-if=\"application.pages.contact.active\"><a bin-dhref=\"/contact?subject=More info about {{::var}}\" class=\"btn btn-success\" i18n=\"\" code=\"{{::catalogCtrl.item.id}}\" read-only=\"\"><span i18n=\"\" code=\"catalog.item.more.info.button\" read-only=\"\" ng-bind=\"var\"></span></a></div></div></div></div></div></div>");}]);