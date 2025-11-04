/*BEGINING OF TIME TABLE SELECTOR*/
document.addEventListener('DOMContentLoaded', function() {
    const wrapper = document.querySelector('.wrapper');
    if (!wrapper) return;

    const selectBtn = wrapper.querySelector('.select-btn');
    const searchInput = wrapper.querySelector('.search input');
    const options = wrapper.querySelector('.options');
    const originalSelect = document.getElementById('timetable-select');
    
    // Toggle dropdown
    selectBtn.addEventListener('click', () => {
        wrapper.classList.toggle('active');
        if (wrapper.classList.contains('active')) {
            searchInput.focus();
        }
    });
    
    // Populate options from original select
    function populateOptions() {
        options.innerHTML = '';
        
        // Get all options from original select
        const selectOptions = originalSelect.querySelectorAll('option');
        
        selectOptions.forEach(option => {
            if (option.value === '') return; // Skip empty options
            
            const li = document.createElement('li');
            li.textContent = option.textContent;
            li.dataset.value = option.value;
            
            li.addEventListener('click', () => {
                selectBtn.querySelector('span').textContent = option.textContent;
                originalSelect.value = option.value;
                wrapper.classList.remove('active');
                
                // Dispatch change event for original select
                originalSelect.dispatchEvent(new Event('change'));
            });
            
            options.appendChild(li);
        });
    }
    
    // Search functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const allOptions = options.querySelectorAll('li');
        
        allOptions.forEach(option => {
            const text = option.textContent.toLowerCase();
            option.style.display = text.includes(searchTerm) ? 'flex' : 'none';
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
            wrapper.classList.remove('active');
        }
    });
    
    // Watch for changes to the original select
    const observer = new MutationObserver(populateOptions);
    observer.observe(originalSelect, { childList: true });
    
    // Initial population if options are already loaded
    if (originalSelect.options.length > 1) {
        populateOptions();
    }
});
/*ENDING OF TIME TABLE SELECTOR*/


/*BEGINING OF SELECT FOR TIME TABLE SELECT TD BOXES*/
document.addEventListener("DOMContentLoaded", function() {
    const popupMenu = document.getElementById("popup-menu");
    const timetable = document.getElementById("timetable");

    // Cache menu items for show/hide
    const ajouterItem = popupMenu.querySelector('.ajouter');
    const modifierItem = popupMenu.querySelector('.modifier');
    const supprimerItem = popupMenu.querySelector('.supprimer');

    timetable.addEventListener("click", function(event) {
        // Check if clicked element is a session entry (regular or online)
        const sessionEntry = event.target.closest('.session-entry') || 
                             event.target.closest('.online-sessions-container .session-entry');

        if (sessionEntry) {
            event.stopPropagation();

            const rect = sessionEntry.getBoundingClientRect();

            // Position the popup menu near the clicked session
            popupMenu.style.top = `${rect.bottom + 10}px`;
            popupMenu.style.left = `${rect.left + 50}px`;
            popupMenu.style.display = "block";

            // Get the session ID from data attribute
            const sessionId = sessionEntry.dataset.sessionId;
            console.log("Selected session ID:", sessionId);

            // Store the selected session ID in the popup menu for later use
            popupMenu.dataset.selectedSessionId = sessionId;

           // ...existing code...
// Show menu items for session
if (ajouterItem) ajouterItem.style.display = '';
if (modifierItem) modifierItem.style.display = '';

// Only show delete if the session-entry has the 'temporary' class
if (sessionEntry && sessionEntry.classList.contains('temporary')) {
    if (supprimerItem) supprimerItem.style.display = '';
} else {
    if (supprimerItem) supprimerItem.style.display = 'none';
}
// ...existing code...
            return;
        }

        // For empty cells (original functionality)
        const targetCell = event.target.closest('td.firstbox, td.lastbox');
        if (!targetCell) return;

        event.stopPropagation();
        const rect = targetCell.getBoundingClientRect();

        // Position the popup menu
        if (targetCell.classList.contains('lastbox')) {
            popupMenu.style.top = `${rect.bottom - 250}px`;
        } else {
            popupMenu.style.top = `${rect.bottom + 10}px`;
        }
        popupMenu.style.left = `${rect.left + 50}px`;
        popupMenu.style.display = "block";

        // Show only "Add", hide "Modify" and "Delete"
        if (ajouterItem) ajouterItem.style.display = '';
        if (modifierItem) modifierItem.style.display = 'none';
        if (supprimerItem) supprimerItem.style.display = 'none';

        // Remove any selected session ID
        delete popupMenu.dataset.selectedSessionId;
    });

    // Hide popup when clicking outside
    document.addEventListener("click", function() {
        popupMenu.style.display = "none";
    });

    // Prevent popup from closing when clicking inside it
    popupMenu.addEventListener("click", function(event) {
        event.stopPropagation();
    });
});
/*END OF SELECT FOR TIME TABLE SELECT TD BOXES*/


