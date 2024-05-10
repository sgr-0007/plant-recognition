document.addEventListener("DOMContentLoaded", function () {

const toggleIcon = document.getElementById("toggleIcon");
const cardBody = document.querySelector(".suggestionsBody");

toggleIcon.addEventListener("click", function () {
  cardBody.classList.toggle("expanded");
  if (cardBody.classList.contains("expanded")) {
    toggleIcon.innerHTML =
      '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 15 7-7 7 7"/></svg>';
  } else {
    toggleIcon.innerHTML =
      '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/></svg>';
  }
});

const approveButtons = document.querySelectorAll(".approve-button");

    approveButtons.forEach(button => {
        button.addEventListener("click", function() {
            const identifiedBy = this.getAttribute("data-identifiedby");
            console.log("Identified by:", identifiedBy);

  });
});

});