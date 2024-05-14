if ("undefined" === typeof window) {
  importScripts("./util/idb-utility.js");
}

let plantIDVar = "";

function closeModal(modal) {
  modal.style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  const approveButtons = document.querySelectorAll(".approve-button");

  approveButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const plantid = this.getAttribute("data-plantid");
      const identifiedBy = this.getAttribute("data-identifiedby");
      console.log("Plantid: ", plantid);
      plantIDVar = plantid;
      console.log("Suggested name:", identifiedBy);
      approveSuggestion(plantid, identifiedBy);
    });
  });

  // Plant id for edited
});

function approveSuggestion(plantID, suggestedName) {
  if (!navigator.onLine) {
    openPlantsIDB()
      .then((db) => {
        const plantId = parseInt(plantID);
        getPlantById(db, plantId)
          .then((plant) => {
            if (plant) {
              console.log("Plant found");
              plant.name = suggestedName;
              updatePlant(db, plant)
                .then(() => {
                  console.log("Plant name updated successfully");

                  plant.plantIdentificationStatus = true;
                  updatePlant(db, plant)
                    .then(() => {
                      console.log(
                        "Plant identification status updated successfully"
                      );
                    })
                    .catch((error) => {
                      console.error(
                        "Error updating plant identification status:",
                        error
                      );
                    });
                })
                .catch((error) => {
                  console.error("Error updating plant", error);
                });
            } else {
              console.error("Plant not found");
            }
          })
          .catch((error) => {
            console.error("Error fetching from IDB", error);
          });
      })
      .catch((error) => {
        console.error("Error opening IDB", error);
      });
  } else if (navigator.onLine) {
    console.log("Online. Approving suggested name");
    approveSuggestedName(plantID, suggestedName);
  }
}

function approveSuggestedName(plantid, suggestedname) {
  const payload = { suggestedname: suggestedname };
  fetch(`http://localhost:5000/api/${plantid}/approvesuggestion`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Approved and updated successfully: ", data);
      const plantIdentificationStatus = true;
      const payload = { plantIdentificationStatus: plantIdentificationStatus };
      fetch(
        `http://localhost:5000/api/${plantid}/updatePlantIdentificationStatus`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      location.reload();
    })
    .catch((error) => {
      console.error("Approved and updated failed: ", error);
    });
}

function updatePlant(db, updatedPlant) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("plants", "readwrite");
    const objectStore = transaction.objectStore("plants");
    const request = objectStore.put(updatedPlant);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

function getIDBSuggestionApprovalAndPushIntoNetworkDb() {
  openPlantsIDB().then((db) => {
    const plantId = parseInt(plantIDVar);
    getPlantById(db, plantId).then((plant) => {
      if (plant) {
        console.log("PLANT FOUND");
        approveSuggestedName(plantId, plant.name)
          .then(() => {
            console.log("Approved suggestion synced to online db");
          })
          .catch((error) => {
            console.error("Error syncing the approved name", error);
          });
      } else {
        console.log("PLANT NOT FOUND IN IDB");
      }
    });
  });
}

// Code for edited name and description

function saveEditedChanges(plantid) {
  console.log("Clicked on save changes");
  console.log("Plant id: ", plantid);
  const editedname = document.getElementById("editedname").value;
  const editeddescription = document.getElementById("editeddescription").value;
  console.log(
    "Edited name: ",
    editedname,
    "Edited description",
    editeddescription
  );
  plantIDVar = plantid;
  updateNameAndDescription(plantid, editedname, editeddescription);
}

function updateNameAndDescription(plantID, editedname, editeddescription) {
  if (!navigator.onLine) {
    openPlantsIDB()
      .then((db) => {
        const plantId = parseInt(plantID);
        getPlantById(db, plantId)
          .then((plant) => {
            if (plant) {
              console.log("Plant found");
              (plant.name = editedname),
                (plant.description = editeddescription);
              updatePlant(db, plant)
                .then(() => {
                  const modal = document.getElementById("editNameDescModal");
                  let modalInstance = bootstrap.Modal.getInstance(modal);
                  modalInstance.hide();
                  console.log(
                    "Plant name and description updated successfully"
                  );
                })
                .catch((error) => {
                  console.error(
                    "Error updating plant name and description: ",
                    error
                  );
                });
            } else {
              console.error("Plant not found");
            }
          })
          .catch((error) => {
            console.error("Error fetching from IDB: ", error);
          });
      })
      .catch((error) => {
        console.error("Error opening IDB: ", error);
      });
  } else if (navigator.onLine) {
    console.log("Online. Directly pushing to online db");
    updateNameAndDescriptionOnline(plantID, editedname, editeddescription);
  }
}

function updateNameAndDescriptionOnline(
  plantid,
  editedname,
  editeddescription
) {
  const payload = {
    editedname: editedname,
    editeddescription: editeddescription,
  };
  console.log("Payload: ", payload);
  fetch(`http://localhost:5000/api/${plantid}/updateNameAndDescription`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      const modal = document.getElementById("editNameDescModal");
      let modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      console.log("Updated name and desc successfully: ", data);
      location.reload();
    })
    .catch((error) => {
      console.error("Updating name and desc failed: ", error);
    });
}

function getIDBUpdatedNameAndDescriptionAndPushIntoNetworkDB() {
  openPlantsIDB().then((db) => {
    const plantId = parseInt(plantIDVar);
    getPlantById(db, plantId).then((plant) => {
      if (plant) {
        console.log("PLANT found");
        updateNameAndDescriptionOnline(plantId, plant.name, plant.description)
          .then(() => {
            console.log("Synced plant name and description to online db");
          })
          .catch((error) => {
            console.error(
              "Error syncing the updated plant name and description",
              error
            );
          });
      } else {
        console.log("PLANT NOT FOUND IN IDB");
      }
    });
  });
}

// When the system comes back online
window.addEventListener("online", () => {
  alert(
    "You are online. Approved suggestions and edited name, description will be synced now"
  );
  getIDBSuggestionApprovalAndPushIntoNetworkDb();
  getIDBUpdatedNameAndDescriptionAndPushIntoNetworkDB();
});
