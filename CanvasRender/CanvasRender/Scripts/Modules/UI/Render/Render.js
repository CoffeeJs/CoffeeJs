var RenderJs = RenderJs || {};
RenderJs.Canvas = RenderJs.Canvas || {};

RenderJs.Canvas.Stage = function (options) {
    var self = this;
    var options = options || {};
    /*
     * Locals
     */
    var _container = options.container || "viewport";
    var _layers = [];

    /*
     * Imaginary layer
     */
    var _icanvas = document.createElement("canvas");
    var _ictx = _icanvas.getContext("2d");

    var _render = new RenderJs.Canvas.Render(this);

    var init = function () {
        document.getElementById(_container).style.width = self.width + "px";
        document.getElementById(_container).style.height = self.height + "px";
        _icanvas.width = this.width;
        _icanvas.height = this.height;
        _render.render();
    }

    this.width = options.width || 1200;
    this.height = options.height || 800;

    this.createLayer = function () {
        var layer = new RenderJs.Canvas.Layer(_container, this.width, this.height);
        _layers.push(layer);

        return layer;
    }
    this.getImagiaryCtx = function () {
        return ictx;
    }
    this.getLayers = function () { return _layers }

    init();
}

RenderJs.Canvas.Render = function (stage) {
    var self = this;

    var _FPS = 50;
    var _events = { onInvalidate: "onInvalidate", onClick: "onClick" };
    var eventManager = new EventManager();

    var _stage = stage;

    this.getFps = function () {
        return Utils.getFps(_FPS) || _FPS;
    }

    this.invalidate = function () {
        var layers = _stage.getLayers();
        for (var i = 0; i < layers.length; i++) {
            layers[i].drawShapes(_FPS);

            //if (layer.isStatic)
            //    if (!layer.invalid)
            //        continue;
            //    else
            //        layer.invalid = false;

            //var ctx = layer.ctx;
            //ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            //if (i == 1)
            //    self.refreshFps(ctx);

            //for (var j = 0, l = layer.objects.length; j < l; j++) {
            //    layer.objects[j].setTransformations(ctx, _FPS);
            //}
            ////updateLayers();
            //for (var j = 0, l = layer.objects.length; j < l; j++) {
            //    layer.objects[j].draw(ctx, _FPS);
            //    var items = [];
            //    for (var k = j + 1; k < l; k++) {
            //        //if (layer.objects[j].rectIntersect(layer.objects[k].getRect()))
            //        items.push(layer.objects[k]);
            //    }
            //    //
            //    //Collision detection
            //    for (var k = 0; k < items.length; k++) {
            //        var colision = 0;//layer.objects[j].pixelCollision(layer.objects[k], ictx);
            //    }
            //}
        }
        requestAnimationFrame(self.invalidate);
    };

    this.refreshFps = function (ctx) {
        var fps = Utils.getFps(_FPS);
        var x = width - 100;
        var y = 20;
        ctx.fillStyle = "#A1A892";
        ctx.font = "bold 10pt Verdana";
        ctx.fillText("FPS: " + fps.toFixed(1), x + 10, y + 10);
    }

    this.onInvalidate = function (handler) {
        eventManager.subscribe(_events.onInvalidate, handler);
    }

    this.render = function () {
        self.invalidate();
    }
}

RenderJs.Canvas.Layer = function (container, width, height) {
    var _shapes = [];
    var _initialized = false;
    var _animated = false;

    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var eventManager = new EventManager();

    canvas.width = width;
    canvas.height = height;
    document.getElementById(container).appendChild(canvas);

    this.onAnimate = function (handler) {
        eventManager.subscribe("animate", handler);
        _animated = true;
    }

    this.offAnimate = function (handler) {
        eventManager.unsubscribe("animate", handler);
        _animated = false;
    }

    this.addShape = function (shape) {
        if (!(shape instanceof RenderJs.Canvas.Shape)) {
            console.log("An object on the canvas should be inherited from CanvasObject!");
            return;
        }
        _shapes.push(shape);
    }

    this.getCanvas = function () {
        return canvas;
    }

    this.getShapes = function () {
        return _shapes;
    }

    this.drawShapes = function (frame) {
        if (_initialized && !_animated) return;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        eventManager.trigger("animate", frame);

        for (var i = 0, length = _shapes.length; i < length; i++) {
            _shapes[i].draw(ctx);
        }

        _initialized = true;
    }


}

RenderJs.Point = function (x, y) {
    return {
        x: x || 0,
        y: y || 0,
        equalsTo: function (p) {
            return x === p.x && y === p.y;
        }
    };
}

RenderJs.Rect = function (x, y, width, height) {
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

var transformationType = { rotate: "rotate", scale: "scale", move: "move" };