var today = new Date();
document.addEventListener('DOMContentLoaded', function () {
    //OnLoad do :
    DisplaTodayTime();
    createTableFromLocalvalues("mainTable");
});

function DisplaTodayTime() {
    document.getElementById("todayDate").innerHTML = ConvertTimeToString(today)
};