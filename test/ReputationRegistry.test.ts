import { expect } from "chai";
import hardhat from "hardhat";
const { ethers } = hardhat as any;

describe("ReputationRegistry", function() {
  it("registers and accepts reviews", async function() {
    const [owner, alice, bob] = await ethers.getSigners();
    const R = await ethers.getContractFactory("ReputationRegistry");
    const r = await R.deploy();
    await r.deployed();

    await r.connect(alice).register();
    await r.connect(bob).register();

    await r.connect(alice).submitReview(owner.address, 5, "Great work");
    const score = await r.getReputation(owner.address);
    expect(score).to.equal(5);
  });
});
