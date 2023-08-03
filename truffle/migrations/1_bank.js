const SimpleStorage = artifacts.require("Bank");

module.exports = function (deployer) {
  deployer.deploy(SimpleStorage);
};
