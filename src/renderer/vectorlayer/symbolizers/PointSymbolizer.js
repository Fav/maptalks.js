/**
 * @classdesc
 * Base symbolizer class for all the point type symbol styles.
 * @abstract
 * @class
 * @protected
 * @memberOf maptalks.symbolizer
 * @name PointSymbolizer
 * @extends {maptalks.symbolizer.CanvasSymbolizer}
 */
Z.symbolizer.PointSymbolizer = Z.symbolizer.CanvasSymbolizer.extend(/** @lends maptalks.symbolizer.PointSymbolizer */{
    get2DExtent: function () {
        var extent = new Z.PointExtent();
        var markerExtent = this.getMarkerExtent();
        var min = markerExtent.getMin(),
            max = markerExtent.getMax();
        var renderPoints = this._getRenderPoints()[0];
        for (var i = renderPoints.length - 1; i >= 0; i--) {
            var point = renderPoints[i];
            extent = extent.combine(new Z.PointExtent(point.add(min), point.add(max)));
        }
        return extent;
    },

    _getRenderPoints: function () {
        return this.geometry._getPainter()._getRenderPoints(this.getPlacement());
    },

    /**
     * Get container points to draw on Canvas
     * @return {maptalks.Point[]}
     */
    _getRenderContainerPoints: function () {
        var map = this.getMap(),
            points = this._getRenderPoints()[0],
            matrices = this.geometry._getPainter().getTransformMatrix(),
            matrix = matrices ? matrices['2d'] : null,
            scale = matrices ? matrices['scale'] : null,
            dxdy = this.getDxDy(),
            layerPoint = this.geometry.getLayer()._getRenderer()._extent2D.getMin();
        if (matrix) {
            dxdy = new Z.Point(dxdy.x / scale.x, dxdy.y / scale.y);
        }

        var containerPoints = Z.Util.mapArrayRecursively(points, function (point) {
            return point.substract(layerPoint)._add(dxdy);
        });
            if (matrix) {
            return matrix.applyToArray(containerPoints);
            }
        return containerPoints;
    },

    _getRotations: function () {
        return this._getRenderPoints()[1];
    }
});
