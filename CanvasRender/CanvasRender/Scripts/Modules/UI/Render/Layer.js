var RenderJs = RenderJs || {};
RenderJs.Canvas = RenderJs.Canvas || {};

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

    this.getContext = function () {
        return ctx;
    }

    this.getShapes = function () {
        return _shapes;
    }

    this.drawShapes = function (frame) {
        if ((_initialized && !_animated) || _shapes.length == 0) return;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        eventManager.trigger("animate", frame);
        var shapesLoaded = true;
        for (var i = 0, length = _shapes.length; i < length; i++) {
            if (!_shapes[i].loaded)
                shapesLoaded = false;
            _shapes[i].draw(ctx);
        }
        if (shapesLoaded)
            _initialized = true;
    }


}