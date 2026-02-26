const https = require('http'); // The server is on http://localhost:5000

const data = JSON.stringify({
    email: 'sunny1524.be23@chitkarauniversity.edu.in'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/auth/forgot-password',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(data);
req.end();
