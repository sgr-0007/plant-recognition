// const displayToast = (success) => {
//     const toastElement = document.getElementById(success ? 'postSuccessToast' : 'postFailureToast');
//     const toast = new bootstrap.Toast(toastElement);
//     toast.show();
// };

// const addNewPlantButtonEventListener = () => {
//     const formData = new FormData(document.getElementById('plantForm'));
//     fetch('http://localhost:5000/api/plants', {
//         method: 'POST',
//         body: formData
//     })
//     .then(response => {
//         if (response.ok) {
//             displayToast(true);
//             console.log('response ok')
//             setTimeout(() => {
//                 window.location.href = '/';  // Redirect to the home page
//             }, 2000);  // Redirect after 2 seconds to show the toast before navigating
//         } else {
//             console.log('response failed')
//             throw new Error('Failed to post new plant data');
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         displayToast(false);
//     });
// };

// window.onload = function () {
//     // Add event listeners to buttons
//     const postButton = document.getElementById("postButton");
//     postButton.addEventListener("click", function(event) {
//         event.preventDefault();  // Prevent the form from submitting via the browser
//         addNewPlantButtonEventListener();
//     });
// };

// importScripts('./idb-utility.js');

if( 'undefined' === typeof window){
    importScripts('./util/idb-utility.js');
 }

document.addEventListener('DOMContentLoaded', function () {
    const plantForm = document.getElementById('plantForm');

    plantForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission via HTTP

        // Gather data from the form
        const plantData = {
            name: document.getElementById('nameOfPlant').value,
            image: document.getElementById('fileInput').files[0], // This will only handle the file as Blob locally
            createdby: document.getElementById('userNickname').value,
            dateTimeSeen: document.getElementById('dateTimePickerInput').value,
            description: document.getElementById('plantDescription').value,
            height: parseFloat(document.getElementById('plantHeight').value),
            spread: parseFloat(document.getElementById('plantSpread').value),
            hasFlowers: document.getElementById('flowerSwitch').checked,
            hasLeaves: document.getElementById('leavesSwitch').checked,
            hasFruitsOrSeeds: document.getElementById('fruitSeeds').checked,
            flowerColor: document.getElementById('flowerColor').value,
            latitude: document.getElementById('latitudeInput').value, // Assume these are filled by some other mechanism (like GPS)
            longitude: document.getElementById('longitudeInput').value
        };

        // Debug print to console
        console.log('Collected Plant Data:', plantData);

        // Open IndexedDB and add new plant to sync
        openSyncPlantsIDB().then(db => {
            addNewPlantToSync(db, plantData).then(() => {
                // Notify user via service worker
                navigator.serviceWorker.ready.then(serviceWorkerRegistration => {
                    serviceWorkerRegistration.showNotification("Plant App", {
                        body: `New plant added! - ${plantData.name}`
                    }).then(r => console.log('Notification displayed:', r))
                        .catch(e => console.error('Notification failed:', e));
                });
            }).catch(error => {
                console.error('Error adding plant to DB:', error);
            });
        });
    });
});

// You need to ensure functions like `openPlantsIDB` and `addNewPlantToSync` are defined and properly handle the data structure.
