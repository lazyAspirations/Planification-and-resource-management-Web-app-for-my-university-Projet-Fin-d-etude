// evenement.js - Updated version
document.addEventListener('DOMContentLoaded', function() {
    const createBtns = document.querySelectorAll('.create-event-btn');
    const eventTypeModal = document.getElementById('event-type-modal');
    const interoModal = document.getElementById('intero-modal');
    const closeEventType = document.getElementById('close-event-type');
    const closeIntero = document.getElementById('close-intero');
    const interoForm = document.getElementById('intero-form');
    const academicSelectionDiv = document.getElementById('academic-selection');
    const sessionSelectContainer = document.getElementById('session-select-container');
    const weekSelect = document.getElementById('week-select');
    
    let selectedTarget = 'group';
    let selectedSessionType = 'my';
    let selectedSessionId = null;
    let selectedGroupId = null;
    let selectedSectionId = null;
    let selectedModuleId = null;

    // Show create event modal
    createBtns.forEach(btn => {
        btn.onclick = () => {
            eventTypeModal.style.display = 'block';
        };
    });
    
    // Close modals
    closeEventType.onclick = () => eventTypeModal.style.display = 'none';
    closeIntero.onclick = () => interoModal.style.display = 'none';
    
    // Event type selection
    document.querySelectorAll('.event-type-btn').forEach(btn => {
        btn.onclick = function() {
            if (this.dataset.type === 'intero') {
                eventTypeModal.style.display = 'none';
                interoModal.style.display = 'block';
                renderAcademicSelection();
            }
        };
    });

    // Target selection (group/section)
    document.querySelectorAll('input[name="target"]').forEach(radio => {
        radio.addEventListener('change', function() {
            selectedTarget = this.value;
            renderAcademicSelection();
        });
    });

    // Session type selection (my/other)
    document.querySelectorAll('input[name="session-type"]').forEach(radio => {
        radio.addEventListener('change', function() {
            selectedSessionType = this.value;
            renderSessionSelect();
        });
    });

    // Render the academic selection menu
function renderAcademicSelection() {
    // State for stepper
    let step = 0; // 0: niveau, 1: spec, 2: section, 3: group (if group target)
    let path = [];
    let selections = { niveau: null, spec: null, section: null, group: null };

    // Helper to render the stepper UI
    function renderStep() {
        let stepTitles = [
            "Select Level (Niveau)",
            "Select Speciality (Spécialité)",
            "Select Section",
            ...(selectedTarget === 'group' ? ["Select Group"] : [])
        ];
        let stepKeys = ["niveau", "spec", "section", ...(selectedTarget === 'group' ? ["group"] : [])];

        // Build path display
        let pathHtml = '';
        if (step > 0) {
            pathHtml += `<button class="back-btn" title="Back" type="button">&#8592;</button>`;
        }
        pathHtml += path.map((p, i) => `<span>${p}</span>${i < path.length - 1 ? ' &gt; ' : ''}`).join('');
        if (step === 0) pathHtml += `<span>Start</span>`;

        // Main container
        academicSelectionDiv.innerHTML = `
            <div class="academic-stepper">
                <div class="step-path">${pathHtml}</div>
                <div class="step-title">${stepTitles[step]}</div>
                <div class="options-list"></div>
            </div>
        `;

        // Back button logic
        if (step > 0) {
            academicSelectionDiv.querySelector('.back-btn').onclick = () => {
                step--;
                path.pop();
                selections[stepKeys[step + 1]] = null;
                if (stepKeys[step + 1] === "group") selectedGroupId = null;
                if (stepKeys[step + 1] === "section") selectedSectionId = null;
                renderStep();
            };
        }

        // Load options for current step
        const optionsList = academicSelectionDiv.querySelector('.options-list');
        if (step === 0) {
            fetch('/api/teacher/niveau')
                .then(res => res.json())
                .then(niveaux => {
                    if (!niveaux.length) {
                        optionsList.innerHTML = `<div class="no-options">No levels found</div>`;
                        return;
                    }
                    optionsList.innerHTML = niveaux.map(n =>
                        `<div class="option-card" data-value="${n.id}">${n.nom_C}</div>`
                    ).join('');
                    optionsList.querySelectorAll('.option-card').forEach(card => {
                        card.onclick = () => {
                            selections.niveau = card.dataset.value;
                            path = [card.textContent];
                            step = 1;
                            renderStep();
                        };
                    });
                });
        } else if (step === 1) {
            fetch(`/api/teacher/spec?niveau=${selections.niveau}`)
                .then(res => res.json())
                .then(specs => {
                    if (!specs.length) {
                        optionsList.innerHTML = `<div class="no-options">No specialities found</div>`;
                        return;
                    }
                    optionsList.innerHTML = specs.map(s =>
                        `<div class="option-card" data-value="${s.id}">${s.abr}</div>`
                    ).join('');
                    optionsList.querySelectorAll('.option-card').forEach(card => {
                        card.onclick = () => {
                            selections.spec = card.dataset.value;
                            path = [path[0], card.textContent];
                            step = 2;
                            renderStep();
                        };
                    });
                });
        } else if (step === 2) {
            fetch(`/api/teacher/section?spec=${selections.spec}`)
                .then(res => res.json())
                .then(sections => {
                    if (!sections.length) {
                        optionsList.innerHTML = `<div class="no-options">No sections found</div>`;
                        return;
                    }
                    optionsList.innerHTML = sections.map(s =>
                        `<div class="option-card" data-value="${s.id}">${s.Nom}</div>`
                    ).join('');
                    optionsList.querySelectorAll('.option-card').forEach(card => {
                        card.onclick = () => {
                            selections.section = card.dataset.value;
                            selectedSectionId = card.dataset.value;
                            path = [path[0], path[1], card.textContent];
                            if (selectedTarget === 'group') {
                                step = 3;
                                renderStep();
                            } else {
                                // For section target, finish selection
                                renderSessionSelect();
                            }
                        };
                    });
                });
        } else if (step === 3 && selectedTarget === 'group') {
            fetch(`/api/teacher/group?section=${selections.section}`)
                .then(res => res.json())
                .then(groups => {
                    if (!groups.length) {
                        optionsList.innerHTML = `<div class="no-options">No groups found</div>`;
                        return;
                    }
                    optionsList.innerHTML = groups.map(g =>
                        `<div class="option-card" data-value="${g.id}">Group ${g.num_Grp}</div>`
                    ).join('');
                    optionsList.querySelectorAll('.option-card').forEach(card => {
                        card.onclick = () => {
                            selections.group = card.dataset.value;
                            selectedGroupId = card.dataset.value;
                            path = [path[0], path[1], path[2], card.textContent];
                            // Done, show session select
                            renderSessionSelect();
                        };
                    });
                });
        }
    }

    // Start at step 0
    step = 0;
    path = [];
    selections = { niveau: null, spec: null, section: null, group: null };
    selectedGroupId = null;
    selectedSectionId = null;
    renderStep();
}

    // Load specialité options
    function loadSpecOptions(niveauId) {
        fetch(`/api/teacher/spec?niveau=${niveauId}`)
            .then(res => res.json())
            .then(specs => {
                const specDiv = academicSelectionDiv.querySelector('[data-level="spec"]');
                specDiv.classList.add('active');
                specDiv.innerHTML = specs.map(s => `
                    <div class="option" data-value="${s.id}">${s.abr}</div>
                `).join('');
                
                specDiv.querySelectorAll('.option').forEach(option => {
                    option.addEventListener('click', function() {
                        const specId = this.getAttribute('data-value');
                        academicSelectionDiv.querySelector('.selection-path').innerHTML += ` &gt; ${this.textContent}`;
                        loadSectionOptions(specId);
                    });
                });
            });
    }

    // Load section options
    function loadSectionOptions(specId) {
        fetch(`/api/teacher/section?spec=${specId}`)
            .then(res => res.json())
            .then(sections => {
                const sectionDiv = academicSelectionDiv.querySelector('[data-level="section"]');
                sectionDiv.classList.add('active');
                sectionDiv.innerHTML = sections.map(s => `
                    <div class="option" data-value="${s.id}">${s.Nom}</div>
                `).join('');
                
                sectionDiv.querySelectorAll('.option').forEach(option => {
                    option.addEventListener('click', function() {
                        const sectionId = this.getAttribute('data-value');
                        selectedSectionId = sectionId;
                        
                        if (selectedTarget === 'group') {
                            academicSelectionDiv.querySelector('.selection-path').innerHTML += ` &gt; ${this.textContent}`;
                            loadGroupOptions(sectionId);
                        } else {
                            // For section target, we're done
                            academicSelectionDiv.querySelector('.selection-path').innerHTML += ` &gt; ${this.textContent}`;
                            renderSessionSelect();
                        }
                    });
                });
            });
    }

    // Load group options (only for group target)
    function loadGroupOptions(sectionId) {
        fetch(`/api/teacher/group?section=${sectionId}`)
            .then(res => res.json())
            .then(groups => {
                const groupDiv = academicSelectionDiv.querySelector('[data-level="group"]');
                groupDiv.classList.add('active');
                groupDiv.innerHTML = groups.map(g => `
                    <div class="option" data-value="${g.id}">Group ${g.num_Grp}</div>
                `).join('');
                
                groupDiv.querySelectorAll('.option').forEach(option => {
                    option.addEventListener('click', function() {
                        const groupId = this.getAttribute('data-value');
                        selectedGroupId = groupId;
                        academicSelectionDiv.querySelector('.selection-path').innerHTML += ` &gt; Group ${this.textContent.split(' ')[1]}`;
                        renderSessionSelect();
                    });
                });
            });
    }

    // Render session select based on selections
    function renderSessionSelect() {
        if ((selectedTarget === 'group' && !selectedGroupId) || 
            (selectedTarget === 'section' && !selectedSectionId)) {
            sessionSelectContainer.innerHTML = '<div class="no-sessions">Please select a group/section first</div>';
            return;
        }

        sessionSelectContainer.innerHTML = '<div class="loading">Loading sessions...</div>';

        let url = `/events/intero-sessions?target=${selectedTarget}&which=${selectedSessionType}`;
        if (selectedTarget === 'group') {
            url += `&groupId=${selectedGroupId}`;
        } else {
            url += `&sectionId=${selectedSectionId}`;
        }

        fetch(url)
            .then(res => res.json())
            .then(sessions => {
                if (sessions.length === 0) {
                    sessionSelectContainer.innerHTML = '<div class="no-sessions">No sessions found</div>';
                    return;
                }

                sessionSelectContainer.innerHTML = `
                    <select id="session-select" class="form-control">
                        <option value="">Select a session</option>
                        ${sessions.map(s => `
                            <option value="${s.id}" data-module="${s.id_module}">
                                ${s.Jour} ${s.horaire} - ${s.id_module} (${s.type_Seance})
                            </option>
                        `).join('')}
                    </select>
                `;

                const select = sessionSelectContainer.querySelector('#session-select');
                select.addEventListener('change', function() {
                    selectedSessionId = this.value;
                    selectedModuleId = this.options[this.selectedIndex]?.getAttribute('data-module') || null;
                });
            })
            .catch(err => {
                console.error('Error loading sessions:', err);
                sessionSelectContainer.innerHTML = '<div class="error">Error loading sessions</div>';
            });
    }

    // Form submission
 // Update the form submission in evenement.js
interoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!selectedSessionId) {
        alert('Please select a session');
        return;
    }

    // Get the selected session day from the select element
    const sessionSelect = document.getElementById('session-select');
    const selectedOption = sessionSelect.options[sessionSelect.selectedIndex];
    const sessionDay = selectedOption.text.split(' ')[0]; // Extract day from option text
    
    const weeks = parseInt(weekSelect.value, 10);
    
    // Calculate the date for the selected week
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'];
    const dayIndex = days.indexOf(sessionDay);
    if (dayIndex === -1) {
        alert('Invalid session day');
        return;
    }
    
    const today = new Date();
    const currentDay = today.getDay(); // 0=Sunday, 1=Monday, etc.
    let daysToAdd = (dayIndex - currentDay + 7) % 7;
    daysToAdd += weeks * 7;
    
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysToAdd);
    
    // Set expiration to the end of the target day (23:59:59)
    targetDate.setHours(23, 59, 59, 0);
    const expDateStr = targetDate.toISOString().slice(0, 19).replace('T', ' ');

    fetch('/events/create-intero', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            target: selectedTarget,
            which: selectedSessionType,
            sessionId: selectedSessionId,
            exp_intero: expDateStr
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(`Interrogation scheduled for ${formatDate(targetDate)}!`);
            interoModal.style.display = 'none';
            location.reload(); // Refresh the page to show the new event
        } else {
            alert('Error: ' + (data.error || 'Failed to schedule interrogation'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while scheduling the interrogation');
    });
});

// Helper function to format date
function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === eventTypeModal) {
            eventTypeModal.style.display = 'none';
        }
        if (event.target === interoModal) {
            interoModal.style.display = 'none';
        }
    });
});