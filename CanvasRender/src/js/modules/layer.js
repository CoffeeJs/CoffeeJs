var RenderJs = RenderJs || {};
RenderJs.Canvas = RenderJs.Canvas || {};

RenderJs.Canvas.Layer = function (container, width, height) {
    var _shapes = [];
    var _initialized = false;
    var _animated = false;

    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var eventManager = new EventManager();

    var getMousePos = function (canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    var init = function () {
        canvas.width = width;
        canvas.height = height;
        document.getElementById(container).appendChild(canvas);
    }

    this.layerClick = function () {
        for (var i = _shapes.length - 1; i >= 0; i--) {
            if (_shapes[i].pointIntersect(getMousePos(event.target, event))) {
                eventManager.trigger(RenderJs.Canvas.Events.click, [_shapes[i], event]);
                _shapes[i].eventManager.trigger(RenderJs.Canvas.Events.click, event)
                return true;
            }
        }
    }

    this.subscribeDomClick = function (handler) {
        canvas.onclick = handler;
    }

    this.unsubscribeDomClick = function () {
        canvas.onclick = null;
    }

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
        shape.layer = this;
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

    this.hasSprites = function () {
        for (var i = 0, length = _shapes.length; i < length; i++) {
            if (_shapes[i] instanceof RenderJs.Canvas.Shapes.Sprite)
                return true;
        }
        return false;
    }

    var time = 0;

    this.drawShapes = function (frame) {
        if ((_initialized && !_animated && !this.hasSprites()) || _shapes.length == 0) return;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        eventManager.trigger("animate", frame);
        var shapesLoaded = true;
        for (var i = 0, length = _shapes.length; i < length; i++) {
            if (!_shapes[i].loaded)
                shapesLoaded = false;
            _shapes[i].draw(ctx, {
                frameRate: frame,
                lastTime: time,
                time: time + 1000 / frame
            });
        }
        if (shapesLoaded)
            _initialized = true;
        time += 1000 / frame;
    }

    this.on = function (type, handler) {
        if (!RenderJs.Canvas.Events[type])
            return;
        this.eventManager.subscribe(type, handler);
    }

    this.off = function (type, handler) {
        if (!RenderJs.Canvas.Events[type])
            return;
        this.eventManager.unsubscribe(type, handler);
    }

    init();
}