const deleteBtn = document.getElementById("delete-account-btn");
const modal = document.getElementById("delete-modal");
const cancelBtn = document.getElementById("cancel-delete-btn");

// Show modal when delete button is clicked
deleteBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
});

// Hide modal when cancel button is clicked
cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
});
