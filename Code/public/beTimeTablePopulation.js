document.addEventListener("DOMContentLoaded", function () {
    // Global variables
    window.timetableData = [];
    let teacherGroups = [];

    // Load timetable data
    fetch('/api/teacher/selecttimetable')
        .then(response => {
            if (response.status === 401) {
                alert("You are not logged in. Please log in to view your timetable.");
                window.location.href = "/login";
                return;
            }
            if (!response.ok) throw new Error("Network response was not ok");
            return response.json();
        })
        .then(data => {
            console.log(data.timetable);
            timetableData = data.timetable;
            teacherGroups = data.groups || [];
            populateGroupDropdown(teacherGroups);

            // Only check for notifications if we're on the user interface page
            const checkbox = document.querySelector('.form-control.w-auto.ml-auto');
            if (checkbox) {
                // Initialize checkbox state from server
                fetch('/api/user/preferences')
                    .then(response => response.json())
                    .then(data => {
                        checkbox.checked = data.displayRequests || false;
                        if (checkbox.checked) {
                            fetchNotifications().then(notifications => {
                                displayTimetable(timetableData, notifications);
                            });
                        } else {
                            displayTimetable(timetableData);
                        }
                    });
            
                checkbox.addEventListener('change', function() {
                    fetch('/api/user/preferences', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ displayRequests: this.checked })
                    }).then(() => {
                        if (this.checked) {
                            fetchNotifications().then(notifications => {
                                displayTimetable(timetableData, notifications);
                            });
                        } else {
                            displayTimetable(timetableData);
                        }
                    });
                });
            } else {
                displayTimetable(timetableData);
            }
        })
        .catch(error => {
            console.error("Error loading timetable:", error);
        });

    // Add this function to fetch notifications
function fetchNotifications() {
    return fetch('/api/teacher/notifications')
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.json();
        })
        .then(data => {
            console.log("Fetched notifications:", data); // Add this line
            return data;
        })
        .catch(error => {
            console.error("Error fetching notifications:", error);
            return [];
        });
}

    // Populate group dropdown with section information
    function populateGroupDropdown(groups) {
        const select = document.getElementById("timetable-select");
        select.innerHTML = '<option value="all" selected>My Timetable</option>';
    
        // Filter out groups with null or undefined num_Grp
        const validGroups = groups.filter(group => group.num_Grp !== null && group.num_Grp !== undefined);
    
        validGroups.forEach(group => {
            const option = document.createElement('option');
            option.value = group.id;
            option.textContent = `${group.level_id} ${group.speciality_abbr} ${group.section_name}${group.num_Grp}`;
            option.dataset.sectionName = group.section_name;
            option.dataset.sectionId = group.id_section; // Add section ID if needed
            select.appendChild(option);
        });
    }

    // Handle group selection
    document.getElementById("timetable-select").addEventListener('change', function () {
        const groupId = this.value;
        const selectedOption = this.options[this.selectedIndex];
        const sectionName = selectedOption.dataset.sectionName;
    
        if (groupId === "all") {
            displayTimetable(timetableData);
            return;
        }
    
        // Fetch all sessions for this group from the server
        fetch(`/api/teacher/group-sessions/${groupId}`)
            .then(response => {
                if (!response.ok) throw new Error("Network response was not ok");
                return response.json();
            })
            .then(filteredData => {
                displayTimetable(filteredData);
            })
            .catch(error => {
                console.error("Error loading group sessions:", error);
                // Fallback to client-side filtering if API fails
                const filteredData = timetableData.filter(session => {
                    // Show all sessions for the selected group
                    if (session.id_groupe == groupId) return true;
    
                    // Show LECTUREs for the group's section
                    if ((session.type_Seance === 'LECTURE' || session.type_Seance === 'ONLINELECTURE') && 
                        session.section_name === sectionName) {
                        return true;
                    }
    
                    return false;
                });
                displayTimetable(filteredData);
            });
    });
});

