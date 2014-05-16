var Utils = (function (module) {

    module.convertToRad = function (deg) {
        return deg * (Math.PI / 180);
    };
    var fps = 0, now, lastUpdate = (new Date) * 1 - 1;

    module.getMousePos = function (canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    module.getCanvas = function (w, h) {
        var c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        return c;
    }

    module.getPixels = function (img) {
        var c, ctx;
        if (img.getContext) {
            c = img;
            try { ctx = c.getContext('2d'); } catch (e) { }
        }
        if (!ctx) {
            c = Utils.getCanvas(img.width, img.height);
            ctx = c.getContext('2d');
            ctx.drawImage(img, 0, 0);
        }
        return ctx.getImageData(0, 0, c.width, c.height);
    }

    module.getFps = function (refFps) {
        var thisFrameFPS = 1000 / ((now = new Date) - lastUpdate);
        fps += (thisFrameFPS - fps) / refFps;
        lastUpdate = now;

        return fps;
    }

    return module;
}(Utils || {}));