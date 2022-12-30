const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game4', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game4');
    const game = await Game.deploy();

    const signer = ethers.provider.getSigner(0);
    const address = await signer.getAddress();

    return { game, signer, address };
  }
  it('should be a winner', async function () {
    const { game, signer, address } = await loadFixture(deployContractAndSetVariables);

    await game.connect(signer).write(address);
    await game.connect(signer).win(address);

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