function displayTimetable(sessions, notifications = []) {
    // Clear existing sessions
    document.querySelectorAll('.session-entry').forEach(el => el.remove());

    // Create maps for quick lookup
    const notificationMap = {};
    const pendingRequests = [];

    // Fill notificationMap and collect pending "ajout" requests
    notifications.forEach(notif => {
    // Always map by id_seance for session modifications
    if (notif.id_seance) {
        notificationMap[notif.id_seance] = notif;
        // If it's a modif request and pending/rejected, also show as a request
        if (
            notif.type_demande === 'modif' &&
            (notif.status === null || notif.status === -1)
        ) {
            pendingRequests.push(notif);
        }
    } else if (
        (notif.type_demande === 'ajout' || notif.type_demande === 'modif') &&
        (notif.status === null || notif.status === -1)
    ) {
        pendingRequests.push(notif);
    } else if (
        notif.type_demande !== 'ajout' && notif.type_demande !== 'modif'
    ) {
        // Keep other types (abse, supp, etc) as before if needed
        pendingRequests.push(notif);
    }
});

    // Define days and session order
    const daysOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'];
    const sessionSlots = [
        '1st Session', '2nd Session', '3rd Session', 
        '4th Session', '5th Session'
    ];

    // Categorize sessions
    const regularSessions = sessions.filter(s => 
        !['ONLINETUTORIAL', 'ONLINELAB', 'ONLINELECTURE'].includes(s.type_Seance?.trim().toUpperCase())
    );
    const onlineSessions = sessions.filter(s => 
        ['ONLINETUTORIAL', 'ONLINELAB', 'ONLINELECTURE'].includes(s.type_Seance?.trim().toUpperCase())
    );

    // Display regular sessions
    daysOrder.forEach(day => {
        const dayRow = Array.from(document.querySelectorAll('td.sub'))
            .find(td => td.textContent.trim() === day)
            ?.parentNode;

        if (!dayRow) return;

        const daySessions = regularSessions.filter(s => s.Jour === day);

        sessionSlots.forEach((slot, index) => {
            const slotCell = dayRow.children[index + 1];
            if (!slotCell) return;

            slotCell.innerHTML = '';

            // Check if there is a pending "ajout" request for this slot
            const addRequest = pendingRequests.find(req => req.type_demande === 'ajout' && req.Jour === day && req.horaire === slot);

            if (addRequest) {
                // Show only the add request (replace any session)
                slotCell.appendChild(createRequestDiv(addRequest));
            } else {
                // Display existing sessions (and handle modif/abse as before)
                daySessions
                    .filter(s => s.horaire === slot)
                    .forEach(session => {
                        const notification = notificationMap[session.id];
                        slotCell.appendChild(createSessionDiv(session, notification));
                    });

                // Display other types of pending requests for this slot (not "ajout")
                pendingRequests
                    .filter(req => req.Jour === day && req.horaire === slot && req.type_demande !== 'ajout')
                    .forEach(request => {
                        slotCell.appendChild(createRequestDiv(request));
                    });
            }
        });
    });

    // Display online sessions
    const onlineRow = document.querySelector('#online-row');
    if (onlineRow) {
        const onlineCell = onlineRow.querySelector('.online-session-cell') || 
                          document.createElement('td');
        onlineCell.className = 'online-session-cell';
        onlineCell.colSpan = 5;
        onlineCell.innerHTML = '';

        const hasContent = onlineSessions.length > 0 || 
            pendingRequests.some(req => req.type_Seance?.includes('ONLINE'));

        if (!hasContent) {
            onlineCell.textContent = 'No online sessions';
        } else {
            const container = document.createElement('div');
            container.className = 'online-sessions-container';

            // Display existing online sessions
            onlineSessions.forEach(session => {
                const notification = notificationMap[session.id];
                container.appendChild(createSessionDiv(session, notification));
            });

            // Display pending online "ajout" requests
            pendingRequests
                .filter(req => req.type_Seance?.includes('ONLINE'))
                .forEach(request => {
                    container.appendChild(createRequestDiv(request));
                });

            onlineCell.appendChild(container);
        }

        if (!onlineRow.querySelector('.online-session-cell')) {
            onlineRow.innerHTML = '';
            onlineRow.appendChild(onlineCell);
        }
    }
}
function createRequestDiv(request) {
    const div = document.createElement('div');
    const isOnline = ['ONLINETUTORIAL', 'ONLINELAB', 'ONLINELECTURE'].includes(request.type_Seance?.trim().toUpperCase());

    // Map type_demande to class
    let requestClass = '';
    switch (request.type_demande) {
        case 'ajout': requestClass = 'add-request'; break;
        case 'supp': requestClass = 'delete-request'; break;
        case 'modif': requestClass = 'modify-request'; break;
        case 'abse': requestClass = 'absence-request'; break;
        default: requestClass = '';
    }

    // Room info
    let roomInfo = '';
    if (request.id_salle) {
        roomInfo = `<div class="session-room"> ${request.id_salle}</div>`;
    }

    div.className = `session-entry request-pending ${requestClass} ${request.type_Seance?.toLowerCase() || ''}`;
    
    const content = `
        <div class="session-content">
            <div class="session-module">${request.id_module || 'New Session'}</div>
            <div class="session-type">${request.type_Seance || 'Type not specified'}</div>
            ${isOnline ? `
                <div class="session-info">
                    <span>${request.Jour || ''}</span> | <span>${request.horaire || 'N/A'}</span>
                </div>
            ` : ''}
            ${request.id_section ? `<div class="session-scope">Section ${request.id_section}</div>` : ''}
            ${request.id_groupe ? `<div class="session-group">Group ${request.id_groupe}</div>` : ''}
            ${roomInfo}
            <div class="request-status">${getRequestStatus(request)}</div>
        </div>
    `;
    div.innerHTML = content;
    return div;
}

