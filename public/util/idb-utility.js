// utility-idb.js
function openPlantsIDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("PlantDatabase", 1);
        request.onerror = e => reject(e.target.error);
        request.onupgradeneeded = e => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('plants')) {
                db.createObjectStore('plants', { keyPath: 'plantid' });
            }
            if (!db.objectStoreNames.contains('plantDetails')) {
                db.createObjectStore('plantDetails', { keyPath: 'plantdetailid' });
            }
            // const db = e.target.result;
            if (!db.objectStoreNames.contains('sync-plants')) {
                db.createObjectStore('sync-plants', { keyPath: 'plantid' });
            }
            if (!db.objectStoreNames.contains('sync-plantDetails')) {
                db.createObjectStore('sync-plantDetails', { keyPath: 'plantdetailid' });
            }
        };
        request.onsuccess = e => resolve(e.target.result);
    });
}

function addDataToStore(db, storeName, data) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        data.forEach(item => {
            const request = store.add(item);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    });
}


