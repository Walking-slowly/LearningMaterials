const express = require('express')
const app = express()

app.get('/inss',function(req, res){
    res.header('Access-Control-Allow-Origin', '*')
    
    res.send(JSON.stringify(parseInt(Math.random()*7) + 1))
   
    
})

app.post('/berts',function(req, res){
    res.header('Access-Control-Allow-Origin', '*')
    
    res.send(JSON.stringify(parseInt(Math.random()*7) + 1))
   
    
})

const hostName = '127.0.0.1';

const port = 12345;


app.listen(port,hostName,function(){
    console.log(`http://${hostName}:${port}`);
  });