function getRequestStatus(request) {
    if (request.type_demande === 'abse') return 'Absence Requested';
    switch (request.type_demande) {
        case 'ajout': return 'Add Request Pending';
        case 'supp': return 'Delete Request Pending';
        case 'modif': return 'Modify Request Pending';
        default: return 'Request Pending';
    }
}

function createSessionDiv(session, notification) {
    const sessionDiv = document.createElement('div');
    let tempClass = session.expiration_date ? 'temporary ' : '';
    let interoClass = session.exp_intero ? 'intero ' : '';
    
    // Check for absence notification
    let absenceRibbon = '';
    if (notification && notification.type_demande === 'abse') {
        absenceRibbon = `<span class="absence-ribbon" title="Absence Requested"><i class="fas fa-user-slash"></i></span>`;
    }

    sessionDiv.className = `session-entry ${tempClass}${interoClass}${session.type_Seance.toLowerCase()}`;
    sessionDiv.style.pointerEvents = 'none';
    sessionDiv.dataset.sessionId = session.id;

    if (session.expiration_date) {
        sessionDiv.dataset.expires = session.expiration_date;
    }

    let groupInfo = '';
    if (session.type_Seance === 'LECTURE' || session.type_Seance === 'ONLINELECTURE') {
        groupInfo = `<div class="session-scope">Section ${session.section_name}</div>`;
    } else if (session.group_number) {
    // Show "SectionName - Group X" for tutorials/labs (including online)
    groupInfo = `<div class="session-group">${session.section_name ? session.section_name + ' - ' : ''}Group ${session.group_number}</div>`;
}

    const isOnline = ['ONLINETUTORIAL', 'ONLINELAB', 'ONLINELECTURE'].includes(session.type_Seance?.trim().toUpperCase());

    sessionDiv.innerHTML = `
        ${absenceRibbon}
        <div class="session-content" style="pointer-events: auto">
            <div class="session-module">${session.id_module}</div>
            <div class="session-type">${session.type_Seance}</div>
            ${isOnline ? `
                <div class="session-info">
                    <span>${session.Jour}</span> | <span>${session.horaire || 'N/A'}</span>
                </div>
            ` : ''}
            ${groupInfo}
            ${session.id_salle ? `<div class="session-room"> ${session.id_salle}</div>` : ''}
            <div class="session-info-row" style="display: flex; justify-content: space-between;">
                ${session.expiration_date ? `<div class="expires-info">Expires: ${formatDate(session.expiration_date)}</div>` : ''}
                ${session.teacher_lastname ? `<div class="teacher-info">${session.teacher_firstname} ${session.teacher_lastname}</div>` : ''}
            </div>
        </div>
    `;

    const contentDiv = sessionDiv.querySelector('.session-content');
    contentDiv.addEventListener('click', function (e) {
        const sessionId = sessionDiv.dataset.sessionId;
        handleSessionSelection(sessionId, sessionDiv);
    });

    return sessionDiv;
}

function getRequestStatusText(notification) {
    if (notification.type_demande === 'abse') {
        return 'You Will Absente for this session';
    }
    switch (notification.type_demande) {
        case 'ajout': return 'Add Request Pending';
        case 'supp': return 'Delete Request Pending';
        case 'modif': return 'Modify Request Pending';
        default: return '';
    }
}

// Add this new function right after the displayTimetable function
function handleSessionSelection(sessionId, element) {
    // First, remove any existing selection highlights
    document.querySelectorAll('.session-entry.selected').forEach(el => {
        el.classList.remove('selected');
    });

    // Highlight the selected session
    element.classList.add('selected');

    // Store the selected session ID in a global variable or data attribute
    document.querySelector('#timetable').dataset.selectedSessionId = sessionId;

    // You can now use this sessionId for delete operations
    console.log("Selected session ID:", sessionId);
}

// Helper function to format date
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
       
    });
}




