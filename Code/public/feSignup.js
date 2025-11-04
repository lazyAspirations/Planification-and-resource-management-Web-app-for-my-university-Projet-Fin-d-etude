document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('signupForm');
  const submitBtn = document.getElementById('submitBtn');
  const inputs = form.querySelectorAll('input[required]');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirm_password');
  const confirmPasswordError = document.getElementById('confirmPasswordError');
  const cleInput = document.getElementById('cle');
  const cleRequirements = cleInput.parentElement.querySelector('.requirements');
  const cleValidationIcon = cleInput.parentElement.querySelector('.validation-icon');


  cleInput.addEventListener('input', function() {
    validateCle();
    checkFormValidity();
  });

  function validateCle() {
    const clePattern = /^#(AD|PR|ET)[a-zA-Z0-9]{12}$/;
    if (clePattern.test(cleInput.value)) {
      cleValidationIcon.textContent = '✓';
      cleValidationIcon.classList.add('valid');
      cleValidationIcon.classList.remove('invalid');
      cleRequirements.style.display = 'none';
    } else {
      cleValidationIcon.textContent = '✗';
      cleValidationIcon.classList.add('invalid');
      cleValidationIcon.classList.remove('valid');
      cleRequirements.style.display = 'block';
    }
  }

  
  // Password requirements elements
  const lengthRequirement = document.getElementById('length');
  const lowercaseRequirement = document.getElementById('lowercase');
  const uppercaseRequirement = document.getElementById('uppercase');
  const numberRequirement = document.getElementById('number');
  
  // Real-time validation for all fields
  inputs.forEach(input => {
    const validationIcon = input.parentElement.querySelector('.validation-icon');
    const requirements = input.parentElement.querySelector('.requirements');
    
    input.addEventListener('input', function() {
      validateField(input, validationIcon);
      if (input === password) {
        validatePassword();
      }
      if (input === confirmPassword || input === password) {
        validateConfirmPassword();
      }
      checkFormValidity();
      
      // Show requirements on focus
      if (requirements) {
        requirements.style.display = 'block';
      }
    });
    
    input.addEventListener('blur', function() {
      validateField(input, validationIcon);
      if (requirements && input.value === '') {
        requirements.style.display = 'none';
      }
    });
  });
  
  // Validate individual field
  function validateField(field, icon) {
    if (field.checkValidity()) {
      icon.textContent = '✓';
      icon.classList.add('valid');
      icon.classList.remove('invalid');
    } else {
      icon.textContent = '✗';
      icon.classList.add('invalid');
      icon.classList.remove('valid');
    }
  }
  
  // Password validation
  function validatePassword() {
    const value = password.value;
    
    // Validate length
    if (value.length >= 8) {
      lengthRequirement.classList.remove('invalid');
      lengthRequirement.classList.add('valid');
    } else {
      lengthRequirement.classList.remove('valid');
      lengthRequirement.classList.add('invalid');
    }
    
    // Validate lowercase
    if (/[a-z]/.test(value)) {
      lowercaseRequirement.classList.remove('invalid');
      lowercaseRequirement.classList.add('valid');
    } else {
      lowercaseRequirement.classList.remove('valid');
      lowercaseRequirement.classList.add('invalid');
    }
    
    // Validate uppercase
    if (/[A-Z]/.test(value)) {
      uppercaseRequirement.classList.remove('invalid');
      uppercaseRequirement.classList.add('valid');
    } else {
      uppercaseRequirement.classList.remove('valid');
      uppercaseRequirement.classList.add('invalid');
    }
    
    // Validate number
    if (/[0-9]/.test(value)) {
      numberRequirement.classList.remove('invalid');
      numberRequirement.classList.add('valid');
    } else {
      numberRequirement.classList.remove('valid');
      numberRequirement.classList.add('invalid');
    }
  }
  
  // Confirm password validation
  function validateConfirmPassword() {
    if (confirmPassword.value && password.value !== confirmPassword.value) {
      confirmPasswordError.textContent = 'Passwords do not match';
      confirmPassword.setCustomValidity("Passwords don't match");
    } else {
      confirmPasswordError.textContent = '';
      confirmPassword.setCustomValidity('');
    }
  }
  
  // Check if all fields are valid
  function checkFormValidity() {
    let allValid = true;
    
    // Check all required fields
    inputs.forEach(input => {
      if (!input.checkValidity()) {
        allValid = false;
      }
    });
    
    // Special check for password match
    if (password.value !== confirmPassword.value) {
      allValid = false;
    }
    
    // Check honeypot (bot prevention)
    const honeypot = document.getElementById('honeypot');
    if (honeypot.value !== '') {
      allValid = false;
    }
    
    submitBtn.disabled = !allValid;
  }
  
  // Initialize form validation
  checkFormValidity();
  
  // Bot prevention - if honeypot is filled, prevent submission
  form.addEventListener('submit', function(e) {
    const honeypot = document.getElementById('honeypot');
    if (honeypot.value !== '') {
      e.preventDefault();
      alert('Bot detection triggered. If you\'re human, please try again without filling hidden fields.');
    }
  });
});