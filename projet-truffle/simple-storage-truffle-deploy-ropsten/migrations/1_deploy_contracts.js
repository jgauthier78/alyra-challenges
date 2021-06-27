// Import du smart contract "SimpleStorage"
const SimpleStorage2 = artifacts.require("SimpleStorage2");
module.exports = (deployer) => {
 // Deployer le smart contract!
 deployer.deploy(SimpleStorage2);
}