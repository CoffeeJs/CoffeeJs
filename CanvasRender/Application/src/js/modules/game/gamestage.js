var RenderJs = RenderJs || {};
RenderJs.Canvas = RenderJs.Canvas || {};
RenderJs.Canvas.Game = RenderJs.Canvas.Game || {};

RenderJs.Canvas.Game.Stage = RenderJs.Canvas.Stage.extend({
    init: function (options) {
        this._super(options);

        this.gVec = new RenderJs.Vector(0, -9,78);
    }
});