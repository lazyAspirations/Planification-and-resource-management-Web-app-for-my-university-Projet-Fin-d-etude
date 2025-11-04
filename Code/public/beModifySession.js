/*BEGINING OF MODIFY SEANCE */

// Helper to update available time slots for modify
async function updateAvailableTimeSlotsForModify(session) {
    const day = document.querySelector('#modify-form select[name="Jour"]').value;
    const moduleId = session.id_module;
    const groupId = session.id_groupe;
    const sectionId = session.id_section;
    const sessionId = session.id;

    if (!day || (!groupId && !sectionId)) return;

    const timeSelect = document.querySelector('#modify-form select[name="horaire"]');
    timeSelect.innerHTML = '<option value="">Loading available times...</option>';

    const params = new URLSearchParams({
        day,
        moduleId: moduleId || '',
        groupId: groupId || '',
        sectionId: sectionId || '',
        sessionId
    });

    fetch(`/api/teacher/available-times-modify?${params.toString()}`)
        .then(response => response.json())
        .then(data => {
            timeSelect.innerHTML = '';
            if (data.availableSlots.length === 0) {
                timeSelect.innerHTML = '<option value="">No available time slots</option>';
                return;
            }
            // Time slot labels and ranges
            const slotInfo = {
                '1st Session': '8:00-9:30',
                '2nd Session': '9:35-11:05',
                '3rd Session': '11:10-12:40',
                '4th Session': '12:45-14:15',
                '5th Session': '14:20-15:50'
            };
            data.availableSlots.forEach(slot => {
                const option = document.createElement('option');
                option.value = slot;
                option.textContent = `${slot} (${slotInfo[slot]})`;
                timeSelect.appendChild(option);
            });
            // Select the current session time if still available
            if (session.horaire && data.availableSlots.includes(session.horaire)) {
                timeSelect.value = session.horaire;
            }
        })
        .catch(error => {
            console.error("Error fetching available times:", error);
            timeSelect.innerHTML = '<option value="">Error loading times</option>';
        });
}

// Modify openModifyPopup to use full session data and update available times
async function openModifyPopup() {
    const sessionId = document.querySelector('#timetable').dataset.selectedSessionId;
    if (!sessionId) {
        alert('Please select a session to modify');
        return;
    }

    // Make sure timetableData is available
    if (!window.timetableData || window.timetableData.length === 0) {
        alert('Timetable data not loaded yet. Please wait and try again.');
        return;
    }

    // Find the selected session in timetableData
    const session = window.timetableData.find(s => s.id == sessionId);
    if (!session) {
        alert('Session data not found');
        return;
    }

    // Fetch the session type from the database (in case it's changed)
    const sessionType = await fetch(`/api/session-type/${sessionId}`)
        .then(response => response.json())
        .then(data => data.type_Seance)
        .catch(error => {
            console.error("Error fetching session type:", error);
            return null;
        });

    if (!sessionType) {
        alert('Failed to retrieve session type. Please try again.');
        return;
    }

    // Store the session reference for later use
    window.currentSession = session;

    // Populate the modify form
    const modifyForm = document.getElementById('modify-form');
    modifyForm.dataset.sessionId = session.id;
    modifyForm.dataset.sessionType = sessionType;

    // Set current values
    document.querySelector('#modify-form select[name="Jour"]').value = session.Jour;

    // Update available time slots before setting horaire
    await updateAvailableTimeSlotsForModify(session);

    // Set the current horaire if still available
    document.querySelector('#modify-form select[name="horaire"]').value = session.horaire;

    // Add a hidden input for session type
    const typeInput = modifyForm.querySelector('input[name="type_Seance"]');
    typeInput.value = sessionType;

    // Load available rooms for the current selection
    checkRoomAvailabilityForModify(session.Jour, session.horaire, sessionType);

    // Show the modify popup
    document.getElementById('modifyMenu').style.display = 'block';
}

function checkRoomAvailabilityForModify(day, hour, sessionType) {
    const roomSelect = document.querySelector('#modify-form select[name="id_salle"]');
    roomSelect.innerHTML = '<option value="">Loading rooms...</option>';

    fetch(`/api/teacher/available-rooms?day=${day}&hour=${hour}&sessionType=${sessionType}`)
        .then(response => response.json())
        .then(rooms => {
            roomSelect.innerHTML = '<option value="">Select a room</option>';
            rooms.forEach(room => {
                const option = document.createElement('option');
                option.value = room.id;
                option.textContent = `${room.id} (Capacity: ${room.capacite_salle})`;
                roomSelect.appendChild(option);
            });
            // Select the current room if it's available
            if (window.currentSession && window.currentSession.id_salle) {
                roomSelect.value = window.currentSession.id_salle;
            }
        })
        .catch(error => {
            console.error("Error fetching rooms:", error);
            roomSelect.innerHTML = '<option value="">Error loading rooms</option>';
        });
}

// Event listeners for modify form fields
document.addEventListener('DOMContentLoaded', function () {
    const modifyForm = document.getElementById('modify-form');
    if (!modifyForm) return;

    const daySelect = modifyForm.querySelector('select[name="Jour"]');
    const hourSelect = modifyForm.querySelector('select[name="horaire"]');

    if (daySelect && hourSelect) {
        daySelect.addEventListener('change', function () {
            if (window.currentSession) {
                updateAvailableTimeSlotsForModify(window.currentSession);
                // After updating time slots, update room availability for the new day/horaire
                setTimeout(() => {
                    const hour = hourSelect.value;
                    const sessionType = modifyForm.dataset.sessionType;
                    if (hour && sessionType) {
                        checkRoomAvailabilityForModify(this.value, hour, sessionType);
                    }
                }, 200);
            }
        });

        hourSelect.addEventListener('change', function () {
            const day = daySelect.value;
            const sessionType = modifyForm.dataset.sessionType;
            if (day && sessionType) {
                checkRoomAvailabilityForModify(day, this.value, sessionType);
            }
        });
    }

    // Handle modify form submission
    modifyForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const sessionId = this.dataset.sessionId;
        const sessionType = this.dataset.sessionType;

        if (!sessionId) {
            alert('No session selected');
            return;
        }

        const formData = {
            Jour: this.querySelector('select[name="Jour"]').value,
            horaire: this.querySelector('select[name="horaire"]').value,
            type_Seance: sessionType,
            id_salle: this.querySelector('select[name="id_salle"]').value
        };

        fetch(`/modify-session/${sessionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Session modification submitted for admin approval');
                    document.getElementById('modifyMenu').style.display = 'none';
                    refreshTimetable();
                } else {
                    alert('Error: ' + (data.error || 'Failed to modify session'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while modifying the session');
            });
    });
});

/*ENDING OF MODIFY SESSION */

/*BEGINING OF HELPER FUNCTIONS*/
function refreshTimetable() {
    fetch('/api/teacher/selecttimetable')
        .then(response => response.json())
        .then(data => {
            timetableData = data.timetable;
            displayTimetable(timetableData);
        })
        .catch(error => {
            console.error("Error refreshing timetable:", error);
        });
}
/*ENDING OF HELPER FUNCTIONS*/