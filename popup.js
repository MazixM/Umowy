var today = new Date();
document.addEventListener('DOMContentLoaded', function () {
    //OnLoad do :
    displaTodayTime();
    var records = storage.get("records");
    if (records != "false" && records != false) {
        createTableFromLocalvalues("mainTable");
    }
    document.getElementById('refreshButton').addEventListener('click', function () {
        updateLocalRecordsTime("progressBar");
        createTableFromLocalvalues("mainTable");
    });
});

function displaTodayTime() {
    document.getElementById("todayDate").innerHTML = ConvertTimeToString(today)
};