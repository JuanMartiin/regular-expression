const button = document.getElementById('login-btn');
const sendBtn = document.getElementById('send-btn');
const email = document.getElementById('email');
const password = document.getElementById('password');
const loginF = document.querySelector('.login');
const expresionRegular = document.querySelector('.expresion-regular-container');
const regular = document.getElementById('regular');

var token;

async function login(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

button.addEventListener('click', () =>{
    init();
})

async function init() {
    await login('http://localhost:3000/login', {
        name: email.value,
        password: password.value
    }).then(res => {
        token = res.data.token;
        if(token && email.value && password.value ){
            document.querySelector('form').style.display = 'none';
            document.getElementById('expresion-regular-container').style.display = 'block';
        }else{
            let p = document.createElement('p');
            p.innerHTML = 'Campos vacios';
            document.querySelector('form').appendChild(p);
        }
        openWsConnection();
        console.log("Token: " + token);
    }).catch(error => {
        console.log(error);
    });
}

async function request(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

function openWsConnection(){

    ws = new WebSocket("ws://localhost:3000/request?token=" + token);

    ws.onopen = (event) => {
        console.log("WebSocket connection established.");
        ws.send(token);
    }

    ws.onmessage = (event) => {
        console.log("WebSocket message received: ", event.data);

    }

    ws.onerror = (event) => {
        console.log("WebSocket error received: ", event);
    }

    ws.onclose = (event) => {
        console.log("WebSocket connection closed.");
    }
}