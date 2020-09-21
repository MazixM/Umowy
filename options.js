document.addEventListener('DOMContentLoaded', function () {
    //OnLoad do :
    document.getElementById('addNew').addEventListener('click', function () {
        document.getElementById('message').innerHTML = addNewContract();
    });
    document.getElementById('deleteAll').addEventListener('click', function () {
        deleteAllContracts();
        alert("Usunięto");
    });
});

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

}
function deleteAllContracts() {
    storage.set("records", false);
    storage.set("counter", false);
}
function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}