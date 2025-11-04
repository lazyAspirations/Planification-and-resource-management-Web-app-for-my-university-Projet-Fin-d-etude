/*BEGINING OF DYNAMIQUE POPULATION OF ADD */
/* DYNAMIC POPULATION AND FORM HANDLING */
document.addEventListener("DOMContentLoaded", function() {
    // 1. Initialize Room Availability Check
    function checkRoomAvailability() {
        const sessionType = document.getElementById('type_Seance').value;
        const day = document.getElementById('Jour').value;
        const hour = document.getElementById('horaire').value;
        
        if (!sessionType || !day || !hour) return;
        
        const roomSelect = document.getElementById('id_salle');
        roomSelect.innerHTML = '<option value="">Loading rooms...</option>';
        
        fetch(`/api/teacher/available-rooms?day=${day}&hour=${hour}&sessionType=${sessionType}`)
            .then(response => response.json())
            .then(rooms => {
                roomSelect.innerHTML = '<option value="">-- Select a room --</option>';
                rooms.forEach(room => {
                    const option = document.createElement('option');
                    option.value = room.id;
                    option.textContent = `${room.id} (Capacity: ${room.capacite_salle})`;
                    roomSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error("Error fetching rooms:", error);
                roomSelect.innerHTML = '<option value="">Error loading rooms</option>';
            });
    }

    function updateAvailableTimeSlots() {
        const day = document.getElementById('Jour').value;
        const module = document.getElementById('id_module').value;
        const group = document.getElementById('id_groupe').value;
        const section = document.getElementById('id_section').value;
        const isOnline = document.getElementById('isOnline').checked;
        
        // Skip if we don't have enough info or it's online
        if (!day || isOnline || (!group && !section)) {
            return;
        }
        
        const timeSelect = document.getElementById('horaire');
        timeSelect.innerHTML = '<option value="">Loading available times...</option>';
        
        fetch(`/api/teacher/available-times?day=${day}&moduleId=${module || ''}&groupId=${group || ''}&sectionId=${section || ''}`)
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
                
                // Trigger room availability check
                checkRoomAvailability();
            })
            .catch(error => {
                console.error("Error fetching available times:", error);
                timeSelect.innerHTML = '<option value="">Error loading times</option>';
            });
    }

    // 2. Initialize Dropdowns
    function populateDropdown(selectId, data, valueField, textField) {
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">-- Select a module --</option>';
        data.forEach(item => {
            const option = document.createElement("option");
            option.value = item[valueField];
            option.textContent = item[textField];
            select.appendChild(option);
        });
    }

    async function fetchModules(sessionType = null) {
        let url = '/api/teacher/modules';
        if (sessionType) url += `?sessionType=${sessionType}`;
        const response = await fetch(url);
        return response.json();
    }

    async function updateModulesDropdown(sessionType) {
        const moduleSelect = document.getElementById('id_module');
        moduleSelect.innerHTML = '<option value="">Loading modules...</option>';
        try {
            const modules = await fetchModules(sessionType);
            populateDropdown('id_module', modules, 'id', 'nom_C');
        } catch (error) {
            moduleSelect.innerHTML = '<option value="">Error loading modules</option>';
        }
    }

    // 3. Initialize Academic Selection Component
    function initAcademicSelection() {
        const selectionPath = document.getElementById('selection-path');
        const levelContainers = document.querySelectorAll('.level-options');
        const hiddenInputs = {
            niveau: document.getElementById('id_niveau'),
            spec: document.getElementById('id_spec'),
            section: document.getElementById('id_section'),
            group: document.getElementById('id_groupe')
        };

        let currentLevel = 'niveau';
        let selectedItems = { niveau: null, spec: null, section: null, group: null };
        let currentSessionType = null;
        let currentModuleId = null;

        async function fetchData(level, parentId = null) {
            try {
                let url = `/api/teacher/${level}`;
                const params = new URLSearchParams();
                
                if (parentId) {
                    params.append(level === 'spec' ? 'niveau' : 
                                level === 'section' ? 'spec' : 
                                'section', parentId);
                }
                
                // Only append module parameter if it's a valid value
                if (level === 'niveau' && currentModuleId && currentModuleId !== '') {
                    params.append('module', currentModuleId);
                }
                
                if (currentSessionType) {
                    params.append('sessionType', currentSessionType);
                }
                
                const response = await fetch(`${url}?${params.toString()}`);
                
                if (!response.ok) {
                    const error = await response.json();
                    console.error(`API Error for ${level}:`, error);
                    throw new Error(error.error || 'Failed to fetch data');
                }
                
                const data = await response.json();
                
                // Ensure we always return an array
                return Array.isArray(data) ? data : [];
            } catch (error) {
                console.error(`Error fetching ${level}:`, error);
                return []; // Return empty array to prevent UI breakage
            }
        }
        
        async function renderOptions(level, parentId = null) {
            const container = document.querySelector(`.level-options[data-level="${level}"]`);
            container.innerHTML = '<div class="loading">Loading...</div>';
            
            try {
                const data = await fetchData(level, parentId);
                
                let html = '';
                if (level !== 'niveau' && parentId) {
                    html += `<div class="back-button" data-back-to="${getPreviousLevel(level)}">← Back</div>`;
                }
                
                if (!Array.isArray(data) || data.length === 0) {
                    html += '<div class="no-results">No options available</div>';
                } else {
                    data.forEach(item => {
                        const displayName = level === 'niveau' ? item.nom_C : 
                                          level === 'spec' ? item.abr : 
                                          level === 'section' ? item.Nom : 
                                          `Group ${item.num_Grp}`;
                        
                        html += `
                            <div class="option-item" 
                                 data-level="${level}" 
                                 data-id="${item.id}" 
                                 data-name="${displayName}">
                                ${displayName}
                            </div>
                        `;
                    });
                }
                
                container.innerHTML = html;
                setupOptionClickHandlers();
                setupBackButtonHandlers();
            } catch (error) {
                console.error(`Error rendering ${level} options:`, error);
                container.innerHTML = '<div class="no-results">Error loading options</div>';
            }
        }

        async function renderOptions(level, parentId = null) {
            const container = document.querySelector(`.level-options[data-level="${level}"]`);
            container.innerHTML = '<div class="loading">Loading...</div>';
            
            const data = await fetchData(level, parentId);
            let html = level !== 'niveau' && parentId ? `<div class="back-button" data-back-to="${getPreviousLevel(level)}">← Back</div>` : '';
            
            if (data.length === 0) {
                html += '<div class="no-results">No options available</div>';
            } else {
                data.forEach(item => {
                    const displayName = level === 'niveau' ? item.nom_C : 
                                      level === 'spec' ? item.abr : 
                                      level === 'section' ? item.Nom : 
                                      `Group ${item.num_Grp}`;
                    html += `<div class="option-item" data-level="${level}" data-id="${item.id}" data-name="${displayName}">${displayName}</div>`;
                });
            }
            
            container.innerHTML = html;
            setupOptionClickHandlers();
            setupBackButtonHandlers();
        }

        function setupBackButtonHandlers() {
            document.querySelectorAll('.back-button').forEach(button => {
                button.addEventListener('click', function() {
                    const targetLevel = this.dataset.backTo;
                    const levels = ['niveau', 'spec', 'section', 'group'];
                    const targetIndex = levels.indexOf(targetLevel);
                    
                    for (let i = targetIndex + 1; i < levels.length; i++) {
                        selectedItems[levels[i]] = null;
                        hiddenInputs[levels[i]].value = '';
                    }
                    navigateToLevel(targetLevel);
                });
            });
        }

        function setupOptionClickHandlers() {
            document.querySelectorAll('.option-item').forEach(item => {
                item.addEventListener('click', function() {
                    const level = this.dataset.level;
                    const id = this.dataset.id;
                    const name = this.dataset.name;
                    
                    selectedItems[level] = { id, name };
                    hiddenInputs[level].value = id;
                    
                    document.querySelectorAll(`.option-item[data-level="${level}"]`).forEach(opt => opt.classList.remove('selected'));
                    this.classList.add('selected');
                    
                    updateSelectionPath();
                    
                    const nextLevel = getNextLevel(level);
                    if (nextLevel) navigateToLevel(nextLevel, id);
                });
            });
        }

        function navigateToLevel(level, parentId = null) {
            currentLevel = level;
            if (!parentId && level !== 'niveau') {
                const prevLevel = getPreviousLevel(level);
                parentId = selectedItems[prevLevel]?.id || null;
            }
            
            levelContainers.forEach(container => container.classList.remove('active'));
            document.querySelector(`.level-options[data-level="${level}"]`).classList.add('active');
            renderOptions(level, parentId);
        }

        function updateSelectionPath() {
            let path = [];
            if (selectedItems.niveau) path.push(selectedItems.niveau.name);
            if (selectedItems.spec) path.push(selectedItems.spec.name);
            if (selectedItems.section) path.push(selectedItems.section.name);
            if (selectedItems.group) path.push(selectedItems.group.name);
            selectionPath.innerHTML = path.length > 0 ? `Selected: ${path.join(' → ')}` : 'Start by selecting a niveau';
        }

        function getNextLevel(currentLevel) {
            const levels = currentSessionType === 'LECTURE' ? ['niveau', 'spec', 'section'] : ['niveau', 'spec', 'section', 'group'];
            const currentIndex = levels.indexOf(currentLevel);
            return levels[currentIndex + 1] || null;
        }

        function getPreviousLevel(currentLevel) {
            const levels = currentSessionType === 'LECTURE' ? ['niveau', 'spec', 'section'] : ['niveau', 'spec', 'section', 'group'];
            const currentIndex = levels.indexOf(currentLevel);
            return levels[currentIndex - 1] || null;
        }

        // Initialize
        renderOptions('niveau');
        updateSelectionPath();

        // Event Listeners
        document.getElementById('type_Seance').addEventListener('change', function() {
            currentSessionType = this.value;
            selectedItems = { niveau: null, spec: null, section: null, group: null };
            Object.values(hiddenInputs).forEach(input => input.value = '');
            updateSelectionPath();
            renderOptions('niveau');
            updateModulesDropdown(this.value);
            checkRoomAvailability();
        });

        // MODULE CHANGE HANDLER - THIS IS THE CRITICAL PART
        document.getElementById('id_module').addEventListener('change', function() {
            currentModuleId = this.value;
            if (currentLevel === 'niveau') {
                renderOptions('niveau');
            } else if (currentLevel) {
                const parentId = currentLevel !== 'niveau' ? selectedItems[getPreviousLevel(currentLevel)]?.id : null;
                renderOptions(currentLevel, parentId);
            }
        });
    }

    // Initialize all components
    initAcademicSelection();

    // Add event listeners for elements that affect time slot availability
['Jour', 'id_module', 'id_groupe', 'id_section', 'isOnline'].forEach(id => {
    document.getElementById(id).addEventListener('change', updateAvailableTimeSlots);
});

// Initialize time slots
updateAvailableTimeSlots();

    updateModulesDropdown();

    // Set up event listeners
    ['type_Seance', 'Jour', 'horaire'].forEach(id => {
        document.getElementById(id).addEventListener('change', checkRoomAvailability);
    });

    checkRoomAvailability();
});

