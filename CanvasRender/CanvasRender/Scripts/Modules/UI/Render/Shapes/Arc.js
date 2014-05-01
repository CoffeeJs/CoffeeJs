var RenderJs = RenderJs || {};
RenderJs.Canvas = RenderJs.Canvas || {};
RenderJs.Canvas.Shapes = RenderJs.Canvas.Shapes || {};

/*
*Represents a circle shape, inherits from shape
*/
RenderJs.Canvas.Shapes.Arc = RenderJs.Canvas.Shape.extend({
    /*
    *Constructor
    */
    init: function (x, y, radius, sAngle, eAngle, color, fillColor, lineWidth) {
        this._super(x, y, radius * 2, radius * 2);

        this.sAngle = Utils.convertToRad(sAngle || 0);
        this.eAngle = Utils.convertToRad(eAngle || 360);
        this.color = color;
        this.fillColor = fillColor;
        this.lineWidth = lineWidth || 1;
    },
    /*
    *Overrides the original function, because the circle center point is not the top,left corner
    */
    getCenter: function () {
        return RenderJs.Point(this.x + this.width / 2, this.y + this.height / 2);
    },
    /*
    *Overrides the original function
    */
    pointIntersect: function (p) {
        c = this.getCenter();

        return Math.pow(p.x - c.x, 2) + Math.pow(p.y - c.y, 2) <= Math.pow((this.width / 2), 2);
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
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.fillColor;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, this.sAngle, this.eAngle);
        if (this.color)
            ctx.stroke();
        if (this.fillColor)
            ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
});