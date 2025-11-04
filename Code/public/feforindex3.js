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


