function displayFileName() {
  const fileInput = document.getElementById("fileInput");
  const fileNameDisplay = document.getElementById("fileNameDisplay");
  const file = fileInput.files[0];
  fileNameDisplay.textContent = file ? file.name : "";
}

document.addEventListener("DOMContentLoaded", () => {
const switches = document.querySelectorAll('input[type="checkbox"]');

// Loop through each switch
switches.forEach((switchElement) => {
  // Add event listener for change event
  switchElement.addEventListener("change", function () {
    // Update the value attribute of the switch based on its checked status
    this.value = this.checked ? "true" : "false";
  });
});

document.getElementById("newPostButton").addEventListener("click", async () => {
  try {
    const position = await getCurrentPosition();
    document.getElementById("latitudeInput").value = position.coords.latitude;
    document.getElementById("longitudeInput").value = position.coords.longitude;
    alert("Location retrieved successfully.");
    document.getElementById("plantForm").submit(); // Automatically submit the form
  } catch (error) {
    console.error("Error retrieving location:", error);
  }
});

async function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      reject(new Error("Geolocation API is not supported."));
    }
  });
}


});
