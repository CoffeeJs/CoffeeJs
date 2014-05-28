var RenderJs = RenderJs || {};
RenderJs.Canvas = RenderJs.Canvas || {};
RenderJs.Canvas.Game = RenderJs.Canvas.Game || {};

RenderJs.Canvas.Game.Object = function () {

    this.gVec = new RenderJs.Vector(0, -9, 78);
    this.init = function (options) {
        _super(options);

        return this;
    }

};

var MyClass = function () {

}

var DerivedClass = function () {

}

DerivedClass.prototype = new MyClass();
DerivedClass.constructor = DerivedClass;

var derived = new DerivedClass();