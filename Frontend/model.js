const bars =document.querySelectorAll(".fa-bars");
const nav_popup =document.getElementsByClassName("nav-popup");
const deletacc = document.querySelector(".deleteacc");
const overlay = document.querySelector(".overlay");
const cancelbtn = document.querySelector("#cancel-btn");
const delbtn = document.querySelector("#del-btn");
const deleteconf = document.querySelector(".deleteconf");
const navbar = document.querySelector(".navbar");
const nav_main = document.querySelector(".nav-main");
const login_modal = document.querySelector(".login-modal");
const log = document.querySelector(".log");
const log_close = document.querySelector("#login-close");
const log_sign = document.querySelector(".log-sign");
const login_email = document.querySelector("#login-email");
const login_password = document.querySelector("#login-password");
const login_submit = document.querySelector("#login-submit");
const signup_modal = document.querySelector(".signup-modal");
const sign = document.querySelector(".sign");
const signup_name = document.querySelector("#signup-name");
const signup_email = document.querySelector("#signup-email");
const signup_password = document.querySelector("#signup-password");
const signup_submit = document.querySelector("#signup-submit");
const signup_close = document.querySelector("#signup-close");
const logOutacc = document.querySelector(".logOutacc");
const body = document.querySelector(".body");
let success = null;


bars.forEach(bar =>{bar.addEventListener("click", function(){
    if(nav_popup[0].style.display === "none"){
        nav_popup[0].style.display = "flex";
    }
    else{
        nav_popup[0].style.display = "none";
    }
});
});

deletacc.addEventListener("click", ()=>{
    deleteconf.style.display = "flex";
    overlay.style.display = "block";
})

cancelbtn.addEventListener("click", function(){
    deleteconf.style.display= "none";
    overlay.style.display  = "none";
});


delbtn.addEventListener("click", function(){
    nav_main.style.display = "flex";
    bars[0].style.display = "none";
    nav_popup[0].style.display = "none";
    deleteconf.style.display = "none";
    log_sign.style.display = "flex";
    log.style.display = "flex";
    localStorage.removeItem("user");
    localStorage.setItem("isLoggedIn", "false");
    const delInfo = document.createElement("h1");
    delInfo.textContent = "your account parmanantly deleted";
    
    body.appendChild(delInfo);
    body.style.display = "flex";
});

//Login section

log.addEventListener("click", function(){
    log.style.display = "none";
    login_modal.style.display = "flex";
    signup_modal.style.display = "none";
    sign.style.display = "block";
    overlay.style.display = "none";

    if(success){
        success.remove();
    }

});

log_close.addEventListener("click", function(){
    login_modal.style.display = "none";
    log_sign.style.display = "flex";
    log.style.display = "block";
    
})

//Login Submit
login_submit.addEventListener("click", async function () {
    const email = login_email.value.trim();
    const password = login_password.value;
    
    if(!email || !password){
        alert("Please enter your email and password!");
        return;
    }
    
    try {
        const response = await fetch("http://127.0.0.1:3000/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify({email, password})
        });

        const data = await response.json();

        if(!response.ok){
            alert(data.message);
            return;
        }

        alert(data.message);

        login_modal.style.display = "none";
        log_sign.style.display = "none";
        bars[0].style.display = "flex";
    } catch (error){
        console.error("Login error:",error);
        alert("Unable to connect to the server!");
    }
})

//SignUp section

sign.addEventListener("click", function(){
    signup_modal.style.display = "flex";
    login_modal.style.display = "none";
    log.style.display = "block";
    sign.style.display = "none";
    overlay.style.display = "none";
})


signup_close.addEventListener("click",function(){
    signup_modal.style.display = "none";
    sign.style.display = "block";
    log_sign.style.display = "flex";
});

signup_submit.addEventListener("click", async function(){


    //Check that every field is filled
    if(signup_email.value === "" || signup_name.value === "" || signup_password.value === ""){
        const signupinfo = document.createElement("p");
        
        signupinfo.textContent = "please fill all box carefully!";
        signupinfo.style.color = "red";
        signup_modal.appendChild(signupinfo);
    }

    //Check password length
    else if(signup_password.value.length < 6){
            const signupinfo = document.createElement("p");
            signupinfo.textContent = "password should be at least 6 characters!";
            signupinfo.style.color = "red";
            signup_modal.appendChild(signupinfo);
    }
    else{
        
        const user = {
        name: signup_name.value,
        email: signup_email.value,
        password: signup_password.value
    };

    try{
       const response = await fetch("http://127.0.0.1:3000/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
       });

       const data = await response.json();
       console.log(data);
        
       signup_modal.style.display = "none";

        
        success = document.createElement("p");
        success.textContent = "Account created successfully";
        success.style.color = "green";
        success.style.position = "fixed";
        success.style.top = "50%";
        success.style.left = "50%";
        success.style.transform = "translate(-50%, -50%)";
        document.body.appendChild(success);
   
        
    } catch(error){
        console.log(error);
        alert("Unable to connect to the server!");
    }
    
} 
});

//LogOut section

logOutacc.addEventListener("click", function(){
    localStorage.setItem("isLoggedIn", "false");
    bars[0].style.display = "none";
    nav_popup[0].style.display = "none";
    log_sign.style.display ="flex";
    log.style.display = "block";
});



async function checkLoginStatus(){
    try{
        const response = await fetch("http://127.0.0.1:3000/me", {
            method: "GET",
            credentials: "include"
        });

        const data = await response.json();

        if(response.ok){
            //User is logged in
            log_sign.style.display = "none";
            bars[0].style.display = "flex";

            console.log("Logged in as:", data.user.email);
        } else{
            //User is not logged in
            log_sign.style.display = "flex";
            bars[0].style.display = 'none';
        }


    } catch(error){
        console.error("Session check error:", error);
    }
}

checkLoginStatus();