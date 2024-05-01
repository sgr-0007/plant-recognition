const insertPlantsInList = (plants) => {
  const plantList = document.getElementById("plant_list");

  if (plants.plants.length === 0) {
    console.log("HELLLLOOOO");
    // Create a container div
    const div = document.createElement("div");
    div.style.display = "grid";
    div.style.placeItems = "center";
    div.style.height = "100vh";
    div.style.margin = "0";
    div.style.padding = "0";
    
    // Create a nested flex container
    const flexContainer = document.createElement("div");
    flexContainer.style.display = "flex";
    flexContainer.style.flexDirection = "column";
    flexContainer.style.alignItems = "center";
    flexContainer.style.textAlign = "center";
    flexContainer.style.margin = "0";
    flexContainer.style.padding = "0";
    
    // Create and append the image
    const img = document.createElement("img");
    img.src = "images/Drought.svg";
    img.alt = "Drought Images";
    img.style.width = "35vw";
    img.style.height = "auto";
    img.style.maxWidth = "100%";
    img.style.margin = "0";
    img.style.padding = "0";
    flexContainer.appendChild(img);
    
    // Create and append the main heading
    const mainHeading = document.createElement("h1");
    mainHeading.style.fontFamily = "'Growing Garden', sans-serif";
    mainHeading.style.fontSize = "5em";
    mainHeading.style.margin = "0";
    mainHeading.style.padding = "0";
    mainHeading.textContent = "No plants found!";
    flexContainer.appendChild(mainHeading);
    
    // Create and append the subheading
    const subHeading = document.createElement("h3");
    subHeading.style.fontFamily = "'Growing Garden', sans-serif";
    subHeading.style.fontSize = "3em";
    subHeading.style.margin = "0";
    subHeading.style.padding = "0";
    subHeading.textContent = "Go find some plants!";
    flexContainer.appendChild(subHeading);
    
    // Append the nested flex container to the container div
    div.appendChild(flexContainer);
    
    // Append the container div to the plant list
    plantList.appendChild(div);
  }
  else{
  plants.plants.forEach((plant) => {
    // Create the card div
    const card = document.createElement("div");
    card.className = "card my-1";
    card.style.width = "60%";

    // Create the card header
    const cardHeader = document.createElement("div");
    cardHeader.className = "card-header";

    const headerContent = document.createElement("div");
    headerContent.className =
      "d-flex justify-content-between align-items-center";

    // Creator info
    const creatorDiv = document.createElement("div");
    creatorDiv.className = "d-flex align-items-center";

    const svgData = '<?xml version="1.0" ?><svg style="enable-background:new 0 0 24 24;" version="1.1" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="info"/><g id="icons"><g id="user"><ellipse cx="12" cy="8" rx="5" ry="6"/><path d="M21.8,19.1c-0.9-1.8-2.6-3.3-4.8-4.2c-0.6-0.2-1.3-0.2-1.8,0.1c-1,0.6-2,0.9-3.2,0.9s-2.2-0.3-3.2-0.9C8.3,14.8,7.6,14.7,7,15c-2.2,0.9-3.9,2.4-4.8,4.2C1.5,20.5,2.6,22,4.1,22h15.8C21.4,22,22.5,20.5,21.8,19.1z"/></g></g></svg>';

    // Create the SVG element
    const creatorIcon = new DOMParser().parseFromString(svgData, 'image/svg+xml').documentElement;
    
    // Set attributes if necessary
    creatorIcon.setAttribute("width", "30");
    creatorIcon.setAttribute("height", "30");
    creatorIcon.setAttribute("fill", "currentColor");
    
    // Append the SVG to the DOM or use it as needed
    document.body.appendChild(creatorIcon);
    
    

    const creatorName = document.createElement("p");
    creatorName.className = "m-0 mx-2";
    creatorName.textContent = plant.createdby;

    creatorDiv.appendChild(creatorIcon);
    creatorDiv.appendChild(creatorName);

    // Status and details link
    const statusDiv = document.createElement("div");
    statusDiv.className = "d-flex align-items-center";

    const statusText = document.createElement("p");
    statusText.className = "m-0";
    statusText.textContent = "Status: Incomplete";

    const detailsLink = document.createElement("a");
    detailsLink.href = `/plantdetails?plantid=${plant.plantid}`;

    const chevronIcon = document.createElement("svg");
    chevronIcon.innerHTML =
      '<path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>';
    chevronIcon.setAttribute("viewBox", "0 0 16 16");
    chevronIcon.setAttribute("fill", "currentColor");
    chevronIcon.className = "bi bi-chevron-right mx-2";
    chevronIcon.style.width = "20px"; // Fixed to add "px"
    chevronIcon.style.height = "20px"; // Fixed to add "px"

    detailsLink.appendChild(chevronIcon);

    statusDiv.appendChild(statusText);
    statusDiv.appendChild(detailsLink);

    headerContent.appendChild(creatorDiv);
    headerContent.appendChild(statusDiv);
    cardHeader.appendChild(headerContent);
    card.appendChild(cardHeader);

    // Plant image
    const img = document.createElement("img");
    img.className = "card-img-top";
    img.alt = "Plant image";
    img.src = plant.image ? plant.image : "placeholder-image.jpg";
    card.appendChild(img);

    // Card body with plant name and description
    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const plantName = document.createElement("h5");
    plantName.className = "card-title";
    const plantNameLink = document.createElement("a");
    plantNameLink.href = `/plantdetails/plantdetails?plantid=${plant.plantid}`;
    plantNameLink.textContent = plant.name;
    plantName.appendChild(plantNameLink);
    const plantDesc = document.createElement("p");
    plantDesc.className = "card-text";
    plantDesc.textContent = plant.description;

    cardBody.appendChild(plantName);
    cardBody.appendChild(plantDesc);
    card.appendChild(cardBody);

    // Append the constructed card to the plant list at the beginning
    plantList.prepend(card);
  });
}
};

