"use strict";
exports.__esModule = true;
exports.get = function (propertyName) { return function (obj) { return obj[propertyName]; }; };
exports.set = function (propertyName) { return function (obj) { return function (value) { return obj[propertyName] = value; }; }; };
// TODO: Test
exports.constant = function (value) { return function () { return value; }; };
// TODO: Test
exports.identity = function (value) { return value; };
// TODO: Test
exports.voidify = function (fn) { return function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    fn.apply(void 0, args);
}; };
exports.groupBy = function (propertyName) {
    var valueOfProperty = exports.get(propertyName);
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
exports.keys = function (obj) { return Object.keys(obj); };
exports.last = function (array) { return array ? array[array.length - 1] : undefined; };
// TODO: Test
exports.value = function (fnOrValue) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return typeof fnOrValue === 'function' ? fnOrValue.apply(void 0, args) : fnOrValue;
};
var uniqueIDs = {};
exports.uniqueId = function (prefix) {
    if (prefix === void 0) { prefix = ''; }
    if (uniqueIDs[prefix] == null) {
        uniqueIDs[prefix] = -1;
    }
    uniqueIDs[prefix]++;
    return prefix + uniqueIDs[prefix];
};
// TODO: Test
exports.when = function (condition, next) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return function (obj) {
        if (exports.value(condition, obj))
            next.apply(void 0, args);
    };
};
// TODO: Test
exports.equal = function (value1, value2) { return function (obj) { return exports.value(value1, obj) === exports.value(value2, obj); }; };
