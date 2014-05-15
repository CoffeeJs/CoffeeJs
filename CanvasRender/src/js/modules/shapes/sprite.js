var RenderJs = RenderJs || {};
RenderJs.Canvas = RenderJs.Canvas || {};
RenderJs.Canvas.Shapes = RenderJs.Canvas.Shapes || {};
/*
*Represents a sprite image, inherits from shape
*/
RenderJs.Canvas.Shapes.Sprite = RenderJs.Canvas.Shape.extend({
    /*
    *Constructor
    */
    init: function (options) {
        var self = this;

        var options = options || {};
        this._super({ x: options.x, y: options.y });
        this.image = document.createElement("img");
        this.loaded = false;
        //this.blurRadius = options.blurRadius || 0;
        //this.cache = options.cache == undefined ? true : options.cache;
        //this.filterCache = null;
        this.frameIndex = 0;
        this.frameCount = options.frameCount;
        this.started = false;
        this.defAnimation = options.defAnimation;
        this.current = undefined;
        this.animations = options.animations;
        this.image.onload = function () {
            self.width = self.image.width;
            self.height = self.image.height;
            self.loaded = true;
        };
        this.image.src = options.url;
    },
    start: function () {
        this.animation(this.defAnimation, true);
    },
    animation: function (name, loop) {
        this.frameIndex = 0;
        this.started = true;

        if (!this.animations[name]) return;
        this.current = this.animations[name];
    },
    /*
    *Function is called in every frame to redraw itself
    *-ctx is the drawing context from a canvas
    */
    draw: function (ctx, frame) {
        if (!this.loaded || !this.started) return;

        //if (!this.filterCache)
        //    for (var i = 0; i < this.filters.length; i++) {
        //        switch (this.filters[i]) {
        //            case RenderJs.Canvas.Filters.Blur:
        //                this.filterCache = RenderJs.Canvas.Filters.Blur(this.image, this.blurRadius);
        //                break;
        //        }
        //    }
        //if (this.filterCache)
        //    ctx.putImageData(this.filterCache, this.x, this.y);
        //else
        var aktFrame = this.frameIndex * 4;
        ctx.drawImage(this.image, this.current[aktFrame], this.current[aktFrame + 1], this.current[aktFrame + 2], this.current[aktFrame + 3], this.x, this.y, this.current[aktFrame + 2], this.current[aktFrame + 3]);
        if (frame.time / (1000 / frame.frameRate) % this.frameCount == 0)
            this.frameIndex = (this.frameIndex * 4 + 4) > this.current.length - 1 ? 0 : this.frameIndex + 1;
    }
});