/*ENDING OF DYNAMIQUE POPULATION OF ADD */



/*BEGINING OF ONLINE POPULATION ADD*/
function initOnlineCheckbox() {
    console.log("[Debug] Initializing online checkbox...");
    
    // Get the checkbox element - more robust selector
    const isOnlineCheckbox = document.querySelector("#big-popup-menu #isOnline");
    
    if (!isOnlineCheckbox) {
        console.error("[Error] Online checkbox element not found!");
        return false; // Return false to indicate failure
    }

    console.log("[Debug] Checkbox found:", isOnlineCheckbox);

    // Function to handle checkbox changes
    function handleOnlineToggle(isOnline) {
        console.log(`[Debug] Checkbox state changed to: ${isOnline}`);
        
        // Get the relevant form elements with more specific selectors
        const sessionTimeContainer = document.querySelector("#big-popup-menu select#horaire");
        const sessionTypeSelect = document.querySelector("#big-popup-menu #type_Seance");
        const roomSelectContainer = document.querySelector("#big-popup-menu .input-box:has(#id_salle)");

        if (isOnline) {
            console.log("[Debug] Switching to ONLINE mode");
            
            // Store original session time select if it exists
            if (sessionTimeContainer && !sessionTimeContainer.dataset.originalHtml) {
                sessionTimeContainer.dataset.originalHtml = sessionTimeContainer.outerHTML;
                
                // Replace with time input
                const timeInput = document.createElement('input');
                timeInput.type = 'time';
                timeInput.id = 'horaire';
                timeInput.name = 'horaire';
                timeInput.required = true;
                timeInput.className = 'online-time-input';
                sessionTimeContainer.replaceWith(timeInput);
            }
            
            // Update session type options for online
            if (sessionTypeSelect) {
                sessionTypeSelect.innerHTML = `
                    <option value="">-- Select a type --</option>
                    <option value="ONLINELECTURE">Online Lecture</option>
                    <option value="ONLINETUTORIAL">Online Tutorial</option>
                    <option value="ONLINELAB">Online Lab</option>
                `;
            }
            
            // Hide room selection container
            if (roomSelectContainer) {
                roomSelectContainer.style.display = "none";
            }
        } else {
            console.log("[Debug] Switching to OFFLINE mode");
            
            // Restore original session time select if it exists
            const timeInput = document.querySelector("#big-popup-menu input#horaire");
if (timeInput) {
    const selectElement = document.createElement("select");
    selectElement.id = "horaire";
    selectElement.name = "horaire";
    selectElement.required = true;
    selectElement.innerHTML = `
        <option value="1st Session">1st Session (8:00-9:30)</option>
        <option value="2nd Session">2nd Session (9:35-11:05)</option>
        <option value="3rd Session">3rd Session (11:10-12:40)</option>
        <option value="4th Session">4th Session (12:45-14:15)</option>
        <option value="5th Session">5th Session (14:20-15:50)</option>
    `;
    timeInput.replaceWith(selectElement);
    console.log("Session time reverted to dropdown.");
}
            
            // Revert to standard session types
            if (sessionTypeSelect) {
                sessionTypeSelect.innerHTML = `
                    <option value="">-- Select a type --</option>
                    <option value="LECTURE">Lecture</option>
                    <option value="TUTORIAL">Tutorial</option>
                    <option value="LAB">Lab</option>
                `;
            }
            
            // Show room selection
            if (roomSelectContainer) {
                roomSelectContainer.style.display = "block";
            }
        }
    }

    // Add event listener for checkbox changes
    isOnlineCheckbox.addEventListener("change", function() {
        handleOnlineToggle(this.checked);
    });

    // Initialize with current checkbox state
    handleOnlineToggle(isOnlineCheckbox.checked);
    console.log("[Debug] Online checkbox initialized");
    return true; // Return true to indicate success
}

