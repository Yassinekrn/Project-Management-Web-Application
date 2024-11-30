document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("deleteTeamModal");
    const cancelBtn = document.getElementById("cancelTeamDelete");
    const confirmBtn = document.getElementById("confirmTeamDelete");

    // Function to open the modal
    document.querySelectorAll(".deleteTeamBtn").forEach((btn) => {
        btn.addEventListener("click", (event) => {
            const teamId = event.target.getAttribute("data-team-id");
            modal.setAttribute("data-team-id", teamId);
            modal.classList.remove("hidden");
        });
    });

    // Close modal on cancel
    cancelBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    // Confirm deletion
    confirmBtn.addEventListener("click", () => {
        const teamId = modal.getAttribute("data-team-id");
        fetch(`http://localhost:3000/teams/delete/${teamId}`, {
            method: "POST",
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    window.location.reload(); // Reload after deletion
                } else {
                    alert("Failed to delete team.");
                }
            });
        modal.classList.add("hidden");
    });
});
