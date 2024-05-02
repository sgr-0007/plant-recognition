// Function to add a new plant to the sync-plants object store in IndexedDB
const addNewPlantToSync = (syncPlantIDB, plantData) => {
    return new Promise((resolve, reject) => {  // Return a Promise from the function
        if (plantData) {
            const transaction = syncPlantIDB.transaction(["sync-plants"], "readwrite");
            const plantStore = transaction.objectStore("sync-plants");
            const addRequest = plantStore.add(plantData);

            addRequest.onsuccess = () => {
                console.log("Added to sync-plants: " + addRequest.result); // Log the ID of the newly added plant
                const getRequest = plantStore.get(addRequest.result);
                getRequest.onsuccess = () => {
                    // console.log("Found: " + JSON.stringify(getRequest.result));
                    // // Resolve the Promise here after successful get
                    // resolve(getRequest.result);
                    console.log("Found " + JSON.stringify(getRequest.result))
                    // Send a sync message to the service worker
                    navigator.serviceWorker.ready.then((sw) => {
                        sw.sync.register("sync-plant-data")
                    }).then(() => {
                        console.log("Sync registered");
                    }).catch((err) => {
                        console.log("Sync registration failed: " + JSON.stringify(err))
                    })
                };
                getRequest.onerror = (err) => {
                    console.error("Error retrieving the newly added plant:", err);
                    reject(err);  // Reject the Promise on get error
                };
            };

            addRequest.onerror = (event) => {
                console.error("Failed to add plant to sync-plants:", event.target.error);
                reject(event.target.error);  // Reject the Promise on add error
            };
        } else {
            console.error("No plant data provided to add to sync-plants.");
            reject("No plant data provided");  // Reject the Promise if no data is provided
        }
    });
};


// Function to add new plants to IndexedDB and return a promise
const addNewPlantsToIDB = (plantDB, plants) => {
    return new Promise((resolve, reject) => {
        const transaction = plantDB.transaction(["plants"], "readwrite");
        const plantStore = transaction.objectStore("plants");

        // Handling multiple adds using a Promise.all approach
        const addPromises = plants.plants.map(plant => {
            return new Promise((resolveAdd, rejectAdd) => {
                const addRequest = plantStore.add(plant);
                addRequest.onsuccess = () => {
                    console.log("Added plant with ID:", addRequest.result); // addRequest.result will contain the key of the newly added plant
                    resolveAdd(addRequest.result); // Resolving with the plant ID
                };
                addRequest.onerror = (event) => {
                    console.error("Error adding plant:", event.target.error);
                    rejectAdd(event.target.error); // Rejecting the add promise if there's an error
                };
            });
        });

        // Resolving the main promise when all add operations are completed
        Promise.all(addPromises)
            .then(results => {
                console.log("All plants added successfully.");
                resolve(results); // Resolving with all results, which are plant IDs
            })
            .catch(error => {
                console.error("Error adding multiple plants:", error);
                reject(error);
            });
    });
};

// Function to remove all plants from IndexedDB
const deleteAllExistingPlantsFromIDB = (plantDB) => {
    return new Promise((resolve, reject) => {
        const transaction = plantDB.transaction(["plants"], "readwrite");
        const plantStore = transaction.objectStore("plants");
        const clearRequest = plantStore.clear(); // Clear all entries in the "plants" object store

        clearRequest.onsuccess = () => {
            console.log("All plants have been removed from IndexedDB.");
            resolve();
        };

        clearRequest.onerror = (event) => {
            console.error("Error clearing plants from IndexedDB:", event.target.error);
            reject(event.target.error);
        };
    });
};

// Function to retrieve all plants from IndexedDB
const getAllPlantsOffline = (plantDB) => {
    return new Promise((resolve, reject) => {
        const transaction = plantDB.transaction(["plants"], "readonly");
        const plantStore = transaction.objectStore("plants");
        const getRequest = plantStore.getAll();
        getRequest.onsuccess = () => {
            // resolve(getRequest.result);
            resolve({ plants: getRequest.result });
        };
        getRequest.onerror = (event) => {
            reject(event.target.error);
        };
    });
};