// Improved initialization handler
function setupOnlineCheckbox() {
    // Try to initialize immediately if popup is already open
    if (document.getElementById('big-popup-menu')?.style.display === 'block') {
        if (initOnlineCheckbox()) {
            return;
        }
    }

    // Set up observer for when popup opens
    const popupObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'style') {
                const popup = document.getElementById('big-popup-menu');
                if (popup.style.display === 'block') {
                    initOnlineCheckbox();
                }
            }
        });
    });
    
    const popup = document.getElementById('big-popup-menu');
    if (popup) {
        popupObserver.observe(popup, { attributes: true });
    }

    // Fallback click handler
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('ajouter')) {
            setTimeout(() => {
                initOnlineCheckbox();
            }, 100);
        }
    });
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", function() {
    // Wait a brief moment to ensure all elements are loaded
    setTimeout(setupOnlineCheckbox, 500);
});
/*ENDING OF ONLINE POPULATION ADD*/




/* BEGINNING ADD SESSION */
document.getElementById('add-session-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    try {
        // Clear previous messages
        clearMessages();

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Prepare data
        const submissionData = prepareSubmissionData();
        console.log('Submitting:', submissionData);

        // Submit form
        await submitForm(submissionData);

    } catch (error) {
        console.error('Form submission error:', error);
        showError('An unexpected error occurred. Please try again.');
    }
});

