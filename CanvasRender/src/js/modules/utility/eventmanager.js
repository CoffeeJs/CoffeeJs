/***************************************************************
*
*   EventManager
*
***************************************************************/
var EventManager;
(EventManager = function () {
}).prototype = {
    subscribe: function (type, method, scope, context) {
        var listeners, handlers, scope;
        if (!(listeners = this.listeners)) {
            listeners = this.listeners = {};
        }
        if (!(handlers = listeners[type])) {
            handlers = listeners[type] = [];
        }
        scope = (scope ? scope : window);
        handlers.push({
            method: method,
            scope: scope,
            context: (context ? context : scope)
        });
    },
    unsubscribe: function (type, handler) {
        this.listeners[type].splice(this.listeners[type].indexOf(handler), 1);
    },
    trigger: function (type, data, context) {
        var listeners, handlers, i, n, handler, scope;
        if (!(listeners = this.listeners)) {
            return;
        }
        if (!(handlers = listeners[type])) {
            return;
        }
        for (i = 0, n = handlers.length; i < n; i++) {
            handler = handlers[i];
            if (typeof (context) !== "undefined" && context !== handler.context) continue;
            if (handler.method.call(
                handler.scope, data, type
            ) === false) {
                return false;
            }
        }
        return true;
    }
};

function Observable(initial) {

    var update = function (value) {
        if (arguments.length > 0) {
            update._value = arguments[0];
            for (var i = 0; i < update._subscribers.length; i++) {
                update._subscribers[i](update._value);
            }
        }
        return update._value;
    };

    update._value = initial;
    update._subscribers = [];
    update.subscribe = function (callback) {
        update._subscribers.push(callback);
    };

    update.unsubscribe = function (callback) {
        update._subscribers.splice(update._subscribers.indexOf(callback), 1);
    };

    return update;
}