// sw.js
const CACHE_NAME = 'plant-app-cache-v1';
const urlsToCache = [
    '/',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request).catch(function() {
            return caches.match(event.request);
        })
    );
});

// sw.js
self.addEventListener('sync', event => {
    if (event.tag === 'sync-plant-data') {
        console.log('Service Worker: Syncing new Plants and Plant Details');
        event.waitUntil(syncPlantData());
    }
});

function syncPlantData() {
    openPlantsIDB().then(db => {
        getAllSyncPlants(db).then(plants => {
            plants.forEach(plant => {
                const formData = new URLSearchParams();
                for (const key in plant) {
                    formData.append(key, plant[key]);
                }

                fetch('http://localhost:5000/api/plants', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }).then(response => {
                    if (response.ok) {
                        deleteSyncPlantFromIDB(db, plant.plantid);
                        self.registration.showNotification('Plant Synced', {
                            body: 'Plant data synced successfully!',
                        });
                    }
                }).catch(err => {
                    console.error('Service Worker: Syncing new Plant failed', err);
                });
            });
        });

        getAllSyncPlantDetails(db).then(details => {
            details.forEach(detail => {
                const formData = new URLSearchParams();
                for (const key in detail) {
                    formData.append(key, detail[key]);
                }

                fetch('http://localhost:5000/api/plantDetails', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }).then(response => {
                    if (response.ok) {
                        deleteSyncPlantDetailFromIDB(db, detail.plantdetailid);
                        self.registration.showNotification('Plant Detail Synced', {
                            body: 'Plant detail synced successfully!',
                        });
                    }
                }).catch(err => {
                    console.error('Service Worker: Syncing new Plant Detail failed', err);
                });
            });
        });
    });
}
