var Model = (function () {
    function Model() {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        var _this = this;
        data.forEach(function (item) {
            for (var key in item) {
                if (item.hasOwnProperty(key)) {
                    _this[key] = item[key];
                }
            }
        });
    }
    return Model;
}());
export { Model };
