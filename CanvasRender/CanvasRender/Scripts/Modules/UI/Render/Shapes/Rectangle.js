/*
*Represents a rectangle shape, inherits from shape
*/
var Rectangle = Shape.extend({
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
        ctx.save();
        for (var i = 0; i < this._transformation.length; i++)
            this._transformation[i].transform(ctx, fps);

        ctx.moveTo(this.position.x, this.position.y);
        if (this.color)
            ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
        if (this.fillColor)
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.fillColor;
        ctx.restore();
    }
});