var RenderJs = RenderJs || {};
RenderJs.Canvas = RenderJs.Canvas || {};

RenderJs.Canvas.Layer = ListNode.extend({
    _initialized: false,
    _animated: false,
    _eventManager: new EventManager(),
    _time: 0,
    _layerClick: function (event) {
        for (var i = this.shapes.length - 1; i >= 0; i--) {
            if (this.shapes[i].pointIntersect(Utils.getMousePos(event.target, event))) {
                this._eventManager.trigger(RenderJs.Canvas.Events.click, [this.shapes[i], event]);
                this.shapes[i].eventManager.trigger(RenderJs.Canvas.Events.click, event)
                return true;
            }
        }
        if (this.prev)
            this.prev.canvas.click();
    },
    init: function (container, width, height) {
        var self = this;
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = width;
        this.canvas.height = height;
        document.getElementById(container).appendChild(this.canvas);
        this.canvas.addEventListener("click", function (event) {
            self._layerClick(event);
        });
    },
    canvas: document.createElement("canvas"),
    ctx: null,
    shapes: [],
    on: function (type, handler) {
        if (!RenderJs.Canvas.Events[type])
            return;
        this._eventManager.subscribe(type, handler);
    },
    off: function (type, handler) {
        if (!RenderJs.Canvas.Events[type])
            return;
        this._eventManager.unsubscribe(type, handler);
    },
    onAnimate: function (handler) {
        this._eventManager.subscribe("animate", handler);
        this._animated = true;
    },
    offAnimate: function (handler) {
        this._eventManager.unsubscribe("animate", handler);
        this._animated = false;
    },
    addShape: function (shape) {
        if (!(shape instanceof RenderJs.Canvas.Shape)) {
            console.log("An object on the canvas should be inherited from CanvasObject!");
            return;
        }
        shape.layer = this;
        this.shapes.push(shape);
    },
    hasSprites: function () {
        for (var i = 0, length = this.shapes.length; i < length; i++) {
            if (this.shapes[i] instanceof RenderJs.Canvas.Shapes.Sprite)
                return true;
        }
        return false;
    },
    drawShapes: function (frame) {
        if ((this._initialized && !this._animated && !this.hasSprites()) || this.shapes.length == 0) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this._eventManager.trigger("animate", frame);
        var shapesLoaded = true;
        for (var i = 0, length = this.shapes.length; i < length; i++) {
            if (!this.shapes[i].loaded)
                shapesLoaded = false;
            this.shapes[i].draw(this.ctx, {
                frameRate: frame,
                lastTime: this._time,
                time: this._time + 1000 / frame
            });
        }
        if (shapesLoaded)
            this._initialized = true;
        this._time += 1000 / frame;
    }
});