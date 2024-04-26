// Function to insert a plant item into the list
const insertPlantInList = (plant) => {
    if (plant.name) {
        const copy = document.getElementById("plant_template").cloneNode(true);
        copy.removeAttribute("id"); // otherwise this will be hidden as well
        copy.innerText = plant.name;
        copy.setAttribute("data-plant-id", plant.id);

        // Insert sorted on string name order - ignoring case
        const plantList = document.getElementById("plant_list");
        const children = plantList.querySelectorAll("li[data-plant-id]");
        let inserted = false;
        for (let i = 0; (i < children.length) && !inserted; i++) {
            const child = children[i];
            const copy_text = copy.innerText.toUpperCase();
            const child_text = child.innerText.toUpperCase();
            if (copy_text < child_text) {
                plantList.insertBefore(copy, child);
                inserted = true;
            }
        }
        if (!inserted) { // Append child if not inserted
            plantList.appendChild(copy);
        }
    }
}

// Register service worker to control making site work offline
window.onload = function () {
    // if ('serviceWorker' in navigator) {
    //     navigator.serviceWorker.register('/sw.js')
    //         .then(function (reg) {
    //             console.log('Service Worker Registered!', reg);
    //         })
    //         .catch(function (err) {
    //             console.log('Service Worker registration failed: ', err);
    //         });
    // }

    // Notification API support check
    if ("Notification" in window) {
        if (Notification.permission === "granted") {
            console.log("Notification permission granted.");
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function (permission) {
                if (permission === "granted") {
                    console.log("Notifications are enabled for plants!");
                }
            });
        }
    }

    // Fetch and manage plant data based on network status
    if (navigator.onLine) {
        fetch('http://localhost:5000/api/plants')
            .then(response => response.json())
            .then(newPlants => {
                openPlantsIDB().then((db) => {
                    deleteAllPlantsFromIDB(db).then(() => {
                        addNewPlantsToIDB(db, newPlants).then(() => {
                            console.log("All new plants added to IDB");
                            newPlants.forEach(plant => insertPlantInList(plant));
                        });
                    });
                });
            });
    } else {
        console.log("Offline mode");
        openPlantsIDB().then((db) => {
            getAllPlants(db).then((plants) => {
                plants.forEach(plant => insertPlantInList(plant));
            });
        });
    }
}
