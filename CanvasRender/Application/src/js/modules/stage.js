var RenderJs = RenderJs || {};
RenderJs.Canvas = RenderJs.Canvas || {};

RenderJs.Canvas.Stage = function (options) {
    var self = this;
    var options = options || {};
    /*
     * Locals
     */
    var _container = options.container || "viewport";
    var _FPS = 60;
    var _eventManager = new EventManager();
    var _stats = new Stats();
    _stats.setMode(0);

    var init = function () {
        //
        //Set stats
        _stats.domElement.style.position = 'absolute';
        _stats.domElement.style.left = '0px';
        _stats.domElement.style.top = '0px';

        document.body.appendChild(_stats.domElement);

        document.getElementById(_container).style.width = self.width + "px";
        document.getElementById(_container).style.height = self.height + "px";
        
        self.invalidate();
    }

    this.invalidate = function () {
        _stats.begin();
        var enumerator = self.layers.getEnumerator();
        while (enumerator.next() != undefined) {
            enumerator.current().drawShapes(_FPS);
        }
        requestAnimationFrame(self.invalidate);
        _stats.end();
    };

    this.refreshFps = function (ctx) {
        var fps = Utils.getFps(_FPS);
        var x = 1200 - 100;
        var y = 20;
        ctx.clearRect(x, y, 100, 50);
        ctx.fillStyle = "#A1A892";
        ctx.font = "bold 10pt Verdana";
        ctx.fillText("FPS: " + fps.toFixed(1), x + 10, y + 10);
    }

    this.onInvalidate = function (handler) {
        _eventManager.subscribe("onInvalidate", handler);
    }
    this.layers = new LinkedList();
    this.width = options.width || 1200;
    this.height = options.height || 800;

    this.createLayer = function (name) {
        var layer = new RenderJs.Canvas.Layer(_container, this.width, this.height, name);
        this.layers.append(layer);

        return layer;
    }
   
    init();
}