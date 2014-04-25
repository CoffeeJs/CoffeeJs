var Utils = (function (module) {

    module.array = (function () {
        var array = {};
        //
        //Creates a new collection, executes the given function and push the result into the new array
        array.map = function (arr, f) {
            var result = [];
            for (var i = 0; i < arr.length; i++) {
                result.push(f(arr[i], i));
            }
            return result;
        };

        //
        //Iterates throught on the array, and executes the parameter function on each element
        array.forEach = function (arr, f) {
            for (var i = 0; i < arr.length; i++) {
                f(arr[i], i);
            }
        };

        //
        //Returns with the first selected element according to the param function, otherwise throws an exception
        array.first = function (arr, f) {
            if (!f)
                if (arr.length == 0)
                    throw new NotFoundException("No elements in the sequence!");
                else
                    return arr[0];

            var match = arr.filter(f);
            if (match.length == 0)
                throw new NotFoundException("Didn't match any element with the conditions!");
            else
                return match[0];
        };
        //
        //Returns with the first selected element according to the param function, otherwise null
        array.firstOrDefault = function (arr, f) {
            if (!f)
                if (arr.length == 0)
                    return null;
                else
                    return arr[0];
            return arr.filter(f)[0];
        };

        //
        //Returns with the last selected element according to the param function, otherwise throws an exception
        array.last = function (arr, f) {
            if (!f)
                if (arr.length == 0)
                    throw new NotFoundException("No elements in the sequence!");
                else
                    return arr[arr.length - 1];
            var match = arr.filter(f);
            if (match.length == 0)
                throw new NotFoundException("Didn't match any element with the conditions!");
            else
                return match[match.length-1];
        };
        //
        //Returns with the last selected element according to the param function, otherwise null
        array.lastOrDefault = function (arr, f) {
            if (!f)
                if (this.length == 0)
                    return null;
                else
                    return arr[arr.length - 1];
            var match = arr.filter(f);
            return match[match.length-1];
        };
        //
        //Iterates throught on the array, and returns true if any items matches with the condition
        array.any = function (arr, item) {
            return arr.indexOf(item) != -1;
        };

        return array;
    })();
    
    return module;
}(Utils || {}));
