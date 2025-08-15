import { expect } from "chai";
import hre from "hardhat";
const ethers = hre.ethers;

describe("EscrowManager", function() {
  it("creates and releases escrow", async function() {
    const [payer, payee] = await ethers.getSigners();
    const E = await ethers.getContractFactory("EscrowManager");
    const e = await E.deploy();
    await e.deployed();

    const tx = await e.connect(payer).createEscrow(payee.address, { value: ethers.utils.parseEther("0.01") });
    const receipt = await tx.wait();
    const id = 0;

    await e.connect(payer).release(id);
    const escrow = await e.getEscrow(id);
    expect(escrow.state).to.equal(2); // State.RELEASED = 2
  });
});
