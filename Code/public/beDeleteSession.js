/*BEGINING OF DELETE SESSION */
function deleteSelectedSession() {
    const sessionId = document.querySelector('#timetable').dataset.selectedSessionId;

    if (!sessionId) {
        alert('Please select a session to delete');
        return;
    }

    // Find the selected session in the timetable data
    const session = window.timetableData.find(s => s.id == sessionId);
    
    if (!session) {
        alert('Session not found');
        return;
    }

    // Check if it's a temporary session (has expiration date)
    const isTemporary = session.expiration_date !== null;

    if (isTemporary) {
        // Delete temporary session immediately
        if (confirm('Are you sure you want to delete this temporary session?')) {
            deleteSessionImmediately(sessionId);
        }
    } else {
        // For regular sessions, show confirmation and send to notifadmin
        if (confirm('Are you sure you want to request deletion of this session? This requires admin approval.')) {
            sendDeleteRequest(sessionId);
        }
    }
}

function deleteSessionImmediately(sessionId) {
    fetch(`/delete-session/${sessionId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Temporary session deleted successfully');
            // Remove the session from the timetable data
            window.timetableData = window.timetableData.filter(s => s.id != sessionId);
            // Refresh the timetable display
            displayTimetable(window.timetableData);
        } else {
            alert('Error: ' + (data.error || 'Failed to delete session'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while deleting the session');
    });
}

function sendDeleteRequest(sessionId) {
    fetch(`/delete-session/${sessionId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Delete request submitted for admin approval');
            // Refresh the timetable to show the pending request
            fetch('/api/teacher/selecttimetable')
                .then(response => response.json())
                .then(data => {
                    window.timetableData = data.timetable;
                    displayTimetable(window.timetableData);
                });
        } else {
            alert('Error: ' + (data.error || 'Failed to submit delete request'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while submitting the delete request');
    });
}

/*ENDING OF DELETE SESSION */