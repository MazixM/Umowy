var today = new Date();
document.addEventListener('DOMContentLoaded', function () {
    //OnLoad do :
    displaTodayTime();
    createTableFromLocalvalues("mainTable");
});

function displaTodayTime() {
    document.getElementById("todayDate").innerHTML = ConvertTimeToString(today)
};