var RenderJs = RenderJs || {};
RenderJs.Canvas = RenderJs.Canvas || {};

RenderJs.Canvas.Stage = function (options) {
    var self = this;
    var options = options || {};
    /*
     * Locals
     */
    var _container = options.container || "viewport";

    /*
     * Imaginary layer
     */
    var _icanvas = document.createElement("canvas");
    var _ictx = _icanvas.getContext("2d");

    var _render = new RenderJs.Canvas.Render(this);

    var bubbleClick = function (index) {
        if (index < 0) return;
        var layer = this.layers[index];
        if (!layer.layerClick())
            bubbleClick(--index);
        return;
    }

    var init = function () {
        document.getElementById(_container).style.width = self.width + "px";
        document.getElementById(_container).style.height = self.height + "px";
        _icanvas.width = this.width;
        _icanvas.height = this.height;
        _render.render();
    }

    this.layers = new LinkedList();
    this.width = options.width || 1200;
    this.height = options.height || 800;

    this.createLayer = function () {
        var layer = new RenderJs.Canvas.Layer(_container, this.width, this.height);

        //layer.subscribeDomClick(function () {
        //    if (!layer.layerClick())
        //        bubbleClick(_layers.length - 2);
        //});

        //for (var i = 0; i < _layers.length; i++) {
        //    _layers[i].unsubscribeDomClick();
        //}
        this.layers.append(layer);

        return layer;
    }
    this.getImagiaryCtx = function () {
        return ictx;
    }

    init();
}