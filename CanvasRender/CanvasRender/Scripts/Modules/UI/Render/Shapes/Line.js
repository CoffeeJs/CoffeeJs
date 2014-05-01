var RenderJs = RenderJs || {};
RenderJs.Canvas = RenderJs.Canvas || {};
RenderJs.Canvas.Shapes = RenderJs.Canvas.Shapes || {};

/*
*Represents a line shape, inherits from shape
*/
RenderJs.Canvas.Shapes.Line = RenderJs.Canvas.Shape.extend({
    /*
    *Constructor
    */
    init: function (x, y, width, height, color, lineWidth) {
        this._super(x, y, width, height);

        this.color = color;
        this.lineWidth = lineWidth || 1;
    },
    /*
    *Function is called in every frame to redraw itself
    *-ctx is the drawing context from a canvas
    *-fps is the frame per second
    */
    draw: function (ctx, fps) {
        ctx.save();
        for (var i = 0; i < this._transformation.length; i++)
            this._transformation[i].transform(ctx, fps);

        var posStart = RenderJs.Point(this.x, this.y);
        var posEnd = RenderJs.Point(this.x + this.width, this.y + this.height);
        if (this.lineWidth % 2 != 0) {
            posStart.x += 0.5;
            posStart.y += 0.5;
            posEnd.x += 0.5;
            posEnd.y += 0.5;
        }
        ctx.beginPath();
        ctx.moveTo(posStart.x, posStart.y);
        ctx.lineTo(posEnd.x, posEnd.y);
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.color;
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
});