document.addEventListener('DOMContentLoaded', () => {
  const authBox = document.querySelector('.auth-box');
  authBox.style.opacity = 0;
  authBox.style.transform = 'translateY(20px)';

  setTimeout(() => {
    authBox.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    authBox.style.opacity = 1;
    authBox.style.transform = 'translateY(0)';
  }, 100);
});

async function signIn() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const signIn = {
        email: email,
        password: password
    };

    const signInJson = JSON.stringify(signIn);
    const response = await fetch(
            "SignIn",
            {
                method: "POST",
                header: {
                    "Content-Type": "application/json"
                },
                body: signInJson
            }
    );

    if (response.ok) {
        const json = await response.json();

        if (json.status) {//true
            if (json.message === "1") {
                window.location = "verify-account.html";
            } else {
                window.location = "index.html";
            }
        } else {//false
            document.getElementById("message").innerHTML = json.message;
        }

    } else {
        document.getElementById("message").innerHTML = "Sign In Failed, Try again!";
    }
}

async function authenticateUser(){
    const response = await fetch("SignIn");
    
    if(response.ok){
        const json = await response.json();
        if(json.message === "1") {
            window.location = "index.html";
        }
    }else{
        
    }
}