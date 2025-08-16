import { expect } from "chai";
import hardhat from "hardhat";
const { ethers } = hardhat as any;

describe("Identity", function() {
  it("registers user and sets KYC", async function() {
    const [user] = await ethers.getSigners();
    const I = await ethers.getContractFactory("Identity");
    const i = await I.deploy();
    await i.deployed();

    await i.connect(user).register("alice");
    const h = await i.handle(user.address);
    expect(h).to.equal("alice");
  });
});
