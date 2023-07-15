const MyContract = artifacts.require("MyContract");

contract("MyContract", function (accounts) {
  it("should store the string 'Hey there!'", async function () {
    const myContract = await MyContract.deployed();

    // Set myString to "Hey there!"
    await myContract.setMyString("Hey there!", { from: accounts[0] });

    // Get myString from public variable getter
    const storedString = await myContract.myString();

    assert.equal(storedString, "Hey there!", "The string was not stored");
  });
});