/*BEGENING OF TD BIG MENU*/
document.addEventListener("DOMContentLoaded", function() {
    const ajouterItem = document.querySelector(".ajouter");
    const bigPopupMenu = document.getElementById("big-popup-menu");
    const popupMenu = document.getElementById("popup-menu");

    // Show the big popup menu and hide the small popup menu when "Ajouter" is clicked
    ajouterItem.addEventListener("click", function(event) {
        event.stopPropagation(); // Prevent the click from bubbling up
        bigPopupMenu.style.display = "block";
        popupMenu.style.display = "none"; // Hide the small popup menu
    });

    // Hide the big popup menu when clicking outside of it
    document.addEventListener("click", function() {
        bigPopupMenu.style.display = "none";
    });

    // Prevent the big popup menu from closing when clicking inside it
    bigPopupMenu.addEventListener("click", function(event) {
        event.stopPropagation();
    });
});

/*BEGENING OF PAVILLON, ROOM SELECT IN TD BIG MENU*/
const roomsByPavilion = {
    pavilion1: ["Room A", "Room B", "Room C"],
    pavilion2: ["Room D", "Room E"],
    pavilion3: ["Room F", "Room G", "Room H"]
};

function updateRooms() {
    const pavilion = document.getElementById("pavilion").value;
    const roomSelect = document.getElementById("room");

    roomSelect.innerHTML = '<option value="">-- Select Room --</option>';

    if (pavilion && roomsByPavilion[pavilion]) {
        roomsByPavilion[pavilion].forEach(room => {
            const option = document.createElement("option");
            option.value = room.toLowerCase().replace(/\s+/g, "-");
            option.textContent = room;
            roomSelect.appendChild(option);
        });
    }
}
/*ENDING OF PAVILLON, ROOM SELECT IN TD BIG MENU*/

/*BEGENING OF SAVE BUTTON*/
document.addEventListener("DOMContentLoaded", function() {
    const hebdomadaireRadio = document.getElementById("Hebdomadaire");
    const exepcionnelRadio = document.getElementById("Exepcionnel");
    const submitButton = document.getElementById("submit");

    hebdomadaireRadio.addEventListener("change", function() {
        if (hebdomadaireRadio.checked) {
            submitButton.textContent = "Submit a request to add a session";
        }
    });

    exepcionnelRadio.addEventListener("change", function() {
        if (exepcionnelRadio.checked) {
            submitButton.textContent = "Add occasional session now";
        }
    });
});
/*END OF SAVE BUTTON*/

/*ENDING OF TD BIG MENU*/


/*BEGENING OF DELETE TD BIG MENU*/
document.addEventListener("DOMContentLoaded", function() {
    const supprimerItem = document.querySelector(".supprimer");
    const deleteMenu = document.getElementById("deleteMenu");
    const popupMenu = document.getElementById("popup-menu");

    // Show the delete menu and hide the small popup menu when "Supprimer" is clicked
    supprimerItem.addEventListener("click", function(event) {
        event.stopPropagation(); // Prevent the click from bubbling up
        deleteMenu.style.display = "block";
        popupMenu.style.display = "none"; // Hide the small popup menu
    });

    // Hide the delete menu when clicking outside of it
    document.addEventListener("click", function() {
        deleteMenu.style.display = "none";
    });

    // Prevent the delete menu from closing when clicking inside it
    deleteMenu.addEventListener("click", function(event) {
        event.stopPropagation();
    });

    // Close button for delete menu
    const closeBtnDelete = deleteMenu.querySelector(".close-btn");
    closeBtnDelete.addEventListener("click", function() {
        deleteMenu.style.display = "none";
    });
});
/*END OF DELETE TD BIG MENU*/




