var  Web3  =  require('web3');
console.log('Web3: ' + Web3);

var  express  =  require('express');
var  app  =  express();

app.use(express.static(__dirname  +  '/public')); 

var  port  =  8000; // you can use any port

app.listen(port);
console.log('server on '  +  port);