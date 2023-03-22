const { assert, expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("CrowdGaming", function () {
  async function deployAndTestVars() {
    const CrowdGaming = await ethers.getContractFactory("CrowdGaming");
    const crowdGaming = await CrowdGaming.deploy();
    const [owner, acc2, acct3] = await ethers.getSigners();
    let name = "MyCampaign";
    let description = "This is my campaign";
    let startAt = 1678916386;
    let endAt = 1678926386;
    let goal = 100;

    return {
      crowdGaming,
      owner,
      acc2,
      acct3,
      name,
      description,
      startAt,
      endAt,
      goal,
    };
  }

  // Authentications
  it("Should launch a campaign with the owner", async function () {
    const { crowdGaming, owner, name, description, goal, startAt, endAt } =
      await loadFixture(deployAndTestVars);

    expect(
      await crowdGaming
        .connect(owner)
        .launchCampaign(name, description, goal, startAt, endAt)
    );
  });

  it("Should only allow the owner to cancel a campaign", async function () {
    const { crowdGaming, acc2 } = await loadFixture(deployAndTestVars);

    await expect(
      crowdGaming.connect(acc2).cancelCampaign(1)
    ).to.be.revertedWith("Not owner");
  });

  it("Should only allow the owner to withdraw funds", async function () {
    const { crowdGaming, acc2 } = await loadFixture(deployAndTestVars);

    await expect(crowdGaming.connect(acc2).withdrawFrom(1)).to.be.revertedWith(
      "Not owner"
    );
  });

  it("Should prevent the withdrawal of a campaign before it's ended", async function () {
    const { crowdGaming, owner, endAt } = await loadFixture(deployAndTestVars);
    expect(await crowdGaming.connect(owner).withdrawFrom(1))
      .to.be.below(endAt)
      .to.be.revertedWith("Hasn't ended");
  });

  // Time based
  it("Should prevent the launch of a campaign with an invalid end time", async function () {
    const { crowdGaming, name, description, goal, startAt, endAt } =
      await loadFixture(deployAndTestVars);

    await expect(
      crowdGaming.launchCampaign(name, description, goal, endAt, startAt)
    ).to.be.revertedWith("Invalid end date");
  });

  it("Should prevent the launch of a campaign with an invalid start time", async function () {
    const { crowdGaming, name, description, goal, endAt } = await loadFixture(
      deployAndTestVars
    );
    let invalidStart = 1678900910;
    await expect(
      crowdGaming.launchCampaign(name, description, goal, invalidStart, endAt)
    ).to.be.revertedWith("Invalid start date");
  });

  // Transactions
  // it should refund the donors if the goal isn't met
  // it should allow a donor to pledge to a campaign that is active
  // it should prevent a donor from pledging to a campaign that has expired

  // Events
  it("Should emit the Launch event", async function () {
    const { crowdGaming, owner, name, description, goal, startAt, endAt } =
      await loadFixture(deployAndTestVars);

    await expect(
      crowdGaming.launchCampaign(name, description, goal, startAt, endAt)
    )
      .to.emit(crowdGaming, "Launch")
      .withArgs(1, owner.address, name, goal, description, startAt, endAt);
  });

  it("Should emit the Cancel event", async function () {
    const { crowdGaming, owner } = await loadFixture(deployAndTestVars);

    await expect(crowdGaming.cancelCampaign(1))
      .to.emit(crowdGaming, "Cancel")
      .withArgs(1, owner.address);
  });

  it("Should emit the Pledge event", async function () {
    const { crowdGaming, acc2, endAt } = await loadFixture(deployAndTestVars);
    const amount = 50;
    expect(await crowdGaming.pledgeTo(1).to.be.below(endAt));
    await expect(crowdGaming.pledgeTo(1))
      .to.emit(crowdGaming, "Cancel")
      .withArgs(1, acc2.address, amount);
  });

  it("Should emit the Withdraw event", async function () {
    const { crowdGaming } = await loadFixture(deployAndTestVars);
  });

  it("Should emit the Refund event", async function () {
    const { crowdGaming } = await loadFixture(deployAndTestVars);
  });
});
