(function(module) {
try {
  module = angular.module('app-templates');
} catch (e) {
  module = angular.module('app-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app.tpl',
    '<div class="row">\n' +
    '	<div class="form-group col-xs-1">\n' +
    '		<label>Canvas:</label>\n' +
    '	</div>\n' +
    '	<div class="form-group col-xs-1">\n' +
    '		<label>Width</label>\n' +
    '		<input class="form-control" type="number" step="10" ng-model="svg.canvasWidth" />\n' +
    '	</div>\n' +
    '	<div class="form-group col-xs-1">\n' +
    '		<label>Height</label>\n' +
    '		<input class="form-control" type="number" step="10" ng-model="svg.canvasHeight" />\n' +
    '	</div>\n' +
    '	<div class="form-group col-xs-1">\n' +
    '		<label>Bubble: </label>\n' +
    '	</div>\n' +
    '	<div class="form-group col-xs-1">\n' +
    '		<label>width</label>\n' +
    '		<input class="form-control" type="number" step="10" ng-model="svg.balloon.width" />\n' +
    '	</div>\n' +
    '	<div class="form-group col-xs-1">\n' +
    '		<label>height</label>\n' +
    '		<input class="form-control" type="number" step="10" ng-model="svg.balloon.height" />\n' +
    '	</div>\n' +
    '	<div class="form-group col-xs-1">\n' +
    '		<label>x</label>\n' +
    '		<input class="form-control" type="number" step="10" ng-model="svg.balloon.x" />\n' +
    '	</div>\n' +
    '	<div class="form-group col-xs-1">\n' +
    '		<label>y</label>\n' +
    '		<input class="form-control" type="number" step="10" ng-model="svg.balloon.y" />\n' +
    '	</div>\n' +
    '	<div class="form-group col-xs-1">\n' +
    '		<label>Callout Point: </label>\n' +
    '	</div>\n' +
    '	<div class="form-group col-xs-1">\n' +
    '		<label>x</label>\n' +
    '		<input class="form-control" type="number" step="10" ng-model="svg.tail.x" />\n' +
    '	</div>\n' +
    '	<div class="form-group col-xs-1">\n' +
    '		<label>y</label>\n' +
    '		<input class="form-control" type="number" step="10" ng-model="svg.tail.y" />\n' +
    '	</div>\n' +
    '</div>\n' +
    '\n' +
    '<div class="row">\n' +
    '	<div class="form-group col-xs-4">\n' +
    '		<label>text</label>\n' +
    '		<input class="form-control" type="text" ng-model="svg.text" />\n' +
    '	</div>\n' +
    '</div>\n' +
    '\n' +
    '<div id="containment" class="row visuals">\n' +
    '	<div id="renderArea"></div>\n' +
    '	<div id="balloonControls"></div>\n' +
    '	<div id="tailControls"></div>\n' +
    '</div>\n' +
    '');
}]);
})();
