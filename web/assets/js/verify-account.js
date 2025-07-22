document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animations
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });

    // Code input fields auto-tab functionality
    const codeInputs = document.querySelectorAll('.code-inputs input');
    
    if (codeInputs.length > 0) {
        codeInputs.forEach((input, index) => {
            // Auto-tab to next input when a digit is entered
            input.addEventListener('input', function() {
                if (this.value.length === 1) {
                    if (index < codeInputs.length - 1) {
                        codeInputs[index + 1].focus();
                    }
                }
            });
            
            // Handle backspace to move to previous input
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace' && this.value.length === 0) {
                    if (index > 0) {
                        codeInputs[index - 1].focus();
                    }
                }
            });
        });
    }

    // Form validation
    const verifyForm = document.getElementById('verifyForm');
    if (verifyForm) {
        verifyForm.addEventListener('submit',async function(e) {
            e.preventDefault();
            
            // Check if all code inputs are filled
            let allFilled = true;
            let verificationCode = '';
            
            codeInputs.forEach(input => {
                if (!input.value) {
                    allFilled = false;
                    input.classList.add('is-invalid');
                } else {
                    verificationCode += input.value;
                    input.classList.remove('is-invalid');
                }
            });
            
            if (!allFilled) {
                document.querySelector('.invalid-feedback').style.display = 'block';
                return;
            }
            
            document.querySelector('.invalid-feedback').style.display = 'none';
            
            // In a real app, you would verify the code with your backend
//            console.log('Verification code submitted:', verificationCode);
            const verification={
                verificationCode: verificationCode
            };
            
            try{
                const response = await fetch("VerifyAccount",{
                    method:"POST",
                    headers:{
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(verification)
                });
                
                if (response.ok) {
                    const json = await response.json();

                    if (json.status) {
                        window.location = "index.html";
                    } else {
                        if (json.message === "1") {
                            window.location = "sign-in.html";
                        } else {
                            document.getElementById("message").innerHTML = json.message;
                        }
                    }
                } else {
                    document.getElementById("message").innerHTML = "Verification failed!";
                }

                
            }catch(error){
                console.error("Error during verification:", error);
                document.getElementById("message").innerHTML = "An error occurred.";
            }
            
            // Simulate successful verification           
            // window.location.href = 'account.html';
        });
    }

    // Resend code functionality with countdown
    const resendLink = document.getElementById('resendCode');
    const countdownElement = document.getElementById('countdown');
    const countdownSeconds = document.getElementById('countdownSeconds');
    
    if (resendLink && countdownElement && countdownSeconds) {
        let countdown = 60;
        let countdownInterval;
        
        const startCountdown = () => {
            resendLink.classList.add('d-none');
            countdownElement.classList.remove('d-none');
            
            countdownInterval = setInterval(() => {
                countdown--;
                countdownSeconds.textContent = countdown;
                
                if (countdown <= 0) {
                    clearInterval(countdownInterval);
                    resendLink.classList.remove('d-none');
                    countdownElement.classList.add('d-none');
                    countdown = 60;
                    countdownSeconds.textContent = countdown;
                }
            }, 1000);
        };
        
        resendLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // In a real app, you would request a new verification code from your backend
            console.log('Resending verification code...');
            alert('A new verification code has been sent to your email.');
            
            startCountdown();
        });
        
        // Start countdown on page load
        startCountdown();
    }
});
//
//async function verifyAccount() {
//    const verificationCode = document.getElementById("verificationCode").value;
//    const verification = {
//        verificationCode: verificationCode
//    };
//
//    const verificationJson = JSON.stringify(verification);
//
//    const response = await fetch(
//            "VerifyAccount",
//            {
//                method: "POST",
//                header: {
//                    "Content-Type": "application/json"
//                },
//                body: verificationJson
//            }
//    );
//    
//    if (response.ok){
//        const json = await response.json();
//        
//        if(json.status){
//            window.location="index.html";
//        }else{
//            if(json.message==="1"){
//                window.location="sign-in.html";
//            }else{
//                document.getElementById("message").innerHTML=json.message;
//            }
//        }
//    }else{
//        document.getElementById("message").innerHTML="verification failed!";
//    }
//}