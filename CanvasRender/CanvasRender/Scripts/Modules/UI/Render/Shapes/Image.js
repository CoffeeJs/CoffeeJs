var RenderJs = RenderJs || {};
RenderJs.Canvas = RenderJs.Canvas || {};
RenderJs.Canvas.Shapes = RenderJs.Canvas.Shapes || {};
/*
*Represents an image, inherits from shape
*/
RenderJs.Canvas.Shapes.Image = RenderJs.Canvas.Shape.extend({
    /*
    *Constructor
    */
    init: function (url, x, y) {
        var self = this;
        this._super(x, y, 0, 0);
        this.image = document.createElement("img");
        this.image.src = url;
        this.image.onload = function () {
            self.width(self.image.width);
            self.height(self.image.height);
        };
    },
    /*
    *Function is called in every frame to redraw itself
    *-ctx is the drawing context from a canvas
    */
    draw: function (ctx) {
        ctx.drawImage(this.image, this.x(), this.y());
        this.invalid = false;
    }
});