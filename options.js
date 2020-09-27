var today = new Date();
document.addEventListener('DOMContentLoaded', function () {
    //OnLoad do :
    document.getElementById('addNew').addEventListener('click', function () {
        alert(addNewContract());
        refreshTable();
    });
    document.getElementById('deleteAll').addEventListener('click', function () {
        deleteAllContracts();
        refreshTable();
        alert("Pomyślnie usunięto wszystkie rekordy.");
    });
    document.getElementById('exportButton').addEventListener('click', function () {
        document.getElementById('importExport').value = JSON.stringify(storage.get("records"));
        copyTextToClipboardById('importExport');
        alert("Pomyślnie skopiowano do schowka.");
    });
    document.getElementById('importButton').addEventListener('click', function () {
        var textToImport = document.getElementById('importExport').value;
        if (isJsonStringCorrect(textToImport)) {
            storage.set("records", JSON.parse(textToImport));
            refreshTable();
            alert("Pomyślnie zaimportowano rekordy.");
        } else {
            alert("Podany JSON jest błędny.");
        }
    });
    refreshTable();
});

function refreshTable() {
    createTableFromLocalvalues("mainTable");
}

function addNewContract() {
    var name = document.getElementById("name").value;
    var dateFrom = document.getElementById("dateFrom").value;
    var dateTo = document.getElementById("dateTo").value;

    dateFrom = new Date(dateFrom);
    dateTo = new Date(dateTo);
    if (name.length < 3 || name.length > 20) {
        return "Podaj nazwę [3-20]";
    }
    if (isValidDate(dateFrom) && isValidDate(dateTo)) {
        var counter = storage.get("counter");
        if (counter == false) {
            counter = 0;
        }
        counter++;
        storage.set("counter", counter);
        var newContract = {
            "name": name,
            "dateFrom": dateFrom.getTime(),
            "dateTo": dateTo.getTime()
        };
        var records = storage.get("records");
        if (records == false) {
            records = {};
        }
        records[counter] = newContract;
        storage.set("records", records);

        return "Dodano";
    } else {
        return "Wybierz datę";
    }
}

function deleteContractByName(name) {
    alert(name);
}

function deleteAllContracts() {
    storage.set("records", false);
    storage.set("counter", false);
}