/* Helper Functions */

function validateForm() {
    // Clear previous errors
    clearMessages();

    const timeSelect = document.getElementById('horaire');
    if (!timeSelect.value) {
        showError('Please select an available time slot');
        return false;
    }

    // Validate frequency
    const frequenceInput = document.querySelector('input[name="Frequence"]:checked');
    if (!frequenceInput) {
        showError('Please select a frequency option (Weekly or Onetime)');
        return false;
    }

    // Validate session type
    const sessionType = document.getElementById('type_Seance').value;
    if (!sessionType) {
        showError('Please select a session type');
        return false;
    }

    // Validate module
    if (!document.getElementById('id_module').value) {
        showError('Please select a module');
        return false;
    }

    // Validate online vs physical
    const isOnline = document.getElementById('isOnline').checked;
    if (!isOnline && !document.getElementById('id_salle').value) {
        showError('Please select a room for physical sessions');
        return false;
    }

    // Validate academic selection
    if (sessionType === 'LECTURE' && !document.getElementById('id_section').value) {
        showError('Please select a section for lecture sessions');
        return false;
    }

    if ((sessionType === 'TUTORIAL' || sessionType === 'LAB') && !document.getElementById('id_groupe').value) {
        showError('Please select a group for tutorial/lab sessions');
        return false;
    }

    return true;
}

