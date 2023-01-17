const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const url = require('url');
const websocket = require('ws');
require('dotenv').config();

var cliente;
var peticiones = 0;
const LIMIT_REQUESTS = 5;

app.use(express.json());

// Server listening on port 3000
const servidor = app.listen(3000, () => {
    console.log("Server running on port 3000");
});

app.post("/login", async (req, res) => {
    
    const token = jwt.sign({
        email: req.body.email,
        password: req.body.password
    }, process.env.TOKEN_SECRET, {
        expiresIn: '10m'
    });

    res.header('auth-token', token).json({
        error: null,
        data: { token }
    });
});


const wss = new websocket.Server({ server: servidor, path: '/webs' });

wss.on('connection', (ws, req) => {
    
    var token = url.parse(req.url, true).token;
    
    jwt.verify(token, process.env.TOKEN_SECRET, (err) => {
        if (err) {
            ws.close();
        } else {
            cliente = ws;
        }
    });
    
    ws.on('message', (data) => {
        jwt.verify(token, process.env.TOKEN_SECRET, (err) => {
            if (err || peticiones >= LIMIT_REQUESTS) {
                ws.send("Error: El token no es valido.");
                ws.close();
            } else {
                //token valido
                //No se que hacer aqui
            }
        });
        // Aumentamos el numero de peticion
        peticiones++;
    });
});