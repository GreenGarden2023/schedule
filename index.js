const express = require('express'); 
const { testFunction } = require('./lib/db');
const httpClient = require('./lib/http-client');


const app = express(); 
const port = process.env.PORT || 8080

// testFunction()

app.get('/', function(req, res){
    testFunction()
    res.send("Hello World");
})
// app.get('/cron-job', async (req, res) =>{
//     console.log('start job')
    
//     testFunction()
//     res.send('started cron job')
// })

app.listen(port, function(){
    console.log("Your app running on port " + port);
})
