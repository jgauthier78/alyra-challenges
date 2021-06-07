var  Web3  =  require('web3');
web3  =  new  Web3(new  Web3.providers.HttpProvider('https://mainnet.infura.io/v3/b717bccc90a842da87cca894a7e5ec59'));

var  addr  =  "0xf3b1c7ca8fc7427d57328664902d4bd257b2eb0f";

console.log('Events by Address: '  +  addr);

var  abi  = [{"constant":true,"inputs":[],"name":"getEbola","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getInfo","outputs":[{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tipCreator","outputs":[{"name":"","type":"string"},{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}]
var  contract  =  new  web3.eth.Contract(abi, '0xe16f391e860420e65c659111c9e1601c0f8e2818');

console.log('------------------------------------------');
console.log('Get smart contract info from contract:');
console.log('0xe16f391e860420e65c659111c9e1601c0f8e2818');
console.log('');
console.log('in the following order = getInfo, getEbola, tipCreator, kill');
console.log('------------------------------------------');

contract.methods.getInfo().call()
.then(function(result){
   console.log('');
   console.log('getInfo:');
   console.log(result);
   
   contract.methods.getEbola().call()
   .then(function(result){
      console.log('');
      console.log('getEbola:');
      console.log(result);
      contract.methods.tipCreator().call()
      .then(function(result){
         console.log('');
         console.log('tipCreator:');
         console.log(result);
         contract.methods.kill().call()
         .then(function(result){
            console.log('');
            console.log('kill:');
            console.log(result);
         });
      });
   });
});