var RenderJs = RenderJs || {};
RenderJs.Physics = (function (module) {

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

    var _pointInPolygon = function (p, edges) {
        var res = false;
        for (var i = 0; i < edges.length; i++) {
            if (_rayCastingAlg(p, edges[i]))
                res = !res;
        }
        return res;
    }

    var _AABB = function (r1, r2) {
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

    var _RectVsCircle = function (r, c) {

    }

    var _lineVsCircle = function (l, c) {
        var dx = l.x2 - l.x1;
        var dy = l.y2 - l.y1;
        var dr = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        var D = l.x1 * l.y2 - l.x2 * l.y1;

        var disc = Math.pow(c.radius, 2) * Math.pow(dr, 2) - Math.pow(D, 2);

        return disc >= 0;
    }

    module.pointInRectangle = function (p, r) {
        var edges = [
            //Top
            { p1: new RenderJs.Point(r.x, r.y), p2: new RenderJs.Point(r.x + r.width, r.y) },
            //Right
            { p1: new RenderJs.Point(r.x + r.width, r.y), p2: new RenderJs.Point(r.x + r.width, r.y + r.height) },
            //Bottom
            { p1: new RenderJs.Point(r.x + r.width, r.y + r.height), p2: new RenderJs.Point(r.x, r.y + r.height) },
            //Left
            { p1: new RenderJs.Point(r.x, r.y + r.height), p2: new RenderJs.Point(r.x, r.y) }
        ];
        return _pointInPolygon(p, edges);
    }

    module.checkCollision = function (obj1, obj2) {
        if (obj1 instanceof RenderJs.Canvas.Shapes.Rectangle && obj2 instanceof RenderJs.Canvas.Shapes.Rectangle)
            _AABB(obj1, obj2);

        if (obj1 instanceof RenderJs.Canvas.Shapes.Rectangle && obj2 instanceof RenderJs.Canvas.Shapes.Arc)
            _RectVsCircle(obj1, obj2);
        if (obj1 instanceof RenderJs.Canvas.Shapes.Arc && obj2 instanceof RenderJs.Canvas.Shapes.Rectangle)
            _RectVsCircle(obj1, obj2);
    }

    return module;

}(RenderJs.Physics || {}));