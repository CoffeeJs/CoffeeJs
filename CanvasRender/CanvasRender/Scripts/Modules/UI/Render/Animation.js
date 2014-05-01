var RenderJs = RenderJs || {};
RenderJs.Canvas = RenderJs.Canvas || {};

RenderJs.Canvas.Animation = function (handler, layer) {
    
    this.start = function () {
        layer.onAnimate(handler);
    }

    this.stop = function () {
        layer.offAnimate(handler);
    }
}