var RenderCanvas = function (width, height) {
    var self = this;

    var _FPS = 50;
    var _objects = [];
    var _events = { onInvalidate: "onInvalidate", onClick: "onClick" };
    var eventManager = new EventManager();
    var _layers = [];
    //var getMousePos = function (canvas, evt) {
    //    var rect = canvas.getBoundingClientRect();
    //    return {
    //        x: evt.clientX - rect.left,
    //        y: evt.clientY - rect.top
    //    };
    //}

    //for (var i = 0; i < _buffers.length; i++) {
    //    _buffers[i].onclick = function (event) {
    //        for (var i = _objects.length - 1; i >= 0; i--) {
    //            if (_objects[i].pointIntersect(getMousePos(event.target, event))) {
    //                eventManager.trigger(_events.onClick, {
    //                    position: getMousePos(event.target, event),
    //                    object: _objects[i]
    //                });
    //                return;
    //            }
    //        }
    //    };
    //}

    this.getFps = function () {
        return Utils.getFps(_FPS) || _FPS;
    }

    this.getRect = function () {
        return Rect(0, 0, _buffers[0].width, _buffers[0].height);
    }

    var createLayers = function () {
        $("#viewport").width(width);
        $("#viewport").height(height);
        $("canvas", "#viewport").remove();
        var canvas0 = document.createElement("canvas");
        canvas0.id = "static";
        var staticLayer = {
            invalid: true,
            isStatic: true,
            ctx: canvas0.getContext("2d"),
            objects: []
        };
        canvas0.width = width;
        canvas0.height = height;
        $("#viewport").append(canvas0);

        var canvas1 = document.createElement("canvas");
        canvas1.id = "dynamic";
        var dynamicLayer = {
            isStatic: false,
            ctx: canvas1.getContext("2d"),
            objects: []
        };
        canvas1.width = width;
        canvas1.height = height;
        $("#viewport").append(canvas1);

        for (var i = 0, l = _objects.length; i < l; i++) {
            var obj = _objects[i];
            if (obj.invalid) {
                dynamicLayer.objects.push(obj);
            } else
                staticLayer.objects.push(obj);
        }
        _layers = [staticLayer, dynamicLayer];
    };

    var updateLayers = function () {
        var staticLayer = _layers[0];
        var dynamicLayer = _layers[1];
        for (var j = 0; j < staticLayer.objects.length; j++) {
            var obj = staticLayer.objects[j];
            if (obj.invalid) {
                dynamicLayer.objects.push(obj);
                staticLayer.objects.splice(j, 1);
                j--;
            }
        }
        for (var j = 0; j < dynamicLayer.objects.length; j++) {
            var obj = dynamicLayer.objects[j];
            if (!obj.invalid) {
                staticLayer.objects.push(obj);
                dynamicLayer.objects.splice(j, 1);
                j--;
                staticLayer.invalid = true;
            }
        }
    }
    this.invalidate = function () {
        for (var i = 0; i < _layers.length; i++) {
            var layer = _layers[i];
            if (layer.isStatic)
                if (!layer.invalid)
                    continue;
                else
                    layer.invalid = false;

            var ctx = layer.ctx;
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            if (i == 1)
                self.refreshFps(ctx);

            for (var j = 0, l = layer.objects.length; j < l; j++) {
                layer.objects[j].setTransformations(ctx, _FPS);
            }
            updateLayers();
            for (var j = 0, l = layer.objects.length; j < l; j++) {
                layer.objects[j].draw(ctx, _FPS);
            }
        }
        eventManager.trigger(_events.onInvalidate, {
            context: ctx,
            fps: _FPS
        });
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

    this.onClick = function (handler) {
        eventManager.subscribe(_events.onClick, handler);
    }

    this.addObject = function (obj) {
        if (!(obj instanceof Shape)) {
            console.log("An object on the canvas should be inherited from CanvasObject!");
            return;
        }
        _objects.push(obj);
    };

    this.render = function () {
        createLayers();
        self.invalidate();
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

var transformationType = { rotate: "rotate", scale: "scale", move: "move" };