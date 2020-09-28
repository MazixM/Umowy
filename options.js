var today = new Date();
document.addEventListener('DOMContentLoaded', function () {
    //OnLoad do :
    document.getElementById('addNew').addEventListener('click', function () {
        addNewContract();
        refreshTable();
    });
    document.getElementById('deleteAll').addEventListener('click', function () {
        deleteAllContracts();
        refreshTable();
        alert("Pomyślnie usunięto wszystkie rekordy.");
    });
    document.getElementById('exportButton').addEventListener('click', function () {
        exportContracts();
    });
    document.getElementById('importButton').addEventListener('click', function () {
        importContracts();
    });
    refreshTable();
});

function refreshTable() {
    var records = storage.get("records");
    if (records != "false" && records != false) {
        createTableFromLocalvalues("mainTable");
    }else
    {
        document.getElementById("mainTable").innerHTML="";
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
        storage.set("records", JSON.parse(textToImport));
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
    var counter = storage.get("counter");
    if (counter == false) {
        counter = 0;
    }
    counter++;
    storage.set("counter", counter);
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
    if (records == false) {
        records = {};
    }
    records[counter] = newContract;
    storage.set("records", records);
    alert("Dodano");
}

function deleteContractByName(name) {
    alert(name);
}

function deleteAllContracts() {
    storage.set("records", false);
    storage.set("counter", false);
}