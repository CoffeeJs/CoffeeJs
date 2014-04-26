/*
*Represents a base class for different type of shapes
*/
var Shape = Class.extend({
    /*
    *Constructor
    */
    init: function (x, y, width, height) {

        this._transformation = [];
        this.position = Point(x, y);
        this.width = width;
        this.height = height;
        this.angle = 0;
        this.scale = { width: 1, height: 1 };
    },
    /*
    *Returns with the center point of the shape
    */
    getCenter: function () {
        var rect = this.getRect();
        return Point(rect.x + (rect.width) / 2, rect.y + (rect.height) / 2);
    },
    /*
    *Returns with the rect around the shape
    */
    getRect: function () {
        return Rect(this.position.x, this.position.y, this.width, this.height);
    },
    /*
    *Check if the shape is on the canvas and it needs to draw or not
    *-canvasRect is a Rect object with x, y, width, height
    */
    isOnCanvas: function (canvasRect) {
        var rect = this.getRect();
        return !(canvasRect.left() > rect.right() ||
                 canvasRect.right() < rect.left() ||
                 canvasRect.top() > rect.bottom() ||
                 canvasRect.bottom() < rect.top());
    },

    /*
    *Move the shape with the given distances in pixels, during the time
    *-dX move horizontally
    *-dY move vertically
    *-t animation time
    */
    moveShape: function (dX, dY, t) {
        var self = this;
        var orig = Point(0, 0);
        if (this._transformation.filter(function (item) { return item.type == transformationType.move; }).length === 0)
            this._transformation.push({
                type: transformationType.move,
                transform: function (ctx, fps) {
                    var d = Point(dX / (t / fps), dY / (t / fps));
                    if (orig.x <= Math.abs(dX))
                        self.position.x += d.x;
                    if (orig.y <= Math.abs(dY))
                        self.position.y += d.y;
                    orig.x += Math.abs(d.x);
                    orig.y += Math.abs(d.y);
                }
            });
    },

    /*
    *Rotate the shape to the given degree, during the time
    *-deg rotation angle
    *-t animation time
    */
    rotateShape: function (deg, time) {
        var self = this;
        var time = time || 50;
        var angle = 0;
        if (this._transformation.filter(function (item) { return item.type == transformationType.rotate; }).length === 0)
            this._transformation.push({
                type: transformationType.rotate,
                transform: function (ctx, fps) {
                    var dDeg = deg / (time / fps);
                    var rotAngle = self.angle;
                    if (angle <= Math.abs(deg))
                        rotAngle += dDeg;
                    var o = self.getCenter();
                    ctx.translate(o.x, o.y);
                    ctx.rotate(Utils.convertToRad(rotAngle));
                    ctx.translate(-o.x, -o.y);
                    self.angle = rotAngle;
                    angle += Math.abs(dDeg);
                }
            });
    },

    /*
    *Scale the shape with the given width and height, during the time
    *-width scale horizontally ratio integer 1 is 100%
    *-height scale vertically ratio integer 1 is 100%
    *-t animation time
    */
    scaleShape: function (width, height, time) {
        var self = this;
        var time = time || 50;
        if (this._transformation.filter(function (item) { return item.type == transformationType.scale; }).length === 0)
            this._transformation.push({
                type: transformationType.scale,
                transform: function (ctx, fps) {
                    var dWidth = width / (time / fps);
                    var dHeight = height / (time / fps);
                    var scaleWidth = self.scale.width;
                    var scaleHeight = self.scale.height;
                    if (self.scale.width <= width)
                        scaleWidth += dWidth;
                    if (self.scale.height <= height)
                        scaleHeight += dHeight;

                    var o = self.getCenter();
                    ctx.translate(o.x, o.y);
                    ctx.scale(scaleWidth, scaleHeight);
                    ctx.translate(-o.x, -o.y);
                    self.scale = { width: scaleWidth, height: scaleHeight };
                }
            });
    }
});