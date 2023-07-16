const MyToken = artifacts.require("MyToken");
const LendingContract = artifacts.require("LendingContract");

module.exports = async function(deployer) {
    await deployer.deploy(MyToken);
    const myToken = await MyToken.deployed();
    await deployer.deploy(LendingContract, myToken.address);
};

