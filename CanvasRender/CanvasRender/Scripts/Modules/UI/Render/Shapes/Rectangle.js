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
    init: function (x, y, width, height, color, fillColor, lineWidth) {
        this._super(x, y, width, height);

        this.color = color;
        this.fillColor = fillColor;
        this.lineWidth = lineWidth || 1;
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