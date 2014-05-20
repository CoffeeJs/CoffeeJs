var RenderJs = RenderJs || {};
RenderJs.Canvas = RenderJs.Canvas || {};

RenderJs.Canvas.Layer = ListNode.extend({
    _initialized: false,
    _animated: false,
    _eventManager: new EventManager(),
    _time: 0,
    _layerClick: function (event, position) {
        var position = position || Utils.getMousePos(event.target, event);
        for (var i = this.shapes.length - 1; i >= 0; i--) {
            if (this.shapes[i].pointIntersect(position)) {
                this._eventManager.trigger(RenderJs.Canvas.Events.click, [this.shapes[i], event]);
                this.shapes[i].eventManager.trigger(RenderJs.Canvas.Events.click, event)
                return true;
            }
        }
        if (this.prev)
            $(this.prev.canvas).trigger("click", position);
    },
    init: function (container, width, height, name) {
        var self = this;
        this.name = name;
        this.shapes = [];
        this.canvas = document.createElement("canvas");
        this.canvas.id = name;
        document.getElementById(container).appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = width;
        this.canvas.height = height;
        $(this.canvas).on("click", function (event, position) {
            self._layerClick(event, position);
            event.preventDefault();
        });
    },
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
            //
            //Collision detection
            if (this.shapes[i].canCollide) {
                for (var j = 0, jl = this.shapes.length; j < jl; j++) {
                    if (this.shapes[j].canCollide && i != j)
                        var collision = this.shapes[j].pixelCollision(this.shapes[k], Utils.getCanvas(0, 0).getContext("2d"));
                }
            }
        }
        if (shapesLoaded)
            this._initialized = true;
        this._time += 1000 / frame;
    }
});