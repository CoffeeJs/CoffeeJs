var RenderJs = RenderJs || {};
RenderJs.Canvas = RenderJs.Canvas || {};

RenderJs.Canvas.Stage = Class.extend({
    init: function (options) {
        this._container = options.container || "viewport";
        this._FPS = 60;
        this._eventManager = new EventManager();
        this._stats = new Stats();
        this._stats.setMode(0);
        this.layers = new LinkedList();
        this.width = options.width || 1200;
        this.height = options.height || 800;
        //
        //Set stats
        this._stats.domElement.style.position = 'absolute';
        this._stats.domElement.style.left = '0px';
        this._stats.domElement.style.top = '0px';
        document.body.appendChild(this._stats.domElement);

        document.getElementById(this._container).style.width = this.width + "px";
        document.getElementById(this._container).style.height = this.height + "px";

        this.invalidate();
    },
    invalidate: function () {
        var self = this;
        this._stats.begin();
        var enumerator = this.layers.getEnumerator();
        while (enumerator.next() != undefined) {
            enumerator.current().drawShapes(this._FPS);
        }

        requestAnimationFrame(function () { self.invalidate(); });
        this._stats.end();
    },
    refreshFps: function (ctx) {
        var fps = Utils.getFps(_FPS);
        var x = 1200 - 100;
        var y = 20;
        ctx.clearRect(x, y, 100, 50);
        ctx.fillStyle = "#A1A892";
        ctx.font = "bold 10pt Verdana";
        ctx.fillText("FPS: " + fps.toFixed(1), x + 10, y + 10);
    },
    createLayer: function (name) {
        var layer = new RenderJs.Canvas.Layer(this._container, this.width, this.height, name);
        this.layers.append(layer);

        return layer;
    },
    onInvalidate: function (handler) {
        this._eventManager.subscribe("onInvalidate", handler);
    }
});