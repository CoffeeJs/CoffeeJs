function Line(p, width, height, color, lineWidth) {
    var self = this;

    this.position = p || Point(0, 0);
    this.width = width || 0;
    this.height = height || 0;
    this.color = color || "black";
    this.lineWidth = lineWidth || 1;

    this.isOnCanvas = function (canvasRect) {
        var rect = self.getRect();
        return !(canvasRect.left() > rect.right() ||
                 canvasRect.right() < rect.left() ||
                 canvasRect.top() > rect.bottom() ||
                 canvasRect.bottom() < rect.top());
    }

    this.getCenter = function () {
        var rect = self.getRect();
        return Point(rect.x + (rect.width) / 2, rect.y + (rect.height) / 2);
    }

    this.getRect = function () {
        return Rect(self.position.x, self.position.y, self.width, self.height);
    }

    this.draw = function (ctx) {
        ctx.save();
        if (self.rotateFunction)
            self.rotateFunction(ctx, self);
        if (self.scaleFunction)
            self.scaleFunction(ctx, self);
        var posStart = Point(self.position.x, self.position.y);
        var posEnd = Point(self.position.x + self.width, self.position.y + self.height);
        if (self.lineWidth % 2 != 0) {
            posStart.x += 0.5;
            posStart.y += 0.5;
            posEnd.x += 0.5;
            posEnd.y += 0.5;
        }
        ctx.beginPath();
        ctx.moveTo(posStart.x, posStart.y);
        ctx.lineTo(posEnd.x, posEnd.y);
        ctx.lineWidth = self.lineWidth;
        ctx.strokeStyle = self.color;
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
}

Line.prototype = new CanvasObject();
Line.prototype.constructor = Line;