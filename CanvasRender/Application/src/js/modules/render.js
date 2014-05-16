var RenderJs = RenderJs || {};
RenderJs.Canvas = RenderJs.Canvas || {};

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
        var enumerator = _stage.layers.getEnumerator();
        while (enumerator.next() != undefined) {
            enumerator.current().drawShapes(_FPS);
            //if (i == 0)
            //    self.refreshFps(layers[i].getContext());
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
        var x = 1200 - 100;
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