const getAllPlants = (plantDB) => {
    return new Promise((resolve, reject) => {
        const transaction = plantDB.transaction(["plants"], "readonly");
        const plantStore = transaction.objectStore("plants");
        const getRequest = plantStore.getAll();
        getRequest.onsuccess = () => {
            // resolve(getRequest.result);
            resolve(getRequest.result);
        };
        getRequest.onerror = (event) => {
            reject(event.target.error);
        };
    });
};

const getAllSyncPlants = (syncPlantIDB) => {
    return new Promise((resolve, reject) => {
        // Open a transaction on the 'sync-plants' object store in readonly mode
        const transaction = syncPlantIDB.transaction(["sync-plants"], "readonly");
        const plantStore = transaction.objectStore("sync-plants");

        // Create a request to get all entries from the store
        const getAllRequest = plantStore.getAll();

        // Add event listeners to handle the request completion
        getAllRequest.onsuccess = () => {
            // resolve(getAllRequest.result); // Resolve the promise with the result when successful
            resolve(getAllRequest.result);
        };

        getAllRequest.onerror = (event) => {
            reject(event.target.error); // Reject the promise if an error occurs
        };
    });
}

// Get plant by plantid
const getPlantById = (plantDB, plantid) => {
    return new Promise((resolve, reject) => {
        const transaction = plantDB.transaction(["plants"], "readonly");
        const plantStore = transaction.objectStore("plants");
        const getRequest = plantStore.get(plantid);
        getRequest.onsuccess = () => {
            resolve(getRequest.result);
        };
        getRequest.onerror = (event) => {
            reject(event.target.error);
        };
    });
};



// Function to get the list of all sync plants from the IndexedDB
const getAllSyncPlantsOffline = (syncPlantIDB) => {
    return new Promise((resolve, reject) => {
        // Open a transaction on the 'sync-plants' object store in readonly mode
        const transaction = syncPlantIDB.transaction(["sync-plants"], "readonly");
        const plantStore = transaction.objectStore("sync-plants");

        // Create a request to get all entries from the store
        const getAllRequest = plantStore.getAll();

        // Add event listeners to handle the request completion
        getAllRequest.onsuccess = () => {
            // resolve(getAllRequest.result); // Resolve the promise with the result when successful
            resolve({ plants: getAllRequest.result });
        };

        getAllRequest.onerror = (event) => {
            reject(event.target.error); // Reject the promise if an error occurs
        };
    });
}

// Function to delete a synced plant from IndexedDB
const deleteSyncPlantFromIDB = (syncPlantIDB, id) => {
    // Open a readwrite transaction on the 'sync-plants' object store
    const transaction = syncPlantIDB.transaction(["sync-plants"], "readwrite");
    const plantStore = transaction.objectStore("sync-plants");

    // Create a request to delete a specific entry based on its id
    const deleteRequest = plantStore.delete(id);

    // Add event listeners to handle the completion of the delete request
    deleteRequest.onsuccess = () => {
        console.log("Deleted sync plant with ID: " + id);
    };

    deleteRequest.onerror = (event) => {
        console.error("Failed to delete sync plant with ID: " + id + ", Error: ", event.target.error);
    };
}

// Function to open the IndexedDB for plant data
function openPlantsIDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("plants-db", 1);

        request.onerror = function (event) {
            reject(new Error(`Database error: ${event.target.errorCode}`));
        };

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('plants')) {
                db.createObjectStore('plants', { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = function (event) {
            const db = event.target.result;
            resolve(db);
        };
    });
}




function openSyncPlantsIDB() {
    return new Promise((resolve, reject) => {
        // Open or create the IndexedDB database called 'sync-plants-db'
        const request = indexedDB.open("sync-plants-db", 1);

        // Handle database errors
        request.onerror = function (event) {
            reject(new Error(`Database error: ${event.target.errorCode}`));
        };

        // Handle database upgrades, including creating object stores if they don't exist
        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            // Create an object store called 'sync-plants' with auto-incrementing keys
            if (!db.objectStoreNames.contains('sync-plants')) {
                db.createObjectStore('sync-plants', { keyPath: 'id', autoIncrement: true });
            }
        };

        // Handle successful database opening
        request.onsuccess = function (event) {
            const db = event.target.result;
            resolve(db);
        };
    });
}
