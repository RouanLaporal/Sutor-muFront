var registerForm = document.getElementById("registerform");
var z = document.getElementById("btn");
var loginForm = document.getElementById("loginform");

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let username = document.getElementById("registerUsername");
    let password = document.getElementById("registerPassword");
    let data = {
        username: username.value,
        password: password.value,
    }
    let body = JSON.stringify(data);
    let headers = { 'Content-Type': "application/json; charset=UTF-8", };

    fetch("https://cryptic-wildwood-39347.herokuapp.com/users/signup", {
        method: 'POST',
        body: body,
        headers: headers,
        mode: 'cors',
    })
        .then(response => response.json())
        .then(response => {
            if (response.message)
                document.location.href = "./login.html";
            else
                alert('NOPE');
        })
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let username = document.getElementById("loginUsername")
    let password = document.getElementById("loginPassword")
    let data = {
        username: username.value,
        password: password.value,
    }
    let body = JSON.stringify(data);
    let headers = { "Content-type": "application/json; charset=UTF-8", };
    //get access to all the data  from the api
    fetch("https://cryptic-wildwood-39347.herokuapp.com/users/login", {
        method: "POST",
        body: body,
        headers: headers,
    })
        .then(response => response.json())
        .then(response => {
            if (response.userId && response.token){
            fetch(`https://cryptic-wildwood-39347.herokuapp.com/users/${response.userId}`,{
                headers:{
                    'Authorization': `${response.token}`,
                }
            })
                .then(res => res.json())
                .then(res => { 
                    if(res._id)
                        document.location.href = "./profil.html";
                    else
                        window.alert('on a pas pu te co bro réesaie');
                });
            }
            else
                alert('NOPE');
        })
})

function register() {
    loginForm.style.left = "-400px";
    registerForm.style.left = "50px";
    z.style.left = "110px";
}

function login() {
    loginForm.style.left = "50px";
    registerForm.style.left = "450px";
    z.style.left = "0px";
}