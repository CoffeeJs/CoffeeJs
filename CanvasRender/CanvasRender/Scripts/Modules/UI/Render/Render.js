var RenderCanvas = function (buffers) {
    var self = this;

    var _FPS = 50;
    var _objects = [];
    var _buffers = buffers;
    var _events = { onInvalidate: "onInvalidate", onClick: "onClick" };
    var eventManager = new EventManager();

    var gridCanvas = [];

    var fillGrid = function () {
        gridCanvas = [];
        var width = self.getCanvas().width / 4;
        var height = self.getCanvas().height / 4;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                gridCanvas.push({
                    rect: Rect(i * width, j * height, width, height),
                    items: []
                });
            }
        }
    }
    
    var updateGrid = function () {
        for (var k = 0; k < gridCanvas.length; k++) {
            gridCanvas[k].items = [];
        }

        for (var i = _objects.length - 1; i >= 0; i--) {
            var item = _objects[i];
            for (var j = gridCanvas.length - 1; j >= 0; j--) {
                if (item.rectIntersect(gridCanvas[j].rect)) {
                    gridCanvas[j].items.push(item);
                }
            }
        }
    }

    var getMousePos = function (canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    for (var i = 0; i < _buffers.length; i++) {
        _buffers[i].onclick = function (event) {
            for (var i = _objects.length - 1; i >= 0; i--) {
                if (_objects[i].pointIntersect(getMousePos(event.target, event))) {
                    eventManager.trigger(_events.onClick, {
                        position: getMousePos(event.target, event),
                        object: _objects[i]
                    });
                    return;
                }
            }
        };
    }



    this.getRect = function () {
        return Rect(0, 0, _buffers[0].width, _buffers[0].height);
    }

    this.getCanvas = (function () {
        var aktBuffer = 0;

        return function (buffering) {
            return _buffers[aktBuffer];

            //if (buffering === true) {
            //    _buffers[1 - aktBuffer].style.visibility = 'hidden';
            //    _buffers[1 - aktBuffer].style.zIndex = 0;
            //    _buffers[aktBuffer].style.visibility = 'visible';
            //    _buffers[aktBuffer].style.zIndex = 100;

            //    aktBuffer = 1 - aktBuffer;
            //}

            //return _buffers[aktBuffer];
        }
    }());

    this.invalidate = function () {
        var ctx = self.getCanvas(true).getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        this.drawFps(ctx);

        //for (var i = 0; i < gridCanvas.length; i++) {
        //    //if (_objects[i].rectIntersect(self.getRect()))
        //    for (var j = 0; j < gridCanvas[i].items.length; j++) {
        //        gridCanvas[i].items[j].draw(ctx, _FPS);
        //    }
        //}

        var l = _objects.length;
        while (l--) {
            _objects[l].draw(ctx, _FPS);
        }

        //for (var i = _objects.length - 1; i >= 0 ; i--) {
        //    //if (_objects[i].rectIntersect(self.getRect()))
        //    _objects[i].draw(ctx, _FPS);
        //}
        eventManager.trigger(_events.onInvalidate, {
            context: ctx,
            fps: _FPS
        });

        updateGrid();
    };

    this.drawFps = function (ctx) {
        var fps = Utils.getFps(_FPS);

        var x = self.getCanvas().width - 100;
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
        _invalid = true;
    };

    this.render = function () {
        fillGrid();
        setInterval(function () {
            self.invalidate();
        }, 1000 / _FPS);
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
