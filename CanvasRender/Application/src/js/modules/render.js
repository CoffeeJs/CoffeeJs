var RenderJs = RenderJs || {};

RenderJs.Vector = function (x, y) {
    this.x = x || 0;
    this.y = y || 0;

    this.set = function (v) {
        this.x = v.x
        this.y = v.y
    }

    this.lengthSquared = function () {
        return Math.pow(this.x, 2) + Math.pow(this.y, 2)
    }

    this.length = function () {
        return Math.sqrt(this.lengthSquared())
    }

    this.scale = function (s) {
        return new RenderJs.Vector(this.x * s, this.y * s)
    }

    this.sub = function (v) {
        if (v instanceof RenderJs.Vector)
            return new RenderJs.Vector(this.x - v.x, this.y - v.y)
        else
            return new RenderJs.Vector(this.x - v, this.y - v)
    }

    this.add = function (v) {
        if (v instanceof RenderJs.Vector)
            return new RenderJs.Vector(this.x + v.x, this.y + v.y)
        else
            return new RenderJs.Vector(this.x + v, this.y + v)
    }

    this.dot = function (v) {
        return this.x * v.x + this.y * v.y
    }

    this.dist = function (v) {
        return this.sub(v).length()
    }

    this.normalize = function () {
        return this.scale(1 / this.length())
    }

    this.angle = function (v) {
        return this.dot(v) / (this.length * v.length)
    }

    this.toString = function (rounded) {
        if (rounded)
            return "(" + Math.round(this.x) + ", " + Math.round(this.y) + ")";
        else
            return "(" + this.x + ", " + this.y + ")";
    }

}