function prepareSubmissionData() {
    const isOnline = document.getElementById('isOnline').checked;
    const frequenceInput = document.querySelector('input[name="Frequence"]:checked');
    const timeSelect = document.getElementById('horaire');

    let horaireValue;
    if (isOnline) {
        const timeInput = document.querySelector('input#horaire[type="time"]');
        horaireValue = timeInput ? timeInput.value : timeSelect.value;
    } else {
        // For physical sessions, extract just the slot name (e.g., "1st Session")
        horaireValue = timeSelect.value.split(' ')[0] + ' ' + timeSelect.value.split(' ')[1];
    }

    
    return {
        Frequence: frequenceInput.value,
        Jour: document.getElementById('Jour').value,
        horaire: document.getElementById('horaire').value,
        type_Seance: document.getElementById('type_Seance').value,
        id_module: document.getElementById('id_module').value,
        id_niveau: document.getElementById('id_niveau').value,
        id_spec: document.getElementById('id_spec').value,
        id_section: document.getElementById('id_section').value || null,
        id_groupe: document.getElementById('id_groupe').value || null,
        id_salle: isOnline ? null : document.getElementById('id_salle').value,
        is_temporary: frequenceInput.value === "Exepcionnel",
        isOnline: isOnline
    };
}

async function submitForm(data) {
    const submitButton = document.querySelector('#add-session-form button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    try {
        const response = await fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Non-JSON response:', text);
            throw new Error('Server returned an unexpected response');
        }

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Submission failed');
        }

        // Success handling
        showSuccess(result.message || 'Session added successfully');
        document.getElementById('big-popup-menu').style.display = 'none';
        
        if (data.Frequence === "Exepcionnel") {
            refreshTimetable();
        }

    } catch (error) {
        console.error('Submission error:', error);
        showError(extractErrorMessage(error));
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Save';
    }
}

function extractErrorMessage(error) {
    // Handle cases where the error is HTML
    if (error.message.includes('<!DOCTYPE') || error.message.includes('<html')) {
        return 'Server error occurred. Please try again later.';
    }
    return error.message || 'Failed to submit session';
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.getElementById('big-popup-menu').prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 5000);
}

function clearMessages() {
    document.querySelectorAll('.error-message, .success-message').forEach(el => el.remove());
}
/* ENDING ADD SESSION */