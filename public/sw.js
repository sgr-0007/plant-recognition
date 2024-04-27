// Inside your Service Worker
importScripts('./util/idb-utility.js');

// Install event to pre-cache resources for the plant project.
self.addEventListener('install', event => {
    console.log('Service Worker: Installing....');
    event.waitUntil((async () => {
        console.log('Service Worker: Caching Plant App Shell...');
        try {
            const cache = await caches.open("plant-static");
            // await cache.addAll([
            //     '/',
            //     '/plants', // Page listing all plants
            //     '/manifest.json',
            //     '/util/insert.js', // Script for plant interactions
            //     '/util/index.js',
            //     '/util/idb-utility.js',
            //     '/stylesheets/style.css',
            //     '/images/Drought.svg', // Icon for the plant app
            //     '/images/plant.gif',
            //     '/images/logo.svg'
            // ]);
            console.log('Service Worker: Plant App Shell Cached');
        } catch (error) {
            console.error("Error occurred while caching:", error);
        }
    })());
});

// Activate event to clean up old caches.
self.addEventListener('activate', event => {
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            return Promise.all(keys.map(key => {
                if (key !== "plant-static") {
                    console.log('Service Worker: Removing old cache:', key);
                    return caches.delete(key);
                }
            }));
        })()
    );
});

// Fetch event to use cache first strategy.
self.addEventListener('fetch', event => {
    event.respondWith((async () => {
        const cache = await caches.open("plant-static");
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
            console.log('Service Worker: Serving from Cache:', event.request.url);
            return cachedResponse;
        }
        console.log('Service Worker: Fetching from Network:', event.request.url);
        return fetch(event.request);
    })());
});

self.addEventListener('sync', event => {
    if (event.tag === 'sync-plant-data') {
        console.log('Service Worker: Syncing new Plants');
        event.waitUntil(
            openSyncPlantsIDB().then((plantDB) => {
                return getAllSyncPlants(plantDB).then(plants => {
                    console.log("plants")
                    console.log(plants)
                    return Promise.all(plants.map(plant => {
                        console.log('Service Worker: Syncing plant:', plant);
                        const formData = new FormData();
                        
                        for (const key in plant) {
                            formData.append(key, plant[key]);
                        }
                        return fetch('http://localhost:3000/api/plantCreate', {
                            method: 'POST',
                            body: formData
                        })
                        // .then(response => {
                        //     if (!response.ok) {
                        //         throw new Error('Failed to sync plant');
                        //     }
                        //     return response.json();
                        // })
                        .then(data => {
                            console.log('Service Worker: Plant synced successfully:', data);
                            deleteSyncPlantFromIDB(plantDB, plant.id);
                            self.registration.showNotification('Plants Synced', {
                                body: 'Plants synced successfully!',
                            });
                        })
                        .catch(error => {
                            console.error('Service Worker: Error syncing plant:', plant, error);
                        });
                    }));
                })
            })
        );
    }
});