/* BEGINNING OF GREETING MESSAGE*/
document.addEventListener("DOMContentLoaded", function () {
    const greetingMessage = document.getElementById("greeting-message");
    const greetingSound = document.getElementById("greeting-sound");

    if (greetingMessage && greetingSound) {
        // Get the user's email from the data attribute
        const userEmail = greetingMessage.getAttribute("data-user-email");

        // Check if the greeting message has already been shown for this user
        if (!sessionStorage.getItem(`greetingShown_${userEmail}`)) {
            // Show the greeting message
            greetingMessage.style.display = "block";

            // Play the greeting sound
            greetingSound.play();

            // Set a timeout to fade out and hide the greeting message after 7 seconds
            setTimeout(() => {
                // Add the fade-out class to trigger the fade-out animation
                greetingMessage.classList.add("fade-out");

                // Wait for the fade-out animation to complete (1 second)
                setTimeout(() => {
                    greetingMessage.style.display = "none";
                    // Mark the greeting message as shown for this user
                    sessionStorage.setItem(`greetingShown_${userEmail}`, "true");
                }, 1000); // Match the duration of the fade-out animation
            }, 5000); // Display duration (7 seconds)
        } else {
            // Hide the greeting message if it has already been shown for this user
            greetingMessage.style.display = "none";
        }
    }
});
/*END OF GREETING MESSAGE */



/* BEGINNING OF GENERAL PURPOSE */
document.addEventListener("DOMContentLoaded", function() {
    const popupMenu = document.getElementById("popup-menu");
    const bigPopupMenu = document.getElementById("big-popup-menu");
    const deleteMenu = document.getElementById("deleteMenu");
    const modifyMenu = document.getElementById("modifyMenu"); 
    const absenceMenu = document.getElementById("absenceMenu");

    const ajouterItem = document.querySelector(".ajouter");
    const supprimerItem = document.querySelector(".supprimer");
    const modifierItem = document.querySelector(".modifier");

    const closeBtns = document.querySelectorAll(".close-btn");

    // Function to hide all menus
    function hideAllMenus() {
        [bigPopupMenu, deleteMenu, modifyMenu, absenceMenu, popupMenu].forEach(menu => {
            if (menu) menu.style.display = "none";
        });
    }

    // Hide menus when clicking outside
    document.addEventListener("click", function() {
        hideAllMenus();
    });


    // Hide menus when SCROLLING outside
    // document.addEventListener("scroll", function() {
    //     hideAllMenus();
    // });


    // Prevent closing menus when clicking inside them
    [bigPopupMenu, deleteMenu, modifyMenu, absenceMenu, popupMenu].forEach(menu => {
        menu?.addEventListener("click", function(event) {
            event.stopPropagation();
        });
    });

    // Close button functionality
   // Close button functionality
closeBtns.forEach(btn => {
    btn.addEventListener("click", function() {
        hideAllMenus();
        
        // Reset forms based on which menu is being closed
        if (this.closest('#big-popup-menu')) {
            resetAddForm();
        } else if (this.closest('#modifyMenu')) {
            resetModifyForm();
        }
    });
});

    // Show the big popup menu when "Ajouter" is clicked
    ajouterItem.addEventListener("click", function(event) {
        event.stopPropagation();
        hideAllMenus();
        bigPopupMenu.style.display = "block";
    });

    // Show delete menu when "Supprimer" is clicked
    supprimerItem.addEventListener("click", function(event) {
        event.stopPropagation();
        hideAllMenus();
        deleteMenu.style.display = "block";
    });

    // Show modify menu when "Modifier" is clicked
    modifierItem?.addEventListener("click", function(event) {
        event.stopPropagation();
        hideAllMenus();
        if (modifyMenu) {
            modifyMenu.style.display = "block";
            // Call the function to populate the modify form
            openModifyPopup();
        }
    });
 
});
/* END OF GENERAL PURPOSE */


/*BEGINING DROP DOWN MENU FOR NAV BAR*/
document.addEventListener("DOMContentLoaded", function() {
const profileIcon = document.querySelector('.Navprofile'); // Select the FontAwesome icon
const profileMenu = document.querySelector('.Navprofile'); // Select the profile menu container

// Toggle dropdown when the icon is clicked
profileIcon.addEventListener('click', (event) => {
  event.stopPropagation(); // Prevent the click from bubbling up to the document
  profileMenu.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', (event) => {
  if (!profileMenu.contains(event.target)) {
    profileMenu.classList.remove('active');
  }
});});
/*ENDING DROP DOWN MENU FOR NAV BAR*/



