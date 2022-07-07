const { expect } = require("chai");
const { ethers } = require("hardhat");

let owner;
let addr1;
let addr2;
let addrs;
let StakeHouse;
let BearToken;

describe("StakeHouse", function () {
	beforeEach(async () => {
		[owner, addr1, addr2, ...addrs] = await ethers.getSigners();
		const bearToken = await ethers.getContractFactory("BearToken");
		BearToken = await bearToken.deploy();
		await BearToken.deployed();

		const stakeHouse = await ethers.getContractFactory("StakeHouse");
		StakeHouse = await stakeHouse.deploy(BearToken.address, 10);
		await StakeHouse.deployed();
	});
	//test Emits event Pool Created
	it("Creates a new pool", async () => {
		let tx = await StakeHouse.createPool(BearToken.address);
	});

	//test function reverted with message

	it("should not deposit 0", async () => {
		await expect(StakeHouse.deposit(1, 0)).to.be.revertedWith(
			"Deposit amount can't be zero"
		);
	});

	it("should deposit an amount", async () => {
		console.log(
			"prev balance owner is ",
			await BearToken.balanceOf(owner.address)
		);

		await StakeHouse.createPool(BearToken.address);

		const amount = "1000";

		await BearToken.approve(StakeHouse.address, amount, {
			from: owner.address,
		});

		// await this.stakeToken.deposit(0, amount);
		const excessValue = "300"; // 10000000000000000000
		let tx = await StakeHouse.deposit(0, "20", {
			from: owner.address,
		});

		let receipt = await tx.wait();
		console.log(
			"event: ",
			receipt.events?.filter((x) => {
				return x.event == "Deposit";
			})
		);

		expect(await BearToken.balanceOf(owner.address)).to.equal("99980");
	});

	it("should not withdraw 0", async () => {
		await expect(StakeHouse.withdraw(1, 0)).to.be.revertedWith(
			"Withdraw amount can't be zero"
		);
	});

	it("should withdraw an amount", async () => {
		console.log(
			"prev balance owner is ",
			await BearToken.balanceOf(owner.address)
		);

		await StakeHouse.createPool(BearToken.address);

		const amount = "1000";

		console.log("amount ", amount);

		let txn = await BearToken.approve(StakeHouse.address, amount, {
			from: owner.address,
		});
		console.log("txn: ", txn);
		// await this.stakeToken.deposit(0, amount);

		await StakeHouse.deposit(0, "20", {
			from: owner.address,
		});

		let tx = await StakeHouse.withdraw(0, "10", {
			from: owner.address,
		});

		let receipt = await tx.wait();
		console.log(
			"event: ",
			receipt.events?.filter((x) => {
				return x.event == "Withdraw";
			})
		);

		console.log(
			"new balance owner is ",
			await BearToken.balanceOf(owner.address)
		);
		expect(await BearToken.balanceOf(owner.address)).to.equal("99990");
	});
});
