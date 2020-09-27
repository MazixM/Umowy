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
function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}
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
function createTableFromLocalvalues(divId) {
    var firstRow = "<tr><td colspan=\"5\"><b>Aktualne umowy</b></td></tr>" +
        "<tr><td><b>Nazwa</b></td><td><b>Data od</b></td><td><b>Data do</b></td><td colspan=\"2\"><table id=\"clearBorder\"><tr><td colspan='2'><b>Godziny serwisowe</b></td></tr><tr><td>Ten miesiąc</td><td>Łącznie</td></tr></table></td></tr>";
    var expiredRow = "<tr><td colspan=\"5\"><b>Nieaktualne umowy</b></td></tr>";
    var actualContract = "";
    var expiredContract = "";
    var records = JSON.stringify(storage.get("records"));
    if (records == false) {
        document.getElementById("mainTable").innerHTML = "<b>Dodaj swoją pierszą umowę w opcjach</b>";

        return;
    }
    var color = "";
    jQuery.each(JSON.parse(records), function (_i, value) {
        if (value.dateTo <= today.getTime()) {
            color = "red";
        } else if ((value.dateTo - today.getTime()) > 604800000) // 7 days
        {
            color = "green";
        } else {
            color = "yellow";
        }
        var textToAdd = "<tr style='background-color: " + color + "'><td>" + value.name + "</td><td>" + ConvertTimeToString(value.dateFrom) + "</td><td>" + ConvertTimeToString(value.dateTo) + "</td></tr>";
        if (color == "red") {
            expiredContract += textToAdd;
        } else {
            actualContract += textToAdd;
        }
    });

    document.getElementById(divId).innerHTML = (firstRow + actualContract + expiredRow + expiredContract);
}