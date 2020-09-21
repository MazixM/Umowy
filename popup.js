var today = new Date();
document.addEventListener('DOMContentLoaded', function () {
    //OnLoad do :
    DisplaTodayTime();
    CreateTableFromLocalvalues();
});

function DisplaTodayTime() {
    document.getElementById("todayDate").innerHTML = ConvertTimeToString(today)
};
function CreateTableFromLocalvalues() {
    var firstRow = "<tr><td colspan=\"3\"><b>Aktualne umowy</b></td></tr>" +
        "<tr><td><b>Nazwa</b></td><td><b>Data od</b></td><td><b>Data do</b></td></tr>";
    var expiredRow = "<tr><td colspan=\"3\"><b>Nieaktualne umowy</b></td></tr>";
    var actualContract = "";
    var expiredContract = "";
    var records = JSON.stringify(storage.get("records"));
    if (records == 'false') {
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

    document.getElementById("mainTable").innerHTML = firstRow + actualContract + expiredRow + expiredContract;
}