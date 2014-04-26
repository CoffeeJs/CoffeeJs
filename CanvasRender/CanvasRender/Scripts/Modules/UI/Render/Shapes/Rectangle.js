var Rectangle = Shape.extend({
    init: function (x, y, width, height, color, fillColor, lineWidth) {
        this._super(x, y, width, height);

        this.color = color;
        this.fillColor = fillColor;
        this.lineWidth = lineWidth || 2;
    },
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

//function Rectangle(p, width, height, color, fillColor, lineWidth) {
//    var self = this;

//    this.position = p || Point(0, 0);
//    this.width = width || 0;
//    this.height = height || 0;

//    this.color = color;
//    this.fillColor = fillColor;
//    this.lineWidth = lineWidth || 2;

//    this.getCenter = function () {
//        var rect = self.getRect();
//        return Point(rect.x + (rect.width) / 2, rect.y + (rect.height) / 2);
//    }

//    this.getRect = function () {
//        return Rect(self.position.x, self.position.y, self.width, self.height);
//    }

//    this.isOnCanvas = function (canvasRect) {
//        var rect = self.getRect();
//        return !(canvasRect.left() > rect.right() ||
//                 canvasRect.right() < rect.left() ||
//                 canvasRect.top() > rect.bottom() ||
//                 canvasRect.bottom() < rect.top());
//    }


//}
//Rectangle.prototype = new CanvasObject();
//Rectangle.prototype.constructor = Rectangle;