const insertPlantsInList = (plants) => {
    const plantList = document.getElementById("plant_list");

    plants.plants.forEach(plant => {
        // Create the card div
        const card = document.createElement("div");
        card.className = "card my-1";
        card.style.width = "60%";

        // Create the card header
        const cardHeader = document.createElement("div");
        cardHeader.className = "card-header";

        const headerContent = document.createElement("div");
        headerContent.className = "d-flex justify-content-between align-items-center";

        // Creator info
        const creatorDiv = document.createElement("div");
        creatorDiv.className = "d-flex align-items-center";

        const creatorIcon = document.createElement("svg");
        creatorIcon.innerHTML = '<path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/><path fill-rule="evenodd" d="M0 8a8 8 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>';
        creatorIcon.setAttribute("viewBox", "0 0 16 16");
        creatorIcon.setAttribute("fill", "currentColor");
        creatorIcon.className = "bi bi-person-circle";
        creatorIcon.style.width = "30px";  // Fixed to add "px"
        creatorIcon.style.height = "30px";  // Fixed to add "px"

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
        chevronIcon.innerHTML = '<path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>';
        chevronIcon.setAttribute("viewBox", "0 0 16 16");
        chevronIcon.setAttribute("fill", "currentColor");
        chevronIcon.className = "bi bi-chevron-right mx-2";
        chevronIcon.style.width = "20px";  // Fixed to add "px"
        chevronIcon.style.height = "20px";  // Fixed to add "px"

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
        plantNameLink.href = `/plantdetails?plantid=${plant.plantid}`;
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




// Register service worker to control making site work offline
window.onload = function () {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js', {scope: '/'})
            .then(function (reg) {
                console.log('Service Worker Registered!', reg);
            })
            .catch(function (err) {
                console.log('Service Worker registration failed: ', err);
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
                    navigator.serviceWorker.ready
                        .then(function (serviceWorkerRegistration) {
                            serviceWorkerRegistration.showNotification("Plant App",
                                {body: "Notifications are enabled!"})
                                .then(r => console.log(r));
                        });
                }
            });
        }
    }

    // Fetch plant data from the server when online
    if (navigator.onLine) {
        fetch('http://localhost:3000/api/plants')
            .then(function (res) {
                return res.json();
            }).then(function (newPlants) {
                console.log(newPlants)
                console.log(typeof(newPlants))
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
}