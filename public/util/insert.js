
if ("undefined" === typeof window) {
  importScripts("./util/idb-utility.js");
}

const readFileAsDataUrl = (file) => {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
  });
};

document.addEventListener("DOMContentLoaded", function () {
  const plantForm = document.getElementById("plantForm");

  plantForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission via HTTP

    //This closes the new post modal
    let modal = document.getElementById("newPostModal");
    let modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();

    // Refresh the page
    location.reload();

    // Gather data from the form
    const plantData = {
      name: document.getElementById("nameOfPlant").value,
      image: document.getElementById("fileInput").files[0], // This will only handle the file as Blob locally
      createdby: document.getElementById("userNickname").value,
      dateTimeSeen: document.getElementById("dateTimePickerInput").value,
      description: document.getElementById("plantDescription").value,
      height: parseFloat(document.getElementById("plantHeight").value),
      spread: parseFloat(document.getElementById("plantSpread").value),
      hasFlowers: document.getElementById("flowerSwitch").checked,
      hasLeaves: document.getElementById("leavesSwitch").checked,
      hasFruitsOrSeeds: document.getElementById("fruitSeeds").checked,
      flowerColor: document.getElementById("flowerColor").value,
      latitude: document.getElementById("latitudeInput").value, // Assume these are filled by some other mechanism (like GPS)
      longitude: document.getElementById("longitudeInput").value,
    };

    // Debug print to console
    console.log("Collected Plant Data:", plantData);

    // Open IndexedDB and add new plant to sync
    openSyncPlantsIDB().then((db) => {
      // Assuming plantData contains a file object under 'image'
      if (plantData.image) {
        readFileAsDataUrl(plantData.image).then(dataUrl => {
          plantData.image = dataUrl;  // Store image as data URL
          // Now add the plant data to IndexedDB including the image
          // addNewPlantToSync(syncPlantIDB, plantData);
        }).catch(error => {
          console.error("Error processing file:", error);
        });
      }
      addNewPlantToSync(db, plantData)
        .then(() => {
          // Close the modal
          // Notify user via service worker
          navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
            serviceWorkerRegistration
              .showNotification("Plant App", {
                body: `New plant added! - ${plantData.name}`,
              })
              .then((r) => console.log("Notification displayed:", r))
              .catch((e) => console.error("Notification failed:", e));
          });
        })
        .catch((error) => {
          console.error("Error adding plant to DB:", error);
        });
    });
  });
});

// You need to ensure functions like `openPlantsIDB` and `addNewPlantToSync` are defined and properly handle the data structure.
