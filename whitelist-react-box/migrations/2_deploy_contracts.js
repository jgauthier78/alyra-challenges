// var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Whitelist = artifacts.require("./Whitelist.sol");

module.exports = function(deployer) {
  // deployer.deploy(SimpleStorage);
  deployer.deploy(Whitelist);
};
