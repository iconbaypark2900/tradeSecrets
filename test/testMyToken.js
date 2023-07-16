const MyToken = artifacts.require("MyToken");

contract("MyToken", (accounts) => {
    let myToken;

    before(async () => {
        myToken = await MyToken.new();
    });

    it("should mint correctly", async () => {
        let balance = await myToken.balanceOf(accounts[0]);
        assert.equal(balance.toNumber(), 10000 * (10 ** 18), "The balance should be 10000");
    });
}); 
