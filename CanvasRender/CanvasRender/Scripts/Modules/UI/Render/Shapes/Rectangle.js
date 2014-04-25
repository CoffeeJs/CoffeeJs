function Rectangle(p, width, height, color, fillColor, lineWidth) {
    var self = this;

    this.position = p || Point(0, 0);
    this.width = width || 0;
    this.height = height || 0;

    this.color = color;
    this.fillColor = fillColor;
    this.lineWidth = lineWidth || 2;

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
        ctx.moveTo(self.position.x, self.position.y);
        if (self.color)
            ctx.strokeRect(self.position.x, self.position.y, self.width, self.height);
        if (self.fillColor)
            ctx.fillRect(self.position.x, self.position.y, self.width, self.height);
        ctx.lineWidth = self.lineWidth;
        ctx.strokeStyle = self.color;
        ctx.fillStyle = self.fillColor;
        ctx.restore();
    }
}
Rectangle.prototype = new CanvasObject();
Rectangle.prototype.constructor = Rectangle;