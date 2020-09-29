var today = new Date();
document.addEventListener('DOMContentLoaded', function () {
    //OnLoad do :
    document.getElementById('addNew').addEventListener('click', function () {
        addNewContract();
        refreshTable();
    });
    document.getElementById('deleteAllButton').addEventListener('click', function () {
        if (confirm("Czy na pewno chcesz usunąć wszystkie rekordy?")) {
            deleteAllContracts();
        }
    });
    document.getElementById('deleteContractButton').addEventListener('click', function () {
        var name = prompt("Podaj nazwę, którą chcesz usunąć", "");
        if (name) {
            deleteContractByName(name);
            refreshTable();
        }
    });
    document.getElementById('exportButton').addEventListener('click', function () {
        exportContracts();
    });
    document.getElementById('importButton').addEventListener('click', function () {
        if (confirm("Obecne rekordy zostaną usunięte, czy chcesz kontynuować?")) {
            importContracts();
        }
    });
    refreshTable();
});

function refreshTable() {
    if (storage.get("records")) {
        createTableFromLocalvalues("mainTable");
    } else {
        document.getElementById("mainTable").innerHTML = "";
    }
}

function exportContracts() {
    document.getElementById('importExport').value = JSON.stringify(storage.get("records"));
    copyTextToClipboardById('importExport');
    alert("Pomyślnie skopiowano do schowka.");
}

function importContracts() {
    var textToImport = document.getElementById('importExport').value;
    if (isJsonStringCorrect(textToImport)) {
        var records = JSON.parse(textToImport);
        storage.set("records", records);
        refreshTable();
        alert("Pomyślnie zaimportowano rekordy.");
    } else {
        alert("Podany JSON jest błędny.");
    }
}

function addNewContract() {
    var name = document.getElementById("name").value;
    var dateFrom = document.getElementById("dateFrom").value;
    var dateTo = document.getElementById("dateTo").value;
    var urlHoursMonth = document.getElementById("urlHoursMonth").value;
    var urlHoursYear = document.getElementById("urlHoursYear").value;
    var hoursMonthMax = document.getElementById("hoursMonthMax").value;
    var hoursYearMax = document.getElementById("hoursYearMax").value;

    dateFrom = new Date(dateFrom);
    dateTo = new Date(dateTo);
    
    if (name.length < 3 || name.length > 20) {
        alert("Podaj nazwę [3-20]");

        return;
    }
    if (!(isValidDate(dateFrom) && isValidDate(dateTo))) {
        alert("Wybierz datę");

        return;
    }
    if (hoursMonthMax.length == 0) {
        alert("Podaj liczbę godzin/Miesiąc");

        return;
    }
    if (hoursYearMax.length == 0) {
        alert("Podaj liczbę godzin/Rok");

        return;
    }
    if (urlHoursMonth) {
        if (!getTimeByUrl(urlHoursMonth)) {
            alert("Podany link h/Miesiąc jest błędny lub nie jesteś zalogowany");

            return;
        }
    } else {
        alert("Podany link h/Miesiąc");

        return;
    }
    if (urlHoursYear) {
        if (!getTimeByUrl(urlHoursYear)) {
            alert("Podany link h/Rok jest błędny lub nie jesteś zalogowany");

            return;
        }
    } else {
        alert("Podany link h/Rok");

        return;
    }


    var newContract = {
        "name": name,
        "dateFrom": dateFrom.getTime(),
        "dateTo": dateTo.getTime(),
        "urlHoursMonth": urlHoursMonth,
        "urlHoursYear": urlHoursYear,
        "hoursMonth": 0,
        "hoursMonthMax": hoursMonthMax,
        "hoursYear": 0,
        "hoursYearMax": hoursYearMax
    };
    var records = storage.get("records");
    if (!records) {
        records = {};
    }
    records[Object.keys(records).length + 1] = newContract;
    storage.set("records", records);
    alert("Dodano");
}

function deleteContractByName(name) {
    var records = storage.get("records");
    var removed = false;
    jQuery.each(records, function (_i, value) {
        if (value.name == name) {
            delete records[_i];
            removed = true;
            return false;
        }
    });
    if (removed) {
        storage.set("records", records);
        alert("Pomyślnie usnięto '" + name + "'");
    } else {
        alert("Nie znaleziono rekordu o nazwie '" + name + "'");
    }
}

function deleteAllContracts() {
    storage.set("records", false);
    refreshTable();
    alert("Pomyślnie usunięto wszystkie rekordy.");
}