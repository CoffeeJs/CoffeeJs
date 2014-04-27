/*
*Represents a base class for different type of shapes
*/
var Shape = Class.extend({
    /*
    *Constructor
    */
    init: function (x, y, width, height) {

        this._transformation = [];
        this.x = x
        this.y = y;
        this.width = width;
        this.height = height;
        this.angle = 0;
        this.scale = { width: 1, height: 1 };
    },
    /*
    *Returns with the center point of the shape
    */
    getCenter: function () {
        return Point(this.x + (this.width) / 2, this.y + (this.height) / 2);
    },
    /*
    *Returns with the rect around the shape
    */
    getRect: function () {
        return Rect(this.x, this.y, this.width, this.height);
    },
    /*
    *Check if the shape is intersect the given rect
    *-rect is a Rect object
    */
    rectIntersect: function (r) {
        var tw = this.width;
        var th = this.height;
        var rw = r.width;
        var rh = r.height;
        if (rw <= 0 || rh <= 0 || tw <= 0 || th <= 0) {
            return false;
        }
        var tx = this.x;
        var ty = this.y;
        var rx = r.x;
        var ry = r.y;
        rw += rx;
        rh += ry;
        tw += tx;
        th += ty;
        //overflow || intersect
        return ((rw < rx || rw > tx) &&
        (rh < ry || rh > ty) &&
        (tw < tx || tw > rx) &&
        (th < ty || th > ry));
    },
    /*
    *Check if the point is in the rect
    *-point
    */
    pointIntersect: function (point) {
        var rect = this.getRect();
        return (point.x >= rect.left() &&
            point.x <= rect.right() &&
            point.y >= rect.top() &&
            point.y <= rect.bottom());
    },
    /*
    *Move the shape with the given distances in pixels, during the time
    *-dX move horizontally
    *-dY move vertically
    *-f move function
    *-t animation time
    */
    moveShape: function (dX, dY, t, f) {
        var self = this;
        var orig = Point(0, 0);
        if (this._transformation.filter(function (item) { return item.type == transformationType.move; }).length === 0)
            this._transformation.push({
                type: transformationType.move,
                transform: function (ctx, fps) {
                    var d = Point(dX / (t / fps), dY / (t / fps));
                    if (orig.x <= Math.abs(dX))
                        self.x += d.x;
                    if (orig.y <= Math.abs(dY))
                        self.y += d.y;
                    orig.x += Math.abs(d.x);
                    orig.y += Math.abs(d.y);
                }
            });
    },

    /*
    *Move the shape with the given distances in pixels, during the time
    *-dX move horizontally
    *-dY move vertically
    *-f move function
    *-t animation time
    */
    movePath: function (f, t) {
        var self = this;
        if (this._transformation.filter(function (item) { return item.type == transformationType.move; }).length === 0)
            this._transformation.push({
                type: transformationType.move,
                transform: function (ctx, fps) {
                    var d = f(self.x, self.y, self.width, self.height, t, fps);
                    self.x = d.x;
                    self.y = d.y;
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