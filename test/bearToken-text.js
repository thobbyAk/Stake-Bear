// We import Chai to use its asserting functions here.
const { expect } = require("chai");

describe("BearTOken Contrract", function () {
	let totalSupply = "10000000000000000000000"; // 10000 * 1e18
	let Token;
	let hardhatToken;
	let owner;
	let addr1;
	let addr2;
	let addrs;

	beforeEach(async function () {
		Token = await ethers.getContractFactory("BearToken");
		[owner, addr1, addr2, ...addrs] = await ethers.getSigners();
		hardhatToken = await Token.deploy();
	});

	describe("Deployment", function () {
		it("Should assign the total supply of tokens to the owner", async function () {
			const ownerBalance = await hardhatToken.balanceOf(owner.address);
			expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
		});
	});
	describe("Transactions", function () {
		it("should transfer Tokens Between Accounts", async function () {
			const ownerBalance = await hardhatToken.balanceOf(owner.address);
			// Transfer 50 tokens from owner to addr1
			await hardhatToken.transfer(addr1.address, 50);
			const addr1Balance = await hardhatToken.balanceOf(addr1.address);
			expect(addr1Balance).to.equal(50);

			// Transfer 50 tokens from addr1 to addr2
			// We use .connect(signer) to send a transaction from another account
			await hardhatToken.connect(addr1).transfer(addr2.address, 50);
			const addr2Balance = await hardhatToken.balanceOf(addr2.address);
			expect(addr2Balance).to.equal(50);
		});

		it("should fail if sender doesnt have enought token", async function () {
			const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

			// Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
			// `require` will evaluate false and revert the transaction.
			await expect(
				hardhatToken.connect(addr1).transfer(owner.address, 1)
			).to.be.revertedWith("ERC20: transfer amount exceeds balance");

			// Owner balance shouldn't have changed.
			expect(await hardhatToken.balanceOf(owner.address)).to.equal(
				initialOwnerBalance
			);
		});
	});
});
