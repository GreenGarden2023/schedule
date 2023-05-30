const express = require('express'); 
const { testFunction } = require('./lib/db');
const httpClient = require('./lib/http-client');


const app = express(); 
const port = 8080; 

app.get('/', function(req, res){
    res.send("Hello World");
})

app.get('/cron-job', async (req, res) =>{
    console.log('start job')
    
    testFunction()
    res.send('started cron job')
})

app.listen(port, function(){
    console.log("Your app running on port " + port);
})