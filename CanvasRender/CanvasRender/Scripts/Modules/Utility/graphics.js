var Utils = (function (module) {

    module.convertToRad = function (deg) {
        return deg * (Math.PI / 180);
    };

    return module;
}(Utils || {}));