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
    //
    //Get the Hypotenuse
    this.length = function () {
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    }
    //
    //Sum of the 2 vectors, and return with that
    this.sum = function (vector) {
        if (vector instanceof RenderJs.Vector)
            return new RenderJs.Vector(x + vector.x, y + vector.y);
        else
            return new RenderJs.Vector(x + vector, y + vector);
    }
    //
    //Dot product returns with a vector
    this.dotVector = function (vector) {
        if (vector instanceof RenderJs.Vector)
            return new RenderJs.Vector(x * vector.x, y * vector.y);
        else
            return new RenderJs.Vector(x * vector, y * vector);
    }
    //
    //Dot product returns with a scalar
    this.dotScalar = function (vector) {
        if (vector instanceof RenderJs.Vector)
            return x * vector.x + y * vector.y;
        else
            return x * vector + y * vector;
    }
    //
    //Vector angle with tan
    this.getAngle = function () {
        return Math.atan(y / x) / (Math.PI / 180);
    }
    this.equalsTo = function (p) {
        return x === p.x && y === p.y;
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