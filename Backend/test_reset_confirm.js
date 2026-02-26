const https = require('http');

const token = '002eeaed35e59c736f73d6badd328be742b6e4033cb84161358f68adc890a1cb';
const data = JSON.stringify({
    password: 'newpassword123'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: `/auth/reset-password/${token}`,
    method: 'PATCH',
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
