const displayToast = (success) => {
    const toastElement = document.getElementById(success ? 'postSuccessToast' : 'postFailureToast');
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
};

const addNewPlantButtonEventListener = () => {
    const formData = new FormData(document.getElementById('plantForm'));
    fetch('http://localhost:5000/api/plants', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            displayToast(true);
            console.log('response ok')
            setTimeout(() => {
                window.location.href = '/';  // Redirect to the home page
            }, 2000);  // Redirect after 2 seconds to show the toast before navigating
        } else {
            console.log('response failed')
            throw new Error('Failed to post new plant data');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        displayToast(false);
    });
};

window.onload = function () {
    // Add event listeners to buttons
    const postButton = document.getElementById("postButton");
    postButton.addEventListener("click", function(event) {
        event.preventDefault();  // Prevent the form from submitting via the browser
        addNewPlantButtonEventListener();
    });
};