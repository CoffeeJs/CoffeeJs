var RenderJs = RenderJs || {};
RenderJs.Canvas = RenderJs.Canvas || {};
RenderJs.Canvas.Shapes = RenderJs.Canvas.Shapes || {};

/*
*Represents a line shape, inherits from shape
*/
RenderJs.Canvas.Shapes.Polygon = function (options) {

    this.color = "#000";
    this.lineWidth = 1;
    this.points = [];
    this.edges = [];
    this.rEdges = [];

    /*
    *Constructor
    */
    var _init = function (options) {
        var options = options || {};

        this._baseInit(options);

        this.points = options.points || [];
        this.color = options.color;
        this.lineWidth = options.lineWidth || 1;
        this.buildEdges();
        this.offset(this.pos);
    }

    this.buildEdges = function () {
        var p1;
        var p2;
        this.edges = [];
        this.rEdges = [];
        for (var i = 0; i < this.points.length; i++) {
            p1 = this.points[i];
            if (i + 1 >= this.points.length) {
                p2 = this.points[0];
            } else {
                p2 = this.points[i + 1];
            }
            this.edges.push(p2.sub(p1));
            this.rEdges.push({ p1: new RenderJs.Vector(p1.x, p1.y), p2: new RenderJs.Vector(p2.x, p2.y) });
        }
    }

    this.getCenter = function () {
        var totalX = 0;
        var totalY = 0;
        for (var i = 0; i < this.points.length; i++) {
            totalX += this.points[i].x;
            totalY += this.points[i].y;
        }

        return new RenderJs.Vector(totalX / this.points.length, totalY / this.points.length);
    }

    this.offset = function (x, y) {
        var v = arguments.length == 2 ? new RenderJs.Vector(arguments[0], arguments[1]) : arguments[0];
        for (var i = 0; i < this.points.length; i++) {
            var p = this.points[i];
            this.points[i].set(p.add(v));
        }
    }

    this.toString = function () {
        var result = "";

        for (var i = 0; i < this.points.length; i++) {
            if (result != "") result += " ";
            result += "{" + this.points[i].toString(true) + "}";
        }

        return result;
    }

    /*
    *Function is called in every frame to redraw itself
    *-ctx is the drawing context from a canvas
    *-fps is the frame per second
    */
    this.draw = function (ctx) {

        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (var i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.closePath();
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }
    _init.call(this, options);
}
RenderJs.Canvas.Shapes.Polygon.prototype = new RenderJs.Canvas.Object();
RenderJs.Canvas.Shapes.Polygon.constructor = RenderJs.Canvas.Shapes.Polygon;