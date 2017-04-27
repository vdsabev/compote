"use strict";
exports.__esModule = true;
function get(propertyName) {
    return function (obj) { return obj[propertyName]; };
}
exports.get = get;
function groupBy(propertyName) {
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
}
exports.groupBy = groupBy;
function keys(obj) {
    return Object.keys(obj);
}
exports.keys = keys;
function last(array) {
    return array ? array[array.length - 1] : undefined;
}
exports.last = last;
var uniqueIDs = {};
function uniqueId(prefix) {
    if (prefix === void 0) { prefix = ''; }
    if (uniqueIDs[prefix] == null) {
        uniqueIDs[prefix] = -1;
    }
    uniqueIDs[prefix]++;
    return prefix + uniqueIDs[prefix];
}
exports.uniqueId = uniqueId;
