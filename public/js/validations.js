function toggleSubmitButton() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const date = document.getElementById('date').value;
    const department = document.querySelector('select').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    const submitBtn = document.getElementById('cf-submit');

    let errors = [];

    // Collect errors in order
    if (!validateName(name)) {
        errors.push('Name cannot be empty');
    }
    if (!validateEmail(email)) {
        errors.push('Please enter a valid email (common domains like gmail.com, yahoo.com, etc.)');
    }
    if (!validateDate(date)) {
        errors.push('Please select a valid date');
    }
    if (!validateDepartment(department)) {
        errors.push('Please select a Service');
    }
    if (!validatePhone(phone)) {
        errors.push('Phone number must be 10 digits');
    }
    if (!validateMessage(message)) {
        errors.push('Message cannot be empty or whitespace');
    }

    // Show the first error or clear if no errors
    if (errors.length > 0) {
        document.getElementById('errorMessage').textContent = errors[0];
        submitBtn.disabled = true;  // Disable submit button if there are errors
    } else {
        document.getElementById('errorMessage').textContent = '';
        submitBtn.disabled = false;  // Enable submit button when all fields are valid
    }
}

// Validate Name
function validateName(name) {
    return name.trim() !== '';
}

// Validate Email (Check common email domains)
function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(com|org|net|gov|edu)$/;
    const validDomains = ['gmail.com', 'yahoo.com', 'outlook.com'];
    const emailDomain = email.split('@')[1];
    return emailPattern.test(email) && validDomains.includes(emailDomain);
}

// Validate Date (Ensure a date is selected)
function validateDate(date) {
    const today = new Date(); // Get the current date as a Date object
    const inputDate = new Date(date); // Convert input date string to Date object
    
    // Set the time of both dates to midnight to avoid time differences affecting the comparison
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    // Return true if the date is valid and is in the past (before today)
    return date !== '' && inputDate > today;
}


// Validate Department (Ensure a department is selected)
function validateDepartment(department) {
    return department !== '';
}

// Validate Phone Number (Ensure it's a 10-digit number)
function validatePhone(phone) {
    const phonePattern = /^[0-9]{10}$/;
    return phonePattern.test(phone);
}

// Validate Message (Ensure it's not empty)
function validateMessage(message) {
    return message.trim() !== '';
}