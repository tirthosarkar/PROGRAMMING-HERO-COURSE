document.getElementById('btnSignIn').addEventListener('click', () => {
    const userName = document.getElementById('Username').value;
    const pass = document.getElementById('Password').value;
    if(userName==="admin" && pass ==="admin123"){
        window.location.assign("./main.html")
    }
    
})