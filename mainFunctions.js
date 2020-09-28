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
function isJsonStringCorrect(str) {
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
    var actualContractRow = "";
    var expiredContractRow = "";
    var records = storage.get("records");

    var color = "";
    jQuery.each(records, function (_i, value) {
        if (value.dateTo <= today.getTime()) {
            color = "red";
        } else if ((value.dateTo - today.getTime()) > 604800000) // 7 days
        {
            color = "green";
        } else {
            color = "yellow";
        }
        var currentRow = "<tr style='background-color: " + color + "'><td>" + value.name + "</td><td>" + ConvertTimeToString(value.dateFrom) + "</td><td>" + ConvertTimeToString(value.dateTo) + "</td><td>" + value.hoursMonth + "/" + value.hoursMonthMax + "</td><td>" + value.hoursYear + "/" + value.hoursYearMax + "</td></tr>";
        if (color == "red") {
            expiredContractRow += currentRow;
        } else {
            actualContractRow += currentRow;
        }
    });

    document.getElementById(divId).innerHTML = (firstRow + actualContractRow + expiredRow + expiredContractRow);
}

function copyTextToClipboardById(id) {
    var copyText = document.getElementById(id);
    copyText.select();
    document.execCommand("copy");

    return copyText.value;
}

function getTimeByURL(webURL) {
    const regexFilter = /<span class="value">(?<time>[0-9]{0,5}:[0-9]{0,2})<\/span>/;
    const htmlContent = $.ajax({
        url: webURL,
        async: false
    }).responseText;
    if (htmlContent != null) {
        var regex = htmlContent.match(regexFilter);
        if (regex != null) {
            return regex[0];
        }
    }
    alert("Nie jesteś zalogowany")

    return "";
}

function updateLocalRecordsTime(progressBarId) {
    var records = storage.get("records");
    var recordsCount = storage.get("counter");
    var progress = document.getElementById(progressBarId);
    progress.value = 0;
    progress.max = recordsCount;
    jQuery.each(records, function (_i, value) {
        progress.value = _i;
        if (value.urlHoursMonth != null && value.urlHoursMonth != "") {
            var time = getTimeByURL(value.urlHoursMonth);
            if (time != "") {
                value.hoursMonth = time;
            }
        }
        if (value.urlHoursYear != null && value.urlHoursYear != "") {
            var time = getTimeByURL(value.urlHoursYear);
            if (time != "") {
                value.hoursYear = time;
            }
        }
    });
    storage.set("records", records);
}