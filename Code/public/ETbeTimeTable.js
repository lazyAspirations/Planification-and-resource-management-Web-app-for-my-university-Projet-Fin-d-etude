document.addEventListener("DOMContentLoaded", function () {
    // Fetch the student's timetable from the backend
    fetch('/api/student/selecttimetable')
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
            if (!data.timetable) return;
            displayStudentTimetable(data.timetable);
        })
        .catch(error => {
            console.error("Error loading timetable:", error);
        });
});

function displayStudentTimetable(sessions) {
    // Clear existing session entries
    document.querySelectorAll('.session-entry').forEach(el => el.remove());

    // Define days and session order
    const daysOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'];
    const sessionSlots = [
        '1st Session', '2nd Session', '3rd Session', 
        '4th Session', '5th Session'
    ];

    // Display regular sessions
    daysOrder.forEach(day => {
        const dayRow = Array.from(document.querySelectorAll('td.sub'))
            .find(td => td.textContent.trim() === day)
            ?.parentNode;

        if (!dayRow) return;

        const daySessions = sessions.filter(s => s.Jour === day);

        sessionSlots.forEach((slot, index) => {
            const slotCell = dayRow.children[index + 1];
            if (!slotCell) return;

            slotCell.innerHTML = '';

            // Display sessions for this slot
            daySessions
                .filter(s => s.horaire === slot)
                .forEach(session => {
                    slotCell.appendChild(createStudentSessionDiv(session));
                });
        });
    });

    // Display online sessions (if any)
    const onlineSessions = sessions.filter(s => 
        ['ONLINETUTORIAL', 'ONLINELAB', 'ONLINELECTURE'].includes(s.type_Seance?.trim().toUpperCase())
    );
    const onlineRow = document.querySelector('#online-row');
    if (onlineRow) {
        const onlineCell = onlineRow.querySelector('.online-session-cell') || 
                          document.createElement('td');
        onlineCell.className = 'online-session-cell';
        onlineCell.colSpan = 5;
        onlineCell.innerHTML = '';

        if (onlineSessions.length === 0) {
            onlineCell.textContent = 'No online sessions';
        } else {
            const container = document.createElement('div');
            container.className = 'online-sessions-container';
            onlineSessions.forEach(session => {
                container.appendChild(createStudentSessionDiv(session));
            });
            onlineCell.appendChild(container);
        }

        if (!onlineRow.querySelector('.online-session-cell')) {
            onlineRow.innerHTML = '';
            onlineRow.appendChild(onlineCell);
        }
    }
}

// ...existing code...
function createStudentSessionDiv(session) {
    const sessionDiv = document.createElement('div');
    sessionDiv.className = `session-entry ${session.type_Seance?.toLowerCase() || ''}`;
    sessionDiv.dataset.sessionId = session.id;

    // Add TEMP ribbon if session is temporary (has expiration_date)
    let tempRibbon = '';
    if (session.expiration_date) {
        sessionDiv.classList.add('temporary');
        tempRibbon = `<span class="temp-ribbon" style="
            position:absolute;top:0;right:0;
            background:#FFA500;color:#fff;
            font-size:0.7em;padding:2px 5px;
            border-radius:0 0 0 4px;
            font-weight:bold;z-index:2;
        ">TEMP</span>`;
        sessionDiv.style.position = 'relative';
    }

    let groupInfo = '';
    if (session.type_Seance === 'LECTURE' || session.type_Seance === 'ONLINELECTURE') {
        groupInfo = `<div class="session-scope">Section ${session.section_name || ''}</div>`;
    } else if (session.group_number) {
        groupInfo = `<div class="session-group">Group ${session.group_number}</div>`;
    }

    // Check if this is an online session
    const isOnline = ['ONLINETUTORIAL', 'ONLINELAB', 'ONLINELECTURE'].includes(session.type_Seance?.trim().toUpperCase());

    sessionDiv.innerHTML = `
        ${tempRibbon}
        <div class="session-content">
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
            </div>
        </div>
    `;
    return sessionDiv;
}
// ...existing code...

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
}