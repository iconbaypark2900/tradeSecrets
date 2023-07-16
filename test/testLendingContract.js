const LendingContract = artifacts.require("LendingContract");
const MyToken = artifacts.require("MyToken");

contract("LendingContract", (accounts) => {
    let lendingContract, myToken;

    before(async () => {
        myToken = await MyToken.new();
        lendingContract = await LendingContract.new(myToken.address);
    });

    it("should deposit correctly", async () => {
        await myToken.transfer(accounts[1], 5000, { from: accounts[0] });
        await lendingContract.deposit({ from: accounts[1], value: 1000 });
        let balance = await myToken.balanceOf(accounts[1]);
        assert.equal(balance.toNumber(), 4000, "The balance should have decreased by 1000");
        let deposit = await lendingContract.deposits(accounts[1]);
        assert.equal(deposit.toNumber(), 1000, "Deposit not updated correctly");
    });

    it("should not allow withdrawal more than deposit", async () => {
        try {
            await lendingContract.withdraw(2000, { from: accounts[1] });
            assert.fail("The withdrawal did not throw");
        } catch (err) {
            assert.ok(/revert/.test(err.message), "The error message should contain 'revert'");
        }
    });

    it("should allow withdrawal less than or equal to deposit", async () => {
        await lendingContract.withdraw(500, { from: accounts[1] });
        let balance = await myToken.balanceOf(accounts[1]);
        assert.equal(balance.toNumber(), 4500, "The balance should have increased by 500");
        let deposit = await lendingContract.deposits(accounts[1]);
        assert.equal(deposit.toNumber(), 500, "Deposit not updated correctly");
    });
}); 
