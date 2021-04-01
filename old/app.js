// Secure Programming: Assignment
// Paavo Kemppainen
// paavo.kemppainen@tuni.fi

const https = require('https')
const http = require('http')

const fs = require('fs');
// HTTPS creadentials (self-signed)
// Certificate created with openssl x509 protocol
// Key with 'openssl genrsa'
// https://nodejs.org/en/knowledge/HTTP/servers/how-to-create-a-HTTPS-server/
const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}

const express = require('express')
const app = express()

app.enable('trust proxy');
app.use((req, res, next) => {
  if(req.secure) {
    next();
  } else {
    res.redirect('https://' + req.headers.host + req.url);
  }
});

// Server only accepts https connections making communication enncypted and safe
// In a real life server the certificate would be distributed from a trusted third-party and not a self signed one
var server = https.createServer(options, app);

// The root of the website
app.get('/', function (req, res ) {
  res.send("Using https");
});

const hostname = '127.0.0.1';
const port = 8080; // HTTPS port is 443
server.listen(port, function(req, res) {
  console.log(`Server running at https://${hostname}:${port}/`);
});

// Redirect all http requests to https
// We don't want to allow http traffic at all as it is not secure
// and enables man-in-the-middle attacks and packet sniffing/tampering.
http.createServer( options, (req, res) => {
  res.writeHead(301, {"Location": "https://" + req.headers['host'] + req.url});
  res.end();
}).listen(80);
