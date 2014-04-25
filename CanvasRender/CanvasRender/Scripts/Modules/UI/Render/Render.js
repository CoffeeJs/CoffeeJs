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
                _objects[i].draw(ctx);
            else
                ;
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
        if (!(obj instanceof CanvasObject)) {
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

function TransformationObject() {
    var self = this;

    this.angle = 0;

    this.rotateFunction = null;
    this.scaleFunction = null;

    this.rotate = function (deg) {
        self.rotateFunction = function (ctx, obj) {
            var o = obj.getCenter();
            ctx.translate(o.x, o.y);
            ctx.rotate(Utils.convertToRad(deg));
            ctx.translate(-o.x, -o.y);
            self.angle = deg;
        };
    }

    this.scale = function (width, height) {
        self.scaleFunction = function (ctx, obj) {
            var o = obj.getCenter();
            ctx.translate(o.x, o.y);
            ctx.scale(width, height);
            ctx.translate(-o.x, -o.y);
        }
    }
}

function CanvasObject() {

    this.position = Point(0, 0);
    this.width = 0;
    this.height = 0;

    this.getCenter = function () {

    }

    this.draw = function (ctx) {
    }

    this.destroy = function (ctx) {

    }


}

CanvasObject.prototype = new TransformationObject();
CanvasObject.prototype.constructor = CanvasObject;
