var today = new Date();

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

    var logData = function (text) {
        var time = Date.now();
        var log = JSON.parse(localStorage.getItem("log"));
        if (log) {
            log[Object.keys(log).length + 1] = { "time": ConvertTimeToString(time), "log": text }
            localStorage.setItem("log", JSON.stringify(log));
        } else {
            localStorage.setItem("log", JSON.stringify({ "time": ConvertTimeToString(time), "log": text }));
        }
    }

    return { set: setData, get: getData, update: updateDate, log: logData }
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
        "<tr><td><b>Nazwa</b></td><td><b>Data od</b></td><td><b>Data do</b></td><td><b>h/miesiąc</b></td><td><b>h/rok</b></td></tr>";
    var expiredRow = "<tr><td colspan=\"5\"><b>Nieaktualne umowy</b></td></tr>";
    var actualContractRow = "";
    var expiredContractRow = "";
    var records = storage.get("records");

    var color = "";
    jQuery.each(records, function (_i, value) {
        if (value.dateTo <= today.getTime()) {
            color = "red";
        } else if ((value.dateTo - today.getTime()) > 1209600000)// 14 days // 604800000) // 7 days
        {
            color = "green";
        } else {
            color = "yellow";
        }
        var currentRow = "<tr style='background-color: " + color + "'><td>" + value.name + "</td><td>" + ConvertTimeToString(value.dateFrom) + "</td><td>" + ConvertTimeToString(value.dateTo) + "</td><td><a href='" + value.urlHoursMonth + "' target='_blank'>" + value.hoursMonth + " / " + value.hoursMonthMax + "<a/></td><td><a href='" + value.urlHoursYear + "' target='_blank'>" + value.hoursYear + " / " + value.hoursYearMax + "</a></td></tr>";
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

function getTimeByUrl(webURL) {
    const regexFilter = /<span class="value">(?<time>[0-9]{0,5}:[0-9]{0,2})<\/span>/;
    const htmlContent = $.ajax({
        url: webURL,
        async: false
    }).responseText;
    if (htmlContent) {
        var regex = htmlContent.match(regexFilter);
        if (regex) {
            return regex[1];
        }
    }
    storage.log("Nie znaleziono godziny dla URL: " + webURL)

    return "";
}

function updateLocalRecordsTime() {
    var records = storage.get("records");
    var progress = document.getElementById("progressBar");
    progress.value = 0;
    progress.max = Object.keys(records).length;

    jQuery.each(records, function (_i, value) {
        //TODO async
        progress.value = _i;
        value.hoursMonth = getTimeByUrlOrReturnDefault(value.urlHoursMonth, value.hoursMonth);
        value.hoursYear = getTimeByUrlOrReturnDefault(value.urlHoursYear, value.hoursYear);
    });
    storage.set("records", records);
}

function getTimeByUrlOrReturnDefault(webUrl, defaultValue) {
    if (webUrl) {
        var time = getTimeByUrl(webUrl);
        if (time) {
            return time;
        }
    }

    return defaultValue;
}   