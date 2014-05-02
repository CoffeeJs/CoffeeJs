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
        this._super(x, y, right - x, bottom - y);

        this.points = options.points;
        this.color = options.color;
        this.lineWidth = options.lineWidth || 1;
    },
    /*
    *Function is called in every frame to redraw itself
    *-ctx is the drawing context from a canvas
    *-fps is the frame per second
    */
    draw: function (ctx) {
        //var posStart = RenderJs.Point(this.x(), this.y());
        //var posEnd = RenderJs.Point(this.x() + this.width(), this.y() + this.height());
        //if (this.lineWidth % 2 != 0) {
        //    posStart.x += 0.5;
        //    posStart.y += 0.5;
        //    posEnd.x += 0.5;
        //    posEnd.y += 0.5;
        //}
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