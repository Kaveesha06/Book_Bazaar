async function getUserData(){
    const response = await fetch("MyAccount");
    
    if(response.ok){
        const json = await response.json();
//        console.log(json);

        document.getElementById("username").innerHTML = `${json.firstName} ${json.lastName}`;
        document.getElementById("since").innerHTML = `Book Bazaar Member Since ${json.since}`;
        document.getElementById("firstName").value = json.firstName;
        document.getElementById("lastName").value = json.lastName;
        document.getElementById("email").innerHTML = `${json.email}`;
        document.getElementById("currentPassword").value =json.password;
        

    }else{
        
    }
}