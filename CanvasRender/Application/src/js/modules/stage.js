var RenderJs = RenderJs || {};
RenderJs.Canvas = RenderJs.Canvas || {};

RenderJs.Canvas.Stage = function (options) {
    
    /*
     * Locals
     */
    var _container = "viewport";
    var _FPS = 60;
    var _eventManager = new EventManager();
    var _stats = new Stats();

    var invalidate = function () {
        var self = this;
        _stats.begin();
        var enumerator = this.layers.getEnumerator();
        while (enumerator.next() != undefined) {
            enumerator.current().drawShapes(_FPS);
        }

        requestAnimationFrame(function () { invalidate.call(self); });
        _stats.end();
    }

    this.layers = new LinkedList();
    this.width = 1200;
    this.height = 800;

    this.init = function () {
        _container = options.container || "viewport";
        _stats.setMode(0);
        this.width = options.width || 1200;
        this.height = options.height || 800;
        //
        //Set stats
        _stats.domElement.style.position = 'absolute';
        _stats.domElement.style.left = '0px';
        _stats.domElement.style.top = '0px';
        document.body.appendChild(_stats.domElement);

        document.getElementById(_container).style.width = this.width + "px";
        document.getElementById(_container).style.height = this.height + "px";

        invalidate.call(this);
    }
    
    this.onInvalidate = function (handler) {
        _eventManager.subscribe("onInvalidate", handler);
    }

    this.createLayer= function (active) {
        var layer = new RenderJs.Canvas.Layer().init(_container, this.width, this.height, active);
        this.layers.append(layer);

        return layer;
    }

    this.init();
}