var RenderJs = RenderJs || {};
RenderJs.Canvas = RenderJs.Canvas || {};
RenderJs.Canvas.Game = RenderJs.Canvas.Game || {};

/*
*Represents a line shape, inherits from shape
*/
RenderJs.Canvas.Game.Platform = RenderJs.Canvas.Shape.extend({
    /*
    *Constructor
    */
    init: function (options) {
        var options = options || {};

        var x = options.points[0];
        var y = options.points[1];
        var right = 0;
        var bottom = 0;
        for (var i = 0; i < options.points.length; i++) {
            if (i % 2 == 0) {
                if (options.points[i] < y) y = options.points[i];
                if (options.points[i] > bottom) bottom = options.points[i];
            }
            else {
                if (options.points[i] < x) x = options.points[i];
                if (options.points[i] > right) right = options.points[i];
            }
        }
        this._super({
            x: x,
            y: y,
            width: right - x,
            height: bottom - y
        });

        this.points = options.points;
        this.color = options.color;
        this.lineWidth = options.lineWidth || 1;
    },
    nearestPoint: function(pos) {
        var piece = this.points[1].sub(this.points[0]);
        var normalizedProjection = pos.sub(this.points[0]).dot(piece);
        if (normalizedProjection < 0)
            return this.points[0]
        else if (normalizedProjection > sqrLength)
            return this.points[1]
        else // Projection is on line
            return this.points[0].add((piece.scale(normalizedProjection / sqrLength)))
    },
    /*
    *Function is called in every frame to redraw itself
    *-ctx is the drawing context from a canvas
    *-fps is the frame per second
    */
    draw: function (ctx) {
        ctx.beginPath();
        ctx.moveTo(this.points[0], this.points[1]);
        for (var i = 2; i < this.points.length; i += 2) {
            ctx.lineTo(this.points[i], this.points[i + 1]);
        }
        ctx.closePath();
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }
});