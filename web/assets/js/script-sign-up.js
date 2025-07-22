document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animations
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });

    // Password visibility toggle
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.querySelector('i').classList.toggle('bi-eye-slash');
            this.querySelector('i').classList.toggle('bi-eye');
        });
    }

    // Password strength meter
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const strengthBar = document.querySelector('.strength-bar');
            const strengthText = document.querySelector('.strength-text');
            const password = this.value;
            let strength = 0;
            
            // Check password length
            if (password.length >= 8) strength += 1;
            if (password.length >= 12) strength += 1;
            
            // Check for mixed case
            if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength += 1;
            
            // Check for numbers
            if (password.match(/([0-9])/)) strength += 1;
            
            // Check for special chars
            if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1;
            
            // Update strength meter
            let width = '0%';
            let color = '#dc3545';
            let text = 'Very Weak';
            
            switch(strength) {
                case 1:
                    width = '20%';
                    text = 'Weak';
                    break;
                case 2:
                    width = '40%';
                    text = 'Fair';
                    color = '#fd7e14';
                    break;
                case 3:
                    width = '60%';
                    text = 'Good';
                    color = '#ffc107';
                    break;
                case 4:
                    width = '80%';
                    text = 'Strong';
                    color = '#28a745';
                    break;
                case 5:
                    width = '100%';
                    text = 'Very Strong';
                    color = '#28a745';
                    break;
            }
            
            strengthBar.style.width = width;
            strengthBar.style.backgroundColor = color;
            strengthText.textContent = text;
            strengthText.style.color = color;
        });
    }

    // Form validation
//    const signupForm = document.getElementById('signupForm');
//    if (signupForm) {
//        signupForm.addEventListener('submit', function(e) {
//            e.preventDefault();
//            
//            // Validate form
//            let isValid = true;
//            const firstName = document.getElementById('firstName');
//            const lastName = document.getElementById('lastName');
//            const email = document.getElementById('email');
//            const password = document.getElementById('password');
//            const terms = document.getElementById('terms');
//            
//            // Reset validation
//            [firstName, lastName, email, password].forEach(input => {
//                input.classList.remove('is-invalid');
//            });
//            
//            // Validate first name
//            if (!firstName.value.trim()) {
//                firstName.classList.add('is-invalid');
//                isValid = false;
//            }
//            
//            // Validate last name
//            if (!lastName.value.trim()) {
//                lastName.classList.add('is-invalid');
//                isValid = false;
//            }
//            
//            // Validate email
//            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//            if (!emailRegex.test(email.value)) {
//                email.classList.add('is-invalid');
//                isValid = false;
//            }
//            
//            // Validate password
//            if (password.value.length < 8) {
//                password.classList.add('is-invalid');
//                isValid = false;
//            }
//            
//            // Validate terms
//            if (!terms.checked) {
//                terms.classList.add('is-invalid');
//                isValid = false;
//            }
//            
//            if (isValid) {
//                // Form is valid - submit to server
//                
//                
//                // window.location.href = 'dashboard.html';
//            }
//        });
//    }
});

async function signUp() {
     
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log(firstName + lastName + email + password);
    
    const user = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
    };
    
    const userJson = JSON.stringify(user);
    const response = await fetch(
            "SignUp",
            {
                method: "POST",
                body: userJson,
                header: {
                    "Content-Type": "application/json"
                }
            }
    );
    
    if (response.ok) { //success
        const json = await response.json();
//        console.log(json)
        
        if (json.status) {//if true
            // redirect another page
//            document.getElementById("message").className = "text-success";
//            document.getElementById("message").innerHTML = json.message;
            window.location = "verify-account.html";
        } else { 
            //suctom message
//            console.log(json.message);
            document.getElementById("message").innerHTML = json.message;
        }

    } else {
        document.getElementById("message").innerHTML = "Registration Failed, try again!";
    }
    
}