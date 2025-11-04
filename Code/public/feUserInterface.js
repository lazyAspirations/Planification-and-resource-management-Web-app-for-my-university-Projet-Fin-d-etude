/*BEGINING PASSWORD */
document.addEventListener('DOMContentLoaded', function() {
    const currentPassword = document.getElementById('currentPassword');
    const newPassword = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const passwordMatchError = document.getElementById('passwordMatchError');
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    
    // Password requirements elements
    const lengthReq = document.getElementById('length-req');
    const lowercaseReq = document.getElementById('lowercase-req');
    const uppercaseReq = document.getElementById('uppercase-req');
    const numberReq = document.getElementById('number-req');
    
    function validatePassword() {
        const currentPass = currentPassword.value;
        const password = newPassword.value;
        const confirm = confirmPassword.value;
        
        // Check password requirements
        const isLengthValid = password.length >= 8;
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        
        // Update requirement indicators
        lengthReq.className = isLengthValid ? 'text-success' : 'text-danger';
        lowercaseReq.className = hasLowercase ? 'text-success' : 'text-danger';
        uppercaseReq.className = hasUppercase ? 'text-success' : 'text-danger';
        numberReq.className = hasNumber ? 'text-success' : 'text-danger';
        
        // Update icons
        lengthReq.innerHTML = (isLengthValid ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-times-circle"></i>') + ' At least 8 characters';
        lowercaseReq.innerHTML = (hasLowercase ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-times-circle"></i>') + ' At least one lowercase letter';
        uppercaseReq.innerHTML = (hasUppercase ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-times-circle"></i>') + ' At least one uppercase letter';
        numberReq.innerHTML = (hasNumber ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-times-circle"></i>') + ' At least one number';
        
        // Check if new password is different from current password
        if (currentPass && password && password === currentPass) {
            passwordMatchError.textContent = 'New password must be different from current password';
            changePasswordBtn.disabled = true;
            return;
        }
        
        // Check if passwords match (only if confirm password has value)
        if (confirm) {
            if (password !== confirm) {
                passwordMatchError.textContent = 'Passwords do not match';
            } else {
                passwordMatchError.textContent = '';
            }
        }
        
        // Enable button only if:
        // 1. All requirements are met
        // 2. Passwords match
        // 3. New password is different from current password
        const allRequirementsMet = isLengthValid && hasLowercase && hasUppercase && hasNumber;
        const passwordsMatch = password === confirm;
        const isDifferentFromCurrent = currentPass && password ? password !== currentPass : true;
        
        changePasswordBtn.disabled = !(allRequirementsMet && passwordsMatch && isDifferentFromCurrent);
    }
    
    // Add event listeners
    currentPassword.addEventListener('input', validatePassword);
    newPassword.addEventListener('input', validatePassword);
    confirmPassword.addEventListener('input', validatePassword);
    
    // Form submission handler
    document.getElementById('passwordResetForm').addEventListener('submit', function(e) {
        if (changePasswordBtn.disabled) {
            e.preventDefault();
            alert('Please fix all password requirements before submitting.');
        }
    });
    
    // Initial validation
    validatePassword();
});
/*ENDING PASSWORD */

/*BEGINING DROP DOWN MENU FOR NAV BAR*/
document.addEventListener("DOMContentLoaded", function() {
    const profileIcon = document.querySelector('.profile'); // Select the FontAwesome icon
    const profileMenu = document.querySelector('.profile'); // Select the profile menu container
    
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


    