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

let plantID = '';

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
        readFileAsDataUrl(plantData.image)
          .then((dataUrl) => {
            plantData.image = dataUrl; // Store image as data URL
            // Now add the plant data to IndexedDB including the image
            // addNewPlantToSync(syncPlantIDB, plantData);
          })
          .catch((error) => {
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

  const plantSuggestion = document.getElementById("suggestionForm");
  plantSuggestion.addEventListener("submit", function (event) {
    event.preventDefault();

    let modal = document.getElementById("suggestModal");
    let modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();

    // Gather data from the suggestion form
    const suggestionFormData = {
      plantID: document.getElementById("plantIDInput").value,
      suggestedName: document.getElementById("suggestion").value,
      identifiedBy: document.getElementById("suggesterUsername").value,
      status: "Not Approved",
      approved: false,
    };

    plantID = suggestionFormData.plantID;
    const plantidentificationID = Math.floor(Math.random() * 10000);
    console.log("Collected suggestion data: ", suggestionFormData);
    if (!navigator.onLine) {
      openPlantsIDB().then((db) => {
        const plantId = parseInt(suggestionFormData.plantID);
        console.log("PLANT ID: ", suggestionFormData.plantID);
        getPlantById(db, plantId).then((plant) => {
          if (plant) {
            console.log("PLANT FOUND");

            const newIdentification = {
              plantidentificationid: plantidentificationID,
              suggestedname: suggestionFormData.suggestedName,
              identifiedBy: suggestionFormData.identifiedBy,
            };

            plant.identifications.push(newIdentification);

            openPlantsIDB().then((db) => {
              const transaction = db.transaction(["plants"], "readwrite");
              const plantStore = transaction.objectStore("plants");
              const updateRequest = plantStore.put(plant);

              updateRequest.onsuccess = () => {
                console.log("Plant data updated successfully.");
                alert("You are offline. Your suggestion will be saved and synced when you are back online.");
              };

              updateRequest.onerror = (event) => {
                console.error("Error updating plant data:", event.target.error);
              };
            });
            // Update the plant data in IndexedDB
          } else {
            console.log("PLANT NOT FOUND");
          }
        });
      });
    } else if(navigator.onLine) {
      console.log("Online mode. Saving suggestion to network DB.");
      saveIdentification(
        suggestionFormData.plantID,
        plantidentificationID,
        suggestionFormData.suggestedName,
        suggestionFormData.identifiedBy
      );
    }
  });
});

function saveIdentification(
  plantid,
  identificationID,
  suggestionTextInput,
  identifiedBy
) {
  let identification = {
    plantidentificationid: identificationID,
    suggestedname: suggestionTextInput,
    identifiedby: identifiedBy,
  };
  console.log("Identification: ", identification);
  fetch(`http://localhost:5000/api/${plantid}/plantIdentification`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(identification),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Identification Success:", data);
    })
    .catch((error) => {
      console.error("Identification error: ", error);
    });
}

function getIDBIdentificationAndPushIntoNetworkDb() {
  openPlantsIDB().then((db) => {
    const plantId = parseInt(plantID);
    getPlantById(db, plantId).then((plant) => {
      if (plant) {
        console.log("PLANT FOUND");
        const saveIdentificationPromises = [];
        plant.identifications.forEach(identification => {
          saveIdentificationPromises.push(
            saveIdentification(
              plantId,
              identification.plantidentificationid,
              identification.suggestedname,
              identification.identifiedBy
            )
          );
        });
          Promise.all(saveIdentificationPromises)
            .then(() =>{
              console.log("All suggestion saved successfully");
            })
            .catch(error => {
              console.error("Error saving suggestion: ", error);
            });
      } else {
        console.log("PLANT NOT FOUND IN GET IDB PUSH TO NWK");
      }
    });
  });
}

window.addEventListener("online", () => {
  alert("You are back online. Your suggestion will be synced now.");
  getIDBIdentificationAndPushIntoNetworkDb();
});

// You need to ensure functions like `openPlantsIDB` and `addNewPlantToSync` are defined and properly handle the data structure.
