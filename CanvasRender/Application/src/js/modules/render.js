var RenderJs = RenderJs || {};

RenderJs.Point = function (x, y) {
    return {
        x: x || 0,
        y: y || 0,
        equalsTo: function (p) {
            return x === p.x && y === p.y;
        }
    };
}

RenderJs.Vector = function (x, y) {
    this.x = x || 0;
    this.y = y || 0;
    ////
    ////Get the Hypotenuse
    //this.length = function () {
    //    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    //}
    ////
    ////Sum of the 2 vectors, and return with that
    //this.sum = function (vector) {
    //    if (vector instanceof RenderJs.Vector)
    //        return new RenderJs.Vector(x + vector.x, y + vector.y);
    //    else
    //        return new RenderJs.Vector(x + vector, y + vector);
    //}
    ////
    ////Dot product returns with a vector
    //this.dotVector = function (vector) {
    //    if (vector instanceof RenderJs.Vector)
    //        return new RenderJs.Vector(x * vector.x, y * vector.y);
    //    else
    //        return new RenderJs.Vector(x * vector, y * vector);
    //}
    ////
    ////Dot product returns with a scalar
    //this.dotScalar = function (vector) {
    //    if (vector instanceof RenderJs.Vector)
    //        return x * vector.x + y * vector.y;
    //    else
    //        return x * vector + y * vector;
    //}
    ////
    ////Vector angle with tan
    //this.getAngle = function () {
    //    return Math.atan(y / x) / (Math.PI / 180);
    //}
    //this.equalsTo = function (p) {
    //    return x === p.x && y === p.y;
    //}

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

    this.toString = function () {
        return "(" + this.x + ", " + this.y + ")"
    }

}

RenderJs.Rect = function (x, y, width, height) {
    return {
        x: x,
        y: y,
        width: width,
        height: height,
        left: function () {
            return x;
        },
        right: function () {
            return x + width;
        },
        top: function () {
            return y;
        },
        bottom: function () {
            return y + height;
        }
    }
}