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
    init: function (options) {
        var self = this;

        var options = options || {};
        this._super(options);
        this.image = document.createElement("img");
        this.image.src = options.url;
        this.loaded = false;
        this.blurRadius = options.blurRadius || 0;
        this.cache = options.cache == undefined ? true : options.cache;
        this.filterCache = null;
        this.image.onload = function () {
            self.width = self.image.width;
            self.height = self.image.height;
            self.loaded = true;
        };
    },
    /*
    *Function is called in every frame to redraw itself
    *-ctx is the drawing context from a canvas
    */
    draw: function (ctx) {
        if (!this.loaded) return;

        if (!this.filterCache)
            for (var i = 0; i < this.filters.length; i++) {
                switch (this.filters[i]) {
                    case RenderJs.Canvas.Filters.Blur:
                        this.filterCache = RenderJs.Canvas.Filters.Blur(this.image, this.blurRadius);
                        break;
                }
            }
        if (this.filterCache)
            ctx.putImageData(this.filterCache, this.x, this.y);
        else
            ctx.drawImage(this.image, this.x, this.y);
        if (!this.cache)
            this.filterCache = null;
    }
});