// Register service worker to control making site work offline
window.onload = function () {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then(function (reg) {
        console.log("Service Worker Registered!", reg);
      })
      .catch(function (err) {
        console.log("Service Worker registration failed: ", err);
      });
  }

  // Check if the browser supports the Notification API
  if ("Notification" in window) {
    // Check if the user has granted permission to receive notifications
    if (Notification.permission === "granted") {
      // Notifications are allowed, you can proceed to create notifications
    } else if (Notification.permission !== "denied") {
      // Request permission from the user if not already denied
      Notification.requestPermission().then(function (permission) {
        // If the user grants permission, you can proceed to create notifications
        if (permission === "granted") {
          navigator.serviceWorker.ready.then(function (
            serviceWorkerRegistration
          ) {
            serviceWorkerRegistration
              .showNotification("Plant App", {
                body: "Notifications are enabled!",
              })
              .then((r) => console.log(r));
          });
        }
      });
    }
  }

  // Fetch plant data from the server when online
  if (navigator.onLine) {
    console.log("Online mode");
    fetch("http://localhost:3000/api/plants")
      .then(function (res) {
        return res.json();
      })
      .then(function (newPlants) {
        console.log(newPlants);
        console.log(typeof newPlants);
        openPlantsIDB().then((db) => {
          insertPlantsInList(newPlants, db);
          deleteAllExistingPlantsFromIDB(db).then(() => {
            addNewPlantsToIDB(db, newPlants).then(() => {
              console.log("All new plants added to IDB");
            });
          });
        });
      });
  } else {
    // Handle offline scenario by loading plants from IndexedDB
    console.log("Offline mode");
    openPlantsIDB().then((db) => {
      getAllPlants(db).then((plants) => {
        for (const plant of plants) {
          insertPlantsInList(plant);
        }
      });
    });
  }
};
