///Save/read function
var storage = (function () {

    var setData = function (key, obj) {
        var values = JSON.stringify(obj);
        localStorage.setItem(key, values);
    }

    var getData = function (key) {
        if (localStorage.getItem(key) != null) {
            return JSON.parse(localStorage.getItem(key));
        } else {
            return false;
        }
    }

    var updateDate = function (key, newData) {
        if (localStorage.getItem(key) != null) {
            var oldData = JSON.parse(localStorage.getItem(key));
            for (keyObj in newData) {
                oldData[keyObj] = newData[keyObj];
            }
            var values = JSON.stringify(oldData);
            localStorage.setItem(key, values);
        } else {
            return false;
        }
    }

    return { set: setData, get: getData, update: updateDate }
})();

function ConvertTimeToString(time) {
    var newData = new Date(time);
    var dd = String(newData.getDate()).padStart(2, '0');
    var mm = String(newData.getMonth() + 1).padStart(2, '0');
    var yyyy = newData.getFullYear();
    return dd + '/' + mm + '/' + yyyy;
}
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}