function displayFileName() {
  const fileInput = document.getElementById("fileInput");
  const fileNameDisplay = document.getElementById("fileNameDisplay");
  const file = fileInput.files[0];
  fileNameDisplay.textContent = file ? file.name : "";
}

document.addEventListener("DOMContentLoaded", () => {
  // Get all the switches
  const switches = document.querySelectorAll('input[type="checkbox"]');

  // Loop through each switch
  switches.forEach((switchElement) => {
    // Add event listener for change event
    switchElement.addEventListener("change", function () {
      // Update the value attribute of the switch based on its checked status
      this.value = this.checked ? "true" : "false";
    });
  });
  document.getElementById("postButton").addEventListener("click", async () => {
    console.log("Hello");
    const nameOfPlant = document.getElementById("nameOfPlant").value;
    const fileInput = document.getElementById("fileInput").value;
    const userNickname = document.getElementById("userNickname").value;
    const dateAndTime = document.getElementById("datePickerInput").value;
    const plantDescription = document.getElementById("plantDescription").value;
    const hasFlowers = document.getElementById("flowerSwitch").value;
    const hasLeaves = document.getElementById("leavesSwitch").value;
    const hasFruitsOrSeeds = document.getElementById("fruitSeeds").value;
    const flowerColor = document.getElementById("flowerColor").value;

    //    Logging to console
    console.log(
      nameOfPlant,
      fileInput,
      userNickname,
      dateAndTime,
      plantDescription,
      hasFlowers,
      hasLeaves,
      hasFruitsOrSeeds,
      flowerColor
    );

    const formData = new FormData();
    formData.append("nameOfPlant", nameOfPlant);
    formData.append("fileInput", fileInput);
    formData.append("userNickname", userNickname);
    formData.append("dateAndTime", dateAndTime);
    formData.append("plantDescription", plantDescription);
    formData.append("hasFlowers", hasFlowers);
    formData.append("hasLeaves", hasLeaves);
    formData.append("hasFruitsOrSeeds", hasFruitsOrSeeds);
    formData.append("flowerColor", flowerColor);

    function generateRandomID(){
        const randomNumber = Math.floor(Math.random() * 1000);
        return randomNumber.toString();
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();

    console.log(formattedDate);

    try {
        // Check if the Geolocation API is supported by the browser
        if ("geolocation" in navigator) {
            // Get the current position
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    // Extract latitude and longitude from the position object
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
    
                    // Include latitude and longitude in the request body
                    const requestBody = {
                        plantid: generateRandomID(),
                        name: nameOfPlant,
                        description: plantDescription,
                        image: fileInput, // Assuming fileInput contains the image file name
                        latitude: latitude,
                        longitude: longitude,
                        createdby: userNickname,
                        createddate: formattedDate
                    };
    
                    // Make the fetch request
                    const response = await fetch('http://localhost:5000/api/plants', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(requestBody)
                    });
    
                    // Check if the request was successful
                    if (response.ok) {
                        const data = await response.json();
                        console.log(data);
                    } else {
                        const errorData = await response.json();
                        console.error('Failed to create plant:', errorData);
                    }
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
    
  });
});
