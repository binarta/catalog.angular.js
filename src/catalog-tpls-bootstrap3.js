angular.module("catalog.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("bin-catalog-breadcrumb.html","<div ng-if=\"$ctrl.renderingMode == \'legacy\'\" class=\"container\"><div class=\"row\"><bin-catalog-raw-breadcrumb></bin-catalog-raw-breadcrumb></div></div><bin-catalog-raw-breadcrumb ng-if=\"$ctrl.renderingMode == \'latest\'\"></bin-catalog-raw-breadcrumb>");
$templateCache.put("bin-catalog-browse-component-partitions-default.html","<bin-catalog-browse-partitions></bin-catalog-browse-partitions>");
$templateCache.put("bin-catalog-browse-component.html","<div class=\"bin-catalog\"><bin-catalog-list one-level-partition=\"true\"><bin-catalog-search search-mode=\"{{$ctrl.searchMode}}\"></bin-catalog-search><bin-catalog-partition-title template-url=\"{{$ctrl.partitionTitleTemplateUrl}}\"></bin-catalog-partition-title><bin-catalog-breadcrumb></bin-catalog-breadcrumb><ng-include src=\"$ctrl.partitionsTemplateUrl\"></ng-include></bin-catalog-list></div>");
$templateCache.put("bin-catalog-browse-page-default.html","<bin-catalog-browse></bin-catalog-browse>");
$templateCache.put("bin-catalog-browse-page.html","<ng-include src=\"$ctrl.templateUrl\"></ng-include>");
$templateCache.put("bin-catalog-browse-partitions-component.html","<bin-catalog-partitions><bin-catalog-partition-description></bin-catalog-partition-description><bin-catalog-item-groups pinnable=\"true\" configurable-component=\"catalog.item.search\" configurable-widget=\"preview.image\" redirect-on-add=\"true\" item-template-url=\"{{$ctrl.parent.itemTemplateUrl}}\"></bin-catalog-item-groups><bin-catalog-working></bin-catalog-working><bin-catalog-search-more></bin-catalog-search-more></bin-catalog-partitions>");
$templateCache.put("bin-catalog-edit-name.html","<form ng-submit=\"submit()\"><div class=\"bin-menu-edit-body\"><div class=\"form-group\"><label for=\"catalogNameInput\" i18n=\"\" code=\"{{::i18nPrefix}}.label\" read-only=\"\" ng-bind=\"::var\"></label> <input type=\"text\" id=\"catalogNameInput\" ng-model=\"name\" ng-disabled=\"working\" required=\"\" autofocus=\"\"></div><bin-violations src=\"violations[\'name\']\" fade-after=\"7000\" code-prefix=\"{{::i18nPrefix}}\"></bin-violations></div><div class=\"bin-menu-edit-actions\"><button type=\"submit\" class=\"btn btn-primary\" ng-disabled=\"working\" i18n=\"\" code=\"clerk.menu.save.button\" read-only=\"\"><span ng-show=\"working\"><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> <span ng-bind=\"::var\"></span></button> <button type=\"reset\" class=\"btn btn-default\" ng-click=\"cancel()\" ng-disabled=\"working\" i18n=\"\" code=\"clerk.menu.cancel.button\" read-only=\"\" ng-bind=\"::var\"></button></div></form>");
$templateCache.put("bin-catalog-empty.html","<div ng-if=\"$ctrl.isEmpty()\"><div class=\"bin-catalog-empty-icon\"><i class=\"fa fa-search\"></i></div><h3 class=\"bin-catalog-empty-title\" i18n=\"\" code=\"search.no.items.found.message\" read-only=\"\" ng-bind=\"::var\"></h3></div>");
$templateCache.put("bin-catalog-item-add.html","<button type=\"button\" class=\"bin-btn bin-btn-default\" ng-click=\"$ctrl.submit()\"><span ng-hide=\"$ctrl.working\"><i class=\"fa fa-plus\"></i></span> <span ng-show=\"$ctrl.working\"><i class=\"fa fa-spinner fa-spin\"></i></span> <span i18n=\"\" code=\"catalog.{{::$ctrl.type}}.add.placeholder\" default=\"add item\" read-only=\"\" ng-bind=\"::var\"></span></button>");
$templateCache.put("bin-catalog-item-cta-edit.html","<form ng-submit=\"submit()\" id=\"bin-catalog-item-cta-edit\"><div class=\"bin-menu-edit-body\"><table class=\"table table-bordered\"><tr><th colspan=\"2\" i18n=\"\" code=\"catalog.item.edit.cta.title\" read-only=\"\" ng-bind=\"::var\"></th></tr><tr ng-class=\"{active: cta === \'default\'}\"><td colspan=\"2\"><input type=\"radio\" name=\"catalogItemCtaRadios\" id=\"catalogItemCtaDefault\" ng-model=\"cta\" value=\"default\" ng-change=\"submit()\"> <label for=\"catalogItemCtaDefault\"><span><strong i18n=\"\" code=\"catalog.item.edit.cta.option.default\" read-only=\"\" ng-bind=\"::var\"></strong></span></label><div class=\"help-block\" i18n=\"\" code=\"catalog.item.edit.cta.option.default.help\" read-only=\"\" ng-bind=\"::var\"></div></td></tr><tr ng-class=\"{active: cta === \'link\'}\"><td><input type=\"radio\" name=\"catalogItemCtaRadios\" id=\"catalogItemCtaLink\" ng-model=\"cta\" value=\"link\" ng-change=\"submit()\"> <label for=\"catalogItemCtaLink\"><span><strong i18n=\"\" code=\"catalog.item.edit.cta.option.link\" read-only=\"\" ng-bind=\"::var\"></strong></span></label><div class=\"help-block\" i18n=\"\" code=\"catalog.item.edit.cta.option.link.help\" read-only=\"\" ng-bind=\"::var\"></div></td><td class=\"text-center\"><button type=\"button\" class=\"btn btn-primary btn-xs\" ng-click=\"configureLink()\"><i class=\"fa fa-cog fa-fw\"></i> <span i18n=\"\" code=\"catalog.item.edit.cta.option.link.configure\" read-only=\"\" ng-bind=\"::var\"></span></button></td></tr><tr ng-class=\"{active: cta === \'none\'}\"><td colspan=\"2\"><input type=\"radio\" name=\"catalogItemCtaRadios\" id=\"catalogItemCtaNone\" ng-model=\"cta\" value=\"none\" ng-change=\"submit()\"> <label for=\"catalogItemCtaNone\"><span><strong i18n=\"\" code=\"catalog.item.edit.cta.option.none\" read-only=\"\" ng-bind=\"::var\"></strong></span></label><div class=\"help-block\" i18n=\"\" code=\"catalog.item.edit.cta.option.none.help\" read-only=\"\" ng-bind=\"::var\"></div></td></tr></table></div><div class=\"bin-menu-edit-actions\"><button type=\"button\" class=\"btn btn-default\" ng-click=\"close()\" i18n=\"\" code=\"clerk.menu.close.button\" read-only=\"\" ng-bind=\"::var\" ng-disabled=\"working\"></button></div></form>");
$templateCache.put("bin-catalog-item-cta.html","<span ng-switch=\"\" on=\"$ctrl.item.cta\"><span ng-switch-when=\"none\"></span> <span ng-switch-when=\"link\"><a ng-href=\"{{$ctrl.item.link}}\" target=\"{{$ctrl.item.linkTarget}}\" class=\"btn btn-primary\" i18n=\"\" code=\"{{::$ctrl.i18nCode}}\" default=\"Info\" read-only=\"\" ng-bind=\"var\"></a></span> <span ng-switch-default=\"\"><bin-catalog-item-request-info-button item=\"$ctrl.item\"></bin-catalog-item-request-info-button></span></span>");
$templateCache.put("bin-catalog-item-details-default.html","<div class=\"row\"><div class=\"col-xs-12 col-sm-4\"><bin-catalog-item-image-gallery></bin-catalog-item-image-gallery></div><div class=\"col-xs-12 col-sm-8\"><bin-catalog-item-spec-sheet></bin-catalog-item-spec-sheet></div></div>");
$templateCache.put("bin-catalog-item-groups.html","<div bin-group-by=\"partition\" on=\"$ctrl.items\"><bin-catalog-items items=\"[]\" ng-if=\"$ctrl.noItemsInMainPartition()\"></bin-catalog-items><div ng-repeat=\"group in groups track by group.id\"><div class=\"row\" ng-if=\"::$ctrl.partition !== group.items[0].partition\"><div class=\"col-xs-12\"><h2 class=\"partition-title\" i18n=\"\" code=\"{{::group.items[0].partition}}\" read-only=\"\" ng-bind=\"::var\"></h2></div></div><bin-catalog-items items=\"group.items\" partition=\"{{::group.items[0].partition}}\"></bin-catalog-items></div></div>");
$templateCache.put("bin-catalog-item-image-component-bottom.html","");
$templateCache.put("bin-catalog-item-image-component.html","<div class=\"responsive-item maintain-aspect-ratio\" ng-class=\"::{\'item-image-not-found\': !$ctrl.src}\" ng-style=\"{\'padding-bottom\': \'calc(100% * {{$ctrl.aspectRatio.height}} / {{$ctrl.aspectRatio.width}}}\"><img bin-image=\"{{::$ctrl.src}}\" ng-class=\"{\'cover\':$ctrl.fittingRule == \'cover\', \'contain\':$ctrl.fittingRule != \'cover\'}\" read-only=\"\" ng-if=\"::$ctrl.src\"><ng-include src=\"$ctrl.bottomTemplateUrl\"></ng-include></div>");
$templateCache.put("bin-catalog-item-image-gallery.html","<div class=\"item-line item-image\"><bin-image-carousel item-id=\"$ctrl.parent.item.id\" items=\"$ctrl.parent.item.carousel\" aspect-ratio=\"$ctrl.parent.item.imageAspectRatio\" fitting-rule=\"$ctrl.parent.item.imageFittingRule\" template-url=\"partials/bin-catalog-item-image-gallery-carousel.html\"></bin-image-carousel></div><script type=\"text/ng-template\" id=\"partials/bin-catalog-item-image-gallery-carousel.html\"><content-carousel items=\"$ctrl.images\" dots=\"false\" arrows=\"true\" auto-play=\"false\" item-template-url=\"partials/bin-catalog-item-image-gallery-carousel-item.html\" ng-class=\"{\'controls-visible\': $ctrl.images.length > 1}\"> </content-carousel></script><script type=\"text/ng-template\" id=\"partials/bin-catalog-item-image-gallery-carousel-item.html\"><div> <bin-image-enlarged code=\"{{::item.path}}\" read-only seo-image ng-if=\"::$index == 0\" aspect-ratio=\"item.aspectRatio\" fitting-rule=\"item.fittingRule\" ></bin-image-enlarged> <bin-image-enlarged code=\"{{::item.path}}\" read-only ng-if=\"::$index != 0\" aspect-ratio=\"item.aspectRatio\" fitting-rule=\"item.fittingRule\" ></bin-image-enlarged> </div></script>");
$templateCache.put("bin-catalog-item-list-default.html","<div class=\"bin-catalog-item thumbnail\"><a bin-href=\"{{::$ctrl.itemPath}}\"><div class=\"item-image-mobile-wrapper\"><div class=\"item-image maintain-aspect-ratio\" ng-class=\"::{\'item-image-not-found\': !$ctrl.image.hero}\" ng-style=\"{\'padding-bottom\': \'calc((100% * \' + $ctrl.item.imageAspectRatio.height + \')/\'+$ctrl.item.imageAspectRatio.width+\')\'}\"><img bin-image=\"{{::$ctrl.image.hero}}\" ng-class=\"{\'cover\':$ctrl.item.imageFittingRule == \'cover\', \'contain\':$ctrl.item.imageFittingRule != \'cover\'}\" read-only=\"\" ng-if=\"::$ctrl.image.hero\"></div></div></a><div class=\"caption\"><a bin-href=\"{{::$ctrl.itemPath}}\"><h3 class=\"item-title\" i18n=\"\" code=\"{{::$ctrl.i18n.title}}\" read-only=\"\" ng-bind=\"::var\"></h3></a><div class=\"item-price\"><bin-price catalog-item=\"$ctrl.item\" read-only=\"\"></bin-price></div></div></div>");
$templateCache.put("bin-catalog-item-publisher-edit.html","<form ng-submit=\"submit()\"><div class=\"bin-menu-edit-body\"><div class=\"alert alert-danger\" ng-show=\"violation\"><i class=\"fa fa-exclamation-triangle fa-fw\"></i> <span i18n=\"\" code=\"clerk.menu.try.again.message\" read-only=\"\" ng-bind=\"::var\"></span></div><div class=\"form-group bin-moment-picker\"><label for=\"bin-blog-publication-time\" i18n=\"\" code=\"catalog.item.publication.time.label\" read-only=\"\" ng-bind=\"::var\"></label> <input id=\"bin-blog-publication-time\" class=\"form-control\" ng-model=\"publicationTime\" moment-picker=\"publicationTime\" format=\"lll\" required=\"\"></div></div><div class=\"bin-menu-edit-actions\"><button type=\"submit\" class=\"btn btn-primary\" i18n=\"\" code=\"clerk.menu.save.button\" read-only=\"\" ng-disabled=\"working\"><span ng-show=\"working\"><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> <span ng-bind=\"::var\"></span></button> <button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\" i18n=\"\" code=\"clerk.menu.cancel.button\" read-only=\"\" ng-bind=\"::var\" ng-disabled=\"working\"></button></div></form>");
$templateCache.put("bin-catalog-item-request-info-button.html","<div ng-if=\"$ctrl.isContactActive()\"><a bin-dhref=\"{{$ctrl.contactPath}}\" ng-class=\"::$ctrl.buttonClass\" ng-if=\"!$ctrl.isRequestInfoFormRegistered()\"><span i18n=\"\" code=\"catalog.item.more.info.button\" read-only=\"\" ng-bind=\"::var\"></span> <i class=\"fa fa-angle-right fa-fw\"></i></a> <button type=\"button\" ng-click=\"$ctrl.scrollToForm()\" ng-class=\"::$ctrl.buttonClass\" ng-if=\"$ctrl.isRequestInfoFormRegistered()\"><span i18n=\"\" code=\"catalog.item.more.info.button\" read-only=\"\" ng-bind=\"::var\"></span> <i class=\"fa fa-angle-down fa-fw\"></i></button></div>");
$templateCache.put("bin-catalog-item-request-info-form.html","<bin-contact-form><h3 class=\"text-center\" ng-bind=\"$ctrl.subject\"></h3><bin-contact-form-field field-type=\"text\" field-name=\"subject\" value=\"{{$ctrl.subject}}\" class=\"hidden\"></bin-contact-form-field><bin-contact-form-field field-type=\"email\" field-name=\"replyTo\"></bin-contact-form-field><bin-contact-form-field field-type=\"textarea\" field-name=\"message\"></bin-contact-form-field><bin-contact-form-submit></bin-contact-form-submit></bin-contact-form>");
$templateCache.put("bin-catalog-item-spec-sheet.html","<h1 class=\"item-line item-title\" i18n=\"\" code=\"{{::$ctrl.parent.i18n.title}}\" ng-bind=\"var\"></h1><div class=\"item-line item-price\"><bin-price catalog-item=\"$ctrl.parent.item\" on-update=\"$ctrl.parent.refresh()\"></bin-price></div><div class=\"item-line item-cta\"><bin-catalog-item-cta item=\"$ctrl.parent.item\"></bin-catalog-item-cta></div><div class=\"item-line item-body\" i18n=\"\" code=\"{{::$ctrl.parent.i18n.body}}\" editor=\"full\" ng-bind-html=\"var|trust\" ng-show=\"var || $ctrl.parent.editing\"></div>");
$templateCache.put("bin-catalog-item-title-default.html","<div class=\"page-header-wrapper\"><div class=\"page-header\"><h1 i18n=\"\" code=\"{{::$ctrl.i18n.title}}\" ng-bind=\"var\"></h1></div></div>");
$templateCache.put("bin-catalog-item-title.html","<ng-include src=\"$ctrl.templateUrl\" ng-if=\"::$ctrl.item\"></ng-include>");
$templateCache.put("bin-catalog-item.html","<div ng-class=\"$ctrl.item.uiStatus\" ng-if=\"::$ctrl.item\"><bin-edit><bin-actions><bin-action-group><bin-action ng-repeat=\"it in $ctrl.editActions\" bin-action-type=\"expression\" bin-action-expression=\"it.action()\" bin-action-icon-class=\"{{::it.iconClass}}\" bin-action-i18n-code=\"{{::it.i18nCode}}\"></bin-action><bin-action bin-action-type=\"expression\" bin-action-expression=\"$ctrl.link()\" bin-action-icon-class=\"fa-link\" bin-action-i18n-code=\"catalog.item.link\" ng-if=\"$ctrl.isLinkAllowed()\"></bin-action><bin-action bin-action-type=\"selector\" bin-action-selector=\"move\" bin-action-icon-class=\"fa-arrows\" bin-action-i18n-code=\"catalog.item.move\" ng-if=\"$ctrl.isMoveAllowed()\"></bin-action><bin-action bin-action-type=\"selector\" bin-action-selector=\"resize\" bin-action-icon-class=\"fa-arrows-alt\" bin-action-i18n-code=\"catalog.item.resize\" ng-if=\"$ctrl.isResizeAllowed()\"></bin-action><bin-action bin-action-type=\"expression\" bin-action-expression=\"$ctrl.pin()\" bin-action-icon-class=\"fa-thumb-tack\" bin-action-i18n-code=\"catalog.item.pin.button\" ng-if=\"$ctrl.isPinAllowed()\"></bin-action><bin-action bin-action-type=\"expression\" bin-action-expression=\"$ctrl.unpin()\" bin-action-icon-class=\"fa-thumb-tack fa-rotate-90\" bin-action-i18n-code=\"catalog.item.unpin.button\" ng-if=\"$ctrl.isUnpinAllowed()\"></bin-action><bin-action bin-action-type=\"expression\" bin-action-expression=\"$ctrl.publish()\" bin-action-icon-class=\"fa-eye\" bin-action-i18n-code=\"catalog.item.publish\" ng-if=\"$ctrl.isPublishAllowed()\"></bin-action><bin-action bin-action-type=\"expression\" bin-action-expression=\"$ctrl.unpublish()\" bin-action-icon-class=\"fa-eye-slash\" bin-action-i18n-code=\"catalog.item.unpublish\" ng-if=\"$ctrl.isUnpublishAllowed()\"></bin-action><bin-action bin-action-type=\"expression\" bin-action-expression=\"$ctrl.configureWidget()\" bin-action-icon-class=\"fa-cog\" bin-action-i18n-code=\"catalog.item.configure.widget\" ng-if=\"$ctrl.isConfigureWidgetAllowed()\"></bin-action><bin-action bin-action-type=\"selector\" bin-action-selector=\"delete\" bin-action-danger=\"\" bin-action-icon-class=\"fa-trash\" bin-action-i18n-code=\"catalog.item.remove\" ng-if=\"$ctrl.isRemoveAllowed()\"></bin-action></bin-action-group><bin-action-group bin-action-group-for=\"move\" bin-action-group-button-i18n-code=\"catalog.item.move\"><bin-action bin-action-type=\"expression\" bin-action-expression=\"$ctrl.moveUp()\" bin-action-icon-class=\"fa-angle-up\" bin-action-i18n-code=\"catalog.item.move.up\" bin-action-disabled=\"$ctrl.isFirst()\"></bin-action><bin-action bin-action-type=\"expression\" bin-action-expression=\"$ctrl.moveDown()\" bin-action-icon-class=\"fa-angle-down\" bin-action-i18n-code=\"catalog.item.move.down\" bin-action-disabled=\"$ctrl.isLast()\"></bin-action><bin-action bin-action-type=\"expression\" bin-action-expression=\"$ctrl.moveTop()\" bin-action-icon-class=\"fa-angle-double-up\" bin-action-i18n-code=\"catalog.item.move.top\" bin-action-disabled=\"$ctrl.isFirst()\"></bin-action><bin-action bin-action-type=\"expression\" bin-action-expression=\"$ctrl.moveBottom()\" bin-action-icon-class=\"fa-angle-double-down\" bin-action-i18n-code=\"catalog.item.move.bottom\" bin-action-disabled=\"$ctrl.isLast()\"></bin-action></bin-action-group><bin-action-group bin-action-group-for=\"resize\" bin-action-group-button-i18n-code=\"catalog.item.resize\"><bin-action bin-action-type=\"expression\" bin-action-expression=\"$ctrl.makeLarge()\" bin-action-icon-class=\"fa-arrows\" bin-action-i18n-code=\"catalog.item.resize.large\"></bin-action><bin-action bin-action-type=\"expression\" bin-action-expression=\"$ctrl.makeWide()\" bin-action-icon-class=\"fa-arrows-h\" bin-action-i18n-code=\"catalog.item.resize.wide\"></bin-action><bin-action bin-action-type=\"expression\" bin-action-expression=\"$ctrl.makeTall()\" bin-action-icon-class=\"fa-arrows-v\" bin-action-i18n-code=\"catalog.item.resize.tall\"></bin-action><bin-action bin-action-type=\"expression\" bin-action-expression=\"$ctrl.resetSize()\" bin-action-icon-class=\"fa-times\" bin-action-i18n-code=\"catalog.item.resize.reset\"></bin-action></bin-action-group><bin-action-group bin-action-group-for=\"delete\"><bin-action bin-action-type=\"expression\" bin-action-expression=\"$ctrl.remove()\" bin-action-danger=\"\" bin-action-icon-class=\"fa-trash\" bin-action-i18n-code=\"catalog.item.remove.confirm\"></bin-action></bin-action-group></bin-actions><bin-edit-body class=\"bin-catalog-item-body-wrapper\"><div class=\"alert alert-info\" ng-if=\"$ctrl.isPublishAllowed() && $ctrl.item.status === \'draft\'\"><i class=\"fa fa-eye-slash fa-fw\"></i> <span i18n=\"\" code=\"catalog.item.draft\" read-only=\"\" ng-bind=\"::var\"></span></div><ng-include class=\"bin-catalog-item-body\" src=\"$ctrl.templateUrl\"></ng-include></bin-edit-body></bin-edit></div>");
$templateCache.put("bin-catalog-items-grid.html","<bin-catalog-item-add ng-if=\"$ctrl.isAddAllowed()\"></bin-catalog-item-add><web-grid columns=\"!$root.viewport ? 4 : $root.viewport.xs ? 2 : $root.viewport.sm ? 3 : 4\"><web-grid-item colspan=\"item.size.colspan\" rowspan=\"item.size.rowspan\" ng-class=\"item.size.cssClass\" ng-repeat=\"item in $ctrl.items track by item.id\"><bin-catalog-item item=\"item\" resizable=\"true\"></bin-catalog-item></web-grid-item></web-grid>");
$templateCache.put("bin-catalog-items.html","<div class=\"row\"><div ng-if=\"$ctrl.isAddAllowed()\"><bin-cols index=\"0\" cols=\"{{::$ctrl.cols || \'sm-4 md-3\'}}\" length=\"$ctrl.items.length + 1\" center=\"{{::$ctrl.center}}\"><bin-catalog-item-add></bin-catalog-item-add></bin-cols></div><bin-cols index=\"$index + ($ctrl.isAddAllowed() ? 1 : 0)\" cols=\"{{::$ctrl.cols || \'sm-4 md-3\'}}\" length=\"$ctrl.items.length + ($ctrl.isAddAllowed() ? 1 : 0)\" center=\"{{::$ctrl.center}}\" ng-repeat=\"item in $ctrl.items track by item.id\"><bin-catalog-item item=\"item\" fitting-rule-attribute=\"fittingRuleOverrideForPreview\"></bin-catalog-item></bin-cols></div>");
$templateCache.put("bin-catalog-partition-add.html","<button type=\"button\" class=\"bin-btn bin-btn-default\" ng-click=\"$ctrl.submit()\"><i class=\"fa fa-plus fa-fw\"></i> <span i18n=\"\" code=\"catalog.partition.add.placeholder\" read-only=\"\" ng-bind=\"::var\"></span></button>");
$templateCache.put("bin-catalog-partition-description.html","<div class=\"bin-catalog-partition-description\" i18n=\"\" code=\"{{::$ctrl.partition}}.body\" editor=\"full-media\" ng-bind-html=\"var|trust\" ng-show=\"var || $ctrl.editing\"></div>");
$templateCache.put("bin-catalog-partition-list-default.html","<a bin-href=\"/browse{{::$ctrl.partition.id}}\"><span i18n=\"\" code=\"{{::$ctrl.partition.id}}\" default=\"{{::$ctrl.partition.name}}\" ng-bind=\"var\"></span></a>");
$templateCache.put("bin-catalog-partition-title-default.html","<div class=\"page-header-wrapper\"><div class=\"page-header\"><h1><bin-catalog-raw-partition-title></bin-catalog-raw-partition-title></h1></div></div>");
$templateCache.put("bin-catalog-partition-title.html","<ng-include src=\"$ctrl.templateUrl\"></ng-include>");
$templateCache.put("bin-catalog-partition.html","<div ng-class=\"$ctrl.partition.uiStatus\"><bin-edit><bin-actions><bin-action-group><bin-action bin-action-type=\"selector\" bin-action-selector=\"move\" bin-action-icon-class=\"fa-arrows\" bin-action-i18n-code=\"catalog.item.move\" ng-if=\"$ctrl.isMoveAllowed()\"></bin-action><bin-action bin-action-type=\"selector\" bin-action-selector=\"delete\" bin-action-danger=\"\" bin-action-icon-class=\"fa-trash\" bin-action-i18n-code=\"catalog.partition.remove\" ng-if=\"$ctrl.isRemoveAllowed()\"></bin-action></bin-action-group><bin-action-group bin-action-group-for=\"move\" bin-action-group-button-i18n-code=\"catalog.item.move\"><bin-action bin-action-type=\"expression\" bin-action-expression=\"$ctrl.moveUp()\" bin-action-icon-class=\"fa-angle-up\" bin-action-i18n-code=\"catalog.item.move.up\" bin-action-disabled=\"$ctrl.isFirst()\"></bin-action><bin-action bin-action-type=\"expression\" bin-action-expression=\"$ctrl.moveDown()\" bin-action-icon-class=\"fa-angle-down\" bin-action-i18n-code=\"catalog.item.move.down\" bin-action-disabled=\"$ctrl.isLast()\"></bin-action><bin-action bin-action-type=\"expression\" bin-action-expression=\"$ctrl.moveTop()\" bin-action-icon-class=\"fa-angle-double-up\" bin-action-i18n-code=\"catalog.item.move.top\" bin-action-disabled=\"$ctrl.isFirst()\"></bin-action><bin-action bin-action-type=\"expression\" bin-action-expression=\"$ctrl.moveBottom()\" bin-action-icon-class=\"fa-angle-double-down\" bin-action=\'i18n-code=\"catalog.item.move.bottom\"\' bin-action-disabled=\"$ctrl.isLast()\"></bin-action></bin-action-group><bin-action-group bin-action-group-for=\"delete\"><bin-action bin-action-type=\"expression\" bin-action-expression=\"$ctrl.remove()\" bin-action-danger=\"\" bin-action-icon-class=\"fa-trash\" bin-action-i18n-code=\"catalog.partition.remove.confirm\"></bin-action></bin-action-group></bin-actions><bin-edit-body><ng-include src=\"$ctrl.templateUrl\"></ng-include></bin-edit-body></bin-edit></div>");
$templateCache.put("bin-catalog-partitions.html","<div class=\"row\"><div class=\"col-xs-12 col-sm-4 col-md-3\" ng-if=\"$ctrl.isPartitionListVisible()\"><div class=\"list-group\" ng-if=\"::!$ctrl.isOnRoot()\"><div class=\"list-group-item list-group-item-back\"><a class=\"btn btn-primary\" bin-href=\"{{::\'/browse\' + $ctrl.parent}}\"><i class=\"fa fa-arrow-left fa-fw\"></i> <span i18n=\"\" code=\"catalog.partition.back\" read-only=\"\" ng-bind=\"::var\"></span></a></div></div><div class=\"list-group\"><div class=\"list-group-item list-group-item-partition\" ng-repeat=\"partition in $ctrl.partitions track by partition.id\"><bin-catalog-partition partition=\"partition\"></bin-catalog-partition></div><div class=\"list-group-item list-group-item-add\" ng-if=\"$ctrl.isAddAllowed()\"><bin-catalog-partition-add></bin-catalog-partition-add></div></div></div><div class=\"col-xs-12\" ng-class=\"{\'col-sm-8 col-md-9\': $ctrl.isPartitionListVisible()}\" ng-transclude=\"\"></div></div>");
$templateCache.put("bin-catalog-publication-time.html","<div ng-if=\"$ctrl.time\"><span ng-if=\"::$ctrl.icon\"><i class=\"fa fa-fw\" ng-class=\"::$ctrl.icon\"></i></span> <span ng-bind=\"$ctrl.publicationTime\"></span> <span class=\"label label-info\" ng-if=\"$ctrl.isDraft()\" i18n=\"\" code=\"catalog.item.draft\" read-only=\"\" ng-bind=\"::var\"></span> <span class=\"label label-info\" ng-if=\"$ctrl.isScheduled()\" i18n=\"\" code=\"catalog.item.scheduled\" read-only=\"\" ng-bind=\"::var\"></span></div>");
$templateCache.put("bin-catalog-raw-breadcrumb.html","<section id=\"breadcrumb\"><ol class=\"breadcrumb visible-xs\" ng-if=\"$ctrl.parent.back\"><li><a bin-href=\"{{$ctrl.parent.back.path}}\"><span><i class=\"fa fa-angle-left fa-fw\"></i></span> <span i18n=\"\" code=\"{{$ctrl.parent.back.id}}\" read-only=\"\" ng-bind=\"var\"></span></a></li></ol><ol class=\"breadcrumb hidden-xs\"><li ng-class=\"::{active: !it.path}\" ng-repeat=\"it in $ctrl.parent.breadcrumb track by it.id\"><a ng-if=\"::it.path\" bin-href=\"{{::it.path}}\" i18n=\"\" code=\"{{::it.id}}\" read-only=\"\" ng-bind=\"var\"></a> <span ng-if=\"::!it.path\" i18n=\"\" code=\"{{::it.id}}\" read-only=\"\" ng-bind=\"var\"></span></li></ol></section>");
$templateCache.put("bin-catalog-raw-partition-title.html","<i18n code=\"{{::$ctrl.code}}\" default=\"{{::$ctrl.default}}\" ng-bind=\"var\"></i18n>");
$templateCache.put("bin-catalog-raw-search.html","<section id=\"search\"><i18n code=\"catalog.search.all.prefix\" read-only=\"\" var=\"searchAll\"></i18n><form ng-submit=\"$ctrl.parent.submit()\"><div class=\"input-group input-group-lg\"><input type=\"text\" class=\"form-control\" ng-model=\"$ctrl.parent.q\" i18n=\"\" code=\"navigation.label.{{::$ctrl.parent.type}}\" read-only=\"\" placeholder=\"{{::searchAll}} {{var|lowercase}}\"><div class=\"input-group-btn\"><button class=\"btn btn-primary\" type=\"submit\"><i class=\"fa fa-search\"></i></button></div></div></form></section>");
$templateCache.put("bin-catalog-search-more.html","<div ng-show=\"$ctrl.hasMore()\"><div class=\"row\"><div class=\"col-xs-12\"><button type=\"button\" class=\"btn btn-primary btn-search-more\" ng-click=\"$ctrl.searchMore()\" ng-disabled=\"$ctrl.isWorking()\" i18n=\"\" code=\"search.for.more.button\" read-only=\"\"><span ng-if=\"$ctrl.isWorking()\"><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> <span ng-if=\"!$ctrl.isWorking()\"><i class=\"fa fa-angle-down fa-fw\"></i></span> <span ng-bind=\"::var\"></span></button></div></div></div>");
$templateCache.put("bin-catalog-search.html","<div ng-if=\"$ctrl.renderingMode == \'legacy\'\" class=\"container\"><div class=\"row\"><div class=\"col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3\"><bin-catalog-raw-search></bin-catalog-raw-search></div></div></div><bin-catalog-raw-search ng-if=\"$ctrl.renderingMode == \'latest\'\"></bin-catalog-raw-search>");
$templateCache.put("bin-catalog-transclude.html","<div ng-transclude=\"\"></div>");
$templateCache.put("bin-catalog-working.html","<div class=\"dots\" ng-if=\"$ctrl.isWorking()\"><div class=\"dot\"></div><div class=\"dot\"></div><div class=\"dot\"></div></div>");
$templateCache.put("bin-spotlight-items.html","<bin-catalog-items ng-if=\"$ctrl.spotlightCtrl.view == \'default\'\" items=\"$ctrl.results\" movable=\"false\" addable=\"false\" pinnable=\"true\" cols=\"{{::$ctrl.cols}}\" center=\"{{::$ctrl.center}}\" item-template-url=\"{{::$ctrl.itemTemplateUrl}}\"></bin-catalog-items><bin-catalog-items ng-if=\"$ctrl.spotlightCtrl.view == \'grid\'\" items=\"$ctrl.results\" movable=\"false\" addable=\"false\" pinnable=\"true\" cols=\"{{::$ctrl.cols}}\" center=\"{{::$ctrl.center}}\" template-url=\"bin-catalog-items-grid.html\" item-template-url=\"{{::$ctrl.itemTemplateUrl}}\"></bin-catalog-items>");
$templateCache.put("bin-spotlight.html","<bin-edit><bin-actions><bin-action-group><bin-action bin-action-type=\"expression\" bin-action-expression=\"$ctrl.toggleRecentItems()\" bin-action-icon-class=\"fa-eye\" bin-action-i18n-code=\"catalog.show.recent\" ng-if=\"$ctrl.areRecentItemsAllowed() && !$ctrl.recentItems\"></bin-action><bin-action bin-action-type=\"expression\" bin-action-expression=\"$ctrl.toggleRecentItems()\" bin-action-icon-class=\"fa-eye-slash\" bin-action-i18n-code=\"catalog.hide.recent\" ng-if=\"$ctrl.areRecentItemsAllowed() && $ctrl.recentItems\"></bin-action><bin-action bin-action-type=\"expression\" bin-action-expression=\"$ctrl.switchToDefaultView()\" bin-action-icon-class=\"fa-th\" bin-action-i18n-code=\"catalog.switch.to.default.view\" ng-if=\"$ctrl.allowViewSwitch && $ctrl.view != \'default\'\"></bin-action><bin-action bin-action-type=\"expression\" bin-action-expression=\"$ctrl.switchToGridView()\" bin-action-icon-class=\"fa-th\" bin-action-i18n-code=\"catalog.switch.to.grid.view\" ng-if=\"$ctrl.allowViewSwitch && $ctrl.view != \'grid\'\"></bin-action></bin-action-group></bin-actions><bin-edit-body><div ng-transclude=\"header\"></div><div class=\"alert alert-info\" ng-if=\"$ctrl.editing && $ctrl.totalItemCount == 0\"><span><i class=\"fa fa-info-circle fa-fw\"></i></span> <span i18n=\"\" code=\"catalog.item.pin.spotlight.info\" read-only=\"\" ng-bind=\"::var\"></span></div><bin-spotlight-items pinned=\"true\"></bin-spotlight-items><div ng-if=\"$ctrl.areRecentItemsAllowed() && $ctrl.recentItems\"><h4 ng-if=\"$ctrl.pinnedItemCount > 0\"><span i18n=\"\" code=\"catalog.spotlight.most.recent.title\" ng-bind=\"var\"></span></h4><bin-spotlight-items></bin-spotlight-items></div><div ng-transclude=\"footer\"></div></bin-edit-body></bin-edit>");
$templateCache.put("bin-widget-settings.html","<form ng-submit=\"submit()\"><div class=\"bin-menu-edit-body\" ng-if=\"status == \'defaults-mode\'\"><div class=\"form-group\" ng-class=\"{\'has-error\': violations.attributes.aspectRatio}\"><label i18n=\"\" code=\"catalog.item.image.aspect.ratio\" read-only=\"\" ng-bind=\"::var\"></label> <input type=\"number\" class=\"form-control\" ng-model=\"defaultAttributes.aspectRatio.width\" required=\"\"> x <input type=\"number\" class=\"form-control\" ng-model=\"defaultAttributes.aspectRatio.height\" required=\"\"><p class=\"help-block\" ng-repeat=\"v in violations.attributes.aspectRatio.width\" i18n=\"\" code=\"widget.aspect.ratio.{{::v}}\" default=\"Width: {{::v}}\" read-only=\"\">{{::var}}</p><p class=\"help-block\" ng-repeat=\"v in violations.attributes.aspectRatio.height\" i18n=\"\" code=\"widget.aspect.ratio..{{::v}}\" default=\"Height: {{::v}}\" read-only=\"\">{{::var}}</p></div><div class=\"form-group\" ng-class=\"{\'has-error\': violations.attributes.fittingRule}\"><label i18n=\"\" code=\"catalog.item.image.fitting.rule\" read-only=\"\" ng-bind=\"::var\"></label> <input class=\"form-control\" ng-model=\"defaultAttributes.fittingRule\" required=\"\"><p class=\"help-block\" ng-repeat=\"v in violations.attributes.fittingRule\" i18n=\"\" code=\"widget.fitting.rule.{{::v}}\" default=\"{{::v}}\" read-only=\"\">{{::var}}</p></div></div><div class=\"bin-menu-edit-body\" ng-if=\"status == \'item-mode\'\"><div class=\"form-group\" ng-class=\"{\'has-error\': violations[fittingRuleAttribute]}\"><label i18n=\"\" code=\"catalog.item.image.fitting.rule\" read-only=\"\" ng-bind=\"::var\"></label> <input class=\"form-control\" ng-model=\"item[fittingRuleAttribute]\"><p class=\"help-block\" ng-repeat=\"v in violations[fittingRuleAttribute]\" i18n=\"\" code=\"widget.fitting.rule.{{::v}}\" default=\"{{::v}}\" read-only=\"\">{{::var}}</p></div></div><div class=\"bin-menu-edit-actions\"><button type=\"submit\" class=\"btn btn-primary\" i18n=\"\" code=\"clerk.menu.save.button\" read-only=\"\" ng-disabled=\"working\"><span ng-show=\"working\"><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> <span ng-bind=\"::var\"></span></button> <button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\" i18n=\"\" code=\"clerk.menu.cancel.button\" read-only=\"\" ng-bind=\"::var\" ng-disabled=\"working\"></button> <button type=\"button\" class=\"btn btn-default\" ng-click=\"switchToItemMode()\" ng-if=\"status == \'defaults-mode\'\" i18n=\"\" code=\"widget.settings.menu.to.item.mode.button\" read-only=\"\" ng-bind=\"::var\" ng-disabled=\"working\"></button> <button type=\"button\" class=\"btn btn-default\" ng-click=\"switchToDefaultsMode()\" ng-if=\"status == \'item-mode\'\" i18n=\"\" code=\"widget.settings.menu.to.defaults.mode.button\" read-only=\"\" ng-bind=\"::var\" ng-disabled=\"working\"></button></div></form>");}]);