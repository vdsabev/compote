export var get = function (propertyName) { return function (obj) { return obj[propertyName]; }; };
export var set = function (propertyName) { return function (obj) { return function (value) { return obj[propertyName] = value; }; }; };
export var setFlag = function (obj, propertyName, newValue) {
    if (newValue === void 0) { newValue = true; }
    var originalValue = obj[propertyName];
    obj[propertyName] = newValue;
    return {
        whileAwaiting: function (promise) {
            var unsetFlag = function () { return obj[propertyName] = originalValue; };
            // We could use `finally`, but some promises (e.g. Firebase) don't support it
            return promise["catch"](unsetFlag).then(unsetFlag);
        }
    };
};
// TODO: Test
export var constant = function (value) { return function () { return value; }; };
export var groupBy = function (propertyName) {
    var valueOfProperty = get(propertyName);
    return function (items) {
        var result = {};
        items.forEach(function (item) {
            var value = valueOfProperty(item);
            if (!result[value]) {
                result[value] = [];
            }
            result[value].push(item);
        });
        return result;
    };
};
export var keys = function (obj) { return Object.keys(obj); };
export var last = function (array) { return array ? array[array.length - 1] : undefined; };
// TODO: Test
export var result = function (fnOrValue) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return typeof fnOrValue === 'function' ? fnOrValue.apply(void 0, args) : fnOrValue;
};
var uniqueIDs = {};
export var uniqueId = function (prefix) {
    if (prefix === void 0) { prefix = ''; }
    if (uniqueIDs[prefix] == null) {
        uniqueIDs[prefix] = -1;
    }
    uniqueIDs[prefix]++;
    return prefix + uniqueIDs[prefix];
};
// TODO: Test
export var when = function (value1, value2, next) {
    var args = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args[_i - 3] = arguments[_i];
    }
    return function (obj) {
        if (result(value1, obj) === result(value2, obj)) {
            next.apply(void 0, args);
        }
    };
};
