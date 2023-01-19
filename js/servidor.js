const express = require('express');
const bodyparser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require("cors");
require('dotenv').config()
var path = require('path');
var WebSocketServer = require("ws").Server;

const app = express();

app.use(bodyparser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '..')));

const PORT = process.env.PORT || 3000;
var server = app.listen(PORT, () => {
    console.log(`server running on port 3000`)
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.post("/login", async (req, res) => {
    // create token
    const token = jwt.sign({
        name: req.body.name,
        id: req.body.id
    }, process.env.TOKEN_SECRET, 
    { expiresIn : 600 });

    res.header('auth-token', token).json({
        error: null,
        data: { token }
    });
});


const wss = new WebSocketServer({ server: server, path: '/request' });

wss.on('connection', (ws, req) => {
  var token = url.parse(req.url, true).query.token;

  jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
          ws.close();
      } else {
          ws.send('(Prueba) Entra en else');
      }
  });

  ws.on('message', (data) => {
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) {
                client.send("Your token has expirated");
                client.close();
            } else {
                client.send(wsUsername + ": " + data);
            }
    })
});

});