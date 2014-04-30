

var vspace = (function (window) {
    return {
        create: function (e) {
            var svg = document.createElement('button');

            e.appendChild(svg);
        }
    };
})(window);