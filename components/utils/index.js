export var get = function (propertyName) { return function (obj) { return obj[propertyName]; }; };
export var set = function (propertyName) { return function (obj) { return function (value) { return obj[propertyName] = value; }; }; };
// TODO: Test
export var classy = function (classes) { return keys(classes).filter(function (key) { return classes[key] === true; }).join(' '); };
// TODO: Test
export var constant = function (value) { return function () { return value; }; };
// TODO: Test
export var identity = function (value) { return value; };
// TODO: Test
export var voidify = function (fn) { return function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    fn.apply(void 0, args);
}; };
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
export var value = function (fnOrValue) {
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
export var when = function (condition, next) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return function (obj) {
        if (value(condition, obj))
            next.apply(void 0, args);
    };
};
// TODO: Test
export var equal = function (value1, value2) { return function (obj) { return value(value1, obj) === value(value2, obj); }; };
