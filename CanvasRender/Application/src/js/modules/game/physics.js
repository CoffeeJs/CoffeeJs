var RenderJs = RenderJs || {};
RenderJs.Physics = RenderJs.Physics || {};

RenderJs.Physics.Collisions = (function (module) {

    var _rayCastingAlg = function (p, edge) {
        'takes a point p=Pt() and an edge of two endpoints a,b=Pt() of a line segment returns boolean';
        var _eps = 0.00001;
        var _huge = Number.MAX_VALUE;
        var _tiny = Number.MIN_VALUE;
        var m_blue, m_red = 0;
        var a = edge.p1;
        var b = edge.p2;

        if (a.y > b.y) {
            a.set(b);
            b.set(a);
        }
        if (p.y == a.y || p.y == b.y)
            p.y += _eps;

        var intersect = false;

        if ((p.y > b.y || p.y < a.y) || (p.x > Math.max(a.x, b.x)))
            return false;

        if (p.x < Math.min(a.x, b.x))
            intersect = true;
        else {
            if (Math.abs(a.x - b.x) > _tiny)
                m_red = (b.y - a.y) / (b.x - a.x);
            else
                m_red = _huge;

            if (Math.abs(a.x - p.x) > _tiny)
                m_blue = (p.y - a.y) / (p.x - a.x);
            else
                m_blue = _huge
            intersect = m_blue >= m_red;
        }

        return intersect;
    }

    var _pointInPolygon = function (p, polygon) {
        var res = false;
        for (var i = 0; i < polygon.rEdges.length; i++) {
            if (_rayCastingAlg(p, polygon.rEdges[i]))
                res = !res;
        }
        return res;
    }

    var _pointInLine = function (p, line) {
        var m = (line.pos2.y - line.pos.y) / (line.pos2.x - line.pos.x);

        return p.y - line.pos.y == m * (p.x - line.pos.y);
    }

    var _pointInCircle = function (p, c) {
        o = c.getCenter();

        return Math.pow(p.x - o.x, 2) + Math.pow(p.y - o.y, 2) <= Math.pow((this.width / 2), 2);
    }

    var _rectVsRect = function (r1, r2) {
        var tw = r1.width;
        var th = r1.height;
        var rw = r2.width;
        var rh = r2.height;
        if (rw <= 0 || rh <= 0 || tw <= 0 || th <= 0) {
            return false;
        }
        var tx = r1.x;
        var ty = r1.y;
        var rx = r2.x;
        var ry = r2.y;
        rw += rx;
        rh += ry;
        tw += tx;
        th += ty;
        //overflow || intersect
        return ((rw < rx || rw > tx) &&
        (rh < ry || rh > ty) &&
        (tw < tx || tw > rx) &&
        (th < ty || th > ry));
    }

    var _rectVsCircle = function (r, c) {
        return _pointInRectangle(c.getCenter(), r) ||
            _lineVsCircle(r.topEdge(), c) ||
            _lineVsCircle(r.rightEdge(), c) ||
            _lineVsCircle(r.bottomEdge(), c) ||
            _lineVsCircle(r.leftEdge(), c);
    }

    var _lineVsCircle = function (l, c) {
        var co = c.getCenter();
        var r = c.radius;
        var d = new RenderJs.Vector(l.pos2.x - l.pos.x, l.pos2.y - l.pos.y);
        var f = new RenderJs.Vector(l.pos.x - co.x, l.pos.y - co.y);

        var a = d.dot(d);
        var b = 2 * f.dot(d);
        var c = f.dot(f) - r * r;

        var discriminant = b * b - 4 * a * c;

        if (discriminant < 0) {
            // no intersection
            return false;
        }
        else {
            // ray didn't totally miss sphere,
            // so there is a solution to
            // the equation.

            discriminant = Math.sqrt(discriminant);

            // either solution may be on or off the ray so need to test both
            // t1 is always the smaller value, because BOTH discriminant and
            // a are nonnegative.
            var t1 = (-b - discriminant) / (2 * a);
            var t2 = (-b + discriminant) / (2 * a);

            // 3x HIT cases:
            //          -o->             --|-->  |            |  --|->
            // Impale(t1 hit,t2 hit), Poke(t1 hit,t2>1), ExitWound(t1<0, t2 hit), 

            // 3x MISS cases:
            //       ->  o                     o ->              | -> |
            // FallShort (t1>1,t2>1), Past (t1<0,t2<0), CompletelyInside(t1<0, t2>1)

            if (t1 >= 0 && t1 <= 1) {
                // t1 is the intersection, and it's closer than t2
                // (since t1 uses -b - discriminant)
                // Impale, Poke
                return true;
            }

            // here t1 didn't intersect so we are either started
            // inside the sphere or completely past it
            if (t2 >= 0 && t2 <= 1) {
                // ExitWound
                return true;
            }

            // no intn: FallShort, Past, CompletelyInside
            return false;
        }
    }

    var _pointInRectangle = function (p, r) {
        return (p.x >= r.x &&
            p.x <= r.x + r.width &&
            p.y >= r.y &&
            p.y <= r.y + r.height);
    }

    module.pointInObject = function (p, obj) {
        if (obj instanceof RenderJs.Canvas.Shapes.Rectangle)
            return _pointInRectangle(p, obj);
        if (obj instanceof RenderJs.Canvas.Shapes.Arc)
            return _pointInCircle(p, obj);
        if (obj instanceof RenderJs.Canvas.Shapes.Polygon)
            return _pointInPolygon(p, obj);
        if (obj instanceof RenderJs.Canvas.Shapes.Line)
            return _pointInLine(p, obj);

        return false;
    }

    module.checkCollision = function (obj1, obj2) {
        if (obj1 instanceof RenderJs.Canvas.Shapes.Rectangle && obj2 instanceof RenderJs.Canvas.Shapes.Rectangle)
            return _rectVsRect(obj1, obj2);

        if (obj1 instanceof RenderJs.Canvas.Shapes.Rectangle && obj2 instanceof RenderJs.Canvas.Shapes.Arc)
            return _rectVsCircle(obj1, obj2);
        if (obj1 instanceof RenderJs.Canvas.Shapes.Arc && obj2 instanceof RenderJs.Canvas.Shapes.Rectangle)
            return _rectVsCircle(obj2, obj1);

        if (obj1 instanceof RenderJs.Canvas.Shapes.Line && obj2 instanceof RenderJs.Canvas.Shapes.Arc)
            return _lineVsCircle(obj1, obj2);
        if (obj1 instanceof RenderJs.Canvas.Shapes.Arc && obj2 instanceof RenderJs.Canvas.Shapes.Line)
            return _lineVsCircle(obj2, obj1);

        if (obj1 instanceof RenderJs.Canvas.Shapes.Polygon && obj2 instanceof RenderJs.Canvas.Shapes.Polygon)
            return module.polygonCollision(obj1, obj2).intersect;

        return false;
    }

    return module;

}(RenderJs.Physics.Collisions || {}));