require("dotenv").config();
const express = require('express');
const app = express();
const https = require('https');
const axios = require('axios');
const bodyParser = require('body-parser');
const { response } = require('express');

const port = process.env.PORT;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res)=> {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = process.env.MAIL_API_URL;

    const options = {
        method: "POST",
        auth: process.env.MAIL_AUTH,
    };

    const request = https.request(url, options, (response) => {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html');
        } else {
            res.sendFile(__dirname + '/failure.html');
        }

        response.on("data", (data) => {
            console.log(response.statusCode);
        });
    });

    request.write(jsonData);
    request.end();

    app.post('/failure', (req, res) => {
        res.redirect('/');
    });

});

app.listen(port || 3000, () =>{
    console.log("Server listening on port: " + port);
});