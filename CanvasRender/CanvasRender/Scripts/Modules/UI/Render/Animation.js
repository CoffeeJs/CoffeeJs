var Animation = function (render, utils) {

    var _animations = [];

    this.position = function (obj, position, t) {
        var id = utils.getGuid();
        _animations.push({
            id: id,
            animate: function (fps) {
                var dPosition = Point(position.x / (t / fps), position.y / (t / fps));
                if (obj.position.equalsTo(position))
                    return true;
                obj.position = Point(obj.position.x + dPosition.x, obj.position.y + dPosition.y);
                return false;
            }
        });
    }

    this.rotate = function (obj, deg, t) {
        var id = utils.getGuid();
        _animations.push({
            id: id,
            animate: function (fps) {
                if (obj.angle >= deg)
                    return true;
                var dDeg = deg / (t / fps);

                obj.rotate(obj.angle + dDeg);
                return false;
            }
        });
    }

    render.onInvalidate(function (status) {
        for (var i = 0; i < _animations.length; i++) {
            if (i > 5)
                continue;
            var stop = _animations[i].animate(status.fps);
            if (stop === true) {
                _animations.splice(i, 1);
                i--;
            }
        }
    });
}