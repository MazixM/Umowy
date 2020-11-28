document.addEventListener("DOMContentLoaded", function () {
  //OnLoad do :
  displaTodayTime();
  var records = storage.get("records");
  if (records) {
    createTableFromLocalvalues("mainTable");
  }
  document
    .getElementById("refreshButton")
    .addEventListener("click", function () {
      updateLocalRecordsTime();
      createTableFromLocalvalues("mainTable");
    });
});

function displaTodayTime() {
  document.getElementById("todayDate").innerHTML = ConvertTimeToString(today);
}
