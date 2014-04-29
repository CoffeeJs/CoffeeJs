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
        _layers = [];
        $("canvas", "#viewport").remove();
        $("#viewport").width(width);
        $("#viewport").height(height);
        for (var i = 0, l = Math.ceil(_objects.length / 5000) ; i < l; i++) {
            var canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            _layers.push({
                ctx: canvas.getContext("2d"),
                objects: _objects.slice(i * 5000, (i + 1) * 5000)
            });
            $("#viewport").append(canvas);
        }
    };

    this.invalidate = function () {
        //var rect = self.getRect();
        //var modifiedObjects = _objects.filter(function (item) {
        //    item.setTransformations(ctx, _FPS);
        //    return item.invalid && item.rectIntersect(rect);
        //});
        //updateGrid(_objects);
        for (var i = 0; i < _layers.length; i++) {
            var layer = _layers[i];
            var ctx = layer.ctx;
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            if (i == 0)
                self.refreshFps(ctx);

            for (var j = 0, l = layer.objects.length; j < l; j++) {
                layer.objects[j].setTransformations(ctx, _FPS);
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
        createLayers();
    };

    this.render = function () {
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
