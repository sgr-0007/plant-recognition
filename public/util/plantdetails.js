function createPlantDetails(plantDetails) {
  const plantDetailsDiv = document.getElementById("plant_details");

  // Create the card container (row)
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("row");

  // Create the image column (col-6)
  const imageCol = document.createElement("div");
  imageCol.classList.add("col-6");

  // Create the image element
  const img = document.createElement("img");
  img.className = "card-img-top img-fluid"; // Adjust class for responsive image
  img.alt = "Plant image";
  img.src = plantDetails.image ? plantDetails.image : "placeholder-image.jpg";
  imageCol.appendChild(img);

  // Create the details column (col-6)
  const detailsCol = document.createElement("div");
  detailsCol.classList.add("col-6");

  // Create the card header (within details column)
  const cardHeader = document.createElement("div");
  cardHeader.classList.add("card-header");
  cardHeader.textContent = "Plant Details";
  detailsCol.appendChild(cardHeader);

  // Create the card body (within details column)
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  // Create the unordered list for details
  const plantDetailsList = document.createElement("ul");
  plantDetailsList.classList.add("list-group", "list-group-flush");

 const detailProperties = [
      "name",
      "description",
      "height",
      "spread",
      { key: "has_leaves", value: plantDetails.has_leaves ? "Yes" : "No" },
      { key: "has_fruitsorseeds", value: plantDetails.has_fruitsorseeds ? "Yes" : "No" },
      "flower_color",
      { key: "date_time_plant_seen", value: plantDetails.date_time_plant_seen.toLocaleString() }
    ];
  
    for (const property of detailProperties) {
      const listItem = document.createElement("li");
      listItem.classList.add("list-group-item");
  
      let listItemContent;
      if (typeof property === "string") {
        listItemContent = `${property.toUpperCase()}: ${plantDetails[property]}`;
      } else {
        listItemContent = `${property.key.toUpperCase()}: ${property.value}`;
      }
      listItem.textContent = listItemContent;
  plantDetailsList.appendChild(listItem);
  cardBody.appendChild(plantDetailsList);
  detailsCol.appendChild(cardBody);

  // Append image and details columns to the card container
  cardContainer.appendChild(imageCol);
  cardContainer.appendChild(detailsCol);

  // Append the card container to the plant details container
  plantDetailsDiv.appendChild(cardContainer);
    }
  
    cardBody.appendChild(plantDetailsList);
    card.appendChild(cardBody);
    plantDetailsDiv.prepend(card);

  
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


    // Fetch plant data from the server when online
    if (navigator.onLine) {
      console.log('fetching plant details')
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const plantid = urlParams.get('plantid');
        
          fetch('http://localhost:3000/plantdetails/plantdetails?plantid='+plantid, {method: 'GET'})
            .then(function (res) {
              return res.json();
            }).then(function (newPlant) {
              console.log(newPlant);
              createPlantDetails(newPlant);
             
            });
        } catch (error) {
          console.log('Error fetching plant details:', error);
        }

    } else {

        
    }
}
