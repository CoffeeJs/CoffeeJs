var RenderJs = RenderJs || {};
RenderJs.Canvas = RenderJs.Canvas || {};

RenderJs.Canvas.Layer = function () {
    /*
     * Locals
     */
    var _self = this;
    var _initialized = false;
    var _animated = false;
    var _eventManager = new EventManager();
    var _time = 0;
    var _imaginaryCtx = null;

    //
    //Click internal event handler 
    var _clickHandler = function (event, position) {
        var position = position || Utils.getMousePos(event.target, event);
        _eventManager.trigger(RenderJs.Canvas.Events.click, [event, position]);
        for (var i = this.shapes.length - 1; i >= 0; i--) {
            if (this.shapes[i].pointIntersect(position)) {
                this.shapes[i].trigger(RenderJs.Canvas.Events.click, event)
                return true;
            }
        }
        if (this.prev)
            $(this.prev.canvas).trigger("click", position);
    }

    //
    //Mousemove internal event handler 
    var _mousemoveHandler = function (event, position) {
        var position = position || Utils.getMousePos(event.target, event);
        _eventManager.trigger(RenderJs.Canvas.Events.mousemove, [event, position]);
        for (var i = this.shapes.length - 1; i >= 0; i--) {
            if (this.shapes[i].pointIntersect(position)) {
                this.shapes[i].trigger(RenderJs.Canvas.Events.mousemove, [event, position])
                return true;
            }
        }
        if (this.prev)
            $(this.prev.canvas).trigger("mousemove", position);
    }

    //
    //Mouseenter internal event handler 
    var _mouseenterHandler = function (event, position) {
        var position = position || Utils.getMousePos(event.target, event);
        _eventManager.trigger(RenderJs.Canvas.Events.mouseenter, [event, position]);
        for (var i = this.shapes.length - 1; i >= 0; i--) {
            if (this.shapes[i].pointIntersect(position)) {
                this.shapes[i].trigger(RenderJs.Canvas.Events.mouseenter, [event, position])
                return true;
            }
        }
        if (this.prev)
            $(this.prev.canvas).trigger("mouseenter", position);
    }

    //
    //Mouseleave internal event handler 
    var _mouseleaveHandler = function (event, position) {
        var position = position || Utils.getMousePos(event.target, event);
        _eventManager.trigger(RenderJs.Canvas.Events.mouseleave, [event, position]);
        for (var i = this.shapes.length - 1; i >= 0; i--) {
            if (this.shapes[i].pointIntersect(position)) {
                this.shapes[i].trigger(RenderJs.Canvas.Events.mouseleave, [event, position])
                return true;
            }
        }
        if (this.prev)
            $(this.prev.canvas).trigger("mouseleave", position);
    }

    //
    //Constructor
    this.init = function (container, width, height, active) {
        _imaginaryCtx = Utils.getCanvas(width, height).getContext("2d");
        document.getElementById(container).appendChild(this.canvas);
        this.canvas.width = width;
        this.canvas.height = height;
        this.active = active;
        //
        //Event wireups
        $(this.canvas).on("click", function (event, position) {
            _clickHandler.call(_self, event, position);
        });

        $(this.canvas).on("mousemove", function (event, position) {
            _mousemoveHandler.call(_self, event, position);
        });

        $(this.canvas).on("mouseenter", function (event, position) {
            _mouseenterHandler.call(_self, event, position);
        });

        $(this.canvas).on("mouseleave", function (event, position) {
            _mouseleaveHandler.call(_self, event, position);
        });

        return this;
    }

    //
    //IListItem implementation
    this.prev = null;
    this.next = null;

    //
    //Array of shapes on the layer
    this.shapes = [];
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.active = false;
    //
    //Subscribe to an event like animate, click, mousemove, mouseenter, mouseleave
    this.on = function (type, handler) {
        if (!RenderJs.Canvas.Events[type])
            return;
        return _eventManager.subscribe(type, handler);
    }

    //
    //Unsubscribe from an event like animate, click, mousemove, mouseenter, mouseleave
    this.off = function (type, id) {
        if (!RenderJs.Canvas.Events[type])
            return;
        _eventManager.unsubscribe(type, id);
    }

    //
    //Add a shape object to the layer, it will be rendered on this layer
    this.addShape = function (shape) {
        if (!(shape instanceof RenderJs.Canvas.Shape)) {
            console.log("An object on the canvas should be inherited from CanvasObject!");
            return;
        }
        shape.layer = this;
        this.shapes.push(shape);
    }

    //
    //Returns true if the layer has sprite objects otherwise false
    var hasSprites = function () {
        for (var i = 0, length = this.shapes.length; i < length; i++) {
            if (this.shapes[i] instanceof RenderJs.Canvas.Shapes.Sprite)
                return true;
        }
        return false;
    }

    //
    //Redraw objects on tha layer if it's neccessary
    this.drawShapes = function (frame) {
        if ((_initialized && !_eventManager.hasSubscribers('animate') && !hasSprites()) || this.shapes.length == 0) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        _eventManager.trigger("animate", frame);
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
                    if (this.shapes[i].pixelCollision(collisionObjects[k], _imaginaryCtx)) {
                        this.shapes[i]._eventManager.trigger(RenderJs.Canvas.Events.collision, collisionObjects[k]);
                        collisionObjects[k]._eventManager.trigger(RenderJs.Canvas.Events.collision, this.shapes[i]);
                    }
                }
            }
        }
        if (shapesLoaded)
            _initialized = true;
        _time += 1000 / frame;
    }
}.implements(IListItem);

