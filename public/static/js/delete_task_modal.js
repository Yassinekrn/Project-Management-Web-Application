document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("deleteModal");
    const cancelBtn = document.getElementById("cancelDelete");
    const confirmBtn = document.getElementById("confirmDelete");

    // Function to open the modal
    document.querySelectorAll(".deleteTaskBtn").forEach((btn) => {
        btn.addEventListener("click", () => {
            modal.classList.remove("hidden");
        });
    });

    // Close modal on cancel
    cancelBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    // Confirm deletion
    confirmBtn.addEventListener("click", () => {
        const taskId = modal.getAttribute("data-task-id");
        fetch(`/tasks/delete/${taskId}`, {
            method: "DELETE",
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    window.location.reload(); // Reload after deletion
                } else {
                    alert("Failed to delete task.");
                }
            });
        modal.classList.add("hidden");
    });
});