/*BEGINING OF DELETE OPTION */
document.addEventListener('DOMContentLoaded', function() {
    // Handle delete button click
    document.getElementById('confirm-delete').addEventListener('click', function() {
        deleteSelectedSession();
        document.getElementById('deleteMenu').style.display = 'none';
    });

    // Handle cancel button click
    document.getElementById('cancel-delete').addEventListener('click', function() {
        document.getElementById('deleteMenu').style.display = 'none';
    });

    // When delete option is clicked from the small popup
    document.querySelector('.supprimer').addEventListener('click', function() {
        const sessionId = document.querySelector('#timetable').dataset.selectedSessionId;
        if (!sessionId) {
            alert('Please select a session first by clicking on it');
            return;
        }
        
        // Get session info to display
        const selectedSession = document.querySelector('.session-entry.selected');
        if (selectedSession) {
            const module = selectedSession.querySelector('.session-module').textContent;
            const type = selectedSession.querySelector('.session-type').textContent;
            const room = selectedSession.querySelector('.session-room').textContent;
            const groupInfo = selectedSession.querySelector('.session-scope, .session-group');
            
            let details = `${module} (${type}) in room ${room}`;
            if (groupInfo) {
                details += ` - ${groupInfo.textContent}`;
            }
            
            document.getElementById('session-delete-info').textContent = details;
        }
        
        document.getElementById('deleteMenu').style.display = 'block';
    });

    // Close button for delete popup
    document.querySelector('#deleteMenu .close-btn').addEventListener('click', function() {
        document.getElementById('deleteMenu').style.display = 'none';
    });

    // Handle clicks outside popups to close them
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.big-popup-menu') && !e.target.closest('.ajouter') && 
            !e.target.closest('.modifier') && !e.target.closest('.supprimer')) {
            document.getElementById('deleteMenu').style.display = 'none';
        }
    });
});

/*ENDING OF DELETE OPTION*/



// For sticky behavior (optional)
window.addEventListener('scroll', function() {
    const formGroup = document.querySelector('.form-group');
    // Adjust the multiplier (0.5) to control speed
    // Higher = faster movement, Lower = slower movement
    const newPosition = 150 + (window.scrollY * 1);
    formGroup.style.top = `${newPosition}px`;
  });



  /* BEGINNING OF FORM RESET FUNCTIONALITY */
function resetAddForm() {
    const form = document.getElementById('add-session-form');
    if (form) {
        form.reset();
        
        // Reset specific elements that might not be cleared by .reset()
        document.getElementById('id_salle').innerHTML = '<option value="">-- Select a room --</option>';
        document.getElementById('horaire').innerHTML = `
            <option value="">-- Select time --</option>
            <option value="1st Session">1st Session (8:00-9:30)</option>
            <option value="2nd Session">2nd Session (9:35-11:05)</option>
            <option value="3rd Session">3rd Session (11:10-12:40)</option>
            <option value="4th Session">4th Session (12:45-14:15)</option>
            <option value="5th Session">5th Session (14:20-15:50)</option>
        `;
        
        // Reset academic selection
        document.getElementById('selection-path').textContent = 'Start by selecting a niveau';
        document.querySelectorAll('.level-options').forEach(el => {
            el.classList.remove('active');
            el.innerHTML = '<div class="loading">Loading...</div>';
        });
        document.querySelector('.level-options[data-level="niveau"]').classList.add('active');
        
        // Reset hidden inputs
        document.getElementById('id_niveau').value = '';
        document.getElementById('id_spec').value = '';
        document.getElementById('id_section').value = '';
        document.getElementById('id_groupe').value = '';
        
        // Reset online checkbox
        document.getElementById('isOnline').checked = false;
    }
}

function resetModifyForm() {
    const form = document.getElementById('modify-form');
    if (form) {
        form.reset();
        document.querySelector('#modify-form select[name="id_salle"]').innerHTML = '<option value="">Select a room</option>';
    }
}

// Add close button event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add form reset for the main add popup
    document.querySelector('#big-popup-menu .close-btn').addEventListener('click', function() {
        resetAddForm();
    });

    // Add form reset for the modify popup
    document.querySelector('#modifyMenu .close-btn').addEventListener('click', function() {
        resetModifyForm();
    });

    // Also reset when clicking outside the popup
    document.addEventListener('click', function(e) {
        if (!e.target.closest('#big-popup-menu') && !e.target.classList.contains('ajouter')) {
            resetAddForm();
        }
        if (!e.target.closest('#modifyMenu') && !e.target.classList.contains('modifier')) {
            resetModifyForm();
        }
    });
});
/* END OF FORM RESET FUNCTIONALITY */

