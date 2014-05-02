var RenderJs = RenderJs || {};
RenderJs.Canvas = RenderJs.Canvas || {};

RenderJs.Canvas.Stage = function (options) {
    var self = this;
    var options = options || {};
    /*
     * Locals
     */
    var _container = options.container || "viewport";
    var _layers = [];

    /*
     * Imaginary layer
     */
    var _icanvas = document.createElement("canvas");
    var _ictx = _icanvas.getContext("2d");

    var _render = new RenderJs.Canvas.Render(this);

    var init = function () {
        document.getElementById(_container).style.width = self.width + "px";
        document.getElementById(_container).style.height = self.height + "px";
        _icanvas.width = this.width;
        _icanvas.height = this.height;
        _render.render();
    }

    this.width = options.width || 1200;
    this.height = options.height || 800;

    this.createLayer = function () {
        var layer = new RenderJs.Canvas.Layer(_container, this.width, this.height);
        _layers.push(layer);

        return layer;
    }
    this.getImagiaryCtx = function () {
        return ictx;
    }
    this.getLayers = function () { return _layers }

    init();
}