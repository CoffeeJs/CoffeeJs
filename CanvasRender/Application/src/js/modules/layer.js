var RenderJs = RenderJs || {};
RenderJs.Canvas = RenderJs.Canvas || {};

RenderJs.Canvas.Layer = ListNode.extend({
    _initialized: false,
    _animated: false,
    _eventManager: new EventManager(),
    _time: 0,
    //
    //Click internal event handler 
    _clickHandler: function (event, position) {
        var position = position || Utils.getMousePos(event.target, event);
        this._eventManager.trigger(RenderJs.Canvas.Events.click, [event, position]);
        for (var i = this.shapes.length - 1; i >= 0; i--) {
            if (this.shapes[i].pointIntersect(position)) {
                this.shapes[i]._eventManager.trigger(RenderJs.Canvas.Events.click, event)
                return true;
            }
        }
        if (this.prev)
            $(this.prev.canvas).trigger("click", position);
    },
    //
    //Mousemove internal event handler 
    _mousemoveHandler: function (event, position) {
        var position = position || Utils.getMousePos(event.target, event);
        this._eventManager.trigger(RenderJs.Canvas.Events.mousemove, [event, position]);
        for (var i = this.shapes.length - 1; i >= 0; i--) {
            if (this.shapes[i].pointIntersect(position)) {
                this.shapes[i]._eventManager.trigger(RenderJs.Canvas.Events.mousemove, [event, position])
                return true;
            }
        }
        if (this.prev)
            $(this.prev.canvas).trigger("mousemove", position);
    },
    //
    //Mouseenter internal event handler 
    _mouseenterHandler: function (event, position) {
        var position = position || Utils.getMousePos(event.target, event);
        this._eventManager.trigger(RenderJs.Canvas.Events.mouseenter, [event, position]);
        for (var i = this.shapes.length - 1; i >= 0; i--) {
            if (this.shapes[i].pointIntersect(position)) {
                this.shapes[i]._eventManager.trigger(RenderJs.Canvas.Events.mouseenter, [event, position])
                return true;
            }
        }
        if (this.prev)
            $(this.prev.canvas).trigger("mouseenter", position);
    },
    //
    //Mouseleave internal event handler 
    _mouseleaveHandler: function (event, position) {
        var position = position || Utils.getMousePos(event.target, event);
        this._eventManager.trigger(RenderJs.Canvas.Events.mouseleave, [event, position]);
        for (var i = this.shapes.length - 1; i >= 0; i--) {
            if (this.shapes[i].pointIntersect(position)) {
                this.shapes[i]._eventManager.trigger(RenderJs.Canvas.Events.mouseleave, [event, position])
                return true;
            }
        }
        if (this.prev)
            $(this.prev.canvas).trigger("mouseleave", position);
    },
    //
    //Constructor
    init: function (container, width, height, active) {
        var self = this;
        this._imaginaryCtx = Utils.getCanvas(width, height).getContext("2d");
        this.active = active || false;
        this.shapes = [];
        this.canvas = document.createElement("canvas");
        document.getElementById(container).appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = width;
        this.canvas.height = height;

        //
        //Event wireups
        $(this.canvas).on("click", function (event, position) {
            self._clickHandler(event, position);
        });

        $(this.canvas).on("mousemove", function (event, position) {
            self._mousemoveHandler(event, position);
        });

        $(this.canvas).on("mouseenter", function (event, position) {
            self._mouseenterHandler(event, position);
        });

        $(this.canvas).on("mouseleave", function (event, position) {
            self._mouseleaveHandler(event, position);
        });
    },
    //
    //Subscribe to an event like animate, click, mousemove, mouseenter, mouseleave
    on: function (type, handler) {
        if (!RenderJs.Canvas.Events[type])
            return;
        return this._eventManager.subscribe(type, handler);
    },
    //
    //Unsubscribe from an event like animate, click, mousemove, mouseenter, mouseleave
    off: function (type, id) {
        if (!RenderJs.Canvas.Events[type])
            return;
        this._eventManager.unsubscribe(type, id);
    },
    //
    //Add a shape object to the layer, it will be rendered on this layer
    addShape: function (shape) {
        if (!(shape instanceof RenderJs.Canvas.Shape)) {
            console.log("An object on the canvas should be inherited from CanvasObject!");
            return;
        }
        shape.layer = this;
        this.shapes.push(shape);
    },
    //
    //Returns true if the layer has sprite objects otherwise false
    hasSprites: function () {
        for (var i = 0, length = this.shapes.length; i < length; i++) {
            if (this.shapes[i] instanceof RenderJs.Canvas.Shapes.Sprite)
                return true;
        }
        return false;
    },
    //
    //Redraw objects on tha layer if it's neccessary
    drawShapes: function (frame) {
        if ((this._initialized && !this._eventManager.hasSubscribers('animate') && !this.hasSprites()) || this.shapes.length == 0) return;

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
            var collisionObjects = [];
            for (var j = 0, jl = this.shapes.length; j < jl; j++) {
                if (this.shapes[j].collision && i != j)
                    collisionObjects.push(this.shapes[j]);
            }

            if (this.shapes[i].collision) {
                for (var k = 0, kl = collisionObjects.length; k < kl; k++) {
                    if (this.shapes[i].pixelCollision(collisionObjects[k], this._imaginaryCtx)) {
                        this.shapes[i]._eventManager.trigger(RenderJs.Canvas.Events.collision, collisionObjects[k]);
                        collisionObjects[k]._eventManager.trigger(RenderJs.Canvas.Events.collision, this.shapes[i]);
                    }
                }
            }
        }
        if (shapesLoaded)
            this._initialized = true;
        this._time += 1000 / frame;
    }
});

