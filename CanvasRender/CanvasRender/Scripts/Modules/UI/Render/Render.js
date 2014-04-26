var RenderCanvas = function (buffers) {
    var self = this;

    var _FPS = 50;
    var _objects = [];
    var _buffers = buffers;
    var _events = { onInvalidate: "onInvalidate" };
    var eventManager = new EventManager();

    this.getRect = function () {
        return Rect(0, 0, _buffers[0].width, _buffers[0].height);
    }

    this.getContext = (function () {
        var aktBuffer = 0;

        return function (buffering) {
            if (buffering === true) {
                _buffers[1 - aktBuffer].style.visibility = 'hidden';
                _buffers[aktBuffer].style.visibility = 'visible';

                aktBuffer = 1 - aktBuffer;
            }

            return _buffers[aktBuffer].getContext("2d");
        }
    }());

    this.invalidate = function () {
        var ctx = self.getContext(true);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        for (var i = 0, l = _objects.length; i < l; i++) {
            if (_objects[i].isOnCanvas(self.getRect()))
                _objects[i].draw(ctx, _FPS);
        }
        eventManager.trigger(_events.onInvalidate, {
            context: ctx,
            fps: _FPS
        });
    };

    this.onInvalidate = function (handler) {
        eventManager.subscribe(_events.onInvalidate, handler);
    }

    this.addObject = function (obj) {
        if (!(obj instanceof Shape)) {
            console.log("An object on the canvas should be inherited from CanvasObject!");
            return;
        }
        _objects.push(obj);
        _invalid = true;
    };

    this.render = function () {
        setInterval(function () {
            self.invalidate();
        }, 1000 / _FPS);
    }
}

function Point(x, y) {
    return {
        x: x || 0,
        y: y || 0,
        equalsTo: function (p) {
            return x === p.x && y === p.y;
        }
    };
}

function Rect(x, y, width, height) {
    return {
        x: x,
        y: y,
        width: width,
        height: height,
        left: function () {
            return x;
        },
        right: function () {
            return x + width;
        },
        top: function () {
            return y;
        },
        bottom: function () {
            return y + height;
        }
    }
}

var transformationType = { rotate: "rotate", scale: "scale" };

var Shape = Class.extend({
    init: function (x, y, width, height) {

        this._transformation = [];
        this.position = Point(x, y);
        this.width = width;
        this.height = height;
        this.angle = 0;
        this.scale = { width: 1, height: 1 };
    },
    getCenter: function () {
        var rect = this.getRect();
        return Point(rect.x + (rect.width) / 2, rect.y + (rect.height) / 2);
    },
    getRect: function () {
        return Rect(this.position.x, this.position.y, this.width, this.height);
    },
    isOnCanvas: function (canvasRect) {
        var rect = this.getRect();
        return !(canvasRect.left() > rect.right() ||
                 canvasRect.right() < rect.left() ||
                 canvasRect.top() > rect.bottom() ||
                 canvasRect.bottom() < rect.top());
    },

    rotateShape: function (deg, time) {
        var self = this;
        var time = time || 50;
        if (this._transformation.filter(function (item) { return item.type == transformationType.rotate; }).length === 0)
            this._transformation.push({
                type: transformationType.rotate,
                transform: function (ctx, fps) {
                    var dDeg = deg / (time / fps);
                    var rotAngle = self.angle;
                    if (self.angle <= deg)
                        rotAngle += dDeg;
                    var o = self.getCenter();
                    ctx.translate(o.x, o.y);
                    ctx.rotate(Utils.convertToRad(rotAngle));
                    ctx.translate(-o.x, -o.y);
                    self.angle = rotAngle;
                }
            });
    },
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
