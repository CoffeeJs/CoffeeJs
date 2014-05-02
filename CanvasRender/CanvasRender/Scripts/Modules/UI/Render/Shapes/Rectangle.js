var RenderJs = RenderJs || {};
RenderJs.Canvas = RenderJs.Canvas || {};
RenderJs.Canvas.Shapes = RenderJs.Canvas.Shapes || {};

/*
*Represents a rectangle shape, inherits from shape
*/
RenderJs.Canvas.Shapes.Rectangle = RenderJs.Canvas.Shape.extend({
    /*
    *Constructor
    */
    init: function (options) {
        var options = options || {};
        this._super(options.x, options.y, options.width, options.height);

        this.color = options.color;
        this.fillColor = options.fillColor;
        this.lineWidth = options.lineWidth || 1;
    },
    /*
    *Function is called in every frame to redraw itself
    *-ctx is the drawing context from a canvas
    *-fps is the frame per second
    */
    draw: function (ctx, fps) {
        if (this.color)
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        if (this.fillColor)
            ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.fillColor;
    }
});