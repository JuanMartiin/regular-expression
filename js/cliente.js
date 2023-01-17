const button = document.getElementById('login-btn');
const sendBtn = document.getElementById('send-btn');
const email = document.getElementById('email');
const password = document.getElementById('password');
const loginF = document.querySelector('.login');
const expresionRegular = document.querySelector('.expresion-regular-container');
const regular = document.getElementById('regular');

var token, ws;

button.addEventListener('click', () => {
    if (email.value != '' && password.value != '') {
        login('http://localhost:3000/login', {
            email: email.value,
            password: password.value
        })
        .then(res => {
            
            token = res.data.token;
            conexionWS(token);
            
            cambiarFormulario();
        })
        .catch(() => console.log('Error'));
    }
});

function cambiarFormulario() {
    if (token != undefined || token != null) {
        loginF.style.display = "none";
        expresionRegular.style.display = "flex";
    }
}

sendBtn.addEventListener('click', enviarExpresion);

function enviarExpresion() {
    if (ws && regular.value != '') {
        ws.send(regular.value);
    } else {
        console.log('Error');
    }
}

function conexionWS(token) {
    
    ws = new WebSocket("ws://localhost:3000/webs?" + token);

    ws.onopen = (event) => {
        console.log("Conexion establecida");
    }

    ws.onclose = (event) => {
        console.log("Conexion cerrada");
    }
}



async function login(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
}