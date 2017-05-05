export function get(propertyName) {
    return function (obj) { return obj[propertyName]; };
}
export function set(propertyName) {
    return function (obj) { return function (value) { return obj[propertyName] = value; }; };
}
export function setFlag(obj, propertyName, newValue) {
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
}
export function groupBy(propertyName) {
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
export function keys(obj) {
    return Object.keys(obj);
}
export function last(array) {
    return array ? array[array.length - 1] : undefined;
}
var uniqueIDs = {};
export function uniqueId(prefix) {
    if (prefix === void 0) { prefix = ''; }
    if (uniqueIDs[prefix] == null) {
        uniqueIDs[prefix] = -1;
    }
    uniqueIDs[prefix]++;
    return prefix + uniqueIDs[prefix];
}
