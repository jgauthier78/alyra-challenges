var  Web3  =  require('web3');
web3  =  new  Web3(new  Web3.providers.HttpProvider('https://ropsten.infura.io/v3/b717bccc90a842da87cca894a7e5ec59'));

var  abi  = [{"inputs": [],"name": "get","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "x","type": "uint256"}],"name": "set","outputs": [],"stateMutability": "nonpayable","type": "function"}]
var  contract  =  new  web3.eth.Contract(abi, '0x8cD906ff391b25304E0572b92028bE24eC1eABFb');

console.log('------------------------------------------');
console.log('Get smart contract data from contract:');
console.log('0x8cD906ff391b25304E0572b92028bE24eC1eABFb');
console.log('------------------------------------------');

contract.methods.get().call()
.then(function(result){
   console.log('');
   console.log('data:'+result);
}).catch(function(error){
   console.log('error:'+error);
});