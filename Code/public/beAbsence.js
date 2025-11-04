/* BEGINNING OF ABSENCE FUNCTIONALITY */
document.addEventListener("DOMContentLoaded", function() {
    const absenceMenu = document.getElementById("absenceMenu");
    const confirmAbsenceBtn = document.getElementById("confirmAbsence");
    let selectedSessionId = null;

    // Handle right-click on all session cells (regular and online)
    document.addEventListener('contextmenu', function(e) {
        // Check if clicked on a session element
        const sessionEntry = e.target.closest('.session-entry') || 
                           e.target.closest('.online-sessions-container .session-entry');
        
        if (!sessionEntry) return;
        
        e.preventDefault();
        
        selectedSessionId = sessionEntry.dataset.sessionId;
        if (!selectedSessionId) return;

        // Position the absence menu near the cursor
        absenceMenu.style.display = 'block';
        absenceMenu.style.top = `${e.clientY}px`;
        absenceMenu.style.left = `${e.clientX}px`;
    });

    // Handle absence form submission
    confirmAbsenceBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (!selectedSessionId) {
            alert('No session selected');
            return;
        }

        const reason = document.getElementById('absenceReason').value;
        
        fetch(`/mark-absence/${selectedSessionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reason })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Absence marked successfully');
                absenceMenu.style.display = 'none';
                document.getElementById('absenceReason').value = '';
            } else {
                alert('Error: ' + (data.error || 'Failed to mark absence'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while marking absence');
        });
    });

    // Close button for absence menu
    absenceMenu.querySelector('.close-btn').addEventListener('click', function() {
        absenceMenu.style.display = 'none';
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!absenceMenu.contains(e.target) && e.target.id !== 'absenceMenu') {
            absenceMenu.style.display = 'none';
        }
    });
});
/* END OF ABSENCE FUNCTIONALITY */