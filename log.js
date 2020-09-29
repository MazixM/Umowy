document.addEventListener('DOMContentLoaded', function () {
    //OnLoad do :
    document.getElementById('clearLogButton').addEventListener('click', function () {
        clearLog();
        showLog();
    });
    document.getElementById('refreshButton').addEventListener('click', function () {
        showLog();
    });
    showLog();
});
function showLog() {
    var logToShow;
    var log = storage.get("log");
    jQuery.each(log, function (_i, value) {
        logToShow += value.time + " - " + value.log + "<br />";
    });
    if (!logToShow) {
        logToShow = "Brak logów";
    }
    document.getElementById('log').innerHTML = logToShow;
}
function clearLog() {
    storage.set("log", false)
}