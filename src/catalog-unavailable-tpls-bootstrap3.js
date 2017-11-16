angular.module("catalog.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("bin-catalog-breadcrumb.html","<section id=\"breadcrumb\"><div class=\"container\"><div class=\"row\"><ol class=\"breadcrumb visible-xs\" ng-if=\"$ctrl.back\"><li><a bin-href=\"{{$ctrl.back.path}}\"><span><i class=\"fa fa-angle-left fa-fw\"></i></span> <span i18n=\"\" code=\"{{$ctrl.back.id}}\" read-only=\"\" ng-bind=\"var\"></span></a></li></ol><ol class=\"breadcrumb hidden-xs\"><li ng-class=\"::{active: !it.path}\" ng-repeat=\"it in $ctrl.breadcrumb track by it.id\"><a ng-if=\"::it.path\" bin-href=\"{{::it.path}}\" i18n=\"\" code=\"{{::it.id}}\" read-only=\"\" ng-bind=\"var\"></a> <span ng-if=\"::!it.path\" i18n=\"\" code=\"{{::it.id}}\" read-only=\"\" ng-bind=\"var\"></span></li></ol></div></div></section>");
$templateCache.put("bin-catalog-edit-name.html","<form ng-submit=\"submit()\"><div class=\"bin-menu-edit-body\"><div class=\"form-group\"><label for=\"catalogNameInput\" i18n=\"\" code=\"{{::i18nPrefix}}.label\" read-only=\"\" ng-bind=\"::var\"></label> <input type=\"text\" id=\"catalogNameInput\" ng-model=\"name\" ng-disabled=\"working\" required=\"\" autofocus=\"\"></div><bin-violations src=\"violations[\'name\']\" fade-after=\"7000\" code-prefix=\"{{::i18nPrefix}}\"></bin-violations></div><div class=\"bin-menu-edit-actions\"><button type=\"submit\" class=\"btn btn-primary\" ng-disabled=\"working\" i18n=\"\" code=\"clerk.menu.save.button\" read-only=\"\"><span ng-show=\"working\"><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> <span ng-bind=\"::var\"></span></button> <button type=\"reset\" class=\"btn btn-default\" ng-click=\"cancel()\" ng-disabled=\"working\" i18n=\"\" code=\"clerk.menu.cancel.button\" read-only=\"\" ng-bind=\"::var\"></button></div></form>");
$templateCache.put("bin-catalog-empty.html","<div ng-if=\"$ctrl.isEmpty()\"><div class=\"bin-catalog-empty-icon\"><i class=\"fa fa-search\"></i></div><h3 class=\"bin-catalog-empty-title\" i18n=\"\" code=\"search.no.items.found.message\" read-only=\"\" ng-bind=\"::var\"></h3></div>");
$templateCache.put("bin-catalog-item-add.html","<button type=\"button\" class=\"bin-btn bin-btn-default\" ng-click=\"$ctrl.submit()\"><span ng-hide=\"$ctrl.working\"><i class=\"fa fa-plus\"></i></span> <span ng-show=\"$ctrl.working\"><i class=\"fa fa-spinner fa-spin\"></i></span> <span i18n=\"\" code=\"catalog.{{::$ctrl.type}}.add.placeholder\" default=\"add item\" read-only=\"\" ng-bind=\"::var\"></span></button>");
$templateCache.put("bin-catalog-item-cta.html","<% if(shop)=\"\" {=\"\" %=\"\"><bin-basket mode=\"add-to-basket-button\" item=\"$ctrl.item\" ng-if=\"$ctrl.isPurchasable()\"></bin-basket><bin-catalog-item-request-info-button item=\"$ctrl.item\" ng-if=\"!$ctrl.isPurchasable()\"></bin-catalog-item-request-info-button><% }=\"\" else=\"\" {=\"\" %=\"\"><bin-catalog-item-request-info-button item=\"$ctrl.item\"></bin-catalog-item-request-info-button><% }=\"\" %=\"\"></%></%></%>");
$templateCache.put("bin-catalog-item-details-default.html","<div class=\"row\"><div class=\"col-xs-12 col-sm-4\"><div class=\"item-line item-image\"><div bin-image-carousel=\"$ctrl.item.id\" items=\"$ctrl.item.carousel\"></div></div></div><div class=\"col-xs-12 col-sm-8\"><h1 class=\"item-line item-title\" i18n=\"\" code=\"{{::$ctrl.i18n.title}}\" ng-bind=\"var\"></h1><div class=\"item-line item-price\"><bin-price catalog-item=\"$ctrl.item\" on-update=\"$ctrl.refresh()\"></bin-price></div><div class=\"item-line item-cta\"><bin-catalog-item-cta item=\"$ctrl.item\"></bin-catalog-item-cta></div><div class=\"item-line item-body\" i18n=\"\" code=\"{{::$ctrl.i18n.body}}\" editor=\"full\" ng-bind-html=\"var|trust\" ng-show=\"var || $ctrl.editing\"></div></div></div>");
$templateCache.put("bin-catalog-item-groups.html","<div bin-group-by=\"partition\" on=\"$ctrl.items\"><bin-catalog-items items=\"[]\" ng-if=\"$ctrl.noItemsInMainPartition()\"></bin-catalog-items><div ng-repeat=\"group in groups track by group.id\"><div class=\"row\" ng-if=\"::$ctrl.partition !== group.items[0].partition\"><div class=\"col-xs-12\"><h2 class=\"partition-title\" i18n=\"\" code=\"{{::group.items[0].partition}}\" read-only=\"\" ng-bind=\"::var\"></h2></div></div><bin-catalog-items items=\"group.items\" partition=\"{{::group.items[0].partition}}\"></bin-catalog-items></div></div>");
$templateCache.put("bin-catalog-item-list-default.html","<div class=\"bin-catalog-item thumbnail\"><a bin-href=\"{{::$ctrl.itemPath}}\"><div class=\"item-image\" ng-class=\"::{\'item-image-not-found\': !$ctrl.image.hero}\"><div class=\"item-image\" bin-background-image=\"{{::$ctrl.image.hero}}\" read-only=\"\" ng-if=\"::$ctrl.image.hero\"></div></div></a><div class=\"caption\"><a bin-href=\"{{::$ctrl.itemPath}}\"><h3 class=\"item-title\" i18n=\"\" code=\"{{::$ctrl.i18n.title}}\" read-only=\"\" ng-bind=\"::var\"></h3></a><div class=\"item-price\"><bin-price catalog-item=\"$ctrl.item\" read-only=\"\"></bin-price></div></div></div>");
$templateCache.put("bin-catalog-item-publisher-edit.html","<form ng-submit=\"submit()\"><div class=\"bin-menu-edit-body\"><div class=\"alert alert-danger\" ng-show=\"violation\"><i class=\"fa fa-exclamation-triangle fa-fw\"></i> <span i18n=\"\" code=\"clerk.menu.try.again.message\" read-only=\"\" ng-bind=\"::var\"></span></div><div class=\"form-group bin-moment-picker\"><label for=\"bin-blog-publication-time\" i18n=\"\" code=\"catalog.item.publication.time.label\" read-only=\"\" ng-bind=\"::var\"></label> <input id=\"bin-blog-publication-time\" class=\"form-control\" ng-model=\"publicationTime\" moment-picker=\"publicationTime\" format=\"lll\" required=\"\"></div></div><div class=\"bin-menu-edit-actions\"><button type=\"submit\" class=\"btn btn-primary\" i18n=\"\" code=\"clerk.menu.save.button\" read-only=\"\" ng-disabled=\"working\"><span ng-show=\"working\"><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> <span ng-bind=\"::var\"></span></button> <button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\" i18n=\"\" code=\"clerk.menu.cancel.button\" read-only=\"\" ng-bind=\"::var\" ng-disabled=\"working\"></button></div></form>");
$templateCache.put("bin-catalog-item-request-info-button.html","<div ng-if=\"$ctrl.isContactActive()\"><a bin-dhref=\"{{$ctrl.contactPath}}\" ng-class=\"::$ctrl.buttonClass\" ng-if=\"!$ctrl.isRequestInfoFormRegistered()\"><span i18n=\"\" code=\"catalog.item.more.info.button\" read-only=\"\" ng-bind=\"::var\"></span> <i class=\"fa fa-angle-right fa-fw\"></i></a> <button type=\"button\" ng-click=\"$ctrl.scrollToForm()\" ng-class=\"::$ctrl.buttonClass\" ng-if=\"$ctrl.isRequestInfoFormRegistered()\"><span i18n=\"\" code=\"catalog.item.more.info.button\" read-only=\"\" ng-bind=\"::var\"></span> <i class=\"fa fa-angle-down fa-fw\"></i></button></div>");
$templateCache.put("bin-catalog-item-request-info-form.html","<bin-contact-form><h3 class=\"text-center\" ng-bind=\"$ctrl.subject\"></h3><bin-contact-form-field field-type=\"text\" field-name=\"subject\" value=\"{{$ctrl.subject}}\" class=\"hidden\"></bin-contact-form-field><bin-contact-form-field field-type=\"email\" field-name=\"replyTo\"></bin-contact-form-field><bin-contact-form-field field-type=\"textarea\" field-name=\"message\"></bin-contact-form-field><bin-contact-form-submit></bin-contact-form-submit></bin-contact-form>");
$templateCache.put("bin-catalog-item-title-default.html","<div class=\"page-header-wrapper\"><div class=\"page-header\"><h1 i18n=\"\" code=\"{{::$ctrl.i18n.title}}\" ng-bind=\"var\"></h1></div></div>");
$templateCache.put("bin-catalog-item-title.html","<ng-include src=\"$ctrl.templateUrl\" ng-if=\"::$ctrl.item\"></ng-include>");
$templateCache.put("bin-catalog-item.html","<div ng-class=\"$ctrl.item.uiStatus\" ng-if=\"::$ctrl.item\"><bin-edit><bin-edit-actions><bin-edit-action action=\"$ctrl.link()\" icon-class=\"fa-link\" i18n-code=\"catalog.item.link\" ng-if=\"$ctrl.isLinkAllowed()\"></bin-edit-action><bin-edit-actions-selector for=\"move\" icon-class=\"fa-arrows\" i18n-code=\"catalog.item.move\" ng-if=\"$ctrl.isMoveAllowed()\"></bin-edit-actions-selector><bin-edit-action action=\"$ctrl.pin()\" icon-class=\"fa-thumb-tack\" i18n-code=\"catalog.item.pin.button\" ng-if=\"$ctrl.isPinAllowed()\"></bin-edit-action><bin-edit-action action=\"$ctrl.unpin()\" icon-class=\"fa-thumb-tack fa-rotate-90\" i18n-code=\"catalog.item.unpin.button\" ng-if=\"$ctrl.isUnpinAllowed()\"></bin-edit-action><bin-edit-action action=\"$ctrl.publish()\" icon-class=\"fa-eye\" i18n-code=\"catalog.item.publish\" ng-if=\"$ctrl.isPublishAllowed()\"></bin-edit-action><bin-edit-action action=\"$ctrl.unpublish()\" icon-class=\"fa-eye-slash\" i18n-code=\"catalog.item.unpublish\" ng-if=\"$ctrl.isUnpublishAllowed()\"></bin-edit-action><bin-edit-actions-selector for=\"delete\" danger=\"\" icon-class=\"fa-trash\" i18n-code=\"catalog.item.remove\" ng-if=\"$ctrl.isRemoveAllowed()\"></bin-edit-actions-selector></bin-edit-actions><bin-edit-actions for=\"move\" button-i18n-code=\"catalog.item.move\"><bin-edit-action action=\"$ctrl.moveUp()\" icon-class=\"fa-angle-up\" i18n-code=\"catalog.item.move.up\" disabled=\"$ctrl.isFirst()\"></bin-edit-action><bin-edit-action action=\"$ctrl.moveDown()\" icon-class=\"fa-angle-down\" i18n-code=\"catalog.item.move.down\" disabled=\"$ctrl.isLast()\"></bin-edit-action><bin-edit-action action=\"$ctrl.moveTop()\" icon-class=\"fa-angle-double-up\" i18n-code=\"catalog.item.move.top\" disabled=\"$ctrl.isFirst()\"></bin-edit-action><bin-edit-action action=\"$ctrl.moveBottom()\" icon-class=\"fa-angle-double-down\" i18n-code=\"catalog.item.move.bottom\" disabled=\"$ctrl.isLast()\"></bin-edit-action></bin-edit-actions><bin-edit-actions for=\"delete\"><bin-edit-action action=\"$ctrl.remove()\" danger=\"\" icon-class=\"fa-trash\" i18n-code=\"catalog.item.remove.confirm\"></bin-edit-action></bin-edit-actions><bin-edit-body><div class=\"alert alert-info\" ng-if=\"$ctrl.isPublishAllowed() && $ctrl.item.status === \'draft\'\"><i class=\"fa fa-eye-slash fa-fw\"></i> <span i18n=\"\" code=\"catalog.item.draft\" read-only=\"\" ng-bind=\"::var\"></span></div><ng-include src=\"$ctrl.templateUrl\"></ng-include></bin-edit-body></bin-edit></div>");
$templateCache.put("bin-catalog-items.html","<div class=\"row\"><div ng-if=\"$ctrl.isAddAllowed()\"><bin-cols index=\"0\" cols=\"{{::$ctrl.cols || \'sm-4 md-3\'}}\" length=\"$ctrl.items.length + 1\" center=\"{{::$ctrl.center}}\"><bin-catalog-item-add></bin-catalog-item-add></bin-cols></div><bin-cols index=\"$index + ($ctrl.isAddAllowed() ? 1 : 0)\" cols=\"{{::$ctrl.cols || \'sm-4 md-3\'}}\" length=\"$ctrl.items.length + ($ctrl.isAddAllowed() ? 1 : 0)\" center=\"{{::$ctrl.center}}\" ng-repeat=\"item in $ctrl.items track by item.id\"><bin-catalog-item item=\"item\"></bin-catalog-item></bin-cols></div>");
$templateCache.put("bin-catalog-partition-add.html","<button type=\"button\" class=\"bin-btn bin-btn-default\" ng-click=\"$ctrl.submit()\"><i class=\"fa fa-plus fa-fw\"></i> <span i18n=\"\" code=\"catalog.partition.add.placeholder\" read-only=\"\" ng-bind=\"::var\"></span></button>");
$templateCache.put("bin-catalog-partition-description.html","<div class=\"bin-catalog-partition-description\" i18n=\"\" code=\"{{::$ctrl.partition}}.body\" editor=\"full-media\" ng-bind-html=\"var|trust\" ng-show=\"var || $ctrl.editing\"></div>");
$templateCache.put("bin-catalog-partition-list-default.html","<a bin-href=\"/browse{{::$ctrl.partition.id}}\"><span i18n=\"\" code=\"{{::$ctrl.partition.id}}\" default=\"{{::$ctrl.partition.name}}\" ng-bind=\"var\"></span></a>");
$templateCache.put("bin-catalog-partition-title.html","<div class=\"page-header-wrapper\"><div class=\"page-header\"><h1 i18n=\"\" code=\"{{::$ctrl.i18n.title}}\" default=\"{{::$ctrl.type}}\" ng-bind=\"var\"></h1></div></div>");
$templateCache.put("bin-catalog-partition.html","<div ng-class=\"$ctrl.partition.uiStatus\"><bin-edit><bin-edit-actions><bin-edit-actions-selector for=\"delete\" danger=\"\" icon-class=\"fa-trash\" i18n-code=\"catalog.partition.remove\" ng-if=\"$ctrl.isRemoveAllowed()\"></bin-edit-actions-selector></bin-edit-actions><bin-edit-actions for=\"delete\"><bin-edit-action action=\"$ctrl.remove()\" danger=\"\" icon-class=\"fa-trash\" i18n-code=\"catalog.partition.remove.confirm\"></bin-edit-action></bin-edit-actions><bin-edit-body><ng-include src=\"$ctrl.templateUrl\"></ng-include></bin-edit-body></bin-edit></div>");
$templateCache.put("bin-catalog-partitions.html","<div class=\"row\"><div class=\"col-xs-12 col-sm-4 col-md-3\" ng-if=\"$ctrl.isPartitionListVisible()\"><div class=\"list-group\" ng-if=\"::!$ctrl.isOnRoot()\"><div class=\"list-group-item list-group-item-back\"><a class=\"btn btn-primary\" bin-href=\"{{::\'/browse\' + $ctrl.parent}}\"><i class=\"fa fa-arrow-left fa-fw\"></i> <span i18n=\"\" code=\"catalog.partition.back\" read-only=\"\" ng-bind=\"::var\"></span></a></div></div><div class=\"list-group\"><div class=\"list-group-item list-group-item-partition\" ng-repeat=\"partition in $ctrl.partitions track by partition.id\"><bin-catalog-partition partition=\"partition\"></bin-catalog-partition></div><div class=\"list-group-item list-group-item-add\" ng-if=\"$ctrl.isAddAllowed()\"><bin-catalog-partition-add></bin-catalog-partition-add></div></div></div><div class=\"col-xs-12\" ng-class=\"{\'col-sm-8 col-md-9\': $ctrl.isPartitionListVisible()}\" ng-transclude=\"\"></div></div>");
$templateCache.put("bin-catalog-publication-time.html","<span ng-bind=\"$ctrl.publicationTime\"></span> <span class=\"label label-info\" ng-if=\"$ctrl.isDraft()\" i18n=\"\" code=\"catalog.item.draft\" read-only=\"\" ng-bind=\"::var\"></span> <span class=\"label label-info\" ng-if=\"$ctrl.isScheduled()\" i18n=\"\" code=\"catalog.item.scheduled\" read-only=\"\" ng-bind=\"::var\"></span>");
$templateCache.put("bin-catalog-search-more.html","<div ng-show=\"$ctrl.hasMore()\"><div class=\"row\"><div class=\"col-xs-12\"><button type=\"button\" class=\"btn btn-primary btn-search-more\" ng-click=\"$ctrl.searchMore()\" ng-disabled=\"$ctrl.isWorking()\" i18n=\"\" code=\"search.for.more.button\" read-only=\"\"><span ng-if=\"$ctrl.isWorking()\"><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> <span ng-if=\"!$ctrl.isWorking()\"><i class=\"fa fa-angle-down fa-fw\"></i></span> <span ng-bind=\"::var\"></span></button></div></div></div>");
$templateCache.put("bin-catalog-search.html","<section id=\"search\"><div class=\"container\"><div class=\"row\"><div class=\"col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3\"><i18n code=\"catalog.search.all.prefix\" read-only=\"\" var=\"searchAll\"></i18n><form ng-submit=\"$ctrl.submit()\"><div class=\"input-group input-group-lg\"><input type=\"text\" class=\"form-control\" ng-model=\"$ctrl.q\" i18n=\"\" code=\"navigation.label.{{::$ctrl.type}}\" read-only=\"\" placeholder=\"{{::searchAll}} {{var|lowercase}}\"><div class=\"input-group-btn\"><button class=\"btn btn-primary\" type=\"submit\"><i class=\"fa fa-search\"></i></button></div></div></form></div></div></div></section>");
$templateCache.put("bin-catalog-transclude.html","<div ng-transclude=\"\"></div>");
$templateCache.put("bin-catalog-working.html","<div class=\"dots\" ng-if=\"$ctrl.isWorking()\"><div class=\"dot\"></div><div class=\"dot\"></div><div class=\"dot\"></div></div>");
$templateCache.put("bin-spotlight-items.html","<bin-catalog-items items=\"$ctrl.results\" movable=\"false\" addable=\"false\" pinnable=\"true\" cols=\"{{::$ctrl.cols}}\" center=\"{{::$ctrl.center}}\" item-template-url=\"{{::$ctrl.templateUrl}}\"></bin-catalog-items>");
$templateCache.put("bin-spotlight.html","<bin-edit><bin-edit-actions><bin-edit-action action=\"$ctrl.goToOverview()\" icon-class=\"fa-th\" i18n-code=\"catalog.overview\"></bin-edit-action><bin-edit-action action=\"$ctrl.toggleRecentItems()\" icon-class=\"fa-eye\" i18n-code=\"catalog.show.recent\" ng-if=\"!$ctrl.recentItems\"></bin-edit-action><bin-edit-action action=\"$ctrl.toggleRecentItems()\" icon-class=\"fa-eye-slash\" i18n-code=\"catalog.hide.recent\" ng-if=\"$ctrl.recentItems\"></bin-edit-action></bin-edit-actions><bin-edit-body><div ng-transclude=\"header\"></div><div class=\"alert alert-info\" ng-if=\"$ctrl.editing && $ctrl.totalItemCount == 0\"><span><i class=\"fa fa-info-circle fa-fw\"></i></span> <span i18n=\"\" code=\"catalog.item.pin.spotlight.info\" read-only=\"\" ng-bind=\"::var\"></span></div><bin-spotlight-items pinned=\"true\"></bin-spotlight-items><div ng-if=\"$ctrl.recentItems\"><h4 ng-if=\"$ctrl.pinnedItemCount > 0\"><span i18n=\"\" code=\"catalog.spotlight.most.recent.title\" ng-bind=\"var\"></span></h4><bin-spotlight-items></bin-spotlight-items></div><div ng-transclude=\"footer\"></div></bin-edit-body></bin-edit>");}]);