var RenderJs = RenderJs || {};
RenderJs.Canvas = RenderJs.Canvas || {};

RenderJs.Canvas.Animation = function (handler, layer) {

    var time = 0;

    var animation = function (frameRate) {
        handler({
            frameRate: frameRate,
            lastTime: time,
            time: time + 1000 / frameRate
        });
        time += 1000 / frameRate;
    };

    this.start = function () {
        layer.onAnimate(animation);
    }

    this.reset = function () {
        time = 0;
    }

    this.pause = function () {
        layer.offAnimate(animation);
    }

    this.stop = function () {
        this.reset();
        layer.offAnimate(animation);
    }
}